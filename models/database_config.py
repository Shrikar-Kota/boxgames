import pymongo
import os
import certifi

mongo = pymongo.MongoClient("mongodb+srv://shrikar:shrikar@boxgames.fl8wx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", tlsCAFile=certifi.where())
mongodb = mongo.boxit

