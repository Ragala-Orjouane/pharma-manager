from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from drf_spectacular.utils import extend_schema

from .models import Categorie
from .serializers import CategorieSerializer


@extend_schema(tags=["Categories"])
class CategorieViewSet(viewsets.ModelViewSet):
    """
    API permettant de gérer les catégories de médicaments.
    """

    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer