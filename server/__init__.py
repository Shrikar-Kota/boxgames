from flask import Flask
from flask_socketio import SocketIO

socketio = SocketIO()

def createapp(debug = False):
    app = Flask(__name__, template_folder = "../templates", static_folder = "../static", static_url_path = '')
    app.secret_key = "secret"
    app.debug = debug
    from .apis import boxit_api
    
    app.register_blueprint(boxit_api, url_prefix = "/boxit")
    
    socketio.init_app(app)
    return app