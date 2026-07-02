from django.urls import path
from .views import LoginView , UserListCreateView, UserDeleteView , AboutMeView

urlpatterns = [ 
    path("auth/login/",LoginView.as_view() , name="login" ),
    path("about/me/",AboutMeView.as_view() , name="about-me" ),
    path("users/",UserListCreateView.as_view() , name="users-list-create" ),
    path("users/<int:user_id>/",UserDeleteView.as_view() , name="users-delete" ),
]
