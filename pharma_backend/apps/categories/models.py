from django.db import models

# Create your models here.
class Categorie(models.Model):
    """
    Représente une catégorie de médicaments.
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