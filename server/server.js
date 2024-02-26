// console.log("hello world")
// console.log(process.env.AZURE_OPENAI_API_KEY)

import express from 'express';
import { ChatOpenAI } from "@langchain/openai";
import cors from 'cors';

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());

const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
});

// async function Joke() {
//     try {
//         const joke = await model.invoke("Tell me a Javascript joke!");
//         return joke.content;
//     } catch (err) {
//         console.error('there is a fault to get a joke:', err);
//         throw err;
//     }
// }

// Define endpoint for GET joke
// router.get('/joke', async (req, res) => {
//     try {
//         const joke = await Joke();
//         res.json({ joke });
//     } catch (err) {
//         console.error('fault joke', err);
//         res.status(500).send('there is a fault to get a joke');
//     }
// });

// Define endpoint for POST chat messages
router.post('/chatting', async (req, res) => {
    try {
        const { query } = req.body;
        const response = await model.invoke(query);
        res.json({ response });
    } catch (err) {
        console.error('there is a fault to create a chat:', err);
        res.status(500).json({ err: 'there is a fault to create a chat' });
    }
});

// Mount the router at the root level
app.use('/', router);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});