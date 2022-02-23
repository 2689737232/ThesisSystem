from django.contrib import admin
from .models import User,UserMenus,UserFunctions
# Register your models here.
admin.site.register(User)
admin.site.register(UserMenus)
admin.site.register(UserFunctions)
