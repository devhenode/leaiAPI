import { supabaseAuthMiddleware } from "../supabase/supabaseAuthMiddleware.js";

export const auth_middleware = async (req, res, next) => {
    try {
        await supabaseAuthMiddleware(req, res, next);
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: "Authentication failed" });
    }
}