import express from 'express';
import { signUp } from '../SignUp.js';
import { signIn } from '../SignIn.js';
import { resetPassword } from '../resetPassword.js';
import { signOut } from '../SignOut.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const result = await signUp(name, email, password);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result);
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const result = await signIn(email, password);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result);
});

router.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  const result = await resetPassword(email);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result);
});

router.post('/signout', async (req, res) => {
  const result = await signOut();
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result);
});

export default router;