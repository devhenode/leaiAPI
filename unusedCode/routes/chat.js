import { GoogleGenerativeAI } from "@google/generative-ai";
import { body, validationResult } from 'express-validator';
import express, { response } from "express"; // Import express

const router = express.Router(); // define a router instead of app
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

router.post("/api/chat", async (req, res) => { // Endpoint to handle chat requests
    // res.json({response: "Hello world"})
    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return errors if validation fails
    }

    const { prompt } = req.body; // Get message from request body
    const chat = model.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 500,
        },
    });

    try {
        const result = await chat.sendMessage(prompt);
        // console.log("full result: ", result)
        const text = result.response.text();
        // const text = await response.text();
        console.log("Generated text: ", text);
        res.json({ generatedPrompt: text }); // Send response back to frontend
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

export default router; // Exporting the router