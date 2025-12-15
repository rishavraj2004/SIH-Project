from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('logout/', views.custom_logout, name='logout'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('dept-dashboard/', views.dept_dashboard, name='dept_dashboard'),
    path('scheduler-dashboard/', views.scheduler_dashboard, name='scheduler_dashboard'),
    
    # React scheduler integration
    path('scheduler/', views.react_scheduler, name='react_scheduler'),
]
