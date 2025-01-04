import { AuthenticateUser } from "./authenticateUser.js";

export const user_login = async (req, res) => {
    console.log('Starting login process');
    const { id, email, password } = req.body;
    
    console.log('Credentials received:', { email, password });

    if (!email || !password) {
        console.log('Missing credentials');
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        console.log('Attempting authentication');
        const user = await AuthenticateUser({ id, email, password });
        console.log('Authentication result:', user);

        if (!user) {
            console.log('Authentication failed');
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log('Login successful');
        res.status(200).json({ 
            message: "Login successful",
            data: user 
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ 
            error: "Login failed",
            details: error.message 
        });
    }
};