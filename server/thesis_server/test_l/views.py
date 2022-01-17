from json import load
from django.template import loader
from django.shortcuts import render
from django.http import HttpResponse
from util.result import result,MyCode

# Create your views here.
def index(request):
    if id is None:
        return result(message="请求参数错误", code=MyCode.paramserror)
    return HttpResponse("传入的参数为 %s." % id)

def insert_user(requset, user_name, user_age):
    pass