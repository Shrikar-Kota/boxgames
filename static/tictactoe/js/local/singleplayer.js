var currentturn = -1;
var gamerunning = 0;
var playersymbol = '';
var computersymbol = '';
var gameMatrix = [['', '', ''], ['', '', ''], ['', '', '']]
var difficultyLevel = ''

const performOnLoad = () => {
    document.querySelector("#playbutton").addEventListener("click", onPlayButtonClick);
    document.querySelector("#replaybutton").addEventListener("click", onReplayButtonClick);
    document.querySelector("#savedetails").addEventListener("click", onSetGameDetailsButtonClick);
    prepareGameDetailsModal();
    setGameAreaHeight();
}

const onPlayButtonClick = () => {
    if (!gamerunning){
        resetGame();
        resetGameDetails();
        getGameDetails();
    }
}

const onReplayButtonClick = () => {
    resetGame();
    startGame();
}

const onSetGameDetailsButtonClick = () => {
    if (difficultyLevel != '' && playersymbol != '' && computersymbol != '')
    {
        $('#gamedetails-modal').modal('hide');
        startGame();
    }
}

const onCellClick = async (event) => {
    if (currentturn == 0)
    {
        var [x, y] = getTableIndices(event.target.id);
        if (gameMatrix[x][y] == '')
        {
            gameMatrix[x][y] = playersymbol;
            updateGameTable(event.target, playersymbol);   
            currentturn = 1;
            await makeComputerMove();
        }
    }
}

const makeComputerMove = () => {
    return new Promise(() => {
        if (currentturn == 1)
        {
            var startTime = new Date().getTime();
            var result = getNextMove();
            var endTime = new Date().getTime();
            if (result.index[0] != -1)
            {
                gameMatrix[result.index[0]][result.index[1]] = computersymbol;
                var computerCell = document.getElementById(`cell-${result.index[0]},${result.index[1]}`);

                setTimeout(
                    (computerCell) => {
                        updateGameTable(computerCell, computersymbol);
                        currentturn = 0

                        var result = isGameFinished();
                        
                        if (result.result)
                        {
                            if (result.value == -1)
                            {
                                showGameResult(1);
                            }
                            else if (result.value == 1)
                            {
                                showGameResult(-1);
                            }
                            else
                            {
                                showGameResult(0);
                            }
                            gamerunning = 0;
                        }
                    },
                    Math.max(2000-(endTime-startTime)), 
                    computerCell
                );
            }
            else
            {
                if (result.result == -1)
                {
                    showGameResult(1);
                }
                else if (result.result == 1)
                {
                    showGameResult(-1);
                }
                else
                {
                    showGameResult(0);
                }
                gamerunning = 0;
            }

            return result;
        }}
    );
}

const showGameResult = (result) => {
    var gameResultModalHeader = document.querySelector('#gameresult-header');
    var gameResultModalText = document.querySelector('#gameresult-text');

    switch (result)
    {
        case 1:
        {  
            gameResultModalHeader.innerHTML = "Congratulations!";
            gameResultModalText.innerHTML = "You have won against me!";
            break;
        }
        case -1:
        {
            gameResultModalHeader.innerHTML = "Better luck next time!";
            gameResultModalText.innerHTML = "Too bad, I have won against you!";
            break;
        }
        case 0:
        {
            gameResultModalHeader.innerHTML = "Better luck next time!";
            gameResultModalText.innerHTML = "Too bad, It was a draw!";
            break;
        }
    }

    $("#gameresult-modal").modal({backdrop: 'static', keyboard: false}, 'show');
}

const setGameAreaHeight = () => {
    var mainArea = document.querySelector("#main-area");
    var controlsArea = document.querySelector("#controls-area");
    var gameArea = document.querySelector("#game-area");

    var totalHeight = parseInt(window.getComputedStyle(mainArea).height.replace("px", ""))
                        - parseInt(window.getComputedStyle(mainArea).paddingTop.replace("px", ""))
                        - parseInt(window.getComputedStyle(mainArea).paddingBottom.replace("px", ""));

    var occupiedHeight = parseInt(window.getComputedStyle(controlsArea).height.replace("px", ""));

    var remainingHeight = totalHeight 
                            - occupiedHeight
                            - parseInt(window.getComputedStyle(gameArea).paddingTop.replace("px", ""))
                            - parseInt(window.getComputedStyle(gameArea).paddingBottom.replace("px", ""));

    gameArea.style.height = remainingHeight+'px';
}

const setGameBoardHeight = () => {
    var gameArea = document.querySelector("#game-area");
    var scoreArea = document.querySelector("#score-area");
    var gameBoard = document.querySelector("#game-board");

    var totalHeight = parseInt(window.getComputedStyle(gameArea).height.replace("px", ""));

    var occupiedHeight = parseInt(window.getComputedStyle(scoreArea).height.replace("px", ""));

    var remainingHeight = totalHeight
                            - occupiedHeight
                            - parseInt(window.getComputedStyle(gameBoard).paddingTop.replace("px", ""))
                            - parseInt(window.getComputedStyle(gameBoard).paddingBottom.replace("px", ""));

    gameBoard.style.height = remainingHeight+'px';
}

const getTableIndices = (cellName) => {
    var indices = cellName.split('-')[1].split(',');
    return [parseInt(indices[0]), parseInt(indices[1])];
}

const getGameDetails = () => {
    $('#gamedetails-modal').modal({backdrop: 'static', keyboard: false}, 'show');
}

const startGame = () => {
    prepareGame();
    gamerunning = 1;
    currentturn = 0;
}

const getNextMove = (playerRole='Maximizer', moves=0) => {
    var result = isGameFinished();
    
    if (result.result)
    {
        var output = {result: 0, moves: 0, index: [-1, -1]};
    
        output.result = result.value;
        output.moves = moves;

        return output;
    }
    else
    {
        var nextPlayer = playerRole == 'Maximizer' ? 'Minimizer' : 'Maximizer';
        var moveResult = {Win : {moves: 0, index: [-1, -1]}, Loss: {moves: 0, index: [-1, -1]}, Draw: {moves: 0, index: [-1, -1]}}

        for(var i = 0; i < 3; i++)
        {
            for(var j = 0; j < 3; j++)
            {
                if (gameMatrix[i][j] == "")
                {
                    gameMatrix[i][j] = playerRole == 'Maximizer' ? computersymbol : playersymbol;
                    
                    var interMoveResult = getNextMove(nextPlayer, moves+1);

                    updateMoveResult(moveResult, interMoveResult, difficultyLevel, playerRole, [i, j]);

                    gameMatrix[i][j] = "";
                }
            }
        }

        return getOptimalMove(moveResult, difficultyLevel, playerRole);
    }
}

const getOptimalMove = (moveResult, difficultyLevel, playerRole) => {
    var result = {result: -1, moves: 0, index: [-1, -1]};
    
    if (playerRole == 'Minimizer' || difficultyLevel == 'Easy')
    {
        if (moveResult.Loss.index[0] != -1)
        {
            result.moves = moveResult.Loss.moves;
            result.index = moveResult.Loss.index;
        }
        else if (moveResult.Draw.index[0] != -1)
        {
            result.result = 0;
            result.moves = moveResult.Draw.moves;
            result.index = moveResult.Draw.index;
        }
        else
        {
            result.result = 1;
            result.moves = moveResult.Win.moves;
            result.index = moveResult.Win.index;
        }
    }   
    else
    {
        if (difficultyLevel == 'Medium')
        {
            if (moveResult.Draw.index[0] != -1)
            {
                result.result = 0;
                result.moves = moveResult.Draw.moves;
                result.index = moveResult.Draw.index;
            }
            else if (moveResult.Win.index[0] != -1)
            {
                result.result = 1;
                result.moves = moveResult.Win.moves;
                result.index = moveResult.Win.index;
            }
            else
            {
                result.moves = moveResult.Loss.moves;
                result.index = moveResult.Loss.index;
            }
        }
        else
        {
            if (moveResult.Win.index[0] != -1)
            {
                result.result = 1;
                result.moves = moveResult.Win.moves;
                result.index = moveResult.Win.index;
            }
            else if (moveResult.Draw.index[0] != -1)
            {
                result.result = 0;
                result.moves = moveResult.Draw.moves;
                result.index = moveResult.Draw.index;
            }
            else
            {
                result.moves = moveResult.Loss.moves;
                result.index = moveResult.Loss.index;
            }
        }
    }

    return result;
}

const updateMoveResult = (moveResult, interMoveResult, difficultyLevel, playerRole, index) => {
    if (playerRole == 'Minimizer' || difficultyLevel == 'Easy')
    {
        if (interMoveResult.result == -1)
        {
            if (moveResult.Loss.index[0] == -1 || interMoveResult.moves < moveResult.Loss.moves)
            {
                moveResult.Loss.moves = interMoveResult.moves;
                moveResult.Loss.index = index;
            }
        }
        else if (moveResult.result == 0)
        {
            if (moveResult.Draw.index[0] == -1 || interMoveResult.moves > moveResult.Draw.moves)
            {
                moveResult.Draw.moves = interMoveResult.moves;
                moveResult.Draw.index = index;
            }
        }
        else
        {
            if (moveResult.Win.index[0] == -1 || interMoveResult.moves > moveResult.Win.moves)
            {
                moveResult.Win.moves = interMoveResult.moves;
                moveResult.Win.index = index;
            }
        }
    }
    else
    {
        if (difficultyLevel == 'Medium')
        {
            if (interMoveResult.result == -1)
            {
                if (moveResult.Draw.index[0] == -1 || interMoveResult.moves > moveResult.Loss.moves)
                {
                    moveResult.Loss.moves = interMoveResult.moves;
                    moveResult.Loss.index = index;
                }
            }
            if (interMoveResult.result == 0)
            {
                if (moveResult.Draw.index[0] == -1 || interMoveResult.moves > moveResult.Draw.moves)
                {
                    moveResult.Draw.moves = interMoveResult.moves;
                    moveResult.Draw.index = index;
                }
            }
            else
            {
                if (moveResult.Win.index[0] == -1 || interMoveResult.moves > moveResult.Win.moves)
                {
                    moveResult.Win.moves = interMoveResult.moves;
                    moveResult.Win.index = index;
                }
            }
        }
        else
        {
            if (interMoveResult.result == -1)
            {
                if (moveResult.Draw.index[0] == -1 || interMoveResult.moves > moveResult.Loss.moves)
                {
                    moveResult.Loss.moves = interMoveResult.moves;
                    moveResult.Loss.index = index;
                }
            }
            if (interMoveResult.result == 0)
            {
                if (moveResult.Draw.index[0] == -1 || interMoveResult.moves > moveResult.Draw.moves)
                {
                    moveResult.Draw.moves = interMoveResult.moves;
                    moveResult.Draw.index = index;
                }
            }
            if (interMoveResult.result == 1)
            {
                if (moveResult.Win.index[0] == -1 || interMoveResult.moves < moveResult.Win.moves)
                {
                    moveResult.Win.moves = interMoveResult.moves;
                    moveResult.Win.index = index;
                }
            }   
        }
    }
}

const isGameFinished = () => {
    var result = {result: false, value: null}
    var hasWonOrLostResult = hasWonOrLost();
    
    if (hasWonOrLostResult.result)
    {
        result.result = true;
        result.value = hasWonOrLostResult.winner != playersymbol ? 1 : -1;
    }
    else if (hasDrawn())
    {
        result.result = true;
        result.value = 0;
    }
    return result;
}

const hasWonOrLost = () => {
    var result = {result: false, winner: ""};
    if (gameMatrix[0][0] != "" && 
        (gameMatrix[0][0] == gameMatrix[1][1] && 
        gameMatrix[2][2] == gameMatrix[0][0]))
    {
        result.result = true;
        result.winner = gameMatrix[0][0];
        return result;
    }

    if (gameMatrix[0][2] != "" && 
        (gameMatrix[0][2] == gameMatrix[1][1] && 
        gameMatrix[2][0] == gameMatrix[0][2]))
    {
        result.result = true;
        result.winner = gameMatrix[0][2];
        return result;
    }

    for(var j = 0; j < 3; j++)
    {
        var isCrossed = true;
        for(var i = 0; i < 3; i++)
        {
            if (gameMatrix[0][j] == "" 
                || gameMatrix[0][j] != gameMatrix[i][j])
            {
                isCrossed = false;
            }
        }
        if (isCrossed)
        {
            result.result = true;
            result.winner = gameMatrix[0][j];
            return result;   
        }
    }

    for(var i = 0; i < 3; i++)
    {
        var isCrossed = true;
        for(var j = 0; j < 3; j++)
        {
            if (gameMatrix[i][0] == ""
                || gameMatrix[i][0] != gameMatrix[i][j])
            {
                isCrossed = false;
            }
        }
        if (isCrossed)
        {
            result.result = true;
            result.winner = gameMatrix[i][0];
            return result;   
        }
    }
    
    return result;
}

const hasDrawn = () => {
    var result = true;
    gameMatrix.forEach(arr => {
        if (arr.includes(""))
        {
            result = false;
        }
    });

    return result;
}

const prepareGame = () => {
    document.querySelector("#game-area").classList.remove("invisible");
    setGameBoardHeight();
    drawTable(document.querySelector('#game-board'));
    addClickTrackers();
    setGameDetails();
}

const drawTable = (gameBoard) => {
    var gameArea = "";
    var totalWidth = parseInt(window.getComputedStyle(gameBoard).width.replace("px", ""))
                        - parseInt(window.getComputedStyle(gameBoard).paddingLeft.replace("px", ""))
                        - parseInt(window.getComputedStyle(gameBoard).paddingRight.replace("px", ""));

    var totalHeight = parseInt(window.getComputedStyle(gameBoard).height.replace("px", ""));

    var tableSize = Math.min(totalWidth, totalHeight);
    var cellBorderWidth = 1;

    cellSide = Math.ceil((tableSize - cellBorderWidth*6)/3);

    for (let row = 0; row < 3; row++){
        var cellname = "cell-"+row+",";
        gameArea += "<div class='row mx-auto'><div class='row mx-auto'>";
        for (let column = 0; column < 3; column++){
            gameArea += `<div class='border cell' id='${cellname}${column}' style='height: ${cellSide}px; width: ${cellSide}px; font-size: ${cellSide}px; line-height: ${cellSide}px'></div>`;
        }
        gameArea += "</div></div>";
    }
    gameBoard.innerHTML = gameArea;
}

const updateGameTable = (targetCell, symbol) => {
    targetCell.innerHTML = "<p>"+symbol.toUpperCase()+"</p>";
    targetCell.style.color = symbol == 'x' ? '#c82333' : '#0069d9';
}

const addClickTrackers = () => {
    var cells = document.querySelectorAll('.cell');
    for (let l = 0; l < cells.length; l++){
        cells[l].addEventListener('click', onCellClick)
    }
}

const setGameDetails = () => {
    document.querySelector("#p-symbol").innerHTML = playersymbol.toUpperCase();
    document.querySelector("#p-symbol").style.color = playersymbol == 'x' ? '#c82333' : '#0069d9';
    document.querySelector("#c-symbol").innerHTML = computersymbol.toUpperCase();
    document.querySelector("#c-symbol").style.color = computersymbol == 'x' ? '#c82333' : '#0069d9';
    
    updateTurn();
}

const updateTurn = () => {
    document.querySelector('#turn').innerHTML = currentturn == 0 ? playersymbol.toUpperCase() : computersymbol.toUpperCase();
    if (currentturn == 0)
    {
        if (playersymbol == 'x')
        {
            document.querySelector('#turn').style.color = '#c82333';
        } 
        else
        {
            document.querySelector('#turn').style.color = '#0069d9';
        }
    }
    else
    {
        if (computersymbol == 'x')
        {
            document.querySelector('#turn').style.color = '#c82333';
        } 
        else
        {
            document.querySelector('#turn').style.color = '#0069d9';
        }
    }
}

const resetGame = () => {
    gameMatrix = [['', '', ''], ['', '', ''], ['', '', '']]
    document.querySelector("#game-area").classList.add("invisible");
    document.querySelector("#game-board").innerHTML = '';
    closeModals();
    resetGameDetailsModal();
}

const resetGameDetails = () => {
    currentturn = -1;
    playersymbol = '';
    computersymbol = '';
}

const closeModals = () => {
    $('#gamedetails-modal').modal('hide');
    $('#gameresult-modal').modal('hide');
}

const resetGameDetailsModal = () => {
    resetGameDetailsModalSymbols();
    resetGameDetailsModalDifficulty();
}

const resetGameDetailsModalSymbols = () => {
    document.querySelector(".symbol-x-btn").classList.add('btn-outline-danger');
    document.querySelector(".symbol-o-btn").classList.add('btn-outline-primary');
    document.querySelector(".symbol-x-btn").classList.remove('btn-danger');
    document.querySelector(".symbol-o-btn").classList.remove('btn-primary');
}

const resetGameDetailsModalDifficulty = () => {
    document.querySelector(".btn-easy").classList.add("btn-outline-success");
    document.querySelector(".btn-medium").classList.add("btn-outline-warning");
    document.querySelector(".btn-hard").classList.add("btn-outline-danger");
    document.querySelector(".btn-easy").classList.remove("btn-success");
    document.querySelector(".btn-medium").classList.remove("btn-warning");
    document.querySelector(".btn-hard").classList.remove("btn-danger");
} 

const prepareGameDetailsModal = () => {
    resetGameDetailsModal();
    document.querySelector(".symbol-x-btn").addEventListener("click", (event) => {
        event.target.blur();
        resetGameDetailsModalSymbols();
        document.querySelector(".symbol-x-btn").classList.remove('btn-outline-danger');
        document.querySelector(".symbol-x-btn").classList.add('btn-danger');
        playersymbol = 'x';
        computersymbol = 'o';
    })
    document.querySelector(".symbol-o-btn").addEventListener("click", (event) => {
        event.target.blur();
        resetGameDetailsModalSymbols();
        document.querySelector(".symbol-o-btn").classList.remove('btn-outline-primary');
        document.querySelector(".symbol-o-btn").classList.add('btn-primary');
        playersymbol = 'o';
        computersymbol = 'x';
    })
    document.querySelector(".btn-easy").addEventListener("click", (event) => {
        event.target.blur();
        resetGameDetailsModalDifficulty();
        document.querySelector(".btn-easy").classList.remove("btn-outline-success");
        document.querySelector(".btn-easy").classList.add("btn-success");
        difficultyLevel = 'Easy';
    });
    document.querySelector(".btn-medium").addEventListener("click", (event) => {
        event.target.blur();
        resetGameDetailsModalDifficulty();
        document.querySelector(".btn-medium").classList.remove("btn-outline-warning");
        document.querySelector(".btn-medium").classList.add("btn-warning");
        difficultyLevel = 'Medium';
    });   
    document.querySelector(".btn-hard").addEventListener("click", (event) => {
        event.target.blur();
        resetGameDetailsModalDifficulty();
        document.querySelector(".btn-hard").classList.remove("btn-outline-danger");
        document.querySelector(".btn-hard").classList.add("btn-danger");
        difficultyLevel = 'Hard';
    });
}