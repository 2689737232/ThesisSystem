from django.urls import path
from . import views

urlpatterns = [
    path('<str:id>/', views.index, name='detail'),
]