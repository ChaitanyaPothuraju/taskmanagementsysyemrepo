import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import SocialLoginButton from '../components/auth/SocialLoginButton';
import { CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login, error, isLoading } = useAuthStore();
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleSocialLogin = async (response: any, provider: 'google' | 'facebook') => {
    try {
      await login(response, provider);
      setSuccess(`Logged in successfully with ${provider}`);
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* App Logo and Header */}
          <div className="p-6 pb-0 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-primary-600"
              >
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to TaskFlow</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage your tasks efficiently
            </p>
          </div>
          
          {/* Login Forms */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{success}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <SocialLoginButton
                provider="google"
                onSuccess={(response) => handleSocialLogin(response, 'google')}
                onError={(error) => console.error('Google login error:', error)}
              />
              
              <SocialLoginButton
                provider="facebook"
                onSuccess={(response) => handleSocialLogin(response, 'facebook')}
                onError={(error) => console.error('Facebook login error:', error)}
              />
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-sm text-gray-500">Demo Mode</span>
                </div>
              </div>
              
              <button
                onClick={() => handleSocialLogin(
                  {
                    credential: 'mock-demo-jwt-token',
                    // In real implementation this would be a proper JWT
                  },
                  'google'
                )}
                className="btn btn-accent w-full"
              >
                Continue with Demo Account
              </button>
            </div>
            
            <p className="mt-6 text-center text-xs text-gray-600">
              By continuing, you agree to TaskFlow's Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}