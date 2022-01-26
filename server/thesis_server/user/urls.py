from django.urls import path, re_path
from . import views
from .view.Menu import Menu
from .view.Function import Function

urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    path("auth", views.AuthView.as_view(), name="auth"),
    path("menu", Menu.as_view(), name="menu"),
    path("function", Function.as_view(), name="function"),
]
