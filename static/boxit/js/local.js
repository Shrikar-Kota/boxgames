var linesactive = {};
var currentturn = 1;
var turnsleft = 1;
var player1score = 0;
var player2score = 0;
var gamerunning = 0;
var maximumscore = 0;

const performOnLoad = () => {
    document.querySelector("#playbutton").addEventListener("click", onPlayButtonClick);
    document.querySelector("#restartbutton").addEventListener("click", onRestartButtonClick);
}

const onPlayButtonClick = () => {
    if (!gamerunning){
        displayGameArea();
        drawTable(document.querySelector("#gameboard"));
        addLineClickTrackers();
        updatePlayerScores();
        updateTurn();
        gamerunning = 1;
    }
}

const onRestartButtonClick = () => {
    if (gamerunning){
        resetAllFieldsToDefault();
        document.querySelector("#info-div").innerHTML = "Turn: <span id='turn'></span>";
        onPlayButtonClick();
    }
}

const onCellClick = (event) => {
    var linenumber = getLineNumber(event);
    updateGameArea(linenumber, event.target.id);
}

const updateGameArea = (linenumber, targetid) => {
    if (linesactive[targetid][linenumber] === 0){
        turnsleft -= 1;
        var activatedlines = updateLinesActive(targetid, linenumber);
        changeBorderLines(activatedlines);
        cellsformed = boxFormed(Object.keys(activatedlines));
        if (cellsformed.length != 0){
            if (currentturn == 1){
                player1score += cellsformed.length;
            }else{
                player2score += cellsformed.length;
            }
            fillBoxes(cellsformed);
            turnsleft += cellsformed.length;
        }else if (turnsleft == 0){
            currentturn = (currentturn%2) + 1;
            turnsleft = 1;
        }
        updatePlayerScores();
        updateTurn();
    }
}

const updatePlayerScores = () => {
    document.querySelector("#p1-score").innerHTML = player1score;
    document.querySelector("#p2-score").innerHTML = player2score;
    if (player1score + player2score === maximumscore){
        var playernames = ["Player 1", "Player 2"];
        document.querySelector("#info-div").innerHTML = playernames[currentturn-1] + " has won!";
        alert(playernames[currentturn-1] + " has won!");
    }
}

const updateTurn = () => {
    var colors = ["blue", "red"];
    var playername = ["Player1", "Player2"]
    document.querySelector("#turn").style.color = colors[currentturn-1];
    document.querySelector("#turn").innerHTML = playername[currentturn-1];
}

const resetAllFieldsToDefault = () => {
    linesactive = {};
    currentturn = 1;
    turnsleft = 1;
    player1score = 0;
    player2score = 0;
    gamerunning = 0;
    maximumscore = 0;
}

const displayGameArea = () => {
    document.querySelector("#gamearea").classList.remove("invisible");
}

const drawTable = (gameBoard, linecount = 8) => {
    var gameArea = "";
    for (let row = 0; row < linecount; row++){
        var cellname = "cell-"+row+",";
        gameArea += "<div class='col-12'><div class='row'>";
        for (let column = 0; column < linecount; column++){
            gameArea += "<div class='col border cell' id='" + cellname + column +"' style='padding-bottom: "+100/linecount+"%;'></div>";
            linesactive[cellname+column] = [0, 0, 0, 0];
        }
        gameArea += "</div></div>";
    }
    linesactive["totalrows"] = linecount;
    gameBoard.innerHTML = gameArea;
    maximumscore = linecount*linecount;
}

const addLineClickTrackers = () => {
    var cells = document.querySelectorAll('.cell');
    for (let l = 0; l < cells.length; l++){
        cells[l].addEventListener('click', onCellClick)
    }
}

const updateLinesActive = (cellname, linenumber) => {
    var rowcol = cellname.split("-")[1].split(",");
    var activatedlines = {};
    var rowno = parseInt(rowcol[0]), colno = parseInt(rowcol[1]);
    if (linenumber == 0){
        linesactive[cellname][0] = 1;
        if (rowno > 0){
            var nextcellname = "cell-"+(rowno-1)+","+colno;
            linesactive[nextcellname][2] = 1;
            activatedlines[nextcellname] = 2;
        }
    }else if (linenumber == 1){
        linesactive[cellname][1] = 1;
        if (colno < linesactive["totalrows"] - 1){
            var nextcellname = "cell-"+rowno+","+(colno+1);
            linesactive[nextcellname][3] = 1;
            activatedlines[nextcellname] = 3;
        }
    }else if (linenumber == 2){
        linesactive[cellname][2] = 1;
        if (rowno < linesactive["totalrows"] - 1){
            var nextcellname = "cell-"+(rowno+1)+","+colno;
            linesactive[nextcellname][0] = 1;
            activatedlines[nextcellname] = 0;
        }
    }else{
        linesactive[cellname][3] = 1;
        if (colno > 0){
            var nextcellname = "cell-"+rowno+","+(colno-1);
            linesactive[nextcellname][1] = 1;
            activatedlines[nextcellname] = 1;
        }
    }
    activatedlines[cellname] = linenumber;
    return activatedlines;
}

const changeBorderLines = (activatedlines) => {
    Object.keys(activatedlines).forEach(cellname => {
        colorLines(cellname, activatedlines[cellname]);
    })
}

const boxFormed = (cells) => {
    var cellsformed = [];
    cells.forEach(cell => {
        if (sumOfCellElements(linesactive[cell]) == 4){
            cellsformed.push(cell);
        }
    });
    return cellsformed;
}

const fillBoxes = (cells) => {
    var fillcolor = ["blue", "red"];
    cells.forEach(cell => {
        document.getElementById(cell).style.setProperty("background", fillcolor[currentturn-1], "important");
        document.getElementById(cell).style.setProperty("border", "1px solid black", "important");
    })
}

const getLineNumber = (event) => {
    var ref = event.target.getBoundingClientRect();
    var originx = (ref.right+ref.left)/2;
    var originy = (ref.bottom+ref.top)/2;
    var x = event.clientX - originx; 
    var y = originy - event.clientY;
    x = x.toFixed(3), y = y.toFixed(3), originy = originy.toFixed(3), originx = originx.toFixed(3);
    var ylimit = ref.bottom.toFixed(3) - originy, xlimit = ref.right.toFixed(3) - originx;
    return getLine(event.target.id, x, y, xlimit, ylimit);
}

const getLine = (cellname, x, y, xlimit, ylimit) => {
    if (y > ylimit/2){
        return 0;
    }else if (y < -ylimit/2){
        return 2;
    }else if (x > xlimit/2){
        return 1;
    }else if (x < xlimit/2){
        return 3;
    }else{
        for (let ind = 0; ind < linesactive[cellname].length; ind++){
            if (linesactive[cellname][ind] == 0){
                return ind;
            }
        }
        return 0;
  }
}

const colorLines = (cellname, borderindex) => {
    var bordernames = ["border-top-color", "border-right-color", "border-bottom-color", "border-left-color"];
    var bordercolors = ["blue", "red"];
    document.getElementById(cellname).style.setProperty(bordernames[borderindex], bordercolors[currentturn-1], "important");
}

const sumOfCellElements = (arr) => {
    var sum = 0;
    arr.forEach(ele => sum += ele);
    return sum;
}
