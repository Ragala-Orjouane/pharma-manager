from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import Vente
from .serializers import VenteSerializer
# Create your views here.
class VenteViewSet(viewsets.ModelViewSet):
    """
    API permettant de gérer les ventes.
    """

    queryset = Vente.objects.all()
    serializer_class = VenteSerializer
    @action(detail=True, methods=["post"])
    def annuler(self, request, pk=None):

        vente = self.get_object()

        if vente.statut == "ANNULEE":
            return Response(
                {"detail": "Vente déjà annulée"},
                status=status.HTTP_400_BAD_REQUEST
            )

        for ligne in vente.lignes.all():

            medicament = ligne.medicament
            medicament.stock_actuel += ligne.quantite
            medicament.save()

        vente.statut = "ANNULEE"
        vente.save()

        return Response({"message": "Vente annulée et stock rétabli"})