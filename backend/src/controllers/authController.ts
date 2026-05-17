import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { validationResult } from 'express-validator';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role || 'Sales User'
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const payload = {
      id: user._id,
      role: user.role
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '15m'
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '7d'
    });

    res.status(200).json({ token: accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(401).json({ message: 'No refresh token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as any;
    
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const payload = {
      id: user._id,
      role: user.role
    };

    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '15m'
    });

    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};
