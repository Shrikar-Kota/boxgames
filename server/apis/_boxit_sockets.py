from os import name
from flask import session
from flask_socketio import emit, join_room, rooms, leave_room
from random import randrange

from models.database_config import mongodb
from .. import socketio
from ..models.mogodb_utils import get_all_documents, create_new_room, get_roomdetails, delete_room_details, update_room_details

@socketio.on('createroom', namespace = '/boxit')
def createroom():
    previds = [document["_id"] for document in get_all_documents(mongodb["gamedata"])]
    newid = randrange(10**6, 10**7)
    while newid in previds:
        newid = randrange(10**6, 10**7)
    gamedetails = {
        "_id": newid,
        "playercount": 1,
        "gamerunning": 0
    }
    try:
        create_new_room(mongodb["gamedata"], gamedetails)
        emit('roomcreated', {'roomid': newid}) 
    except:
        emit('roomecreationerror')
        
@socketio.on('findroom', namespace = '/boxit')
def findroom(payload):
    roomid = payload['roomid']
    room_details = get_roomdetails(roomid, mongodb["gamedata"])
    if room_details is not None and room_details['gamerunning'] == 0:
        room_details["playercount"] += 1
        update_room_details(roomid, mongodb["gamedata"], room_details)
        emit('roomfound', {'roomid': roomid})
        emit('opponentjoined', {'roomid': roomid}, to = roomid)
    else:
        emit('roomnotfounderror')
    
@socketio.on('joinroom', namespace = '/boxit')
def joinroom(payload):
    roomid = payload['roomid']
    room_details = get_roomdetails(roomid, mongodb["gamedata"])
    if room_details is None:
        emit("roomnotfounderror")
    else:
        join_room(roomid)
    
@socketio.on('killroom', namespace = '/boxit')
def killroom(payload):
    id = payload["roomid"]
    room_details = get_roomdetails(id, mongodb["gamedata"])
    if room_details is not None:
        if room_details["gamerunning"] != 1:
            delete_room_details(id, mongodb["gamedata"])
    
@socketio.on("gamerestartrequestsent", namespace = "/boxit")
def gamerestartappealcreated():
    for i in rooms():
        if type(i) == int:
            emit("gamerestartrequested", room = i, include_self = False)
            break
        
@socketio.on("gamerestartacceptsent", namespace = "/boxit")
def gamerestartappealaccepted():
    for i in rooms():
        if type(i) == int:
            emit("gamerestartaccepted", room = i, include_self = False)
            break
        
@socketio.on("gamerestartdeclinesent", namespace = "/boxit")
def gamerestartappealdeclined():
    for i in rooms():
        if type(i) == int:
            emit("gamerestartdeclined", room = i, include_self = False)
            break
  
@socketio.on("moveplayed", namespace = "/boxit")
def moveplayed(payload):
    for i in rooms():
        if type(i) == int:
            emit("opponentmoveplayed", payload, room = i, include_self = False)
            break
        
@socketio.on('disconnect', namespace = '/boxit')
def disconnect():
    room_details = None
    for i in rooms():
        if type(i) == int:
            room_details = get_roomdetails(i, mongodb["gamedata"])
            break
    if room_details is not None:
        if room_details["gamerunning"] == 0 and room_details["playercount"] == 2:
            room_details["gamerunning"] = 1
            update_room_details(room_details['_id'], mongodb["gamedata"], room_details)
        else:
            emit("opponentdisconnected", room = room_details['_id'])
            delete_room_details(room_details["_id"], mongodb["gamedata"])