# -*- coding: utf-8 -*-
import code
import json
import jwt
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from user.models import Menu as MenuModel, Function,UserMenus,User
from user.decorators.permission_required import permission_required
from util.result import result, MyCode
from user.models import function_code_dict, menu_code_dict
from user.setting import SECRET_KEY


@method_decorator(decorator=[csrf_exempt], name="dispatch")
class Menu(APIView):
    @permission_required(1)
    def post(self, request, *args, **kwords):
        body_dict = json.loads(request.body.decode("utf8"))
        action = body_dict["action"]
        if action == "init":
            try:
                if gen_init_menu():
                    return result(message="操作%s执行成功" % action)
                else:
                    return result(message="添加失败", code=500)
            except BaseException as e:
                return result(message=str(e))

    def get(self, request, *args, **kwords):
        token = request.META.get('HTTP_AUTHORIZATION')
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_no = data["data"]["no"]
        if user_no is None:
            return result(message="需要接受用户id", code=MyCode.paramserror)
        
        user = User.objects.filter(no=user_no).first()
        user_menus = UserMenus.objects.filter(user=user, state=1)
        # menus = MenuModel.objects.filter(user_menu=user)
        menu_list = [{
            "name": um.menu.name,
            "code": um.menu.code,
            "id": um.menu.id
        } for um in user_menus]
        return result(message="ok", data={"menus": menu_list})


# 根据模型中的menu_code_dict初始化菜单数据
def gen_init_menu():
    MenuModel.objects.filter().delete()
    menu_list = menu_code_dict.keys()
    gen_list = [MenuModel(name=menu, code=menu_code_dict[menu])
                for menu in menu_list]
    for menu in gen_list:
        menu.save()
    return True
