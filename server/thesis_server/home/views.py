from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
from util.result import result

# Create your views here.
def index(request):
    t = request
    print(t)
    return result(message="你好啊")
