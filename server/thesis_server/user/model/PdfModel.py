from statistics import mode
from django.db import models
from user.models import User
from django.forms import ModelForm

"""
   上传用户、作者、年份、pdf标题、期刊、最后更新、文献类型、时间、保存uri
"""
# https://docs.djangoproject.com/zh-hans/4.0/ref/models/fields/#django.db.models.FileField


def user_directory_path(instance, filename):
   # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'user_{0}/{1}'.format(instance.user.id, filename)


class Pdf(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    author = models.CharField(max_length=100, null=True)
    year = models.CharField(max_length=10, null=True)
    pdf_title = models.CharField(max_length=128, null=False)
    periodical = models.CharField(max_length=100, null=True)
    last_modify = models.CharField(max_length=50, null=True)
    article_type = models.CharField(max_length=100, null=True)
    score = models.IntegerField(max_length=1, default=5)
    #  path = models.FileField(upload_to="uploads/")  # 保存在项目pdfs/uploads文件夹下
    pdf = models.FileField(upload_to=user_directory_path)


# 表示从模型中创建一个表单
class PdfForm(ModelForm):
    class Meta:
        model = Pdf
        fields = '__all__'
