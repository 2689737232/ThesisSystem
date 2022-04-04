### 创建elasticsearch索引

**需要配置 ik 分词器**
```
# 创建一个对pdf处理的pipline
PUT /_ingest/pipeline/attachment
{
    "description": "Extract attachment information",
    "processors": [
        {
            "attachment": {
                "field": "content",
                "ignore_missing": true
            }
        },
        {
            "remove": {
                "field": "content"
            }
        }
    ]
}
DELETE thesis_system
PUT thesis_system
{
  "settings": {
    "analysis": {
      "normalizer": {
        "my_normalizer": {
          "type": "custom",
          "filter": ["lowercase"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "user_id": {
        "type": "keyword"
      },
      "pdf_id": {
        "type": "keyword"
      },
      "attachment": {
        "properties": {
          "content":{
            "type": "text",
            "analyzer": "ik_smart"
          }
        }
      }
    }
  }
}


POST thesis_system/_doc?pipeline=attachment&pretty 
{
  "user_id": "用户id",
  "pdf_id": "pdf文件id",
  "content": "pdf文件的base64编码"
}

# 查询方法
GET thesis_system/_search
{
  "query": {
    "match": {
      "attachment.content": {
        "query": "项目的学习",
        "analyzer": "ik_smart"
      }
    }
  }
}
```