document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded: Initializing flashcard app.");

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
        // JSON.parse() converts the JSON string back into a JavaScript array of objects
        const rawJsonText = flashcardDataScript.textContent.trim(); // Trim whitespace
        console.log("Raw JSON text from script tag:", rawJsonText);

        if (rawJsonText) {
            flashcards = JSON.parse(rawJsonText);
            console.log("Successfully parsed flashcards:", flashcards);
        } else {
            console.warn("Flashcard data script tag is empty.");
        }
        
    } catch (e) {
        console.error("Error parsing flashcard JSON data:", e);
        // Optionally, display an error message on the page for the user
        const flashcardContainer = document.getElementById('flashcard-display');
        if (flashcardContainer) {
            flashcardContainer.innerHTML = '<p style="text-align: center; color: red;">Error loading flashcards. Please check the console for details.</p>';
        }
        return; // Stop execution if parsing fails
    }

    // Check if flashcards array is empty after parsing
    if (flashcards.length === 0) {
        console.warn("No flashcards found to display after parsing. The flashcards array is empty or parsing failed.");
        // Optionally, display a message to the user that no flashcards are available
        const flashcardContainer = document.getElementById('flashcard-display');
        if (flashcardContainer) {
            flashcardContainer.innerHTML = '<p style="text-align: center; color: #555;">No flashcards available. Please add some cards!</p>';
        }
        return; // Stop execution
    }

    let currentIndex = 0; // Initialize the index for the current flashcard
    
    // Get references to the DOM elements
    const flashcardContainer = document.getElementById('flashcard-display'); // The main container that handles clicks
    const flashcardInner = flashcardContainer.querySelector('.flashcard-inner'); // The element that actually flips
    const questionText = document.getElementById('question-text'); // Span for question content
    const answerText = document.getElementById('answer-text');     // Span for answer content

    // Ensure all necessary DOM elements are found
    if (!flashcardContainer || !flashcardInner || !questionText || !answerText) {
        console.error("Error: One or more required DOM elements for flashcard display were not found.");
        console.log({flashcardContainer, flashcardInner, questionText, answerText});
        return;
    }

    /**
     * Updates the content of the flashcard to display the question and answer
     * for the flashcard at the given index.
     * It also ensures the card is flipped back to its front view.
     * @param {number} index The index of the flashcard to display from the 'flashcards' array.
     */
    function displayFlashcard(index) {
        console.log(`Displaying flashcard at index: ${index}`);
        console.log("Current flashcard data:", flashcards[index]);

        // First, ensure the card is not flipped (showing the front side)
        // This is crucial for when you click to go to the next question,
        // it should start by showing the new question, not the previous answer.
        flashcardInner.style.transform = 'rotateY(0deg)'; 

        // Update content after a short delay. This delay allows the
        // card to visually flip back to the front before the text changes,
        // making the transition smoother and less jarring.
        // The delay (e.g., 400ms) should be roughly half of your CSS transition duration (0.8s).
        setTimeout(() => {
            // Set the text content of the question and answer spans
            if (flashcards[index]) {
                questionText.textContent = flashcards[index].question || "No Question Found";
                answerText.textContent = flashcards[index].answer || "No Answer Found";
            } else {
                questionText.textContent = "Error: Flashcard data missing.";
                answerText.textContent = "Error: Flashcard data missing.";
                console.error(`Attempted to display flashcard at invalid index: ${index}`);
            }
        }, 400); 
    }

    /**
     * Handles the click event on the flashcard container.
     * This function advances to the next flashcard in the array.
     */
    function handleFlashcardClick() {
        console.log("Flashcard clicked. Moving to next question.");
        // Increment the current index
        currentIndex++;

        // If the current index goes beyond the last flashcard, loop back to the first one (index 0)
        if (currentIndex >= flashcards.length) {
            currentIndex = 0;
        }

        // Call the displayFlashcard function to show the new card
        displayFlashcard(currentIndex);
    }

    // Attach the click event listener to the main flashcard container
    // When this element is clicked, the handleFlashcardClick function will execute.
    flashcardContainer.addEventListener('click', handleFlashcardClick);

    // Initial display: Show the first flashcard when the page loads
    // This ensures there's a flashcard visible immediately without requiring a click.
    displayFlashcard(currentIndex);
});
