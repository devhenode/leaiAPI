import dotenv from "dotenv";
import express from "express";
import corsMiddleware from "./middleware/cors.js";
import { auth_middleware } from "./auth/auth_middleware.js";
import { user_post } from "./auth/user/user_post.js";

dotenv.config();

const app = express();
app.use(corsMiddleware);
app.use(express.json());

// Add two routes - one with auth and one for testing
app.post('/api/signup', auth_middleware, user_post); // Original route with auth
app.post('/api/signup/test', user_post); // Test route without auth

// Enhanced CORS settings
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // For testing, allow all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/signup/test`);
});