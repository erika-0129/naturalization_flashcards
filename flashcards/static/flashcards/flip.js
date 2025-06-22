document.addEventListener('DOMContentLoaded', function() {

    // Get the script tag that contains the flashcard data
    const flashcardDataScript = document.getElementById('flashcard-data');

    // Check if the script tag exists to prevent errors
    if (!flashcardDataScript) {
        console.error("Error: Flashcard data script not found in HTML. Make sure it has id='flashcard-data'.");
        return; // Stop execution if data is not available
    }

    let flashcards = []; // Initialize as an empty array

    try {
        // Parse the JSON data from the script tag's text content
        const rawJsonText = flashcardDataScript.textContent.trim();
        console.log("Raw JSON text from script tag:", rawJsonText);

        if (rawJsonText) {
            flashcards = JSON.parse(rawJsonText);
            console.log("Successfully parsed flashcards:", flashcards);
        } else {
            console.warn("Flashcard data script tag is empty. Please ensure flashcards_json is being passed correctly from Django.");
        }
        
    } catch (e) {
        console.error("Error parsing flashcard JSON data:", e);
        const flashcardContainer = document.getElementById('flashcard-display');
        if (flashcardContainer) {
            flashcardContainer.innerHTML = '<p style="text-align: center; color: red;">Error loading flashcards. Please check the console for details.</p>';
        }
        return; // Stop execution if parsing fails
    }

    // Check if flashcards array is empty after parsing
    if (flashcards.length === 0) {
        console.warn("No flashcards found to display after parsing. The flashcards array is empty or parsing failed.");
        const flashcardContainer = document.getElementById('flashcard-display');
        if (flashcardContainer) {
            flashcardContainer.innerHTML = '<p style="text-align: center; color: #555;">No flashcards available. Please add some cards!</p>';
        }
        return; // Stop execution
    }

    let currentIndex = 0; // Initialize the index for the current flashcard
    
    // Get references to the DOM elements
    const flashcardContainer = document.getElementById('flashcard-display');
    const flashcardInner = flashcardContainer.querySelector('.flashcard-inner');
    const questionText = document.getElementById('question-text');
    const answerText = document.getElementById('answer-text');

    // Get references to the new buttons
    const answerButton = document.querySelectorAll('.answer-button');
    const questionButton = document.querySelectorAll('.question-button');
    const nextButtons = document.querySelectorAll('.next-question'); 
    const previousButtons = document.querySelectorAll('.previous-question'); 

    // Ensure all necessary DOM elements are found
    if (!flashcardContainer || !flashcardInner || !questionText || !answerText || 
        !answerButton === 0 || !questionButton === 0 || nextButtons.length === 0 || previousButtons.length === 0) {
        console.error("Error: One or more required DOM elements for flashcard display or buttons were not found.");
        console.log({flashcardContainer, flashcardInner, questionText, answerText, answerButton, questionButton, nextButtons, previousButtons});
        return;
    }

    // Some questions have multiple answers. This will organize the answers so that they are displayed with a newline
    function parsePythonListString(listString) {
        // Remove brackets and split by comma and space, then trim quotes/whitespace
        let items = listString.replace(/^\[|\]$/g, '') // Remove leading/trailing brackets
                              .split(/,\s*/) // Split by comma followed by any whitespace
                              .map(item => item.trim().replace(/^'|'$/g, '')); // Trim and remove single quotes
        // Filter out any empty strings that might result from extra commas or malformed string
        items = items.filter(item => item !== ''); 
        return items.join('<br>');
    }

    
    // Updates the content of the flashcard to display the question and answer
    function displayFlashcard(index) {
        console.log(`Displaying flashcard at index: ${index}`);
        console.log("Current flashcard data:", flashcards[index]);

        // Ensure the card is showing the front (question side)
        flashcardInner.style.transform = 'rotateY(0deg) rotateX(0deg)'; 

        // Update content after a short delay 
        setTimeout(() => {
            if (flashcards[index]) {
                questionText.textContent = flashcards[index].question || "No Question Found";
                let currentAnswer = flashcards[index].answer;
                if (typeof currentAnswer === 'string' && currentAnswer.startsWith('[') && currentAnswer.endsWith(']')) {
                    // This is a multi-part answer stored as a Python list string
                    answerText.innerHTML = parsePythonListString(currentAnswer);
                } else {
                    // Standard single answer
                    answerText.textContent = currentAnswer || "No Answer Found";
                }
            } else {
                questionText.textContent = "Error: Flashcard data missing.";
                answerText.textContent = "Error: Flashcard data missing.";
                console.error(`Attempted to display flashcard at invalid index: ${index}`);
            }
        }, 400); 
    }


    // Handles the click to show the answer (vertical flip).
    function handleAnswerClick() {
        console.log("Answer button clicked. Flipping to answer.");
        // Apply vertical flip to show the back (answer) side
        flashcardInner.style.transform = 'rotateX(180deg)';
    }


     // Handles the click to show the question (vertical flip back)
    function handleQuestionClick() {
        console.log("Question button clicked. Flipping to question.");
        // Apply vertical flip to show the front (question) side
        flashcardInner.style.transform = 'rotateX(0deg)';
    }


    // Handles the click to go to the next flashcard (horizontal flip).
    function handleNextClick() {
        console.log("Next Question button clicked. Moving to next question.");
        currentIndex++;
        if (currentIndex >= flashcards.length) {
            currentIndex = 0; // Loop back to the first question
        }
        
        // Apply horizontal flip to animate the transition to the next card
        flashcardInner.style.transform = 'rotateY(180deg)';
        
        // After the flip animation starts, update the content and reset the flip
        setTimeout(() => {
            displayFlashcard(currentIndex); 
        }, 400); 
    }

    // Handles the click to go to the previous flashcard (horizontal flip).
    function handlePreviousClick() {
        console.log("Previous Question button clicked. Moving to previous question.");
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = flashcards.length - 1; // Loop back to the last question
        }

        // Apply horizontal flip in the opposite direction
        flashcardInner.style.transform = 'rotateY(-180deg)'; 
        
        // After the flip animation starts, update the content and reset the flip
        setTimeout(() => {
            displayFlashcard(currentIndex); // Updates content and resets to front (rotateY(0) rotateX(0))
        }, 400);
    }

    // Attach event listeners to the buttons
    answerButton.forEach(button => { // Iterate through all answer buttons
        button.addEventListener('click', handleAnswerClick);
    });
    questionButton.forEach(button => { // Iterate through all question buttons
        button.addEventListener('click', handleQuestionClick);
    });

    nextButtons.forEach(button => {
        button.addEventListener('click', handleNextClick);
    });

    previousButtons.forEach(button => {
        button.addEventListener('click', handlePreviousClick);
    });

    // Initial display: Show the first flashcard when the page loads
    displayFlashcard(currentIndex);
});
