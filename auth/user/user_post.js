import { CreateUser } from "../../supabase/Database/user/createUser.js";

export const user_post = async (req, res) => {
    let { name, email } = req.body;
    let user_id = req.id;

    try {
        await CreateUser({user_id, email, name});
        res.status(200).send("User created");
    } catch (error) {
        res.status(400).send(" Failed to Create user")
    }
}