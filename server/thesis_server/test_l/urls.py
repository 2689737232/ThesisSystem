from django.urls import path, re_path
from django.conf.urls.static import static
from . import views
from django.conf import settings
from django.http import HttpResponse


urlpatterns = [
    path('', views.index_view, name='detail'),
    path('upload', views.upload_file_view, name='upload_file'),
    path('cbv-view', views.CBV_View.as_view(), name='cbv_view'),
    path("public-keys", views.PublicKeyView.as_view(), name="publi_keys"),
    path("password", views.BcryptView.as_view(), name="password"),
    path("auth", views.AuthView.as_view(), name="auth"),
    re_path(r'^info/(?P<msg>\S{1,})/$', view=views.show_params_view)
]
