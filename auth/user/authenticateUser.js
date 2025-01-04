import { supabase } from "../../supabase-client.js";

export const AuthenticateUser = async ({ email, password }) => {
    try {
        console.log("Searching for user with email:", email);
        
        const { data: user, error } = await supabase
            .from('User')
            .select("id, email, password")
            .eq("email", email)
            .single();

        console.log("Database response:", { user, error });

        if (error || !user) {
            console.log("No user found or database error");
            return null;
        }

        // Check if the provided password matches
        const isPasswordCorrect = user.password === password;
        console.log("Password match:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            console.log("Password mismatch");
            return null;
        }

        return {
            id: user.id,
            email: user.email,
        };
    } catch (error) {
        console.error("Error authenticating user:", error);
        throw new Error("Failed to authenticate user");
    }
};