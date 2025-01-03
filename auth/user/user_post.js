import { CreateUser } from "../../supabase/Database/user/createUser.js";

export const user_post = async (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    try {
        const result = await CreateUser({ name, email });
        if (!result) {
            return res.status(500).json({ error: "Failed to create user" });
        }
        res.status(200).json({ 
            message: "User created successfully",
            data: result 
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ 
            error: "Failed to create user",
            details: error.message 
        });
    }
};