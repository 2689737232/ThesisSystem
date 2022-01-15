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

在models.py中创建模型类，使用`python manage.py migrate`将数据库状态与当前的模型集和迁移同步。  
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
