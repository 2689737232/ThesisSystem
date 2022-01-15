from http.client import ImproperConnectionState
import imp
from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(request):
   return HttpResponse("你好啊！我是登录页面")


def sign_up_id(request, sign_up_id):
   print(request)
   return HttpResponse("注册页面 %s"%sign_up_id)

def sign_up(request):
   print(request)
   return HttpResponse("注册页面")