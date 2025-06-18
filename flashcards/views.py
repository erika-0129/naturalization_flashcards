from django.shortcuts import render
from django.http import HttpResponse, Http404
from flashcards.models import Flashcard, Category
import json


def index(request):
    # Conversion to list
    category_list = Category.objects.all()
    
    return render(request, "flashcards/index.html",{
        "category_list": category_list 
    })


def category_cards(request, category_id):
    try:
        # Get the specific category object
        selected_category = Category.objects.get(pk=category_id)
    except Category.DoesNotExist:
        raise Http404("Category does not exist")
    
    # Access flashcard questions and answers, filtered by the selected category
    flashcards_queryset = Flashcard.objects.filter(category__id=category_id).values('question', 'answer')
    
    # Convert the QuerySet to a list of dictionaries
    flashcards_list = list(flashcards_queryset)
    
    # Serialize the list of dictionaries to a JSON string
    flashcards_json = json.dumps(flashcards_list)

    return render(request, "flashcards/category_cards.html",{
        "category_name": selected_category.name,  
        "flashcards_json": flashcards_json
    })