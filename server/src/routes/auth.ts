import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Mock user database (for demonstration purposes only)
const mockUsers = [
  {
    id: '1',
    username: 'operator1',
    password: 'password123', // In production, use proper password hashing
    role: 'operator',
    substation: 'Substation A'
  },
  {
    id: '2',
    username: 'admin1',
    password: 'admin123',
    role: 'admin',
    substation: 'All'
  }
];

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    throw new AppError('Username and password are required', 400);
  }

  // Find user
  const user = mockUsers.find(u => u.username === username && u.password === password);
  
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user.id,
      role: user.role,
      substation: user.substation
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      substation: user.substation
    }
  });
});

// Verify token endpoint
router.post('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError('No token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
});

export default router; 