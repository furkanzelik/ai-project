const userInput = document.getElementById('field');
const chatDiv = document.getElementById('content');
const banner = document.getElementById('banner');
const submitButton = document.getElementById('submitButton');


// Define displayMessage function in the global scope
function displayMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;

    // Apply different classes based on the sender for styling
    if (sender === 'user') {
        messageDiv.classList.add('user-message', 'right-message');
    } else if (sender === 'bot') {
        messageDiv.classList.add('bot-message', 'left-message');
    }

    chatDiv.appendChild(messageDiv);
}

// Event listener for submit button
document.getElementById('submitButton').addEventListener('click', async () => {

    submitButton.disabled = true;

    //if send banner goes away
    banner.style.display = 'none'

    // Retrieve user input value from the input field
    const userInputValue = userInput.value;

    // Show the user question in the chat
    displayMessage(userInputValue, 'user');

    try {
        // Send the user input to the server
        const response = await fetch('http://127.0.0.1:8080/chatting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: userInputValue }) // Send user input value
        });

        if (!response.ok) {
            throw new Error('Cannot fetch from server');
        }

        //  data from the server
        const data = await response.json();
        const chatResponse = data.response;

        // Display message of the chatbot kwargs = postman object/item
        displayMessage(chatResponse.kwargs.content, 'bot'); // Update here to display the bot's response directly
    } catch (error) {
        console.log('Error:', error);
    } finally {
        submitButton.disabled = false;
    }
});


