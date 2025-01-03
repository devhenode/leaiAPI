import supabase from './supabase-client.js';  // Ensure this is properly configured

export async function resetPassword(email) {
  // Check if email is provided
  if (!email) {
    return { error: 'Email is required' };
  }

  try {
    // Send password reset email via Supabase
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password', // Customize the redirect URL as needed
    });

    if (error) {
      console.error('Error sending password reset email:', error.message);
      return { error: error.message };  // Returning the error message
    }

    console.log('Password reset email sent successfully:', data);
    return { message: 'Password reset email sent successfully', data: data };  // Returning success message
  } catch (err) {
    console.error('Unexpected error occurred:', err.message);
    return { error: 'Internal server error' };  // Return a generic error in case of unexpected failure
  }
}
