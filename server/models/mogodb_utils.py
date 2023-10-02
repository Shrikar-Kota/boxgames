from models.database_config import mongodb

def get_all_documents(collection):
    return collection.find()

def get_roomdetails(id, collection):
    return collection.find_one({"_id": id})

def create_new_room(collection, data):
    return collection.insert_one(data)

def update_room_details(id, collection, data):
    return collection.update_one({"_id": id}, {"$set": data})

def delete_room_details(id, collection):
    return collection.delete_one({"_id": id})