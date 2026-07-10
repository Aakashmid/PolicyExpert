from rest_framework import generics 
from .models import Policy
from .serializer import PolicySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser 
from core.permissions import IsEmployee, IsAdmin

# Create your views here.


class PolicyListCreateView(generics.ListCreateAPIView):
    """
    View to list all policies or create a new policy.
    """
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [IsAuthenticated()]


class PolicyRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    """
    View to retrieve or delete a single policy.
    """
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAdmin()]
        return [IsAuthenticated()]
