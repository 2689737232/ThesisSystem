from django.template import loader
from django.shortcuts import render
from django.http import HttpResponse
from util.result import result,MyCode
from django.views.decorators.http import require_http_methods,require_POST
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt  # 使用装饰器

# 视图可以写成函数（FBV）、类（CBV）

def index_view(request):
    return HttpResponse("传入的参数为 %s." % id)

# 需要大写
@require_http_methods(["GET", "POST"])
def show_params_view(requset,msg):
    return result(message=msg)

@require_POST
@csrf_exempt
def upload_file_view(request):
    return result(message="上次成功")

# 写cbv时，请求是get执行get方法,同时需要继承django中的View类
from django.views import View
@method_decorator(csrf_exempt, name='dispatch')
class CBV_View(View):
    def get(self, request, *args, **kwords):
        return result(message="使用cbv中的get请求")

    def post(self, request, *args, **kwords):
        return result(message="使用cbv中的post请求")


# 搭建restful接口
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
from test_l.serializers import UserSerializer, GroupSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]