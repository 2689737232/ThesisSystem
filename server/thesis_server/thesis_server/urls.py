"""thesis_server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from turtle import home
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponse
from util.result import result
from django.template import loader
from .views import page_not_found,not_allowed

from django.urls import include, path
from rest_framework import routers
from test_l import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

urls = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('login/', include('login.urls')),
    path('test/', include('test_l.urls')),
    path('api-test/', include('rest_framework.urls', namespace='rest_framework'))
]

urlpatterns = [
    # path('', include('home.urls')),
    path("api/v1/", include(urls))
] 

handler404 = page_not_found