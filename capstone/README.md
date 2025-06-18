## Project: Questions for Naturalization Test

### Distinctiveness and Complexity

This is a project that I have been wanting to work on for a long time as I believe it is a helpful, and interactive way to study for the U.S. Naturalization test. The project includes real data from the USCIS test prep-questions. It uses models to store this data, and animation to display flashcards that are interactive to the user. It is different from previous projects as it was created as a study guide for a user looking to become a U.S. Citizen. The project utilizes models and Django along with animations from CSS.

### Models.py

The models used in this project are Category, for the categories provided by the USCIS study guide, and Flashcard, to display the question and answer from the study guide.

### Test Questions and Answers: us_flashcards.json

A us_flashcards.json file was created to store all categories, questions and answers. It includes all 100 prep questions provided by https://www.uscis.gov/sites/default/files/document/questions-and-answers/100q.pdf

### Views.py

The command `python manage.py loaddata flashcards/fixtures/flashcards/us_flashcards.json` used the data from the json file above to be added to each of the models. Views.py is then able to use the dataset of the models to get the information it needs to display the questions and answers.

### HTML

The HTML files provided are simple but effective. The index.html file allows the user to select which category they would like to study from. The category_cards.html file creates the `<div>`'s necessary to create the "flashcard" effect, with the front of the card including the question, and the back of the card including the answer.

### Javascript: flip.js

The core of the program. Not only are there several event listeners watching for click interatcions, but there are several JSON parse functions that are used to communicate the information from the json file to be correctly translated to the dynamic website. The user of the array 'flashcards' is necessary to organize the information in a user-readable context from JSON. It then uses the 'class' information to correctly incorporate a question with its corresponding answer. The script also ensures that if a user has reached the end of the categories questions, it will start at the first question again. There are several checks for errors in case there is an issue with the json information or if it cannot be found. It also uses delays to give the program a couple of seconds to update from one flashcard information to the next.

### Running Application

This project does not use any additonal libraries to be installed. It can be ran with the `python manage.py runserver` prompt and it will automatically take the user to the index page, where they will choose what category to study from. The user has the oppotunity to review the question, check the answer, go to the next question, go back to the previous question, or return to the list of categories.
