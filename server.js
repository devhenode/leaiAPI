import express from 'express';
import authRoute from './auth/authRoute.js';
import dotenv from 'dotenv';
import chat from './auth/chat.js';
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: [
        "http://localhost:5173",
        'https://leai-full.vercel.app',
        'https://leaiapi.onrender.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Security middleware (recommended)
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by'); // Hide Express

// Routes
app.use('/auth', authRoute);
app.use('/auth', chat);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Start server with error handling
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});