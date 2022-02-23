from rest_framework.views import APIView
from user.models import menu_code_dict, \
    function_code_dict, menu_function_dict,\
    Function as FunctionModel, Menu
from util.result import result
import json
from user.decorators.permission_required import permission_required


# 更具menu生成function
class Function(APIView):
    @permission_required(1)
    def post(self, request, *args, **kwords):
        body_dict = json.loads(request.body.decode("utf8"))
        action = body_dict["action"]
        if action == "init":
            gen_init_function()
            return result("初始化功能表")
        elif action is None:
            return result("需要传入action参数")

    def get(self, request, *args, **kwords):
        pass


def gen_init_function():
    FunctionModel.objects.all().delete()
    for menu_name, functions in menu_function_dict.items():
        menu_code = menu_code_dict[menu_name]
        menu = Menu.objects.filter(code=menu_code).first()
        for key in functions:
            f = FunctionModel(
                menu=menu,
                name=key,
                code=function_code_dict[key],
            )
            f.save()
    return True