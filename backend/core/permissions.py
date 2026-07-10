from rest_framework.permissions import BasePermission


class IsEmployee(BasePermission):
    """
    Custom permission to only allow users with 'employee' role.
    """
    def has_permission(self, request, view)->bool:
        # Check if user is authenticated first
        if not request.user or not request.user.is_authenticated:
            return False
        
        return request.user.role == 'employee'

class IsAdmin(BasePermission):
    """
    Custom permission to only allow users with 'admin' role.
    """
    def has_permission(self, request, view)->bool:
        if not request.user or not request.user.is_authenticated:
            return False
        
        return request.user.role == 'admin'