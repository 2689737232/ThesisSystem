from asyncio import format_helpers
from django.contrib import admin
from .models import User, UserMenus, UserFunctions
from .model.PdfModel import Pdf
from util.tools import encryption
from django.db import transaction
from user.views import add_user
# Register your models here.
# admin.site.register(Pdf)
# admin.site.register(User)
# admin.site.register(UserMenus)
# admin.site.register(UserFunctions)

admin.site.site_header = "论文管理后台"
admin.site.index_title = "用户管理"


class UserAdmin(admin.ModelAdmin):
    fieldsets = (
        ('用户基本信息', {'fields': ['no', 'role', 'name', 'age']}),
        ('用户密码', {'fields': ['password_bcrypt']}),
    )

    # 保持模型时的操作
    @transaction.atomic
    def save_model(self, request, obj, form, change):
        save_id = transaction.savepoint()
        if type(obj) is User:
            try:
                user: User = obj
                add_user(user_no=user.no, password=obj.password_bcrypt,
                         role=user.role, name=user.name,  age=user.age, save_id=save_id)
            except BaseException as be:
                print("注册服务错误", be)
                if save_id is not None:
                    transaction.savepoint_rollback(save_id)

        #   super().save_model(request, obj, form, change)


admin.site.register(User, UserAdmin)
admin.site.register(UserMenus, UserAdmin)
admin.site.register(UserFunctions, UserAdmin)
