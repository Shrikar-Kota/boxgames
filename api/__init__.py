from flask import Flask, render_template, Blueprint
from flask_socketio import SocketIO

socketio = SocketIO()

boxitApi = Blueprint("boxit_api", __name__)
ticTacToeApi = Blueprint("tictactoe_api", __name__)

def createapp(debug):
    app = Flask(__name__, template_folder = "../templates", static_folder = "../static", static_url_path = '')
    app.secret_key = "notasecretanymore"
    app.debug = debug
    
    app.register_blueprint(boxitApi, url_prefix = "/boxit")
    app.register_blueprint(ticTacToeApi, url_prefix = "/tictactoe")
    
    @app.route('/')
    def index():
        return render_template('index.html')
    
    socketio.init_app(app, cors_allowed_origins="*", engineio_logger=True)
    return app

from . import __boxitapi, __boxitsockets, __tictactoeapi