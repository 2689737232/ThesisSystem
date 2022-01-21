import imp


import json


def request_dict(request: str) -> dict:
    return json.loads(request.body.decode("utf8"))

"""
    @password str
"""
import bcrypt
from util.result import result 

def make_hash(password):
    password_encode =  str.encode(password, "utf8") 
    # gensalt()  中参数rounds默认为12
    hashed = bcrypt.hashpw(password_encode, bcrypt.gensalt())
    return result(message="加密成功", data={"hashed": hashed.decode("utf8")})