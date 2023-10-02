const socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port + "/boxit");

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
    $('#joinroom-modal').modal({backdrop: 'static', keyboard: false}, 'show');
}

const onCreateRoomClick = () => {
    $('#createloader-modal').modal({backdrop: 'static', keyboard: false}, 'show');
    socket.emit('createroom');
}

const OnJoinRoomModalClick = () => {
    $('#joinroom-modal').modal('hide');
    var roomid = document.querySelector("#roomid-field").value;
    document.querySelector("#roomid-field").value = '';
    if (/^\d{7}$/.test(roomid)){
        socket.emit('findroom', {"roomid": parseInt(roomid)});
        displayJoinLoader();
    }
    else{
        displayInvalidRoom();
    }
}

displayJoinLoader = () => {
    $("#joinloader-modal").modal({backdrop: 'static', keyboard: false}, 'show');
}

displayInvalidRoom = () => {
    $("#invalidroom-modal").modal('show');
}