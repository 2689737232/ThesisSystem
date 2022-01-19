from django.urls import path, re_path
from django.conf.urls.static import static
from . import views
from django.conf import settings
from django.http import HttpResponse


urlpatterns = [
    path('', views.index, name='detail'),
    path('upload', views.upload_file, name='upload_file'),
    re_path(r'^info/(?P<msg>\S{1,})/$', view=views.show_params)
]
