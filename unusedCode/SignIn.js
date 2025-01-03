import supabase from './supabase-client.js';

export async function signIn(email, password) {
  const { user, session, error } = await supabase.auth.signIn({
    email: email,
    password: password
  });

  if (error) {
    console.error('Error signing in:', error);
    return { error: error.message };
  }

  console.log('User signed in:', user);
  return { user: user, session: session };
}
