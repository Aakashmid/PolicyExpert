from django.urls import path
from .views import LoginView , UserListCreateView, UserDeleteView , AboutMeView , LogoutView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [ 
    path("auth/login/",LoginView.as_view() , name="login" ),
    path("auth/token/refresh/",TokenRefreshView.as_view() , name="refresh-token" ),
    path("auth/logout/",LogoutView.as_view() , name="logout" ),
    path("about/me/",AboutMeView.as_view() , name="about-me" ),
    path("users/",UserListCreateView.as_view() , name="users-list-create" ),
    path("users/<int:user_id>/",UserDeleteView.as_view() , name="users-delete" ),
]
