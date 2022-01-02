from flask import Blueprint

boxit_api = Blueprint("boxit_api", __name__)

from . import _boxit_api, _boxit_sockets