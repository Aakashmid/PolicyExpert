from django.db import models


class Policy(models.Model):
    STATUS_CHOICES = [
        ("processing", "Processing"),
        ("ready", "Ready"),
        ("failed", "Failed"),
    ]

    name = models.CharField(max_length=100)
    department = models.CharField(max_length=50)
    file = models.FileField(upload_to="policies/", max_length=100)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES,default="Processing")
    version = models.CharField(max_length=20, default="v1.0")
    description = models.CharField(max_length=100)
    effective_from = models.DateTimeField()
    uploaded_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    uploaded_by = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True
    )
