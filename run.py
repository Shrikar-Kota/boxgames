from server import createapp, socketio

app = createapp(debug = True)

if __name__ == "__main__":
    socketio.run(app)