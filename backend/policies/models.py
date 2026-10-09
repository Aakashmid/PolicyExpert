import magic
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models


def validate_file_is_pdf(value):
    file_head = value.read(2048)
    value.seek(0)
    print("print validate file is pdf  ran")
    mime_type = magic.from_buffer(file_head, mime=True)
    if mime_type != "application/pdf":
        raise ValidationError("File content is not a valid PDF.")


def validate_file_size(value):
    max_mb = settings.MAX_FILE_SIZE
    print("print validate file size ran")
    if value.size > max_mb * 1024 * 1024:
        raise ValidationError(f"File size must be under {max_mb} MB")


class Policy(models.Model):
    class Status(models.TextChoices):
        PROCESSING = "processing", "Processing"
        READY = "ready", "Ready"
        FAILED = "failed", "Failed"
        QUEUED = "queued", "Queued"

    name = models.CharField(max_length=100)
    department = models.CharField(max_length=50)
    file = models.FileField(
        upload_to="policies/",
        max_length=100,
        validators=[
            FileExtensionValidator(allowed_extensions=["pdf"]),
            validate_file_size,
            validate_file_is_pdf,
        ],
    )

    version = models.CharField(max_length=20, default="v1.0")
    file_hash = models.CharField(max_length=64, unique=True)
    # models.py
    page_count = models.PositiveIntegerField(null=True, blank=True)
    description = models.CharField(max_length=100)
    effective_from = models.DateTimeField()
    uploaded_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    uploaded_by = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.QUEUED,
    )

    processing_error_code = models.CharField(max_length=50, null=True, blank=True)
