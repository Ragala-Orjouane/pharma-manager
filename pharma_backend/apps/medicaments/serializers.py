from rest_framework import serializers
from .models import Medicament


class MedicamentSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Medicament.
    """

    est_en_alerte = serializers.ReadOnlyField()

    class Meta:
        model = Medicament
        fields = "__all__"

    def validate(self, data):
        """
        Vérifie cohérence prix et stock.
        """

        if data["prix_vente"] < data["prix_achat"]:
            raise serializers.ValidationError({
                "prix_vente":"Le prix de vente ne peut pas être inférieur au prix d'achat."
            })

        return data