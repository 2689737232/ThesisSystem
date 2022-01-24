from datetime import datetime, timedelta
from math import fabs
from operator import mod
from random import choice

from django.template import engine
from .setting import SECRET_KEY
from django.db import models
import jwt

# Create your models here.


class User(models.Model):
    ROLE = (
        (1, 'super_user'),
        (2, 'teacher'),
        (3, 'student'),
        (4, 'tourist')
    )
    # 自定义主键，使用了primary_key后python不会再自动的添加
    id = models.BigAutoField(primary_key=True)
    # 学号、角色、名字、年龄、密码（加密）
    no = models.CharField(max_length=12, unique=True)
    role = models.SmallIntegerField(choices=ROLE, default=3)
    name = models.CharField(max_length=5, default="", verbose_name="用户名")
    age = models.IntegerField(default=0, verbose_name="用户年龄")
    password_bcrypt = models.CharField(
        max_length=150, null=False)

    class Meta:
        db_table = "user"

    # 在user模型中添加静态方法

    def __str__(self):
        return self.name

    @property
    def token(self):
        return self._gen_jwt_token()

    def _gen_jwt_token(self):
        token = jwt.encode({
            'exp': datetime.utcnow() + timedelta(days=3),
            'iat': datetime.utcnow(),
            'data': {
                'username': self.name,
                'no': self.no,
                'role': self.role
            }
        }, SECRET_KEY, algorithm='HS256')

        return token


"""
权限表，菜单下对于功能
    菜单: 我的文献、浏览、回收站、添加用户、导入、权限修改（考虑添加）
    功能: 浏览文档、删除文档、修改文档、添加学生、添加教师、导入文档、权限修改（考虑添加）

    学生用户:
        菜单: 我的文献、浏览、回收站、导入
        功能: 浏览文档、删除文档、修改文档、导入文档
    教师用户:
         菜单: 我的文献、浏览、回收站、添加用户、导入
         功能: 浏览文档、删除文档、修改文档、添加学生、导入文档
    管理员: 所有
"""


class MapModel(models.Model):
    @property
    def code_name(self):
        return self.code_dict[self.code]
    class Meta:
        abstract = True

class Menu(MapModel):
    user_menu = models.ManyToManyField(User)  # 菜单和用户多对一
    name = models.CharField(max_length=50, null=True)
    CODE = (
        ("1000001", "我的文献"),
        ("1000002", "浏览"),
        ("1000003", "回收站"),
        ("1000004", "添加用户"),
        ("1000005", "导入"),
        ("1000006", "权限修改")
    )
    code_dict = {
        "1000001": "我的文献",
        "1000002": "浏览",
        "1000003": "回收站",
        "1000004": "添加用户",
        "1000005": "导入",
        "1000006": "权限修改"
    }
    code = models.CharField(choices=CODE, max_length=7, null=False)
    STATE = (
        (1, 'allow'),
        (2, 'forbid')
    )
    state = models.SmallIntegerField(choices=STATE, null=False)
    icon = models.CharField(max_length=200, null=True)



class Function(models.Model):
    user_function = models.ManyToManyField(User)  # 功能和用户是多对多
    menu_id = models.ForeignKey(Menu,  on_delete=models.CASCADE)  # 功能和菜单多对一
    name = models.CharField(max_length=50, null=False)
    CODE = (
        # 我的文献页
        ("2000001", "浏览我的文档"),
        # 回收站页
        ("2000002", "删除我的文档"),
        # 浏览页
        ("2000003", "修改自己文档"),
        # 添加用户页
        ("2000004", "添加学生"),
        ("2000005", "添加教师"),
        # 导入页
        ("2000006", "导入文档"),
        # 权限修改页
        ("2000007", "权限修改")
    )
    code_dict = {
        "2000001": "浏览我的文档",
        "2000002": "删除我的文档",
        "2000003": "修改自己文档",
        "2000004": "添加学生",
        "2000005": "添加教师",
        "2000006": "导入文档",
        "2000007": "权限修改"
    }
    code = models.CharField(choices=CODE, max_length=7, null=False)
    STATE = (
        (1, 'allow'),
        (2, 'forbid')
    )
    state = models.SmallIntegerField(choices=STATE, null=False)
    icon = models.CharField(max_length=200, null=True)

