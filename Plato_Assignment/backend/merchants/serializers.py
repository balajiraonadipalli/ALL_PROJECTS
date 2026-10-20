from rest_framework import serializers
from .models import Merchant, LedgerEntry, IdempotencyKey


class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = ['id', 'name', 'email', 'bank_account_id', 'created_at']


class LedgerEntrySerializer(serializers.ModelSerializer):
    amount_rupees = serializers.SerializerMethodField()
    payout_id = serializers.PrimaryKeyRelatedField(source='payout', read_only=True)

    class Meta:
        model = LedgerEntry
        fields = ['id', 'entry_type', 'amount_paise', 'amount_rupees',
                  'description', 'payout_id', 'created_at']

    def get_amount_rupees(self, obj):
        return obj.amount_paise / 100
