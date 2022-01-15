from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('sign-up', views.sign_up, name='sign_up'),
    path('sign-up/<int:sign_up_id>', views.sign_up, name='sign_up_id'),
]