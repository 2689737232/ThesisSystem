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
es_host = "http://localhost:9200"
client = Elasticsearch(es_host)
pdf_abs_dir = r"E:\VSProject\v-project\ThesisSystem\server\thesis_server\pdfs"

def test():
    print(search_by_keyword("就业"))
    
        

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
    return result 


def delete_all():
    client.delete_by_query(index="thesis_system")