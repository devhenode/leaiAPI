import supabase from './supabase-client.js';

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    return { error: error.message };
  }

  console.log('User signed out');
  return { message: 'User signed out' };
}
