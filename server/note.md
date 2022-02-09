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


### 1.3 文档的删除和操作

- 添加文档  
可以使用put添加文档`put xxx/_doc/1` 1为id值.  
如果不指定id需要使用`post`请求
- 获取文档
`get xxx/_doc/xxxx`  添加id值  
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
