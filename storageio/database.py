import pymongo
import certifi

from . import config

__mongodbclient = pymongo.MongoClient(config.DB_CONNECTION_STRING, tlsCAFile=certifi.where())
__mongodb = __mongodbclient.boxit

def find(collectionname:str, querystring:dict = None):
    return __mongodb[collectionname].find(querystring)

def find_one(collectionname:str, querystring:dict = None):
    return __mongodb[collectionname].find_one(querystring)

def insert_one(collectionname:str, data:dict):
    return __mongodb[collectionname].insert_one(data)

def update_one(collectionname:str, querystring:dict, data:dict):
    return __mongodb[collectionname].update_one(querystring, {"$set": data})

def delete_one(collectionname:str, querystring:dict = None):
    return __mongodb[collectionname].delete_one(querystring)