from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Dept_Head', 'Department Head'),
        ('Scheduler', 'Scheduler'),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='Scheduler'
    )
    
    department = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Required for Dept_Head and Scheduler roles"
    )
    
    def __str__(self):
        return f"{self.username} ({self.role})"
    
    def save(self, *args, **kwargs):
        # Admin doesn't need a department
        if self.role == 'Admin':
            self.department = None
        super().save(*args, **kwargs)