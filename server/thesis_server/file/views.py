from webbrowser import get
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, csrf_protect 
from user.decorators.permission_required import permission_required

# 对文件进行访问  目前只有有pdf文件
@method_decorator(decorator=[csrf_exempt], name="dispatch")
class FileView(APIView):

   permission_required(2)  # 文件访问仅对注册用户开放
   def get(self, request, *args, **kwords):
      file_type = ""
      file_path = "" 
      return HttpResponse("ok")