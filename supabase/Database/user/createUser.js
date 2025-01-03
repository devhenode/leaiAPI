import {supabase} from '../../../supabase-client.js';

export const CreateUser = async (userData) => {
    try {
        const { data, error } = await supabase
            .from('User')
            .insert([userData])
            .select(); // Add select() to return the inserted data

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error; // Re-throw the error to handle it in the route
    }
}