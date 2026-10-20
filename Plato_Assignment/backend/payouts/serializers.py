from rest_framework import serializers
from .models import Payout


class PayoutSerializer(serializers.ModelSerializer):
    amount_rupees = serializers.SerializerMethodField()
    merchant_name = serializers.CharField(source='merchant.name', read_only=True)

    class Meta:
        model = Payout
        fields = [
            'id', 'merchant', 'merchant_name', 'amount_paise', 'amount_rupees',
            'bank_account_id', 'status', 'attempts', 'processing_started_at',
            'failure_reason', 'created_at', 'updated_at',
        ]

    def get_amount_rupees(self, obj):
        return obj.amount_paise / 100


class CreatePayoutSerializer(serializers.Serializer):
    merchant_id = serializers.UUIDField()
    amount_paise = serializers.IntegerField(min_value=1)
    bank_account_id = serializers.CharField(max_length=100)
