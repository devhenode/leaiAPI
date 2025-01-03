import { supabase } from '../supabase-client.js';  // Note the ../../ to go up two levels 

export const supabaseAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            console.error("Failed to get Supabase auth user:", error);
            return res.status(401).json({ error: "Unauthorized" });
        }

        req.id = user.id;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ error: "Authentication failed" });
    }
}