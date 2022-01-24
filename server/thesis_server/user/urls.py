from django.urls import path, re_path
from . import views
from .views.Menu import Menu

urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    path("auth", views.AuthView.as_view(), name="auth"),
    path("ment", Menu.as_view(), name="menu")
]
