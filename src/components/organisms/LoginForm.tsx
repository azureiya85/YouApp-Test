'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { loginUser } from '@/actions/authActionsAPI';
import { loginSchema, LoginDTO } from '@/validations/zodSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import PasswordField from '@/components/molecules/PasswordField';
import { useRouter } from 'next/navigation'; 

type LoginFormProps = {
  onSwitch: () => void;
};

export default function LoginForm({ onSwitch }: LoginFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()
  const form = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: { usernameOrEmail: '', password: '' },
  });

  const onSubmit = (data: LoginDTO) => {
    startTransition(async () => {
      const result = await loginUser(data);
      if (result.success) {
        toast.success("Login Successful!", {
          description: "Welcome back!",
        });
        router.push('/dashboard');
      } else {
        toast.error("Login Failed", {
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
            name="usernameOrEmail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter username or email" {...field} />
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
                  <PasswordField placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full cursor-pointer hover:bg-secondary-400" disabled={isPending}>
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm text-white">
        No account?{' '}
        <button
          onClick={onSwitch}
          className="font-semibold text-tertiary-400 underline hover:text-tertiary-300"
        >
          Register Here
        </button>
      </p>
    </div>
  );
}