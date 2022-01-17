"""
    自定义返回json数据格式
"""
from email import charset
from django.http import JsonResponse, HttpResponse


class MyCode(object):
    # 正常登陆
    ok = 200
    # 参数错误
    paramserror = 400
    # 权限错误
    unauth = 401
    # 禁止
    forbidden = 403
    # 未找到
    notfount = 404
    # 方法错误
    methoderror = 405
    # 服务器内部错误
    servererror = 500


def result(code:MyCode = MyCode.ok, message:str = "", data = None, kwargs = None) -> JsonResponse:
    json_dict = {
        "code": code,
        "message": message,
        "data": data
    }
    if kwargs and isinstance(kwargs, dict) and kwargs.keys():
        json_dict.update(kwargs)
    return  JsonResponse(json_dict, json_dumps_params={'ensure_ascii': False})

def ok(message: str) -> JsonResponse:
    return result(message=message)

# 参数错误
def params_error(message="", data=None):
    return result(code=MyCode.paramserror, message=message, data=data)

# 权限错误
def unauth(message="", data=None):
    return result(code=MyCode.unauth, message=message, data=data)

# 方法错误
def method_error(message="", data=None):
    return result(code=MyCode.methoderror, message=message, data=data)

# 服务器内部错误
def server_error(message="", data=None):
    return result(code=MyCode.servererror, message=message, data=data)
