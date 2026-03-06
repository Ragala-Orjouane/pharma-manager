from django.contrib import admin
from .models import Medicament

# Register your models here.
@admin.register(Medicament)
class MedicamentAdmin(admin.ModelAdmin):

    list_display = (
        "nom",
        "categorie",
        "stock_actuel",
        "stock_minimum",
        "prix_vente",
        "date_expiration",
    )

    list_filter = (
        "categorie",
        "ordonnance_requise",
    )

    search_fields = (
        "nom",
        "dci",
    )