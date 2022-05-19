from util.result import result
import bcrypt
import imp
import json


def request_dict(request: str) -> dict:
    return json.loads(request.body.decode("utf8"))


"""
    @password str
"""


def make_hash(password):
    password_encode = str.encode(password, "utf8")
    # gensalt()  中参数rounds默认为12
    hashed = bcrypt.hashpw(password_encode, bcrypt.gensalt())
    return result(message="加密成功", data={"hashed": hashed.decode("utf8")})


"""
    对明文密码进行加密，返回加密后的结果
"""
def encryption(password):
    password_encode = str.encode(password, "utf8")
    return bcrypt.hashpw(
        password_encode, bcrypt.gensalt()
    ).decode("utf8")
