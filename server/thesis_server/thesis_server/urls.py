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
from xml.dom.minidom import Document
from django.conf import settings  # 官方建议这么引入setting，不要相对引入
from django.contrib import admin
from django.urls import path, include, re_path
from django.template import loader
from .views import page_not_found, not_allowed
from django.urls import include, path
from rest_framework import routers
from test_l import views
from django.conf.urls.static import static


router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)


urls = [
    path('user/', include('user.urls')),
    path('test/', include('test_l.urls')),
    path('api-test/', include('rest_framework.urls', namespace='rest_framework')),
    path("file/", include('file.urls'))
]

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path("api/v1/", include(urls)),
]
# 表示请求到 /pdfs/ 请求到 MEDIA_ROOT
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
handler404 = page_not_found
