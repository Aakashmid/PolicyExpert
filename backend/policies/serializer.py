from rest_framework import serializers
from .models import Policy


class PolicySerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Policy
        fields = (
            "name",
            "department",
            "file",
            "status",
            "version",
            "description",
            "effective_from",
            "uploaded_on",
            "updated_on",
            "uploaded_by_name",
        )

        read_only_fields = (
            "uploaded_on",
            "updated_on",
            "status",
        )

    def get_uploaded_by_name(self, obj):
        if obj.uploaded_by:
            return f"{obj.uploaded_by.first_name} {obj.uploaded_by.last_name}"
        return None
