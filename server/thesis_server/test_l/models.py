from django.db import models
from django import forms

class User(models.Model):
    id = models.BigAutoField(primary_key=True)  #自定义主键，使用了primary_key后python不会再自动的添加
    name = models.CharField(max_length=5, default="", verbose_name="用户名")
    age = models.IntegerField(default=0, verbose_name="用户年龄")

class UploadFileForm(models.Model):
    title = models.CharField(max_length=500)
    file = forms.FileField()