const userInput = document.getElementById('field');
const chatDiv = document.getElementById('content');
const messageDiv = document.createElement('div');



document.getElementById('submitButton').addEventListener('click', async ()=> {
    //retrieve user input
    userInput.value

    //show the user question in the chat
    displayMessage(userInput.value, 'user');


    try{
        // question to server (PRG06)
        const response = await fetch('http://127.0.0.1:8080/chatting', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({query: userInput})
        });
        if (!response.ok){
            throw new Error('cannot fetch from server');
        }

        // get data from the server
        const data = await response.json();
        const chatResponse = data.response;

        //display message of the chatbot
        displayMessage (chatResponse, 'bot');
    }catch (error){
        console.log('Error:', error);
    }
});


// display message function

    function displayMessage(message, sender) {

        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageDiv.textContent = message;
        chatDiv.appendChild(messageDiv);

    }



