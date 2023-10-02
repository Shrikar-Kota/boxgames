from api import createapp
import config

app = createapp(False)
        
if __name__ == "__main__":
    if config.APP_STARTUP_TYPE == 'DEBUG':
        app.debug = True
        from api import socketio
        socketio.run(app)    
    else:
        app.run()