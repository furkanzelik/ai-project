
![image](https://github.com/furkanzelik/ai-project/assets/113936184/01aea029-3cd0-4977-a84d-a6ffecab4056)

Deze chatbot kan je helpen bij het plannen van je volgende vakantie. Je kunt de chatbot vragen stellen over bestemmingen, activiteiten, accommodaties en meer. De chatbot zal je helpen bij het vinden van de perfecte vakantie die past bij jouw interesses en budget.

Hoe te gebruiken:

Open de chatbot in je favoriete messaging-app.
Stel de chatbot een vraag over je vakantie.
De chatbot zal je een antwoord geven en je mogelijk extra vragen stellen om je behoeften beter te begrijpen.
Ga door met het gesprek totdat je alle informatie hebt die je nodig hebt om je vakantie te plannen.

<h1>Installatie OpenAI</h1>

Deze README legt stap voor stap uit hoe je OpenAI kunt installeren en gebruiken.

Vereisten:

<lu>
    <li>Node.js</li>
    <li>NPM</li>
</lu>

<h2>Stappen:</h2>

<lu>
    <li>Ga naar de map server.</li>
    <li>Voer het volgende commando uit om een nieuw NPM-project te initialiseren:</li>
    <li>npm init</li>
    <li>Installeer de benodigde modules met de volgende commando's:</li>
    <li>npm install</li>
    <li>npm install langchain</li>
    <li>npm install @langchain/openai</li>
    Voeg de volgende regel toe aan je package.json-bestand in de sectie "scripts":
    <li>"dev": "node --env-file=.env --watch server.js"</li>
    <li>Maak een nieuw bestand met de naam .env in de map server.</li>
    <li>Open het .env-bestand en voeg je OpenAI-sleutel toe op de volgende regel:</li>
    <li>OPENAI_API_KEY</li>
    <li>Start de server met het volgende commando:</li>
    <li>cd server</li>
    <li>npm run dev</li>

Open het HTML-bestand in je browser.
</lu>
