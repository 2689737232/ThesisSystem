from msilib.schema import Error
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
import jwt
from django.views import View
from user.setting import SECRET_KEY
from util.result import result, MyCode


def permission_required(msg):
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
                    if role != 1:
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


def auth_permission_required(perm):
    def decorator(view_func):
        def _wrapped_view(request, *args, **kwargs):
            # 格式化权限
            perms = (perm,) if isinstance(perm, str) else perm

            if request.user.is_authenticated:
                # 正常登录用户判断是否有权限
                if not request.user.has_perms(perms):
                    raise PermissionDenied
            else:
                try:
                  #  获取token
                    auth = request.META.get('HTTP_AUTHORIZATION').split()
                except AttributeError:
                    return JsonResponse({"code": 401, "message": "No authenticate header"})

                # 用户通过API获取数据验证流程
                if auth[0].lower() == 'token':
                    try:
                        dict = jwt.decode(
                            auth[1], settings.SECRET_KEY, algorithms=['HS256'])
                        username = dict.get('data').get('username')
                    except jwt.ExpiredSignatureError:
                        return JsonResponse({"status_code": 401, "message": "Token expired"})
                    except jwt.InvalidTokenError:
                        return JsonResponse({"status_code": 401, "message": "Invalid token"})
                    except Exception as e:
                        return JsonResponse({"status_code": 401, "message": "Can not get user object"})

                    try:
                        user = UserModel.objects.get(username=username)
                    except UserModel.DoesNotExist:
                        return JsonResponse({"status_code": 401, "message": "User Does not exist"})

                    if not user.is_active:
                        return JsonResponse({"status_code": 401, "message": "User inactive or deleted"})

                    # Token登录的用户判断是否有权限
                    if not user.has_perms(perms):
                        return JsonResponse({"status_code": 403, "message": "PermissionDenied"})
                else:
                    return JsonResponse({"status_code": 401, "message": "Not support auth type"})

            return view_func(request, *args, **kwargs)

        return _wrapped_view

    return decorator
