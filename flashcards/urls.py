from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("flashcards_<str:category_id>", views.category_cards, name="category_cards")
]