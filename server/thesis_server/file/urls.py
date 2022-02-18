from django.urls import path, re_path
from . import views

urlpatterns = [
    path("", views.FileView.as_view(), name="fileview"),
]