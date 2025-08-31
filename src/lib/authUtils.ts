import 'server-only'; 
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

interface UserPayload {
  id: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export async function getSession(): Promise<{ user: UserPayload } | null> {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify<UserPayload>(token, secret);
    
    return { user: payload };

  } catch (error) {
    console.error("Failed to verify token:", error);
    return null;
  }
}