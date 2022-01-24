from django.urls import path, re_path
from . import views
from .view.Menu import Menu

urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    path("auth", views.AuthView.as_view(), name="auth"),
    path("menu", Menu.as_view(), name="menu")
]
