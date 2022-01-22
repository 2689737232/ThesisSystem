from datetime import datetime, timedelta
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
        }, SECRET_KEY, algorithm="HS256")

        return token
