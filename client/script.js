const userInput = document.getElementById('field');
const chatDiv = document.getElementById('content');
const banner = document.getElementById('banner');
const submitButton = document.getElementById('submitButton');

// Define global variable for chat history
let chatHistory = [];

// Function to save chat history
function saveChatHistory() {
    localStorage.setItem('ChatHistory', JSON.stringify(chatHistory));
}

// Function to load chat history
function loadChatHistory() {
    const chatHistoryData = localStorage.getItem('ChatHistory');
    chatHistory = chatHistoryData ? JSON.parse(chatHistoryData) : [];
}

function displayMessage(message, sender, temperature) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;

    // user message right bot message left
    if (sender === 'user') {
        messageDiv.classList.add('user-message', 'right-message');
    } else if (sender === 'bot') {
        messageDiv.classList.add('bot-message', 'left-message');
    }

    chatDiv.appendChild(messageDiv);

    if (temperature !== null) {
        const temperatureDiv = document.createElement('div-temperature');
        temperatureDiv.textContent = `Temperature: ${temperature}°C`;
        temperatureDiv.classList.add('temperature');
        messageDiv.parentNode.insertBefore(temperatureDiv, messageDiv.nextSibling);
    }
}

// Load chat history when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
    chatHistory.forEach(({ message, sender }) => {
        displayMessage(message, sender);
    });
});



// Function to search for relevant information in stored conversation history
function searchChatHistory(query) {
    return chatHistory.filter(({ message }) => {
        return message.toLowerCase().includes(query.toLowerCase());
    });
}

function createEngineeredPromptTemplate(userInput) {
    // Include the chat history in the prompt for context
    const chatHistoryContext = chatHistory.map(({ message }) => `* ${message}`).join('\n');
    return `You are a holiday planner chatbot. Your goal is to help users plan their holidays with a good conversation. Based on their preferences and past conversation (see below), you will suggest activities and destinations.

  **Conversation History:**
  ${chatHistoryContext}

  Please provide your holiday preferences: ${userInput}`;
}

function createResponseTemplate(userInput) {
    // Provide guidance for the AI bot on how to respond effectively
    if (userInput.toLowerCase().includes('sporting')) {
        return `Great choice! Based on your preference for a sporting holiday, I suggest considering destinations with opportunities for activities such as hiking, water sports, or adventure sports. Would you like me to suggest some specific destinations?`;
    } else if (userInput.toLowerCase().includes('historical')) {
        return `Excellent! Historical holidays offer a rich cultural experience. I can recommend destinations with fascinating historical sites and museums to explore. Let me know if you'd like me to suggest some options.`;
    } else {
        // If no specific preference matches, provide a generic response
        return `Thank you for providing your holiday preferences. Based on your input, I will tailor my suggestions to best suit your interests. Feel free to provide more details or ask any questions you may have.`;
    }
}


// submit button
document.getElementById('submitButton').addEventListener('click', async () => {

    submitButton.disabled = true;
    banner.style.display = 'none'

    // Retrieve user input value from the input field
    const userInputValue = userInput.value;
    // Show the user question in the chat
    displayMessage(userInputValue, 'user');

    try {

        const engineeredPrompt = createEngineeredPromptTemplate(userInputValue);
        const responseTemplate = createResponseTemplate(userInputValue);

        // Send the user input to the server
        const response = await fetch('http://127.0.0.1:8080/chatting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: engineeredPrompt, responseTemplate, latitude: 51.926517,
                longitude: 4.462456 }) // Send user input value
        });

        if (!response.ok) {
            throw new Error('Cannot fetch from server');
        }

        //  data from the server
        const data = await response.json();
        const chatResponse = data.response;

        // Display message of the chatbot kwargs = postman object/item
        displayMessage(chatResponse.kwargs.content, 'bot');

        // Save the user input and bot response to chat history
        chatHistory.push({ message: userInputValue, sender: 'user' });
        chatHistory.push({ message: chatResponse.kwargs.content, sender: 'bot' });
        saveChatHistory();

    } catch (error) {
        console.log('Error:', error);
    } finally {
        submitButton.disabled = false;

    }
});


// Handle user input for queries about past conversations
document.getElementById('submitButton').addEventListener('click', async () => {
    const userInputValue = userInput.value;
    if (userInputValue.toLowerCase().includes('history')) {
        const query = userInputValue.replace('history', '').trim();
        const relevantMessages = searchChatHistory(query);
        if (relevantMessages.length > 0) {
            const response = relevantMessages.map(({ message, sender }) => `${sender}: ${message}`).join('\n');
            displayMessage(`Here is what I found in our conversation history:\n${response}`, 'bot');
            console.log(response);
        } else {
            displayMessage("I couldn't find any relevant information in our conversation history.", 'bot');
        }
    }
});





