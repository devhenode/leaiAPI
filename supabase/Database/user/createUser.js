import supabase from '../../../supabase-client.js';

export const CreateUser = async (userData) => {
    try {
        const { data, error } = await  supabase.from('User').select('*').insert([userData]);

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Encoutering error while Creating User', error.message);
    }
}