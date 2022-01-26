from rest_framework.views import APIView
import json
from util.result import result
from user.decorators.permission_required import permission_required

class Token(APIView):
   @permission_required(2)
   def post(self, request, *args, **kwords):
       return result(message="token正常")
       

   def get(self, request, *args, **kwords):
      pass