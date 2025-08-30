'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';
import { profileSchema, ProfileDTO } from '@/validations/zodProfileSchema';
import { ZodError } from 'zod';

const API_BASE_URL = process.env.API_BASE_URL;

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function getProfile() {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return null; 
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/getProfile`, {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    });

    if (response.status === 404) {
      return null; // No profile exists for this user yet
    }
    
    if (!response.ok) {
      console.error("Failed to fetch profile:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data; 
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

// This function will be called from a form
export async function createOrUpdateProfile(
  data: ProfileDTO, 
  isCreating: boolean
): Promise<ActionResponse> {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return { success: false, error: 'Authentication token not found.' };
  }

  try {
    const validatedData = profileSchema.parse(data);

    const apiPayload = {
      name: validatedData.name,
      birthday: format(validatedData.birthday, 'yyyy-MM-dd'), // Format date for API
      height: validatedData.height,
      weight: validatedData.weight,
      interests: validatedData.interests || [],
    };
    
    const url = isCreating 
        ? `${API_BASE_URL}/api/createProfile`
        : `${API_BASE_URL}/api/updateProfile`;
        
    const method = isCreating ? 'POST' : 'PUT';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to save profile.' };
    }

    revalidatePath('/dashboard'); 
    return { success: true };

  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues.map((e) => e.message).join(', ') };
    }
    console.error("Profile Action Error:", error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}