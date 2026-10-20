from django.core.management.base import BaseCommand
from django.db import transaction
from merchants.models import Merchant, LedgerEntry
from payouts.models import Payout


class Command(BaseCommand):
    help = 'Seeds the database with merchant and ledger data for demo purposes.'

    def handle(self, *args, **options):
        if Merchant.objects.exists():
            self.stdout.write(self.style.WARNING('Data already seeded — skipping.'))
            return

        self.stdout.write('Seeding merchants...')

        with transaction.atomic():
            # Merchant 1 — Priya Sharma
            priya = Merchant.objects.create(
                name='Priya Sharma',
                email='priya@designstudio.in',
                bank_account_id='HDFC0001234567',
            )
            for i, amt in enumerate([1000000, 800000, 600000, 1200000, 900000], 1):
                LedgerEntry.objects.create(
                    merchant=priya,
                    entry_type='credit',
                    amount_paise=amt,
                    description=f'Customer payment #{i} (USD → INR)',
                )

            # Merchant 2 — Raj Patel
            raj = Merchant.objects.create(
                name='Raj Patel',
                email='raj@techfreelance.in',
                bank_account_id='ICICI0009876543',
            )
            for i, amt in enumerate([4000000, 3500000, 4500000], 1):
                LedgerEntry.objects.create(
                    merchant=raj,
                    entry_type='credit',
                    amount_paise=amt,
                    description=f'Customer payment #{i} (USD → INR)',
                )
            # Completed payout for Raj
            completed_payout = Payout.objects.create(
                merchant=raj,
                amount_paise=2500000,
                bank_account_id=raj.bank_account_id,
                status='completed',
            )
            LedgerEntry.objects.create(
                merchant=raj,
                entry_type='debit',
                amount_paise=2500000,
                payout=completed_payout,
                description='Payout to ICICI0009876543',
            )

            # Merchant 3 — Ananya Tech
            ananya = Merchant.objects.create(
                name='Ananya Tech Solutions',
                email='ananya@ananyatech.in',
                bank_account_id='SBI0005551234',
            )
            for i, amt in enumerate([3750000, 3750000], 1):
                LedgerEntry.objects.create(
                    merchant=ananya,
                    entry_type='credit',
                    amount_paise=amt,
                    description=f'Customer payment #{i} (USD → INR)',
                )
            # A failed payout — funds should have been returned
            failed_payout = Payout.objects.create(
                merchant=ananya,
                amount_paise=1000000,
                bank_account_id=ananya.bank_account_id,
                status='failed',
                failure_reason='Bank rejected the transfer',
                attempts=3,
            )
            LedgerEntry.objects.create(
                merchant=ananya,
                entry_type='debit',
                amount_paise=1000000,
                payout=failed_payout,
                description='Payout hold (failed)',
            )
            LedgerEntry.objects.create(
                merchant=ananya,
                entry_type='credit',
                amount_paise=1000000,
                payout=failed_payout,
                description='Payout failed (Bank rejected the transfer) — funds returned',
            )

        self.stdout.write(self.style.SUCCESS(
            f'Seeded 3 merchants: Priya Sharma (₹{45000}), Raj Patel (₹{95000}), Ananya Tech (₹{75000})'
        ))
