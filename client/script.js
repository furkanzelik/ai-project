
const userInput = document.getElementById('field');
const chatDiv = document.getElementById('content');
const banner = document.getElementById('banner');
const submitButton = document.getElementById('submitButton');


// Initialize chat history array and load any existing history
let chatHistory = [];
loadChatHistory();

// DOMContentLoaded event listener to display existing chat history
document.addEventListener('DOMContentLoaded', () => {
    chatHistory.forEach(({ message, sender }) => {
        displayMessage(message, sender);
    });
});

// Save chat history to local storage
function saveChatHistory() {
    localStorage.setItem('ChatHistory', JSON.stringify(chatHistory));
}

// Load chat history from local storage
function loadChatHistory() {
    const chatHistoryData = localStorage.getItem('ChatHistory');
    chatHistory = chatHistoryData ? JSON.parse(chatHistoryData) : [];
}

// Display a message in the chat area
function displayMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;

    if (sender === 'user') {
        messageDiv.classList.add('user-message', 'right-message');
    } else {
        messageDiv.classList.add('bot-message', 'left-message');
    }

    chatDiv.appendChild(messageDiv);
}
// Search chat history for messages containing a specific query
// function searchChatHistory(query) {
//     return chatHistory.filter(({ message }) => {
//         return message.toLowerCase().includes(query.toLowerCase());
//     });
// }

// Create engineered prompt template for the AI chatbot
function fengineeredPrompt(userInput) {
    const chatHistoryContext = chatHistory
        .map(({ message }) => ` ${message}`);

    return `You are a holiday planner chatbot. Your goal is to help users plan their holidays with a good conversation. 
  Based on their preferences, you will suggest activities and destinations.

  **Conversation History:**
  ${chatHistoryContext}

  Please provide your holiday preferences: ${userInput}`;
}

// Create response template for the AI chatbot
function fResponseTemplate(userInput) {
    if (userInput.toLowerCase().includes('sporting')) {
        return `Great choice! Based on your preference for a sporting holiday, 
    I suggest considering destinations with opportunities for activities such as hiking,
     water sports, or adventure sports. Would you like me to suggest some specific destinations?`;
    } else if (userInput.toLowerCase().includes('historical')) {
        return `Excellent! Historical holidays offer a rich cultural experience. 
    I can recommend destinations with fascinating historical sites and museums to explore. 
    Let me know if you'd like me to suggest some options.`;
    } else {
        return `Thank you for providing your holiday preferences. Based on your input, 
    I will tailor my suggestions to best suit your interests. Feel free to provide 
    more details or ask any questions you may have.`;
    }
}

// Submit button click event listener
document.getElementById('submitButton').addEventListener('click', async () => {
    submitButton.disabled = true;
    banner.style.display = 'none';

    // Get user input value and display it in the chat
    const userInputValue = userInput.value;
    displayMessage(userInputValue, 'user');

    try {
        const engineeredPrompt = fengineeredPrompt(userInputValue);
        const responseTemplate = fResponseTemplate(userInputValue);

        // Send user input to the server and display the response
        const response = await fetch('http://127.0.0.1:8080/chatting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: engineeredPrompt, responseTemplate })
        });

        if (!response.ok) {
            throw new Error('Cannot fetch from server');
        }

        const data = await response.json();
        const chatResponse = data.response;

        // Display message of the chatbot
        displayMessage(chatResponse.kwargs.content, 'bot');

        // Save user and bot messages
        chatHistory.push({ message: userInputValue, sender: 'user' });
        chatHistory.push({ message: chatResponse.kwargs.content, sender: 'bot' });
        saveChatHistory();

    } catch (error) {
        console.log('Error:', error);
    } finally {
        submitButton.disabled = false;
    }
});