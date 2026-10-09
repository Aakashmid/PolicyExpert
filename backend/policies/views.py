import hashlib
import os

import fitz
from core.permissions import IsAdmin, IsEmployee
from django.db import IntegrityError, transaction
from django.http import FileResponse
from rest_framework import generics, serializers, status
from rest_framework.exceptions import APIException
from rest_framework.generics import get_object_or_404
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Policy
from .serializer import (
    PolicyCreateSerializer,
    PolicyEditMetadataSerializer,
    PolicySerializer,
)
from .tasks import PROCESSING_ERRORS, process_policy

# Create your views here.
# to-do  : create retry processing functionality


class PolicyCreateView(generics.CreateAPIView):
    """
    create a new policy.
    """

    queryset = Policy.objects.all()
    serializer_class = PolicyCreateSerializer
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        """Set upload metadata and ingest a newly created document."""
        uploaded_file = serializer.validated_data["file"]

        # Calculate the page count from the uploaded PDF.
        with fitz.open(stream=uploaded_file.read(), filetype="pdf") as pdf:
            page_count = pdf.page_count
        uploaded_file.seek(0)

        # Compute SHA-256 hash
        sha256 = hashlib.sha256()
        for chunk in uploaded_file.chunks():
            sha256.update(chunk)
        file_hash = sha256.hexdigest()
        uploaded_file.seek(0)

        # Fast-path duplicate check — friendly error in the common case
        existing = Policy.objects.filter(file_hash=file_hash).first()
        if existing:
            uploader = (
                existing.uploaded_by.email if existing.uploaded_by else "another user"
            )
            raise serializers.ValidationError(
                {"detail": f"This policy has already been uploaded by {uploader}."}
            )

        # Authoritative check: the DB's unique constraint on file_hash
        # catches the race where two identical uploads land at the same time.
        try:
            with transaction.atomic():
                policy = serializer.save(
                    uploaded_by=self.request.user,
                    file_hash=file_hash,
                    page_count=page_count,
                )
        except IntegrityError:
            raise serializers.ValidationError(
                {"detail": "This policy has already been uploaded."}
            )

        policy = serializer.save(uploaded_by=self.request.user, file_hash=file_hash)

        try:
            process_policy.delay(policy.id)
        except Exception as e:
            policy.status = policy.Status.FAILED
            policy.processing_error_code = "QUEUE_FAILED"
            policy.save(update_fields=["status", "processing_error_code"])


class PolicyListView(generics.ListAPIView):
    """
    View to list all policies.
    """

    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    permission_classes = [IsAuthenticated]


# retry policy processing
class RetryPolicyProcessView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, policy_id):
        policy = get_object_or_404(Policy, pk=policy_id)

        if policy.status != Policy.Status.FAILED:
            raise serializers.ValidationError(
                {"detail": "Only failed policies can be retried."}
            )

        _, retryable = PROCESSING_ERRORS.get(
            policy.processing_error_code, (None, False)
        )
        if not retryable:
            raise serializers.ValidationError(
                {"detail": "This error requires re-uploading the file, not a retry."}
            )

        policy.status = Policy.Status.QUEUED
        policy.processing_error_code = None
        policy.save(update_fields=["status", "processing_error_code"])

        try:
            process_policy.delay(policy.id)
        except Exception as e:
            policy.status = policy.Status.FAILED
            policy.processing_error_code = "Internal error during processing try again!"
            policy.save(update_fields=["status", "processing_error_code"])

        # user PolicyCreateSerializer as its admin only serializer and has all the read fields of PolicySerializer
        return Response(PolicyCreateSerializer(policy).data, status=status.HTTP_200_OK)


# to-do  :  handle error when celery worker is not running


# not finished!
class PolicyRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    """
    View to retrieve or delete a single policy.
    """

    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    lookup_field = "id"
    lookup_url_kwarg = "policy_id"

    def get_permissions(self):
        if self.request.method == "DELETE":
            return [IsAdmin()]
        return [IsAuthenticated()]


class PolicyEditMetadatView(generics.UpdateAPIView):
    queryset = Policy.objects.all()
    serializer_class = PolicyEditMetadataSerializer
    permission_classes = [IsAdmin]
    lookup_url_kwarg = "policy_id"


# GET /api/policies/<document_id>/download/?mode=view       -> opens inline (iframe/new tab preview)
# GET /api/policies/<document_id>/download/?mode=download    -> forces "Save As"
class PolicyDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, policy_id):
        # Path to the PDF file
        policy = get_object_or_404(Policy, id=policy_id, status="ready")

        if not policy.file or not os.path.exists(policy.file.path):
            return Response(
                {"error": "File not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        mode = request.query_params.get("mode", "download")  # "view" or "download"
        disposition = "inline" if mode == "view" else "attachment"

        response = FileResponse(
            open(policy.file.path, "rb"),
            content_type="application/pdf",
        )
        response["Content-Disposition"] = (
            f'{disposition}; filename="{os.path.basename(policy.file.name)}"'
        )
        return response
