from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from .models import Timetable
from django.contrib.auth.models import User
from django.http import HttpResponseForbidden

# Login view
def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            if user.username.lower() == 'admin':
                return redirect('admin_panel')
            else:
                return redirect('schedule_panel')
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})
    return render(request, 'login.html')

# Logout
def logout_view(request):
    logout(request)
    return redirect('login')

# Check functions
def is_admin(user):
    return user.username.lower() == 'admin'

def is_schedule(user):
    return user.username.lower() == 'schedule'

# Schedule panel
@login_required
@user_passes_test(is_schedule)
def schedule_panel(request):
    timetables = Timetable.objects.filter(created_by=request.user).order_by('-created_at')
    return render(request, 'schedule.html', {'timetables': timetables})

# Admin panel
@login_required
@user_passes_test(is_admin)
def admin_panel(request):
    timetables = Timetable.objects.all().order_by('-created_at')
    return render(request, 'admin_panel.html', {'timetables': timetables})

# Create timetable (with external redirect and Pending status)
@login_required
@user_passes_test(is_schedule)
def create_timetable(request):
    if request.method == 'POST':
        title = request.POST.get('title', 'Sample Timetable')
        content = request.POST.get('content', 'Timetable content here...')
        
        # Save as Pending in database
        Timetable.objects.create(title=title, content=content, created_by=request.user, status='Pending')
        
        # Redirect to external generator
        return redirect('http://localhost:5173/')
    
    return render(request, 'create_timetable.html')

# Update status (Admin actions: Approve/Reject/Review)
@login_required
@user_passes_test(is_admin)
def update_status(request, id, status):
    if request.method != 'POST':
        return HttpResponseForbidden("Invalid request")
    timetable = get_object_or_404(Timetable, id=id)
    timetable.status = status
    timetable.save()
    return redirect('admin_panel')

# Clear history for Schedule (only their timetables)
@login_required
@user_passes_test(is_schedule)
def clear_schedule_history(request):
    if request.method == 'POST':
        Timetable.objects.filter(created_by=request.user).delete()
    return redirect('schedule_panel')

# Clear history for Admin (all timetables)
@login_required
@user_passes_test(is_admin)
def clear_admin_history(request):
    if request.method == 'POST':
        Timetable.objects.all().delete()
    return redirect('admin_panel')

