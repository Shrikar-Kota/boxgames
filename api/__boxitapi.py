from flask import render_template, request
from datetime import datetime, timezone

from . import boxitApi
from dal.gameroom import get_roomdetails

@boxitApi.route("/")
def home():
    return render_template('boxit/home.html')

@boxitApi.route("/howtoplay")
def howtoplay():
    return render_template('boxit/howtoplay.html')    

@boxitApi.route("/local")
def local_home():
    return render_template('boxit/local/home.html')

@boxitApi.route("/local/multiplayer/game")
def local_multiplayer_game():
    return render_template('boxit/local/multiplayergame.html')

@boxitApi.route("/online/multiplayer")
def online_home():
    return render_template('boxit/online/home.html')
    
@boxitApi.route("/online/multiplayer/waitinglobby")
def online_waitinglobby():
    roomid = request.args.get("id")
    if roomid:
        roomid = int(roomid)
        roomdetails = get_roomdetails(roomid)
        if roomdetails is not None:
            timeelapsed = int(datetime.now().replace(tzinfo=timezone.utc).timestamp()) - roomdetails['starttime']
            timeleft = 30 - timeelapsed
            if timeleft <= 0:
                timeleft = 0
            return render_template('boxit/online/waitinglobby.html', roomid = roomid, timeleft = timeleft)
    return render_template('boxit/home.html')    

@boxitApi.route("/online/multiplayer/game")
def online_multiplayer_game():
    roomid = request.args.get("id")
    playername = request.args.get("playername")
    if roomid and playername:
        roomid = int(roomid); playername = int(playername)
        roomdetails = get_roomdetails(roomid)
        if roomdetails is not None:
            return render_template('boxit/online/game.html', roomid = roomid, playername = playername)
    return render_template('boxit/home.html')