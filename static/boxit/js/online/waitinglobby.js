var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port + "/boxit");

//when opponent joins
socket.on('opponentjoined', (roomid) => window.location.href = onlineurl + "?id=" + roomid["roomid"] + "&playername=1");

const performOnLoad = () => {
    socket.emit("joinwaitinglobby", {'roomid': roomid});
    document.querySelector("#timer").innerHTML = timeleft;
    timer();
}

const timer = () => {
    var time = timeleft;
    if (timeleft == 0)
    {
        killRoom(roomid);
        document.getElementById("body-area").innerHTML = "<h3>Player failed to join!</h3><br>";
        document.getElementById("home-button").classList.remove("invisible");
    } 
    else
    {
        var countdown = setInterval(() => {
            if (time >= 0)
            {
                document.querySelector("#timer").innerHTML = time;
                time -= 1;
            }
        }, 1000);
        setTimeout(
            () => {
                killRoom(roomid);
                clearInterval(countdown);
                document.getElementById("body-area").innerHTML = "<h3>Player failed to join!</h3><br>";
                document.getElementById("home-button").classList.remove("invisible");
            },
            1000*(timeleft+1)
        )
    }
}

const killRoom = (roomid) => {
    socket.emit("killroom", {"roomid": roomid});
}