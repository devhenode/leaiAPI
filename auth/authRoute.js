import express from 'express';
import supabase from '../supabase-client.js';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});

// Apply rate limiter to all routes
router.use(limiter);

// Signup route with validation
router.post(
  '/api/signup',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      res.json({ message: 'Signup successful, check your email for confirmation', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Login route
router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password});
      if (error) throw error;
      res.json({ message: 'Login Successful', user});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Reset password route
router.post('/api/verify-reset-password-otp', async (req, res) => {
  const { email, token, new_password } = req.body;
  try {
      // Verify OTP
      const { data, error } = await supabase.auth.verifyOtp({ 
          email, 
          token, 
          type: 'recovery' 
      });
      if (error) throw error;

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
          password: new_password
      });
      if (updateError) throw updateError;

      res.json({ message: 'Password reset successful' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});
  
export default router;