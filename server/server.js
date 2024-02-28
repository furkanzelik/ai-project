
import express from 'express';
import { ChatOpenAI } from "@langchain/openai";
import cors from 'cors';

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());
app.use('/', router);

const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
});


// Define endpoint for POST chat messages
router.post('/chatting', async(req, res) =>{
    try{
        const {query} = req.body;
        console.log("Received query:", query); // Log received query for debugging
        const response = await model.invoke(query);
        res.json({response})
    }
    catch(error){
        console.error("Error processing chat query:", error); // Log error for debugging
        res.status(500).json({ error: "Error processing chat query"});
    }
})




// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});