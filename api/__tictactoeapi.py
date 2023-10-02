from flask import render_template, request
from datetime import datetime, timezone

from . import ticTacToeApi

@ticTacToeApi.route("/")
def home():
    return render_template('tictactoe/home.html')

@ticTacToeApi.route("/howtoplay")
def howtoplay():
    return render_template('tictactoe/howtoplay.html')    

@ticTacToeApi.route("/local")
def local_home():
    return render_template('tictactoe/local/home.html')

@ticTacToeApi.route("/local/singleplayer/game")
def local_singleplayer_game():
    return render_template('tictactoe/local/singleplayergame.html')

@ticTacToeApi.route("/local/multiplayer/game")
def local_multiplayer_game():
    return render_template('tictactoe/local/multiplayergame.html')