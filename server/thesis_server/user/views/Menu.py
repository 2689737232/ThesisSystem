import json
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from user.models import Menu, Function
from user.decorators.permission_required import permission_required


@method_decorator(decorator=[csrf_exempt], name="dispatch")
class Menu(APIView):
    @permission_required("需要携带token")
    def post(self, request, *args, **kwords):
        body_dict = json.loads(request.body.decode("utf8"))
        action = body_dict["action"]
        if action == "init":
            gen_init_menu()


def gen_init_menu():
    menu_list = ["我的文献", "浏览", "回收站", "添加用户", "导入", "权限修改"]
    gen_list = [Menu(name=menu, code=menu) for menu in menu_list]
    [menu.save() for menu in gen_list]
    return True


def gen_init_function():
    function_list = ["浏览我的文档", "删除我的文档",
                     "修改自己文档", "添加学生", "添加教师", "添加管理员", "导入文档", "权限修改"]
    menu_function_dict = {
        "浏览我的文档": "我的文献",
        "删除我的文档": "我的文献",
        "修改自己文档": "我的文献",
        "添加学生": "添加用户",
        "添加教师": "添加用户",
        "添加管理员": "添加用户",
        "导入文档": "导入",
        "权限修改": "权限修改"
    }
    result_list = []
    for name in function_list:
        Function.objects.filter("")
