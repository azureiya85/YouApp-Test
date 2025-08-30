'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { toast } from 'sonner'; 
import { registerUser } from '@/actions/authActionsAPI';
import { registerSchema, RegisterDTO } from '@/validations/zodSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import PasswordField from '@/components/molecules/PasswordField';

type RegisterFormProps = {
  onSwitch: () => void;
};

export default function RegisterForm({ onSwitch }: RegisterFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<RegisterDTO>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', username: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (data: RegisterDTO) => {
    startTransition(async () => {
      const result = await registerUser(data);
      if (result.success) {
        toast.success("Registration Successful!", {
          description: "You can now log in with your new account.",
        });
        onSwitch(); // Switch to login view
      } else {
        toast.error("Registration Failed", {
          description: result.error || "An unknown error occurred.",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Create Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordField placeholder="Create Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordField placeholder="Confirm Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full hover:bg-secondary-400" disabled={isPending}>
            {isPending ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm text-white">
        Already have an account?{' '}
        <button
          onClick={onSwitch}
          className="font-semibold text-tertiary-400 underline hover:text-tertiary-300"
        >
          Login Here
        </button>
      </p>
    </div>
  );
}