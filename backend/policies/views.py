import hashlib
from .tasks import process_policy
from .models import Policy
from .serializer import PolicySerializer
from core.permissions import IsEmployee, IsAdmin
from rest_framework import generics, serializers
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.


class PolicyListCreateView(generics.ListCreateAPIView):
    """
    View to list all policies or create a new policy.
    """

    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdmin()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        """Set upload metadata and ingest a newly created document."""
        uploaded_file = serializer.validated_data["file"]

        # Compute SHA-256 hash
        sha256 = hashlib.sha256()
        for chunk in uploaded_file.chunks():
            sha256.update(chunk)
        file_hash = sha256.hexdigest()
        uploaded_file.seek(0)

        # Check for duplicate file existence based on hash
        if Policy.objects.filter(
            file_hash=file_hash
        ).exists():
            raise serializers.ValidationError(
                {
                    "detail": f"This policy has already been uploaded by {self.request.user.email}"
                }
            )

        policy = serializer.save(uploaded_by=self.request.user, file_hash=file_hash)

        try:
            process_policy.delay(policy.id)
        except Exception as e:  #  had to update logic 
            policy.status= "Failed"
            # policy.processing_error = "Failed to proc"
            policy.save()


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
