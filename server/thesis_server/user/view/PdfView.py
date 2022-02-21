from datetime import date
from email import errors

from pymysql import Date
from .Token import get_token
from util.result import result, MyCode
from rest_framework.views import APIView
from user.decorators.permission_required import permission_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from user.model.PdfModel import Pdf as PdfModel
from user.models import User


@method_decorator(decorator=[csrf_exempt], name="dispatch")
class Pdf(APIView):

    @permission_required(2)
    def post(self, request, *args, **kwords):
        user_id = request.POST['user']
        author = request.POST['author']
        year = request.POST['year']
        pdf_title = request.POST['pdf_title']
        periodical = request.POST['periodical']
        last_modify = request.POST['last_modify']
        article_type = request.POST['article_type']

        pdf = request.FILES['pdf']
        if user_id is not None:
            user = User.objects.filter(no=user_id).first()
            try:
                pdf_model = PdfModel.objects.create(
                    user=user,
                    author=author,
                    year=year,
                    pdf_title=pdf_title,
                    periodical=periodical,
                    last_modify=last_modify,
                    article_type=article_type,
                    pdf=pdf
                )
            except errors as e:
                return result(message="上传失败", code=MyCode.servererror)
        return result(message="上传成功", data=pdf_title)

    @permission_required(3)
    def get(self, request, *args, **kwords):
        # 请求文章类型  1为所有文章  2为我的文章
        articles_type = request.query_params.get("articlesType", "-1")
        page = int(request.query_params.get("page", 0))   # 第几页,默认第一页
        size = int(request.query_params.get("size", 10))   # 一页几条数据，默认10条

        if articles_type == "-1":
            return result(message="请求参数错误", code=MyCode.paramserror)
        else:
            start = page * size
            end = (page+1) * size
            # 1我的文献 2为所有  3为我的收藏
            if articles_type == "1":
                user_no = get_token(request).get("no", "")
                pdf_objs = PdfModel.objects.filter(user=User.objects.get(no=user_no))[start:end]
                data = gen_list(pdf_objs)
                return result(message="获取列表", data=data)
            elif articles_type == "2":
                pdf_objs = PdfModel.objects.all()[start:end]
                data = gen_list(pdf_objs)
                return result(message="获取列表", data=data)
            else:
                pass


# 获取页面总数
@method_decorator(decorator=[csrf_exempt], name="dispatch")
class PdfPages(APIView):
    @permission_required(2)
    def get(self, request, *args, **kwords):
        # 请求文章类型  1为所有文章  2为我的文章 3为我的收藏
        articles_type = request.query_params.get("articlesType", "-1")
        
        if articles_type == "-1":
            return result(message="请求参数错误", code=MyCode.paramserror)
        elif articles_type == "1":
            user_no = get_token(request).get("no", "")
            pdf_count = PdfModel.objects.filter(user=User.objects.get(no=user_no)).count()
           
            print("获得页数", pdf_count)
            data = {
                "count": pdf_count
            }
            return result(message="我的文献总数", data=data)
        elif articles_type == "2":
            pdf_count = PdfModel.objects.count()
            data = {
                "count": pdf_count
            }
            return result(message="所有文献总数", data=data)
        else:
            return result("ok")

def gen_list(pdf_objs):
    pdfs = []
    for pdf in pdf_objs:
        pdfs.append(pdf.dict_props)
    data = {
        "articles": pdfs
    }
    return data
