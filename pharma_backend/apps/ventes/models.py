from django.db import models

from django.utils import timezone
from apps.medicaments.models import Medicament
# Create your models here.



class Vente(models.Model):
    """
    Représente une transaction de vente dans la pharmacie.

    Une vente correspond à une opération commerciale où un ou plusieurs
    médicaments sont vendus à un client. Chaque vente est composée
    de plusieurs lignes de vente représentant les médicaments vendus.

    Attributs:
        reference (str): Identifiant unique de la vente.
        date_vente (datetime): Date et heure de la transaction.
        total_ttc (Decimal): Montant total de la vente toutes taxes comprises.
        statut (str): État de la vente (EN_COURS, COMPLETEE, ANNULEE).
        notes (str): Informations complémentaires concernant la vente.
    """

    STATUT_CHOICES = [
        ("EN_COURS", "En cours"),
        ("COMPLETEE", "Complétée"),
        ("ANNULEE", "Annulée"),
    ]

    reference = models.CharField(
        max_length=20,
        unique=True
    )

    date_vente = models.DateTimeField(default=timezone.now)

    total_ttc = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default="COMPLETEE"
    )

    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.reference


class LigneVente(models.Model):
    """
    Représente une ligne de médicament dans une vente.

    Chaque ligne correspond à un médicament vendu avec une quantité
    et un prix unitaire au moment de la transaction.

    Attributs:
        vente (Vente): Vente à laquelle appartient cette ligne.
        medicament (Medicament): Médicament vendu.
        quantite (int): Quantité de médicament vendue.
        prix_unitaire (Decimal): Prix de vente unitaire au moment de la transaction
                                 (snapshot du prix du médicament).
        sous_total (Decimal): Montant total de la ligne (quantite × prix_unitaire).
    """

    vente = models.ForeignKey(
        Vente,
        on_delete=models.CASCADE,
        related_name="lignes"
    )

    medicament = models.ForeignKey(
        Medicament,
        on_delete=models.PROTECT
    )

    quantite = models.PositiveIntegerField()

    prix_unitaire = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    sous_total = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def save(self, *args, **kwargs):
        """
            Calcule automatiquement le sous-total avant sauvegarde.

            Le sous-total correspond à la multiplication de la quantité
            par le prix unitaire du médicament.
        """

        self.sous_total = self.quantite * self.prix_unitaire
        super().save(*args, **kwargs)