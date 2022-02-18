import code
from unittest import result
from webbrowser import get
from django.http import FileResponse, HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from thesis_server.settings import BASE_DIR
from user.decorators.permission_required import permission_required
from util.result import result, MyCode
# 对文件进行访问  目前只有有pdf文件


@method_decorator(decorator=[csrf_exempt], name="dispatch")
class FileView(APIView):

    permission_required(2)  # 文件访问仅对注册用户开放

    def get(self, request, *args, **kwords):
        file_type = request.query_params.get("fileType")
        file_path = request.query_params.get("filePath")

        if file_type is None:
            return result(message="请求参数fileType丢失", code=MyCode.paramserror)
        if file_path is None:
            return result(message="请求参数filePath丢失", code=MyCode.paramserror)

        # https://blog.csdn.net/HYESC/article/details/111978789
        if file_type == "pdf":
               file_name = file_path.split("/")[1]
               response = FileResponse(open(BASE_DIR.joinpath("pdfs/", file_path), "rb"))
               response['Content-Type'] = 'application/pdf'
               # response['Content-Disposition'] = 'attachment;filename="%s"' % file_name  # 用于文件直接打开
               return response
        else:
            return result(message="请求失败", code=400)
