from django.urls import reverse
from rest_framework import serializers

from .models import Policy
from .tasks import PROCESSING_ERRORS


class PolicySerializer(serializers.ModelSerializer):
    """Serializer for only read operations list or detail view."""

    uploaded_by_name = serializers.SerializerMethodField()
    is_retryable = serializers.SerializerMethodField()
    processing_error = serializers.SerializerMethodField()
    view_url = serializers.SerializerMethodField()

    class Meta:
        model = Policy
        fields = (
            "id",
            "name",
            "department",
            "status",
            "version",
            "description",
            "effective_from",
            "uploaded_on",
            "updated_on",
            "page_count",
            "uploaded_by_name",
            "processing_error",
            "is_retryable",
            "view_url",
        )

        read_only_fields = (
            "uploaded_on",
            "updated_on",
            "status",
            "page_count",
            "processing_error",
        )

    def get_uploaded_by_name(self, obj):
        if obj.uploaded_by:
            return f"{obj.uploaded_by.first_name} {obj.uploaded_by.last_name}"
        return None

    def get_processing_error(self, obj):
        if not obj.processing_error_code:
            # print("processing_error code not present")
            return None
        message, _ = PROCESSING_ERRORS.get(obj.processing_error_code, (None, False))
        return message

    def get_is_retryable(self, obj):
        if not obj.processing_error_code:
            return False
        _, retryable = PROCESSING_ERRORS.get(obj.processing_error_code, (None, False))
        return retryable

    def get_view_url(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(
            reverse("policy-download", args=[obj.id]) + "?mode=view"
        )


class PolicyCreateSerializer(PolicySerializer):
    """Admin-only: create. Inherits all read fields from PolicySerializer,
    adds file (write) and file_hash (read) on top."""

    file = serializers.FileField(write_only=True)
    file_hash = serializers.CharField(read_only=True)

    class Meta(PolicySerializer.Meta):
        fields = PolicySerializer.Meta.fields + ("file", "file_hash")

        read_only_fields = (
            "id",
            "uploaded_on",
            "updated_on",
            "status",
            "page_count",
            "processing_error",
        )


class PolicyEditMetadataSerializer(serializers.ModelSerializer):
    """Admin-only: PATCH/PUT metadata. Excludes file and status fields."""

    class Meta:
        model = Policy
        fields = (
            "id",
            "name",
            "department",
            "version",
            "description",
            "effective_from",
        )
        read_only_fields = ("id",)
