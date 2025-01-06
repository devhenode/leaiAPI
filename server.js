import express from 'express'
import  authRoute from './auth/authRoute.js';
import dotenv from 'dotenv'
import chat from './auth/chat.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoute);
app.use('/auth', chat)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
