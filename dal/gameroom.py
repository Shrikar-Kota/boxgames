from . import storage

def get_all_documents():
    return storage.find('gamedata')

def get_roomdetails(id):
    return storage.find_one('gamedata', {"_id": id})

def create_new_room(data):
    return storage.insert_one('gamedata', data)

def update_room_details(id, data):
    return storage.update_one('gamedata', {"_id": id}, data)

def delete_room_details(id):
    return storage.delete_one('gamedata', {"_id": id})