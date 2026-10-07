import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { createToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ message: 'Email and password required' }, { status: 400 });
    }

    const configuredEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const configuredPassword = process.env.ADMIN_PASSWORD;

    if (email.toLowerCase() === configuredEmail && password === configuredPassword) {
      const passwordHash = await bcrypt.hash(configuredPassword, 12);
      const user = await User.findOneAndUpdate(
        { email: configuredEmail },
        {
          email: configuredEmail,
          password: passwordHash,
          role: 'admin',
          name: 'JG Impact Admin',
          isActive: true,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const token = createToken(user._id, user.email, user.role);

      return Response.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
  }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.isActive) {
      return Response.json({ message: 'User account is inactive' }, { status: 401 });
    }

    const token = createToken(user._id, user.email, user.role);

    return Response.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
