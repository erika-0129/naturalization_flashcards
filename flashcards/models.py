from django.db import models
from django.contrib.auth.models import User

# Question category
class Category(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
    
# Flashcard questions and answers
class Flashcard(models.Model):
    question = models.TextField()
    answer = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="flashcards")

    def __str__(self):
        return self.question, self.answer
