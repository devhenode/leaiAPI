import dotenv from "dotenv";
import express from "express";
import corsMiddleware from "./middleware/cors.js";
import { user_post } from "./auth/user/user_post.js";

// import chatRoutes from "./routes/chat.js";
// import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(corsMiddleware); // Use the cors middleware
app.use(express.json()); // Parse JSON bod

// app.use(chatRoutes)
// app.use(authRoutes)
app.use(user_post)

// app.post('/api/signup', async (req, res) => {
//   const { name, email, password } = req.body;
//   const result = await signUp(name, email, password);
//   if (result.error) {
//     return res.status(400).json({ error: result.error });
//   }
//   res.status(200).json(result);
// });

// Handle preflight requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL); // Replace with your frontend URL
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Specify allowed methods
    res.header('Access-Control-Allow-Headers', 'Content-Type'); // Specify allowed headers
    res.sendStatus(204); // No content
});

const PORT = process.env.PORT || 3000; // Set the port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
