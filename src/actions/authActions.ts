'use server';

import dbConnect from "@/lib/dbConnect";
import { IUser } from "@/models/Users";
import { loginSchema, LoginDTO, registerSchema, RegisterDTO } from "@/validations/zodSchema";
import { ZodError, ZodIssue } from "zod";
import { MongoServerError } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function registerUser(data: RegisterDTO): Promise<ActionResponse> {
  try {
    // 1. Validate data with Zod
    registerSchema.parse(data);
    
    const db = await dbConnect();
    const usersCollection = db.collection<IUser>('users');

    // 2. Check if user or email already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });

    if (existingUser) {
      return { success: false, error: "User with this email or username already exists." };
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 4. Create new user document
    const newUser: Omit<IUser, '_id'> = {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    
    await usersCollection.insertOne(newUser);

    return { success: true };

  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues.map((e: ZodIssue) => e.message).join(', ') };
    }
    // Handle specific MongoDB duplicate key error
    if (error instanceof MongoServerError && error.code === 11000) {
        return { success: false, error: 'A user with that email or username already exists.' };
    }
    console.error("Registration Error:", error);
    return { success: false, error: "An unexpected error occurred during registration." };
  }
}

export async function loginUser(data: LoginDTO): Promise<ActionResponse> {
  try {
    // 1. Validate data
    loginSchema.parse(data);
    const db = await dbConnect();
    const usersCollection = db.collection<IUser>('users');

    // 2. Find user by email or username
    const user = await usersCollection.findOne({
      $or: [{ email: data.usernameOrEmail }, { username: data.usernameOrEmail }],
    });

    if (!user || !user.password) {
      return { success: false, error: "Invalid credentials." };
    }

    // 3. Compare password
    const isPasswordMatch = await bcrypt.compare(data.password, user.password);
    if (!isPasswordMatch) {
      return { success: false, error: "Invalid credentials." };
    }

    // 4. Create JWT Token
    const token = jwt.sign(
      { userId: user._id.toHexString(), username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    // 5. Set token in a secure, httpOnly cookie
    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return { success: true };

  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues.map((e: ZodIssue) => e.message).join(', ') };
    }
    console.error("Login Error:", error);
    return { success: false, error: "An unexpected error occurred during login." };
  }
}