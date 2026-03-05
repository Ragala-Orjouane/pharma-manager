from rest_framework import serializers
from .models import Categorie


class CategorieSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Categorie.
    """

    class Meta:
        model = Categorie
        fields = [
            "id",
            "nom",
            "description",
            "date_creation"
        ]

    def validate_nom(self, value):
        """
        Vérifie que le nom n'est pas vide.
        """
        if len(value.strip()) < 2:
            raise serializers.ValidationError(
                "Le nom de la catégorie doit contenir au moins 2 caractères."
            )
        return value