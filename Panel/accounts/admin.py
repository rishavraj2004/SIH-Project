from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'role', 'department', 'is_staff']
    list_filter = ['role', 'department', 'is_staff', 'is_active']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Role & Department', {'fields': ('role', 'department')}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role & Department', {'fields': ('role', 'department')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)