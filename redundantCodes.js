
// router.post('/api/reset-password', async (req, res) => {
//   const { email } = req.body;
//   try {
//     const { data, error } = await supabase.auth.resetPasswordForEmail(email);
//     if  (error) throw error;
//       res.json({ message: 'Password reset sent to your email'});
//     } catch (error) {
//       res.status(400).json({ error: error.message });
      
//   }
// });

// router.post('/api/signup-otp', async (req, res) => {
//     const {email, password } = req.body;
//     try {
//         const {data, error } = await supabase.auth.signUp({
//             email,
//             password,
//             options: {
//               signInWithOtp: true
//             }
//         });
//         if (error) throw error;
//         res.json({ message: 'OTP sent signup, Check your mail'})
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// })

// router.post('/api/verify-signup-otp', async (req, res) => {
//     const { email, token } = req.body;
//     try {
//       const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
//       if (error) throw error;
//       res.json({ message: 'Signup successful', user: data.user });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
// });
  
  // Get OTP for password reset
// router.post('/api/reset-password-otp', async (req, res) => {
//     const { email } = req.body;
//     try {
//       const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: 'http://example.com/account/update-password',
//       });
//       if (error) throw error;
//       res.json({ message: 'OTP sent for password reset. Check your email.' });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
// });
  
  // Verify OTP for password reset
// router.post('/api/verify-reset-password-otp', async (req, res) => {
//     const { email, token, new_password } = req.body;
//     try {
//       const { data, error } = await supabase.auth.verifyOtp({ 
//         email, 
//         token, 
//         type: 'recovery' 
//       });
//       if (error) throw error;
      
//       // Update the password
//       const { data: updateData, error: updateError } = await supabase.auth.updateUser({
//         password: new_password
//       });
//       if (updateError) throw updateError;
  
//       res.json({ message: 'Password reset successful' });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
// });