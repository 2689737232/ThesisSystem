from msilib.schema import Error
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
import jwt
from django.views import View
from user.setting import SECRET_KEY
from util.result import result, MyCode


# level表示权限级别，管理员验证级别、教师验证级别、学生验证级别
def permission_required(level):
    def decorator(func):
        def _wrapped_view(self, request, *args, **kwargs):
            print(self, request)
            # 判断请求信息中的token
            # 添加到django.views中方法的装饰器
            if isinstance(self, View):
                token = request.META.get('HTTP_AUTHORIZATION')
                try:
                    dict = jwt.decode(
                        token, SECRET_KEY, algorithms=['HS256']
                    )
                    role = dict.get('data').get('role')
                    if role > level:
                        return result(code=401, message="禁止访问")
                    else:
                        return func(self, request, *args, **kwargs)
                except jwt.ExpiredSignatureError:
                    return result(code=401, message="token已经过期")
                except jwt.InvalidTokenError:
                    return result(code=401, message="无效的token")
                except Exception as e:
                    result(code=401, message=e)
        return _wrapped_view
    return decorator