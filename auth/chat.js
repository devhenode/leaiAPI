import  supabase from '../supabase-client.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis"
import { body, validationResult } from 'express-validator';
import express from "express"; // Import express
import rateLimit from "express-rate-limit"

const router = express.Router(); // define a router instead of app
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
})

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many request try again later "}
});

router.use("/api/chat", limiter);

const config = {
    temperature: 0.7,
    maxOutputTokens: 500,
    topK: 40,
    topP: 0.95
}

async function saveChatMessage(user_id, prompt, response) {
    try {
        const {data, error } = await supabse
            .from("chat_history")
            .insert([
                {
                    user_id: user_id,
                    prompt: prompt,
                    response: response,
                    timestamp: new Date().toISOString()
                }
            ]);
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error saving to supabse:", error);
        throw error;
    }

}

async function getChatHistory(user_id, limit = 10) {
    try {
        const { data, error } = await supabase
            .from("chat_history")
            .select("*")
            .eq("user_id", user_id)
            .order("timestamp", { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching from supabase: ", error);
        throw error;
    }
}


router.post('/api/video', [
    body('prompt').trim().notEmpty().withMessage('Prompt cannot be empty'),
], async (req, res) => {
    const { prompt } = req.body;

    try {
        // Using gemini to generate video for user
        const result = await model.generateContent(
            `Generate 2-3 relevant Youtube search terms for: ${prompt}`
        );
        const searchTerms = result.response.text();

        // Youtube search
        const response = await youtube.search.list({
            part: 'snippet',
            q: searchTerms,
            maxResults: 5,
            type: 'video'
        });

        const video = response.data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium,
            channelTitle: item.snippet.channelTitle,
            description: item.snippet.description
        }));

        res.json({
            success: true,
            video,
            searchTerms,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        })
    }
})


router.post("/api/chat", [
    body('prompt').trim().notEmpty().withMessage('Prompt cannot be empty'),
    body('userId').optional().isString().withMessage('Invalid user ID')
], async (req, res) => { 
    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        }); 
    }

    const { prompt, user_id } = req.body; 

    try {
        // Initialize chat with history if user ID provided
        const userHistory = user_id ? await getChatHistory(user_id) : [];

        const chat = model.startChat({
            history: userHistory,
            generationConfig: config
        });

    
        const result = await chat.sendMessage(prompt);
        // console.log("full result: ", result)
        const text = result.response.text();
        if (user_id) {
            await saveChatMessage(user_id, prompt, text);
        }
        const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
        
        console.log("Generated text: ", text);
        res.json({        
            success: true,
            generatedPrompt: cleanText,
            timestamp: new Date().toISOString(),
            messageId: crypto.randomUUID()
        }); // Send response back to frontend
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ 
            success: false,
            error: "An error occurred while processing your request.",
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// check AI health
router.get("/api/chat/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString()
    });
});

// get chat History: for users
router.get("/api/chat/history/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const history = await getChatHistory(user_id);
        res.json({
            success: true,
            history,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch chat history",
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

router.delete("/api/chat/history/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const { error } = await supabase
            .from('chat_history')
            .delete()
            .eq('user_id', user_id);

        if (error) throw error;

        res.json({
            success: true,
            message: "Chat History Deleted",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to delete chat history",
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
export default router; // Exporting the router;
