from datetime import datetime, timedelta
from .setting import SECRET_KEY
from django.db import models
import jwt


# Create your models here
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
    no = models.CharField(max_length=12, unique=True, verbose_name='学号')
    role = models.SmallIntegerField(choices=ROLE, default=3, verbose_name='角色')
    name = models.CharField(max_length=5, default="", verbose_name="用户名")
    age = models.IntegerField(default=0, verbose_name="用户年龄")
    password_bcrypt = models.CharField(
        verbose_name='密码(加密)',
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

# 用户收藏
# class UserCollection(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     user = models.ForeignKey()
"""
权限表，菜单下对于功能
    菜单: 我的文献、浏览、回收站、添加用户、导入、权限修改（考虑添加）、收藏
    功能: 浏览文档、删除文档、修改文档、添加学生、添加教师、导入文档、权限修改（考虑添加）、读取收藏、删除收藏、添加收藏、

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


def gen_code(code_dict: list):
    l = []
    for key, val in code_dict.items():
        l.append((val, key))
    return tuple(l)


menu_code_dict = {
    "我的文献": "1000001",
    "浏览": "1000002",
    "回收站": "1000003",
    "添加用户": "1000004",
    "导入": "1000005",
    "权限修改": "1000006",
    "收藏": "1000007",
    "权限管理": "1000008",
    "搜索": "1000009",
    "推荐": "1000010"
}
function_code_dict = {
    "浏览我的文档": "2000001",
    "删除我的文档": "2000002",
    "修改自己文档": "2000003",
    "添加学生": "2000004",
    "添加教师": "2000005",
    "导入文档": "2000006",
    "权限修改": "2000007",
    "恢复文档": "2000008",
    "浏览其他文献": "2000009",
    "读取收藏": "2000010",
    "删除收藏": "2000011",
    "添加收藏": "2000012",
    "进入权限管理": "2000013",
    "搜索": "2000014",
    "推荐": "2000015"
}
menu_function_dict = {
    "我的文献": ["浏览我的文档", "删除我的文档", "修改自己文档"],
    "浏览": ["浏览其他文献"],
    "回收站": ["恢复文档"],
    "添加用户": ["添加学生", "添加教师"],
    "导入": ["导入文档"],
    "权限修改": ["权限修改"],
    "收藏": ["读取收藏", "删除收藏", "添加收藏"],
    "权限管理": ["进入权限管理"],
    "搜索": ["搜索"],
    "推荐": ["推荐"]
}


class Menu(MapModel):
    user_menu = models.ManyToManyField(User, through='UserMenus')  # 菜单和用户多对一
    name = models.CharField(max_length=50, null=True)
    CODE = gen_code(menu_code_dict)
    code = models.CharField(choices=CODE, max_length=7,
                            null=False, unique=True)
    icon = models.CharField(max_length=200, null=True)


class UserMenus(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)
    STATE = (
        (1, 'allow'),
        (2, 'forbid')
    )
    state = models.SmallIntegerField(choices=STATE, null=False)


class Function(models.Model):
    user_function = models.ManyToManyField(
        User, through='UserFunctions')  # 功能和用户是多对多
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)  # 功能和菜单多对一
    name = models.CharField(max_length=50, null=False)
    CODE = gen_code(function_code_dict)
    code = models.CharField(choices=CODE, max_length=7,
                            null=False, unique=True)
    icon = models.CharField(max_length=200, null=True)


class UserFunctions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    function = models.ForeignKey(Function, on_delete=models.CASCADE)
    STATE = (
        (1, 'allow'),
        (2, 'forbid')
    )
    state = models.SmallIntegerField(choices=STATE, null=False)

