"""
将pdf上传到elasticsearch
"""

import base64
from genericpath import isdir
from importlib.resources import path
from operator import index
import os
from pydoc import cli
from elasticsearch import Elasticsearch
from user.model.PdfModel import Pdf as PdfModel

es_host = "http://localhost:9200"
client = Elasticsearch(es_host)
pdf_abs_dir = r"E:\VSProject\v-project\ThesisSystem\server\thesis_server\pdfs"


def test():
    print(get_pdf_nodel_from_search(search_by_keyword("前端")))


def upload_to_elasticsearch(user_id, pdf_id, pdf):
    base64_pdf = base64.b64encode(pdf).decode("ascii")
    data = {
        "user_id": str(user_id),
        "pdf_id": str(pdf_id),
        "content": base64_pdf
    }
    try:
        client.index(index="thesis_system", body=data, pipeline="attachment")
    except Exception as e:
        print(e)

# https://www.jb51.net/article/156935.htm


def search_by_keyword(word):
    result = client.search(index="thesis_system", size=10, body={
        "query": {
            "match": {
                "attachment.content": {
                    "query": word,
                    "analyzer": "ik_smart"
                }
            }
        }
    })
    return result.body['hits']['hits']

# 从elastsearch查询结果中，在mysql中找到对于数据


def get_pdf_nodel_from_search(search_result):
    result = []
    for i in search_result:
        result.append(i['_source']['pdf_id'])
    return PdfModel.objects.filter(pk__in=result)


def delete_all():
    client.delete_by_query(index="thesis_system", body={
        "query": {
            "match_all": {
            }
        }
    })


def recommend():
    result = client.search(index="thesis_system", size=10, body={
        "query": {
            "more_like_this": {
                "fields": ["attachment.title", "attachment.content"],
                "analyzer": "ik_smart",
                "like": ["推荐系统"],
                "min_term_freq": 1,
                "max_query_terms": 12,
            }
        }
    })
    return result
