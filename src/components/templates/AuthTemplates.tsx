'use client';

import { useState } from 'react';
import LoginForm from '../organisms/LoginForm';
import RegisterForm from '../organisms/RegisterForm';

export default function AuthTemplate() {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => {
    setIsLoginView((prev) => !prev);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-primary-700 to-primary-900">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-3xl font-bold text-left text-white">
          {isLoginView ? 'Login' : 'Register'}
        </h1>
        {isLoginView ? (
          <LoginForm onSwitch={toggleView} />
        ) : (
          <RegisterForm onSwitch={toggleView} />
        )}
      </div>
    </main>
  );
}