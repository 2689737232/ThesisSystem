import bcrypt
from django.views import View
import json
from .models import User, Menu, Function
from util.result import result, MyCode
from django.views.decorators.http import require_http_methods, require_POST
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, csrf_protect  # 使用装饰器
from .models import User as MyUser, UserFunctions, UserMenus, \
    function_code_dict, menu_code_dict, menu_function_dict
from rest_framework.views import APIView
from util.tools import request_dict
from .decorators.permission_required import permission_required
from django.db import transaction

# Create your views here.


@method_decorator(decorator=[csrf_exempt], name="dispatch")
class Index(View):
    def get(self, request, *args, **kwords):
        return result(message="用户接口")


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
    # 登录
    def post(self, request, *args, **kwords):
        result_dict = {
            "message": "",
            "code": MyCode.ok,
            "data": {}
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
                    token = db_user.token
                    # 生成token，添加到响应头中
                    result_dict["data"]["token"] = token
                else:
                    result_dict["code"] = MyCode.forbidden
                    result_dict["message"] = "请检查用户名或密码"

        except Exception as e:
            print("登录异常", e)
            result_dict["code"] = MyCode.forbidden
            result_dict["message"] = "请求异常"
        return result(code=result_dict["code"], message=result_dict["message"], data=result_dict["data"])

    # 用户注册只对管理员开放
    @permission_required(1)
    @transaction.atomic
    def get(self, request, *args, **kwords):
        body_dict = json.loads(request.body.decode("utf8"))
        user_no = body_dict["userNo"]
        password = body_dict["password"]
        role = body_dict["role"]
        name = body_dict["name"]
        age = body_dict["age"]
        try:
            if role is None:
                role = 3
            if user_no is None or password is None:
                return result(message="账号密码不能为空", code=MyCode.paramserror)
            elif len(user_no) < 11:
                return result(message="账号不能小于11位", code=MyCode.paramserror)
            elif len(password) < 10:
                return result(message="密码不能小于10位", code=MyCode.paramserror)
            else:
                # 查询数据库账号是否存在
                exist = userExist(user_no)
                if exist:
                    return result(message="账号已经存在", code=MyCode.paramserror)
                else:
                    save_id = transaction.savepoint()
                    # 添加用户
                    user = addUser(user_no=user_no,
                                   password=password,
                                   role=role,
                                   name=name,
                                   age=age,
                                   save_id=save_id
                                   )

                    return result("ok", data={"user_no": user.no, "name": user.name})
        except BaseException as be:
            print("注册服务错误", be)
            if save_id is not None:
                transaction.savepoint_rollback(save_id)
            return result(code=MyCode.servererror, message="请求异常")


# 向数据库中添加用户
def addUser(user_no, password, role, name,  age, save_id):
    if age is None:
        age = 0
    if name is None:
        name = "未知"

    password_encode = str.encode(password, "utf8")
    user = MyUser(
        no=user_no,
        role=role,
        name=name,
        password_bcrypt=bcrypt.hashpw(
            password_encode, bcrypt.gensalt()
        ).decode("utf8")
    )
    user.save()
    # 设置用户页面、功能权限
    add_user_permission(user)
    # 提交事务
    transaction.savepoint_commit(save_id)
    return user


def add_user_permission(user: User):
    user_menus = []
    user_function = []
    if user.role == '1':    # 管理员
        user_menus = menu_code_dict.keys()
        user_function = function_code_dict.keys()
    elif user.role == '2':  # 教师
        user_menus = ["我的文献", "浏览", "回收站", "导入", "添加用户"]
        user_function = ["浏览我的文档", "删除我的文档",
                         "修改自己文档", "浏览其他文献", "添加学生", "导入文档"]
    elif user.role == '3':  # 学生
        user_menus = ["我的文献", "浏览", "回收站", "导入"]
        user_function = ["浏览我的文档", "删除我的文档", "修改自己文档", "浏览其他文献",  "导入文档"]
    else:
        user_menus = ["浏览"]
        user_function = ["浏览其他文献"]
    set_user_menu_function(user_menus, user_function, user)


def set_user_menu_function(user_menus, user_functions, user):
    all_menu = list(menu_code_dict.keys())
    all_function = list(function_code_dict.keys())

    for mk in all_menu:
        menu = Menu.objects.filter(code=menu_code_dict[mk]).first()
        if mk in user_menus:
            UserMenus(user=user, menu=menu, state=1).save()
        else:
            UserMenus(user=user, menu=menu, state=2).save()

    for fk in all_function:
        function = Function.objects.filter(
            code=function_code_dict[fk]).first()
        if fk in user_functions:
            UserFunctions(user=user, function=function, state=1).save()
        else:
            UserFunctions(user=user, function=function, state=2).save()


# 判断用户是否存在
def userExist(user_no: str):
    user = MyUser.objects.filter(no=user_no).first()
    if user is None:
        return False
    else:
        return True
