const socket = io.connect("http://" + document.domain + ":" + location.port + "/boxit");

socket.on("roomcreationerror", () => alert("Internal server error.\nTry later."));

socket.on("roomcreated", (roomid) => window.location.href = waitinglobbyurl + "?id=" + roomid["roomid"]);

socket.on("roomnotfounderror", () => {
    $("#joinloader-modal").modal('hide');
    displayInvalidRoom();
});

socket.on("roomfound", (roomid) => window.location.href = onlineurl + "?id=" + roomid["roomid"] + "&playername=2");

const performOnLoad = () => {
    document.querySelector("#join-room").addEventListener("click", onJoinRoomClick);
    document.querySelector("#create-room").addEventListener("click", onCreateRoomClick);
    document.querySelector("#joinroom-button").addEventListener("click", OnJoinRoomModalClick);
}

const onJoinRoomClick = () => {
    $('#joinroom-modal').modal('show');
}

const onCreateRoomClick = () => {
    $('#createloader-modal').modal('show');
    socket.emit('createroom');
}

const OnJoinRoomModalClick = () => {
    $('#joinroom-modal').modal('hide');
    var roomid = document.querySelector("#roomid-field").value;
    document.querySelector("#roomid-field").value = '';
    console.log(typeof(roomid))
    if (/^\d{7}$/.test(roomid)){
        socket.emit('findroom', {"roomid": parseInt(roomid)});
        displayJoinLoader();
    }
}

displayJoinLoader = () => {
    $("#joinloader-modal").modal('show');
}

displayInvalidRoom = () => {
    $("#invalidroom-modal").modal('show');
}