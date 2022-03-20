## 1.elasticsearch

### 1.1安装
核心功能是对数据进行检索，通过索引将文档写入es。

- 集群安装，解压复制`master`、`slave1`、`slave2`。配置`config/elasticsearch.yml`
```yml
主节点
node.name: master
node.master: true
network.host: 127.0.0.1

从节点
cluster.name: es-slave1
node.name: slave1
network.host: 127.0.0.1
http.port: 9201
discovery.zen.ping.unicast.hosts: ["127.0.0.1"]
```

- `ik分词器`对中文进行分词，`elasticsearch-analysis-ik`  在git仓库中下载下，解压到`elasticsearch`中的`pulgins/ik`文件夹下。自定义扩展词库，如要把`我是lala`看成是一个词，可以使用自定义扩展词库。在`ik`文件夹下`config`文件夹下创建一个`ext.dic`中添加`我是lala`。在`config/IKAnalysis.cfg.xml`中配置扩展词典的位置。


### 1.2索引管理
相当于是一个数据库。需要一个master节点、两个slave节点。  
#### 新建索引  
[![HQRacQ.png](https://s4.ax1x.com/2022/02/07/HQRacQ.png)](https://imgtu.com/i/HQRacQ)

- 使用浏览器插件创建
- 使用网络请求创建,或使用`kibana`中的`console`
启动`kibana`访问`localhost:5601`,使用`console`，执行`put book`创建一个book索引。  

**注意**1.索引名不能为大写字母、2.名称不能重复。

#### 修改索引

- 删除索引
`delete /index_name`

- 修改索引的副本数： `kibana`中
```json
PUT book/_settings
{
  "number_of_replicas": 3
}
```
同理可以更新分片数。

- 写入文档
```json
put book/_doc/1   // 表示像_doc中写入id为1的数据
{
    "title":"java从入门到精通"
}
```
- 关闭写权限
```json
put book/_settings   // 表示像_doc中写入id为1的数据
{
   "blocks.write": true
}
```

- 查看索引信息  
`get book,test/_settings` 查看多个索引的信息  
`get _all/_settings` 查看所有  

- 打开\关闭索引  
`post book/_close`    
`post book/_open` 


### 1.3 文档管理

- 添加文档  
可以使用put添加文档`put xxx/_doc/1` 1为id值.  
如果不指定id需要使用`post`请求

- 获取文档
`get xxx/_doc/xxxx`  添加id值  

- 文档的更新
```json
POST blog/_update/1
{
  "script":{
    "lang": "painless",
    "source": "ctx._source.title=params.title",
    "params": {
      "title":"js"
    }
  }
}

POST blog/_update_by_query
{
  "script": {
    "source": "ctx._source.title=\"javascript\"",
    "lang": "painless"
  },
  "query": {
    "term": {
      "title": "js"
    }
  }
}
```

- 文档的删除
```json
delete xxx/_doc/id值
// 删除一个索引下的所有文档
post xxx/_delete_by_query
{
  "query":{
    "match_all":{
      "term": {
        "title: "xxx"
      }
    }
  }
}
```

#### 1.3.2根据id删除
```json
POST book/_delete_by_query
{
  "query":{
    "term":{
      "_id":"_Agq1H4BIrOECWjBvxUb"
    }
  }
}
```

#### 1.3.3批量操作
创建一个json文件，最后结尾需要空出一行
```json
{"index":{"_index":"user", "_id":"666"}}
{"name": "lala"}
{"update": {"_index":"user", "_id": "666"}}
{"doc": {"name": "wawa"}}

```
发送`post`请求到`http://localhost:9200/user/_bulk`,请求头类型为`content-type:application/json`,添加json文件。  

- 批量查询 
```json
// 批量查询id为1和asgasg的数据
GET blog/_mget
{
  "ids":["1", "asgasg"]
}
```

### 1.4 文档更新
```json
// 会覆盖源文档
PUT xxx/_doc/id值
{
  "属性":"值"
}
```
如果只是想更新文档字段,可以通过脚本实现
```json
POST xxx/_update/id值
{
  "script":{
    "lang": "painless", // 内置脚本语言
    "source": "ctx._source.title=params.title",     // ctx上下文
    "params":{
      "title": "更新值"
    }
  }
}
```


### 1.5 对pdf进行搜索

https://juejin.cn/post/6844903848323072007
https://www.cnblogs.com/strongchenyu/p/13777596.html

对各个节点安装`ingest-attachment`,在每个节点的`bin`目录下执行`elasticsearch-plugin install ingest-attachment`。
创建
```json
PUT _ingest/pipeline/pdfattachment 
{
  "description": "Extract attachment information encoded in Base64 with UTF-8 charset",
  "processors": [
    {
      "attachment": {"field": "file"}    
    }  
  ]
}
```

将pdf文件进行base64编码后，上传到elasticsearch中。
```json
POST pdf-test1/_doc?pipeline=pdfattachment&pretty 
{
  "file": "asgasgasg(pdf的base64编码)"
}
```

查看
```json
GET pdf-test1/_search
```

移除查找结果中的`file字段`,再次上传后就没有`file`属性。
```
PUT _ingest/pipeline/pdfattachment
{  
  "description": 
  "Extract attachment information encoded in Base64 with UTF-8 charset", 
  "processors": [
    {
      "attachment": {
        "field": "file"      
      }    
    },    
    {
      "remove": {
        "field": "file"
      }   
    }  
  ]
}
```

使用分词器查找
```json
GET pdf-test1/_search
{
  "query": {
    "match": {
      "attachment.content": {
        "query": "前端",
        "analyzer": "ik_smart"
      }
    }
  }
}
```

### 1.6 索引

#### 1.6.1 主要类型

**字符串类型**  
- text,如果是可以被全文检索的可以设置为text，如博客内容、新闻，一大段文字。使用text后，内容会被分词器分为一个个的词项。也别称为analyzed字段
- keyword，适用于结构化的字段。比如有邮件地址、手机号、标签等内容，可以用过滤、排序、聚合。也被称为not-analyzed字段。

**数字类型**  
- long, [-2^63,2^63-1]
- integer, [-2^31,2^31-1]
- short， [-2^15,2^15-1]
- byte，[-2^7,2^7-1]
- double，64位双精度IEE754双精度
- float，32位双精度IEE754双精度
- half_float，16位双精度IEE754双精度
- scaled_float 缩放类型的浮点类型

在选择的时候尽量选范围小的类型。

**日期类型**  
在json中没有日期类型。在es中日期类型，形式比较多样。
- 2020-11-11，
- 时间戳
```json
put xxx
{
  "mappings":{
    "properties":{
      "date":{
        "type": "date"
      }
    }
  }
}
```
**二进制类型**  
接受的是base64编码的字符串，默认不存储，不被搜索。

**布尔类型**  
可以接受`true`、`"true"`、`false`、`"false"`

**范围类型**  
- integer_range
- float_range
- long_range
- double_range
- date_range
- ip_range
定义时，可以指定范围。
```json
put product
{
  "mappings":{
    "properties":{
      "date": {
        "type": "date"
      },
      "price":{
        "type": "float_range"
      }
    }
  }
}

// 插入文档时
gte表示大于等于,gt表示大于。同理lte表示小于等于
PUT product
{
  "date": "2020-02-02",
  "price": {
    "gte": 10,
    "lte": 100
  }
}
```
mapping，用来表示一个文档以及文档所包含的字段该如何被存储索引。
#### 1.6.2 动态映射
自动创建出来的映射，es自动分析文档中的字段进行分析字段的存储类型，。
如果新增字段，mapping内容会默认更新。如果说要添加新字段时需要提醒，可以通过创建时"mappings"制定
```json
# 创建一个索引
PUT /index1
{
  "mappings": {
    "dynamic": "strict",  // 可以制定true false strict
    "properties": {
      "title":{
        "type": "text"
      },
      "age":{
        "type": "double"
      }
    }
  }
}
// 在这种情况下添加了新字段hobby会报错
POST index1/_doc
{
  "title":"lala",
  "age": "23",
  "hobby": "coding"
}
```
**复合类型**
es中没有数组类型，默认情况下，任何字段都可以有一个或多个值。添加数组时，数组中第一个元素的值决定了整个数组的类型。

**对象类型**
由于json本身具有层级关系，所以文档包含对象。
```json
PUT product/_doc/1
{
  "date": "2020-01-01T11:11:11Z",
  "ext_info":{
    "addr": "chengdu"
  }
}
```
**嵌套类型**
嵌套类型是兑现类型的特例，
如果对象是
```json
{
  "user": {
    "first": "Zhou",
    "last": "Hong"
  },
  "user": {
    "first": "Li",
    "last": "Si"
  }
}
```
在es中会被转化为
```json
{
  "user.frist": ["Zhoue", "Li"],
  "user.last": ["Hong", "Si"]
}
```
#### 1.6.3 静态映射

**映射参数**

- analyzer  
在定义分词器的时候,可以使用分词器。
```json
PUT blog
PUT blog/_doc/1
{
  "title": "定义分词器"
}
如果没有使用分词器，在查看词条向量的时候。
GET blog/_termvectors/1
{
  "filed"
}
```



## 2.django

###  2.1安装mysql
https://pymysql.readthedocs.io/en/latest/user/index.html  
`pip3 install pymysql`,在`__init__.py`中添加
```python
import pymysql
pymysql.install_as_MySQLdb()
```

### 2.2创建一个应用

`python manage.py startapp login`  

### 2.3创建数据模型

在models.py中创建模型类，使用`python manage.py makemigrations `，`python manage.py migrate`.将数据库状态与当前的模型集和迁移同步。  
在使用makemigrations后可以使用`python manage.py sqlmigrate xxx 0001`查看数据库创建脚本。  
使用`python manage.py shell`启动 Python 交互式解释器。  


### 2.4安装 djangorestframework
`pip install djangorestframework`  
`pip install markdown`  
`pip install django-filter`

添加`rest_framework`到`INSTALLED_APPS`中去。  
settings.py:
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'login.apps.LoginConfig'
    'rest_framework'
]
```

### 2.5模型

如果自己在模型中添加了主键`id = models.BigAutoField(primary_key=True)`django不会再自动的添加主键。  
模型出错`migrate`错误，实在不行删除目录`migrations`下的除`__init__.py`的文件。再重新`makemigrations`、`migrate`

### 2.6配置静态文件地址

在`settings.py`中配置
```python
STATIC_URL = 'static/'
STATIC_ROOT = os.path.abspath("static")
```
再使用`python manage.py collectstatic`会将其他应用下的静态文件复制到`STATIC_ROOT`下。 

### 2.7自定义错误页面

1. 设置`settings.py`中`DEBUG`为`False`
1. 设置`settings.py`中`ALLOWED_HOSTS`
3. 在url配置页面，设置如
```python
from .views import page_not_found

urlpatterns = [
    path('', include('home.urls')),
    path('admin/', admin.site.urls),
    path('login/', include('login.urls')),
    path('test/', include('test_l.urls')),
] 
handler404 = page_not_found
```
views文件
```python
def page_not_found(request, exception):
    print(request, "----------")
    return HttpResponseNotFound(content="页面没有找到哦")
```

### 2.8创建超级用户

`python manage.py createsuperuser --email xxx@xx.com --username`

### 2.9csrf

https://docs.djangoproject.com/zh-hans/4.0/ref/csrf/

解决1： 在请求中添加`headers: {'X-CSRFToken': csrftoken},`  
解决2（针对函数视图）： 使用装饰器`from django.views.decorators.csrf import csrf_exempt`
```python
@require_POST
@csrf_exempt
def upload_file_view(request):
    return result(message="上次成功")
```
解决3（针对类试图）：   `from django.utils.decorators import method_decorator` 和 `csrf_exempt`组合
```python
from django.views import View
@method_decorator(csrf_exempt, name='dispatch')
class CBV_View(View):
    def get(self, request, *args, **kwords):
        return result(message="使用cbv中的get请求")
    def post(self, request, *args, **kwords):
        return result(message="使用cbv中的post请求")
```

### 2.10登录

- 使用https传输
- 使用bcrypt加密保存。
https://github.com/pyca/bcrypt/

### 2.11token
- 使用pyjwt生成token
参考
https://blog.csdn.net/weixin_42134789/article/details/105898077



### 2.12文件上传

- 配置上传文件的默认路径，在`settings.py`中配置
```python
# 上传文件的保存路径 
MEDIA_ROOT = BASE_DIR.joinpath("pdfs")
# 配置下载文件时的路径
MEDIA_URL = "/pdfs/"  # 表示以这个请求开始的是加载pdfs资源
```
- 然后在总路由中配置
```python
# 表示以/pdfs/的请求，路由到到 MEDIA_ROOT这个位置中
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

**上传文件**
- 前端需要设置请求头的`'Content-type': "multipart/form-data"` 
- django中post请求里，可以通过`request.POST['键']`和`request.FILES['键'] ` 取到请求的数据和文件
- 在定义模型时，对于文件类型可以使用`Model.FileFiled(upload_to="xxx")`指定保存



## 3 部署

使用docker部署项目

参考：  
- https://segmentfault.com/a/1190000038559170

## 参考

- https://zhuanlan.zhihu.com/p/98295397
- https://www.bilibili.com/video/BV1ft4y1e7tq