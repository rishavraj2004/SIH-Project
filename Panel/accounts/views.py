from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages
from .decorators import role_required
from .models import CustomUser
from django.http import HttpResponse

# ------------------------
# Login View
# ------------------------
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Role-based redirection
            if user.role == 'Admin':
                return redirect('admin_dashboard')
            elif user.role == 'Dept_Head':
                return redirect('dept_dashboard')
            elif user.role == 'Scheduler':
                return redirect('scheduler_dashboard')
            else:
                messages.error(request, 'Invalid user role.')
                return redirect('login')
        else:
            messages.error(request, 'Invalid username or password.')
            return redirect('login')
    
    # GET request: render login page
    return render(request, 'login.html')

# ------------------------
# Logout
# ------------------------
@login_required
def custom_logout(request):
    logout(request)
    messages.success(request, 'You have been successfully logged out.')
    return redirect('login')

# ------------------------
# Dashboards
# ------------------------
@login_required
@role_required('Admin')
def admin_dashboard(request):
    context = {
        'user': request.user,
        'role': 'Admin'
    }
    return render(request, 'dashboard_admin.html', context)

@login_required
@role_required('Dept_Head')
def dept_dashboard(request):
    context = {
        'user': request.user,
        'role': 'Department Head',
        'department': request.user.department
    }
    return render(request, 'dashboard_dept.html', context)

@login_required
@role_required('Scheduler')
def scheduler_dashboard(request):
    context = {
        'user': request.user,
        'role': 'Scheduler',
        'department': request.user.department
    }
    return render(request, 'dashboard_scheduler.html', context)

# ------------------------
# React Scheduler Redirect
# ------------------------
@login_required
@role_required('Scheduler')
def react_scheduler(request):
    """
    Redirect Scheduler to live React dev server
    """
    return redirect('http://localhost:5173')

# ------------------------
# Create Test Users (Optional)
# ------------------------
def create_test_users(request):
    try:
        if not CustomUser.objects.filter(username='admin').exists():
            CustomUser.objects.create_user(username='admin', password='admin123', role='Admin')
        if not CustomUser.objects.filter(username='depthead').exists():
            CustomUser.objects.create_user(username='depthead', password='dept123', role='Dept_Head', department='Engineering')
        if not CustomUser.objects.filter(username='scheduler').exists():
            CustomUser.objects.create_user(username='scheduler', password='schedule123', role='Scheduler', department='Marketing')
        return HttpResponse("Test users created successfully!")
    except Exception as e:
        return HttpResponse(f"Error: {str(e)}")
