# -*- coding: utf-8 -*-
import json
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from user.models import Menu as MenuModel, Function
from user.decorators.permission_required import permission_required
from util.result import result, MyCode
from user.models import function_code_dict, menu_code_dict

@method_decorator(decorator=[csrf_exempt], name="dispatch")
class Menu(APIView):
    @permission_required("需要携带token")
    def post(self, request, *args, **kwords):
        body_dict = json.loads(request.body.decode("utf8"))
        action = body_dict["action"]
        if action == "init":
            try:
                if gen_init_menu():
                    return result(message="操作%s执行成功"%action)
                else:
                    return result(message="添加失败", code=500)
            except BaseException as e:
                return result(message=str(e))

    def get(self, request, *args, **kwords):
        menus = MenuModel.objects.all()
        menu_list = [{
            "name": menu.name,
            "code": menu.code,
            "id": menu.id
        } for menu in menus]
        return result(message="ok", data={"menus": menu_list})

def gen_init_menu():
    menu_list = menu_code_dict.keys()
    gen_list = [MenuModel(name=menu, code=menu_code_dict[menu]) for menu in menu_list]
    for menu in gen_list:
        menu.save()
    return True
