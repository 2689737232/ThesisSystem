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
    user = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name="users_upload", related_query_name="user_collect"
    )  # 上传用户
    author = models.CharField(max_length=100, null=True)
    year = models.CharField(max_length=10, null=True)
    pdf_title = models.CharField(max_length=128, null=False)
    periodical = models.CharField(max_length=100, null=True)
    last_modify = models.CharField(max_length=50, null=True)
    article_type = models.CharField(max_length=100, null=True)
    score = models.IntegerField(default=5)
    #  path = models.FileField(upload_to="uploads/")  # 保存在项目pdfs/uploads文件夹下
    pdf = models.FileField(upload_to=user_directory_path)
    user_collect = models.ManyToManyField(User, through="UserPdfs")

    @property
    def dict_props(self):
        upload_user = self.user
        return {
            "id": self.id,
            "userNo": upload_user.no,
            "author": self.author,
            "year": self.year,
            "title": self.pdf_title,
            "periodical": self.periodical,
            "lastModify": self.last_modify,
            "articleType": self.article_type,
            "score": self.score,
            "pdfPath": self.pdf.name
        }


class UserPdfs(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name="users_collect",
                             related_query_name="user_collect")
    pdf = models.ForeignKey(Pdf, on_delete=models.CASCADE)


# 表示从模型中创建一个表单
class PdfForm(ModelForm):
    class Meta:
        model = Pdf
        fields = '__all__'
