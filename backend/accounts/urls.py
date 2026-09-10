from django.urls import path
from .views import (
    LoginView,
    UserListCreateView,
    UserDeleteView,
    UserMeView,
    LogoutView,
    CustomTokenRefreshView,
    UserPasswordResetView,
    UserActivateView,
    UserDeactivateView,
    ChangePasswordView,
)

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/token/refresh/", CustomTokenRefreshView.as_view(), name="refresh-token"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/change-password/", ChangePasswordView.as_view(), name="password-change"),
    #
    path("users/me/", UserMeView.as_view(), name="about-me"),
    path("users/", UserListCreateView.as_view(), name="users-list-create"),
    path("users/<int:user_id>/", UserDeleteView.as_view(), name="users-delete"),
    # users actions view by admin
    path("users/<int:user_id>/activate/", UserActivateView.as_view(), name="users-activate"),
    path("users/<int:user_id>/deactivate/", UserDeactivateView.as_view(), name="users-deactivate"),
    path("users/<int:user_id>/reset-password/", UserPasswordResetView.as_view(), name="users-reset-password"),
]
