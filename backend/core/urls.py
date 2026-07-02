from django.contrib import admin
from django.urls import path,include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [ 
    path("adminsite/", admin.site.urls),
    # OpenAPI schema (JSON)
    path("api/v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    # Swagger UI
    path(
        "api/v1/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    # ReDoc UI
    path("api/v1/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),


    # Authentication endpoint and user related endpoints 
    path("api/v1/",include('accounts.urls'),name="users"),


]
