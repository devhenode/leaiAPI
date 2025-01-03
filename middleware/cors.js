import cors from "cors"; // Import cors

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
};

export default cors(corsOptions);