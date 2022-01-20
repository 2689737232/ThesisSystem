from django.db import models
from django import forms


class User(models.Model):
    ROLE = (
        (1, 'teacher'),
        (2, 'student'),
        (3, 'tourist')
    )
    # 自定义主键，使用了primary_key后python不会再自动的添加
    id = models.BigAutoField(primary_key=True)
    role = models.SmallIntegerField(choices=ROLE, default=3)
    name = models.CharField(max_length=5, default="", verbose_name="用户名")
    age = models.IntegerField(default=0, verbose_name="用户年龄")

    class Meta:
        db_table = "test_user"

class UploadFileForm(models.Model):
    title = models.CharField(max_length=500)
    file = forms.FileField()
