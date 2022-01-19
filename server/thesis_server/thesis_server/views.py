import json
from django.http import HttpResponseNotFound,HttpResponseNotAllowed

def page_not_found(request, exception):
    return HttpResponseNotFound(json.dumps({"code": 404, "message": "页面没有找到哦"}, ensure_ascii=False))

def not_allowed(request, exception):
    return HttpResponseNotAllowed(json.dumps({"code": 405, "message": "请求不允许"}, ensure_ascii=False))