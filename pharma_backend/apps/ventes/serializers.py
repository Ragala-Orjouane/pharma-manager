from rest_framework import serializers
from .models import Vente, LigneVente
from apps.medicaments.models import Medicament

#Serializer de LigneVente

class LigneVenteSerializer(serializers.ModelSerializer):

    class Meta:
        model = LigneVente
        fields = [
            "medicament",
            "quantite",
            "prix_unitaire",
            "sous_total"
        ]
        read_only_fields = ["prix_unitaire", "sous_total"]

#Serializer de Vente

class VenteSerializer(serializers.ModelSerializer):

    lignes = LigneVenteSerializer(many=True)

    class Meta:
        model = Vente
        fields = [
            "id",
            "reference",
            "date_vente",
            "total_ttc",
            "statut",
            "notes",
            "lignes"
        ]

        read_only_fields = ["reference", "total_ttc"]
    
    def create(self, validated_data):

        lignes_data = validated_data.pop("lignes")

        vente = Vente.objects.create(**validated_data)

        total = 0

        for ligne in lignes_data:

            medicament = ligne["medicament"]
            quantite = ligne["quantite"]

            if medicament.stock_actuel < quantite:
                raise serializers.ValidationError(
                    f"Stock insuffisant pour {medicament.nom}"
                )

            prix = medicament.prix_vente

            LigneVente.objects.create(
                vente=vente,
                medicament=medicament,
                quantite=quantite,
                prix_unitaire=prix,
                sous_total=prix * quantite
            )

            medicament.stock_actuel -= quantite
            medicament.save()

            total += prix * quantite

        vente.total_ttc = total
        vente.save()

        return vente