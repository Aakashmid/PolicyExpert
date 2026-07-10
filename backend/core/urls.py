from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    path("adminsite/", admin.site.urls),  # OpenAPI schema (JSON)
    path("api/v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(  # Swagger UI
        "api/v1/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/v1/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",  # ReDoc UI
    ),
    path("api/v1/policies/", include("policies.urls"), name="policies"),
    path(
        "api/v1/", include("accounts.urls"), name="users"
    ),  # Authentication endpoint and user related endpoints
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
