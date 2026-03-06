from django.db import models

# Create your models here.
class Medicament(models.Model):
    """
    Représente un médicament dans l'inventaire de la pharmacie.

    Attributs:
        nom (str): Nom commercial du médicament.
        dci (str): Dénomination Commune Internationale.
        categorie (Categorie): Catégorie du médicament.
        forme (str): Forme galénique (comprimé, sirop, injection).
        dosage (str): Dosage du médicament (ex: 500mg).
        prix_achat (Decimal): Prix d'achat.
        prix_vente (Decimal): Prix de vente.
        stock_actuel (int): Quantité en stock.
        stock_minimum (int): Seuil d'alerte.
        date_expiration (date): Date de péremption.
        ordonnance_requise (bool): Indique si ordonnance nécessaire.
        est_actif (bool): Soft delete.
        date_creation (datetime): Date création.
    """

    nom = models.CharField(max_length=200)

    dci = models.CharField(
        max_length=200,
        blank=True
    )

    categorie = models.ForeignKey(
        "categories.Categorie",
        on_delete=models.PROTECT,
        related_name="medicaments",
        verbose_name='Catégorie'
    )

    forme = models.CharField(max_length=100)

    dosage = models.CharField(max_length=100)

    prix_achat = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    prix_vente = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    stock_actuel = models.PositiveIntegerField(default=0)

    stock_minimum = models.PositiveIntegerField(default=10)

    date_expiration = models.DateField()

    ordonnance_requise = models.BooleanField(default=False)

    est_actif = models.BooleanField(default=True)

    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["nom"]
        verbose_name = "Médicament"
        verbose_name_plural = "Médicaments"

    def __str__(self):
        return f"{self.nom} ({self.dosage})"

    @property
    def est_en_alerte(self):
        """
        Retourne True si le stock est inférieur au seuil minimum.
        """
        return self.stock_actuel <= self.stock_minimum