from django.db import models
from django import forms


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
    password_bcrypt = models.CharField(max_length=150, null=False, default="123456")

    class Meta:
        db_table = "test_user"

class UploadFileForm(models.Model):
    title = models.CharField(max_length=500)
    file = forms.FileField()
