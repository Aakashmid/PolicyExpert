from django.urls import path
from .views import PolicyListCreateView , PolicyRetrieveDestroyView

urlpatterns = [
    path("", PolicyListCreateView.as_view(), name="policy-list-create"),
    path("<int:policy_id>/", PolicyRetrieveDestroyView.as_view(), name="policy-retrieve-destroy"),
]