from django.urls import path
from main import views

urlpatterns = [
    path('', views.index),
    path('contacts/', views.contacts),
    path('payment/', views.create_payment, name='create_payment'),
    path('webhook/', views.handle_webhook, name='handle_webhook')
]
