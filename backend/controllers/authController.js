import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// ─── Helper: sanitise user object sent back to client ─────────────────────────
const sanitiseUser = (user, token) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  profileImage: user.profileImage,
  bio: user.bio,
  createdAt: user.createdAt,
  token,
});

// ─── POST /api/auth/register ───────────────────────────────────────────────────
export const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validate required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check for existing email
    const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (emailExists) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Check for existing username
    const usernameExists = await User.findOne({ username: username.toLowerCase().trim() });
    if (usernameExists) {
      return res.status(409).json({ message: 'That username is already taken.' });
    }

    // Create user (password will be hashed by the pre-save hook in the model)
    const user = await User.create({ name, username, email, password });

    const token = generateToken(user._id);

    return res.status(201).json(sanitiseUser(user, token));
  } catch (error) {
    // Handle Mongoose validation errors gracefully
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }

    console.error('Register error:', error.message);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/username and password are required.' });
    }

    const input = identifier.trim().toLowerCase();

    // Allow login via email or username
    const user = await User.findOne({
      $or: [{ email: input }, { username: input }],
    }).select('+password'); // Must explicitly request password (select: false in schema)

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id);

    return res.status(200).json(sanitiseUser(user, token));
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new passwords are required.' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) return res.status(401).json({ message: 'Current password is incorrect.' });
    user.password = newPassword;
    await user.save();
    return res.json({ message: 'Password updated successfully.' });
  } catch {
    return res.status(500).json({ message: 'Unable to update password. Please try again.' });
  }
};
