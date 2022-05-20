from asyncio import format_helpers
from django.contrib import admin
from .models import User, UserMenus, UserFunctions
from .model.PdfModel import Pdf
from util.tools import encryption
from django.db import transaction
from user.views import add_user

"""
 判断是否是添加用户
"""
def is_add_user_action(request, obj):
    # 对象为User且请求地址以 add 开头，算作是添加用户操作
    return type(obj) is User and request.path.endswith('add')

"""
 自定义admin
"""
class UserAdmin(admin.ModelAdmin):
    fieldsets = (
        ('用户基本信息', {'fields': ['no', 'role', 'name', 'age']}),
        ('用户密码', {'fields': ['password_bcrypt']}),
    )

    # 保存模型时的操作
    @transaction.atomic
    def save_model(self, request, obj, form, change):
        save_id = transaction.savepoint()
        # 添加用户
        if is_add_user_action(request, obj):
            try:
                user: User = obj
                add_user(user_no=user.no, password=obj.password_bcrypt,
                         role=user.role, name=user.name,  age=user.age, save_id=save_id)
            except BaseException as be:
                print("注册服务错误", be)
                if save_id is not None:
                    transaction.savepoint_rollback(save_id)

        else:
            super().save_model(request, obj, form, change)


admin.site.register(User, UserAdmin)
admin.site.register(UserMenus, UserAdmin)
admin.site.register(UserFunctions, UserAdmin)
admin.site.site_header = "论文管理后台"
admin.site.index_title = "用户管理"


