"""
将pdf上传到elasticsearch
"""

from operator import index
from pydoc import cli
from elasticsearch import Elasticsearch


def test():
    es_host = "http://localhost:9200"
    client = Elasticsearch(es_host)
    result = client.search(index="thesis_system", size=10, body={
        "query": {
            "match": {
                "attachment.content": {
                    "query": "前端开发",
                    "analyzer": "ik_smart"
                }
            }
        }
    })
    print(result.body)
