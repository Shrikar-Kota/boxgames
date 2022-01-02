const socket = io.connect("http://" + document.domain + ":" + location.port + "/boxit");

socket.on("roomcreationerror", () => alert("Internal server error.\nTry later."));

socket.on("roomcreated", (roomid) => window.location.href = waitinglobbyurl + "?id=" + roomid["roomid"]);

socket.on("roomnotfounderror", () => alert("Room not found!\nEnter valid code."));

socket.on("roomfound", (roomid) => window.location.href = onlineurl + "?id=" + roomid["roomid"] + "&playername=2");

const performOnLoad = () => {
    document.querySelector("#join-room").addEventListener("click", onJoinRoomClick);
    document.querySelector("#create-room").addEventListener("click", onCreateRoomClick);
}

const onJoinRoomClick = () => {
    var roomid = prompt("Enter room id");
    socket.emit('findroom', {"roomid": parseInt(roomid)});
}

const onCreateRoomClick = () => {
    socket.emit('createroom');
}