var socket = io.connect("http://" + document.domain + ":" + location.port + "/boxit");

//when opponent joins
socket.on('opponentjoined', (roomid) => window.location.href = onlineurl + "?id=" + roomid["roomid"] + "&playername=1");

const performOnLoad = () => {
    socket.emit("joinwaitinglobby", {'roomid': roomid});
    document.querySelector("#timer").innerHTML = 30;
    timer();
}

const timer = () => {
    var time = 30;
    var countdown = setInterval(() => {
        document.querySelector("#timer").innerHTML = time;
        time -= 1;
    }, 1000);
    setTimeout(
        () => {
            clearInterval(countdown);
            document.getElementById("body-area").innerHTML = "<h3>Player failed to join!</h3><br>";
            document.getElementById("home-button").classList.remove("invisible");
            killRoom(roomid);
        },
        1000*32
    )
}

const killRoom = (roomid) => {
    socket.emit("killroom", {"roomid": roomid});
}