### 安装mysql
https://pymysql.readthedocs.io/en/latest/user/index.html  
`pip3 install pymysql`,在`__init__.py`中添加
```python
import pymysql
pymysql.install_as_MySQLdb()
```

### 创建一个应用

`python manage.py startapp login`  

### 创建数据模型

在models.py中创建模型类，使用`python manage.py makemigrations `，`python manage.py migrate`.将数据库状态与当前的模型集和迁移同步。  
在使用makemigrations后可以使用`python manage.py sqlmigrate xxx 0001`查看数据库创建脚本。  
使用`python manage.py shell`启动 Python 交互式解释器。  


### 安装 djangorestframework
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

### 模型

如果自己在模型中添加了主键`id = models.BigAutoField(primary_key=True)`django不会再自动的添加主键。  

### 配置静态文件地址

在`settings.py`中配置
```python
STATIC_URL = 'static/'
STATIC_ROOT = os.path.abspath("static")
```
再使用`python manage.py collectstatic`会将其他应用下的静态文件复制到`STATIC_ROOT`下。 

### 自定义错误页面

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

### 创建超级用户

`python manage.py createsuperuser --email xxx@xx.com --username`

### csrf

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

### 登录

- 使用https传输
- 使用bcrypt加密保存。
https://github.com/pyca/bcrypt/

### token
- 使用pyjwt生成token
参考
https://blog.csdn.net/weixin_42134789/article/details/105898077