from django.urls import path
from . import views

urlpatterns = [
    path('schedule/', views.schedule_panel, name='schedule_panel'),
    path('admin-panel/', views.admin_panel, name='admin_panel'),
    path('create-timetable/', views.create_timetable, name='create_timetable'),
    path('update-status/<int:id>/<str:status>/', views.update_status, name='update_status'),
    path('logout/', views.logout_view, name='logout'),  # Add this line
    path('clear-schedule-history/', views.clear_schedule_history, name='clear_schedule_history'),
    path('clear-admin-history/', views.clear_admin_history, name='clear_admin_history'),

]
