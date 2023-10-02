import json
import os

__LOCAL_STORAGE = os.path.join(os.getcwd(), "localstorage")

def __createfile(filename):
    if not (os.path.exists(__LOCAL_STORAGE)):
        os.mkdir(__LOCAL_STORAGE)
        if not (os.path.exists(os.path.join(__LOCAL_STORAGE, filename+".json"))):
            with open(os.path.join(__LOCAL_STORAGE, filename+".json"), "w") as file:
                json.dump({filename: []}, file)

def __getData(filename):
    __createfile(filename)
    with open(os.path.join(__LOCAL_STORAGE, filename+".json"), "r") as file:
        return json.load(file)[filename]

def __writeData(filename, data:dict):
    __createfile(filename)
    with open(os.path.join(__LOCAL_STORAGE, filename+".json"), "w") as file:
        json.dump({filename: data}, file)
    
def find(collectionname:str, querystring:dict = None):
    itemslist = []
    for item in __getData(collectionname):
        if querystring is None:
            itemslist.append(item)
            continue
        isitem = True
        for key in querystring:
            if item[key] != querystring[key]:
                isitem = False
                break
        if isitem:
            itemslist.append(item)
    return itemslist

def find_one(collectionname:str, querystring:dict = None):
    for item in __getData(collectionname):
        if querystring is None:
            return item
        isitem = True
        for key in querystring:
            if item[key] != querystring[key]:
                isitem = False
                break
        if isitem:
            return item
    return None

def insert_one(collectionname:str, data:dict):
    __writeData(collectionname, [*__getData(collectionname), data])

def update_one(collectionname:str, querystring:dict, data:dict):
    itemslist = __getData(collectionname)
    for index in range(len(itemslist)):
        isitem = True
        for key in querystring:
            if itemslist[index][key] != querystring[key]:
                isitem = False
                break
        if isitem:
            for key in data:
                itemslist[index][key] = data[key]
            break
    __writeData(collectionname, itemslist)

def delete_one(collectionname:str, querystring:dict):
    itemslist = __getData(collectionname)
    for index in range(len(itemslist)):
        isitem = True
        for key in querystring:
            if itemslist[index][key] != querystring[key]:
                isitem = False
                break
        if isitem:
            itemslist.pop(index)
            break
    __writeData(collectionname, itemslist)