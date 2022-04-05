from atexit import unregister
from cmath import e
import code
from email import errors
from http.cookies import CookieError
import imp
from msilib.schema import Error
from user.elasticsearch import upload_to_elasticsearch

from .Token import get_token
from util.result import result, MyCode
from rest_framework.views import APIView
from user.decorators.permission_required import permission_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from user.model.PdfModel import Pdf as PdfModel
from user.models import User
from user.model.PdfModel import UserCollectPdfs, UserHistory
from django.core.files.uploadedfile import InMemoryUploadedFile
from user.elasticsearch import search_by_keyword,get_pdf_nodel_from_search

# 上传pdf，获取pdf
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

        pdf: InMemoryUploadedFile = request.FILES['pdf']

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

                upload_to_elasticsearch(
                    user_id=pdf_model.user_id,
                    pdf_id=pdf_model.id,
                    pdf=pdf.file.getvalue()
                )
            except Error as e:
                return result(message="上传失败", code=MyCode.servererror)
        return result(message="上传成功", data=pdf_title)

    @permission_required(3)
    def get(self, request, *args, **kwords):
        # 请求文章类型  1我的文献 2为所有  3为我的收藏 4为搜索 5为推荐
        articles_type = request.query_params.get("articlesType", "-1")
        page = int(request.query_params.get("page", 0))   # 第几页,默认第一页
        size = int(request.query_params.get("size", 10))   # 一页几条数据，默认10条

        if articles_type == "-1":
            return result(message="请求参数错误", code=MyCode.paramserror)

        start = (page-1) * size
        end = page * size

        if articles_type == "1":
            user_no = get_token(request).get("no", "")
            pdf_objs = PdfModel.objects.filter(
                user=User.objects.get(no=user_no))[start:end]
            data = gen_list(pdf_objs)
            return result(message="获取列表", data=data)
        elif articles_type == "2":
            pdf_objs = PdfModel.objects.all()[start:end]
            data = gen_list(pdf_objs)
            return result(message="获取列表", data=data)
        elif articles_type == "3":
            # 暂时不考虑添加收藏功能
            return result(code=MyCode.paramserror, message="暂不支持获取收藏列表")
        elif articles_type == "4":
            return result(code=200, message="ok")
        elif articles_type == "5":
            return result(code=200, message="ok")
        else:
            return result(code=MyCode.paramserror, message="请求参数【articles_type】类型错误")


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
            pdf_count = PdfModel.objects.filter(
                user=User.objects.get(no=user_no)).count()

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


# 收藏页面
@method_decorator(decorator=[csrf_exempt], name="dispatch")
class PdfCollections(APIView):
    @permission_required(2)
    def get(self, request, *args, **kwords):
        user_no = get_token(request).get("no", "")
        if user_no is None:
            return result(message="参数no为空", code=MyCode.paramserror)
        else:
            user_pdfs = PdfModel.objects.filter(user_collect__no=user_no)
            return result(message="用户收藏信息", data=gen_list(user_pdfs))

    @permission_required(2)
    def post(self, request, *args, **kwords):
        user_no = get_token(request).get("no", "")
        pdf_id = request.POST.get("pdfId", "")
        if pdf_id is None:
            return result(message="参数pdfId不能为空", code=MyCode.paramserror)
        else:
            # 判断如果数据库中有收藏需要取消收藏、否则添加
            db_user_pdf = UserCollectPdfs.objects.filter(
                user__no=user_no, pdf__id=pdf_id).first()
            if db_user_pdf is None:
                UserCollectPdfs(
                    user=User.objects.filter(no=user_no).first(),
                    pdf=PdfModel.objects.filter(id=pdf_id).first()
                ).save()
                return result(message="添加收藏成功")
            else:
                db_user_pdf.delete()
                return result(message="取消收藏成功")


def gen_list(pdf_objs):
    pdfs = []
    for pdf in pdf_objs:
        pdfs.append(pdf.dict_props)
    data = {
        "articles": pdfs
    }
    return data


# 浏览历史
@method_decorator(decorator=[csrf_exempt], name="dispatch")
class PdfHistory(APIView):
    def get(self, request, *args, **kwords):
        user_no = get_token(request).get("no", "")
        pdf_list = PdfModel.objects.filter(
            user_history=User.objects.get(no=user_no)
        )
        return result(message="用户浏览信息", data=gen_list(pdf_list))

    def post(self, request, *args, **kwords):
        pdf_id = request.POST.get("pdfId", "")
        user_no = get_token(request).get("no", "")
        if pdf_id == "":
            return result(message="参数pdfId不能为空", code=MyCode.paramserror)
        else:
            # 判断是否有该记录的浏览历史
            db_user_pdf = UserHistory.objects.filter(
                user_id=user_no, pdf_id=pdf_id).first()
            if db_user_pdf is None:
                UserHistory(
                    user=User.objects.filter(no=user_no).first(),
                    pdf=PdfModel.objects.filter(id=pdf_id).first()
                ).save()
                return result(message="添加浏览记录成功,pdf: " + pdf_id)
            else:
                return result(message="已浏览该文章")



# 搜索文章
@method_decorator(decorator=[csrf_exempt], name="dispatch")
class Search(APIView):
    def get(self, request, *args, **kwords):
        key_words = request.query_params.get("keyWords", "")
        if key_words == "":
            return result(code=MyCode.paramserror, message="搜索关键字不能为空")

        pdfs = get_pdf_nodel_from_search(search_by_keyword(key_words))
        pdfs = gen_list(pdfs)
        return result(code=200, message="ok", data=pdfs)

    def post(self, request, *args, **kwords):
        pass
