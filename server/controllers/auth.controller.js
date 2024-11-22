import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { logger } from '../utils/logger.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    const userResponse = {
      id: user.id,
      username: user.username,
      role: user.role,
      placeId: user.place_id
    };

    res.json({ token, user: userResponse });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const validateToken = async (req, res) => {
  res.json({ user: req.user });
};