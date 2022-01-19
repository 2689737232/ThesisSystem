from json import load
import json
from django.template import loader
from django.shortcuts import render
from django.http import HttpResponse
from util.result import result,MyCode
from django.views.decorators.http import require_http_methods,require_POST

def index(request):
    return HttpResponse("传入的参数为 %s." % id)

# 需要大写
@require_http_methods(["GET", "POST"])
def show_params(requset,msg):
    return result(message=msg)

@require_POST
def upload_file(request):
    return result(message="上次成功")