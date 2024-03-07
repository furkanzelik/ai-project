const userInput = document.getElementById('field');
const chatDiv = document.getElementById('content');
const banner = document.getElementById('banner');
const submitButton = document.getElementById('submitButton');
let conversationRemember = {};


function saveChatHistory(messages) {
    localStorage.setItem('ChatHistory', JSON.stringify(messages));
}

function loadChatHistory(){
    const chatHistory = localStorage.getItem('ChatHistory');
    return chatHistory ? JSON.parse(chatHistory) : [];
}


function displayMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;

    // user message right bot message left
    if (sender === 'user') {
        messageDiv.classList.add('user-message', 'right-message');
    } else if (sender === 'bot') {
        messageDiv.classList.add('bot-message', 'left-message');
    }

    chatDiv.appendChild(messageDiv);
}


function createEngineeredPromptTemplate(userInput) {
    // Provide clear instructions and context for the user
    return `You are a holiday planner chatbot. Your goal is to help users plan their holidays. Based on their preferences, you will suggest activities and destinations. For example, you may ask: "What type of holiday are you interested in? (e.g., sporting, historical)". Please provide your holiday preferences: ${userInput}`;
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

document.addEventListener('DOMContentLoaded', () => {
    // Load chat history when the page is loaded
    const chatHistory = loadChatHistory();
    chatHistory.forEach(([sender, message]) => {
        displayMessage(message, sender);
    });
});




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
            body: JSON.stringify({ query: engineeredPrompt, responseTemplate: responseTemplate }) // Send user input value
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
        const chatHistory = loadChatHistory();
        chatHistory.push(['user', userInputValue]);
        chatHistory.push(['bot', chatResponse.kwargs.content]);
        saveChatHistory(chatHistory);

    } catch (error) {
        console.log('Error:', error);
    } finally {
        submitButton.disabled = false;
    }
});

// Function to search for relevant information in stored conversation history
function searchChatHistory(query) {
    const chatHistory = loadChatHistory();
    return chatHistory.filter(([sender, message]) => {
        return message.toLowerCase().includes(query.toLowerCase());
    });
}

// Function to process user query and generate response
function processUserQuery(query) {
    const relevantMessages = searchChatHistory(query);
    if (relevantMessages.length > 0) {
        const response = relevantMessages.map(([sender, message]) => `${sender}: ${message}`).join('\n');
        return `Here is what I found in our conversation history:\n${response}`;
    } else {
        return "I couldn't find any relevant information in our conversation history.";
    }
}

// Handle user input for queries about past conversations
document.getElementById('submitButton').addEventListener('click', async () => {
    const userInputValue = userInput.value;
    if (userInputValue.toLowerCase().includes('history')) {
        const response = processUserQuery(userInputValue);
        displayMessage(response, 'bot');
    }
});





