import config

if (config.STORAGE_TYPE == 'DATABASE'):
    from . import database as storage
else:
    from . import jsonstorage as storage