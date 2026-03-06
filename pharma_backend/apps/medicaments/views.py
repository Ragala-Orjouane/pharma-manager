from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from django.db import models

from .models import Medicament
from .serializers import MedicamentSerializer
# Create your views here.



@extend_schema(tags=["Medicaments"])
class MedicamentViewSet(viewsets.ModelViewSet):
    """
    API pour gérer les médicaments de la pharmacie.
    """

    queryset = Medicament.objects.filter(est_actif=True)
    serializer_class = MedicamentSerializer

    def perform_destroy(self, instance):
        """
        Soft delete d'un médicament.
        """
        instance.est_actif = False
        instance.save()

    @action(detail=False, methods=["get"])
    def alertes(self, request):
        """
        Retourne les médicaments dont le stock est inférieur au seuil minimum.
        """

        medicaments = Medicament.objects.filter(
            stock_actuel__lte=models.F("stock_minimum"),
            est_actif=True
        )

        serializer = self.get_serializer(medicaments, many=True)

        return Response(serializer.data)