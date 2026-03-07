from django.db import models

# Create your models here.
class Categorie(models.Model):
    """
    Représente une catégorie de médicaments pour l'organisation de l'inventaire.

    Les catégories permettent de regrouper les médicaments par type 
    (ex: Antibiotiques, Antalgiques, Anti-inflammatoires, etc.) pour faciliter
    la recherche et l'analyse.

    Attributs:
        nom (str): Nom unique de la catégorie (ex: "Antibiotiques").
        description (str): Description détaillée de la catégorie.
        date_creation (datetime): Date et heure de création de la catégorie.
    
    Relations:
        medicaments (Medicament): Liste des médicaments appartenant à cette catégorie.
                                  Accessible via le related_name défini dans Medicament.
    """

    nom = models.CharField(
        max_length=150,
        unique=True,
        verbose_name="Nom"
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name="Description"
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['nom']
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"

    def __str__(self):
        return self.nom