import express from 'express'
import  authRoute from './auth/authRoute.js';
import dotenv from 'dotenv';
import chat from './auth/chat.js';
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const corsOptions = {
    origin: [
        "http://localhost:5173/",
        'https://leai-eight.vercel.app/', // Add your Vercel domain
        'https://leaiapi.onrender.com/'    // Add your Render domain
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions))

app.use(express.json());

app.use('/auth', authRoute);
app.use('/auth', chat)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
