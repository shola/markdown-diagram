import { ReactNode, useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { useAuthStore } from '../../store/useAuthStore';
import { Spinner } from '../ui/Spinner';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialized, loading, user } = useAuthStore();

  // Show loading spinner while auth is initializing
  if (!initialized || loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // If no user is logged in, show auth forms
  if (!user) {
    return <AuthForms />;
  }

  // User is authenticated, show app content
  return <>{children}</>;
}

function AuthForms() {
  const [activeForm, setActiveForm] = useState<'login' | 'signup' | 'reset'>('login');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {activeForm === 'login' && 'Sign in to your account'}
            {activeForm === 'signup' && 'Create your account'}
            {activeForm === 'reset' && 'Reset your password'}
          </h2>
        </div>

        {activeForm === 'login' && (
          <LoginForm onSignUp={() => setActiveForm('signup')} onReset={() => setActiveForm('reset')} />
        )}
        {activeForm === 'signup' && (
          <SignUpForm onLogin={() => setActiveForm('login')} />
        )}
        {activeForm === 'reset' && (
          <ResetPasswordForm onBack={() => setActiveForm('login')} />
        )}
      </div>
    </div>
  );
}