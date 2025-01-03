import supabase from './supabase-client.js';

export async function signUp(name, email, password) {
  const { user, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    console.error('Error signing up:', error);
    return { error: error.message };
  }

  // Store additional user information in a separate table
  const { data, error: insertError } = await supabase
    .from('profiles')
    .insert([{ id: user.id, name: name, email: email }]);

  if (insertError) {
    console.error('Error storing user information:', insertError);
    return { error: insertError.message };
  }

  console.log('User signed up:', user);
  return { user: user, profile: data };
}

// signUp(name, email, password);