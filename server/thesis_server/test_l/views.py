from email import message
from rest_framework.views import APIView
from test_l.serializers import UserSerializer, GroupSerializer
from rest_framework import permissions
from rest_framework import viewsets
from django.contrib.auth.models import User, Group
import bcrypt
from django.views import View
import json
from django.http import HttpResponse
from util.result import result,MyCode
from util.tools import request_dict
from django.views.decorators.http import require_http_methods, require_POST
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt  # 使用装饰器
from .models import User as MyUser
# 视图可以写成函数（FBV）、类（CBV）


def index_view(request):
    return HttpResponse("传入的参数为 %s." % id)

# 需要大写


@require_http_methods(["GET", "POST"])
def show_params_view(requset, msg):
    return result(message=msg)


@require_POST
@csrf_exempt
def upload_file_view(request):
    return result(message="上次成功")


# 写cbv时，请求是get执行get方法,同时需要继承django中的View类


@method_decorator(csrf_exempt, name='dispatch')
class CBV_View(View):
    def get(self, request, *args, **kwords):
        return result(message="使用cbv中的get请求")

    def post(self, request, *args, **kwords):
        return result(message="使用cbv中的post请求")


class PublicKeyView(APIView):
    def get(self, request, *args, **kwords):
        return result("加密公钥", data={"public_key": "asgas5g45sag"})


"""
 加密密码
"""


@method_decorator(decorator=[csrf_exempt], name="dispatch")
class BcryptView(APIView):
    def post(self, request, *args, **kwords):
        body_dict = request_dict(request)
        password_encode = str.encode(body_dict["password"], "utf8")
        # gensalt()  中参数rounds默认为12
        hashed = bcrypt.hashpw(password_encode, bcrypt.gensalt())
        return result(message="加密成功", data={"hashed": hashed.decode("utf8")})


@method_decorator(decorator=[csrf_exempt], name="dispatch")
class AuthView(View):
    def post(self, request, *args, **kwords):
        result_dict = {
            "message": "",
            "code": MyCode.ok,
            "data": None
        }
        try:
            body_dict = json.loads(request.body.decode("utf8"))
            user_no = body_dict["userNo"]
            password = body_dict["password"]

            if user_no is None or password is None:
                result_dict["code"] = MyCode.paramserror
                result_dict["message"] = "账号或密码不能为空！"
            else:
                # 验证账号密码
                db_user = MyUser.objects.filter(no=user_no).first()
                if db_user is None:
                    return result(code=MyCode.paramserror, message="用户不存在")
                if bcrypt.checkpw(str.encode(password, "utf8"), str.encode(db_user.password_bcrypt, "utf8")):
                    result_dict["code"] = MyCode.ok
                    result_dict["message"] = "登录成功"
                    # 生成token，添加到响应头中
                else:
                    result_dict["code"] = MyCode.forbidden
                    result_dict["message"] = "请检查用户名或密码"

        except Exception as e:
            print(e)
            result_dict["code"] = MyCode.forbidden
            result_dict["message"] = "请求异常"
        return result(code=result_dict["code"], message=result_dict["message"], data=result_dict["data"])

    def get(self, request, *args, **kwords):
        pass
# 搭建restful接口


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
