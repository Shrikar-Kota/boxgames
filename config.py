import configparser

reader = configparser.ConfigParser()
reader.read("config.ini")

__STORAGE_CONFIG = reader['STORAGE_CONFIG']
__DB_CONFIG = reader['DB_CONFIG']
__APP_SETTINGS = reader['APP_SETTINGS']

STORAGE_TYPE = __STORAGE_CONFIG.get('STORAGE_TYPE', 'LOCAL')
DB_CONNECTION_STRING = __DB_CONFIG.get('CONNECTION_STRING', None)
APP_STARTUP_TYPE = __APP_SETTINGS.get('STARTUP_TYPE', 'DEBUG')