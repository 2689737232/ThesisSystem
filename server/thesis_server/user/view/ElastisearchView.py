"""
   对elastiseach操作
"""

from rest_framework.views import APIView
from user.models import menu_code_dict, \
    function_code_dict, menu_function_dict,\
    Function as FunctionModel, Menu
from util.result import result
import json
from user.decorators.permission_required import permission_required
from user.elasticsearch import test
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(decorator=[csrf_exempt], name="dispatch")
class ElasticSearchView(APIView):
    @permission_required(1)
    def post(self, request, *args, **kwords):
        test()
        return result(message="测试elasticsearch")

    @permission_required(1)
    def get(self, request, *args, **kwords):
        test()
        return result(message="测试elasticsearch")
