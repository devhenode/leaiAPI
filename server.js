import express from 'express'
import  authRoute from './auth/authRoute.js';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
