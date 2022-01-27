import jwt
from rest_framework.views import APIView
import json
from util.result import result
from user.decorators.permission_required import permission_required
from user.setting import SECRET_KEY


class Token(APIView):
    def post(self, request, *args, **kwords):
        token = request.META.get('HTTP_AUTHORIZATION')
        try:
            dict = jwt.decode(
                token, SECRET_KEY, algorithms=['HS256']
            )
            return result(message="token正常", data={"username": dict.get('data').get('username')})
        except jwt.ExpiredSignatureError:
            return result(code=401, message="token已经过期")
        except jwt.InvalidTokenError:
            return result(code=401, message="无效的token")
        except Exception as e:
            result(code=401, message=e)
        

    def get(self, request, *args, **kwords):
        pass
