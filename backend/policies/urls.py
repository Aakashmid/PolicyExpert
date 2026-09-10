from django.urls import path
from .views import PolicyListView, PolicyCreateView, PolicyRetrieveDestroyView, RetryPolicyProcessView, PolicyEditMetadatView, PolicyDownloadView

urlpatterns = [
    path("", PolicyListView.as_view(), name="policy-list"),
    path("upload/", PolicyCreateView.as_view(), name="policy-create"),
    path("<int:policy_id>/", PolicyRetrieveDestroyView.as_view(), name="policy-retrieve-destroy"),
    path("<int:policy_id>/retry/", RetryPolicyProcessView.as_view(), name="retry-policy-processing"),
    path("<int:policy_id>/edit-metadata/", PolicyEditMetadatView.as_view(), name="policy-edit-metadata"),
    path("<int:policy_id>/download/", PolicyDownloadView.as_view(), name="policy-download"),
]
