import json
from http.client import ImproperConnectionState
import imp
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.http import require_GET, require_POST
from util.result import  result
# Create your views here.
import sys


def index(request):
   return result(message="你好这里是登录页面", data={})
   # return  "ok"


def sign_up_id(request, sign_up_id):
   print(request)
   return HttpResponse("注册页面 %s"%sign_up_id)

@require_POST
def sign_up(request):
   print(request)
   return HttpResponse("注册页面")