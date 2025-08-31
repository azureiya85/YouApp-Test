'use server';

import { loginSchema, LoginDTO, registerSchema, RegisterDTO } from "@/validations/zodSchema";
import { ZodError } from "zod";
import { cookies } from 'next/headers';

type ActionResponse = {
  success: boolean;
  error?: string;
};

const API_BASE_URL = process.env.API_BASE_URL;

export async function registerUser(data: RegisterDTO): Promise<ActionResponse> {
  try {
    // 1. Validate incoming data against our schema
    const validatedData = registerSchema.parse(data);

    // 2. Prepare the payload for the external API (excluding confirmPassword)
    const apiPayload = {
      email: validatedData.email,
      username: validatedData.username,
      password: validatedData.password,
    };

    // 3. Call the external API with timeout and better error handling
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiPayload),
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    // 4. Handle non-successful responses
    if (!response.ok) {
      let errorMessage = 'Registration failed.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      return { success: false, error: errorMessage };
    }

    // 5. Handle successful registration
    return { success: true };

  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues.map((e) => e.message).join(', ') };
    }
    
    // Handle timeout and network errors
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('ETIMEDOUT')) {
        return { success: false, error: 'Request timeout. Please check your connection and try again.' };
      }
      if (error.message.includes('fetch failed')) {
        return { success: false, error: 'Network error. Please check your connection and try again.' };
      }
    }
    
    console.error("Registration Action Error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function loginUser(data: LoginDTO): Promise<ActionResponse> {
  try {
    // 1. Validate incoming data
    const validatedData = loginSchema.parse(data);

    // 2. Determine if the input is an email or a username
    const isEmail = /.+@.+\..+/.test(validatedData.usernameOrEmail);

    // 3. Prepare the payload 
    const apiPayload = {
      email: isEmail ? validatedData.usernameOrEmail : "",
      username: !isEmail ? validatedData.usernameOrEmail : "",
      password: validatedData.password,
    };

    console.log('Login payload:', apiPayload); // Debug log

    // 4. Call the external login API
    const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
        signal: AbortSignal.timeout(15000),
    });

    // 5. Handle non-successful responses
    if (!response.ok) {
      let errorMessage = 'Invalid credentials.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error('Failed to parse login error response:', e);
      }
      return { success: false, error: errorMessage };
    }

    // 6. Handle successful login
    const responseData = await response.json();

    const token = responseData.token || responseData.access_token;

    if (!token) {
        console.error("Login successful, but no token found in API response:", responseData);
        return { success: false, error: "Login failed: could not retrieve session token." };
    }
    
    // 7. Set the received token in a secure, httpOnly cookie
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
      return { success: false, error: error.issues.map((e) => e.message).join(', ') };
    }
    
    // Handle timeout and network errors
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('ETIMEDOUT')) {
        return { success: false, error: 'Request timeout. Please check your connection and try again.' };
      }
      if (error.message.includes('fetch failed')) {
        return { success: false, error: 'Network error. Please check your connection and try again.' };
      }
    }
    
    console.error("Login Action Error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

// Logout
export async function logoutUser(): Promise<ActionResponse> {
  try {
    (await cookies()).delete('token');
    return { success: true };
  } catch (error) {
    console.error("Logout Error:", error);
    return { success: false, error: "Failed to logout." };
  }
}