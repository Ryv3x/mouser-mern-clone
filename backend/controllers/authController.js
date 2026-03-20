import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { generateVerificationTokenWithExpiry } from '../utils/tokenUtils.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../utils/emailService.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const { token, expiresAt } = generateVerificationTokenWithExpiry();
  const user = await User.create({
    name,
    email,
    password,
    emailVerificationToken: token,
    emailVerificationExpires: expiresAt,
  });

  if (user) {
    // Send verification email
    const emailSent = await sendVerificationEmail(user.email, token, user.name);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Registration successful! ' +
        (emailSent ? 'Please check your email to verify your account.' : 'Failed to send verification email. Contact support.'),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    res.json({
      message: 'Email verified successfully! You can now log in.',
      redirect: '/login',
    });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ message: 'Failed to verify email: ' + err.message });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new token
    const { token, expiresAt } = generateVerificationTokenWithExpiry();
    user.emailVerificationToken = token;
    user.emailVerificationExpires = expiresAt;
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, token, user.name);

    res.json({ message: 'Verification email sent! Check your inbox.' });
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({ message: 'Failed to resend verification email: ' + err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.log('Login failed: user not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.banned) {
      console.log('Login blocked: user banned', user.email);
      return res.status(403).json({ message: `Account banned: ${user.banReason || 'No reason provided'}` });
    }

    const passwordMatch = await user.matchPassword(password);
    if (!passwordMatch) {
      console.log('Login failed: incorrect password for', user.email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Allow certain trusted emails to bypass email verification
    const verificationBypass = ['admin@mouser.com', 'seller@mouser.com'];
    if (!user.emailVerified && !verificationBypass.includes(email)) {
      console.log('Login blocked: email not verified for', user.email);
      return res.status(400).json({
        message: 'Please verify your email before logging in',
        emailNotVerified: true,
        email: user.email,
      });
    }

    const token = generateToken(user._id);
    console.log('Login successful for', user.email);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error('Login error:', err && err.message ? err.message : err);
    return res.status(500).json({ message: 'Login failed: ' + (err.message || err) });
  }
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
