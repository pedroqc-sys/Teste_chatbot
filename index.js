const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

// Pega a chave de forma segura a partir das variáveis de ambiente do servidor
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.post('/webhook', async (req, res) => {
    const userMessage = req.body.queryResult.queryText;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(userMessage);
        const geminiResponse = result.response.text();

        res.json({
            fulfillmentText: geminiResponse
        });

    } catch (error) {
        console.error("Erro ao chamar o Gemini:", error);
        res.json({
            fulfillmentText: "Desculpe, ocorreu um erro técnico. Tente novamente mais tarde."
        });
    }
});

// O Render define a porta automaticamente através de process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor a rodar com sucesso.`);
});
