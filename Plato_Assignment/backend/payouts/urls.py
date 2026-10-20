from django.urls import path
from . import views

urlpatterns = [
    path('payouts/', views.PayoutListCreateView.as_view(), name='payout-list-create'),
    path('payouts/<uuid:payout_id>/', views.PayoutDetailView.as_view(), name='payout-detail'),
]
