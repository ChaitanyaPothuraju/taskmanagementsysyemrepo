import { useState } from 'react';
import { Facebook, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SocialLoginButtonProps {
  provider: 'google' | 'facebook';
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export default function SocialLoginButton({
  provider,
  onSuccess,
  onError,
}: SocialLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      try {
        if (provider === 'google') {
          onSuccess({ credential: 'mock-google-jwt-token' });
        } else {
          onSuccess({
            userID: 'fb-user-123',
            name: 'Jane Doe',
            email: 'jane@example.com',
            picture: {
              data: {
                url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
              },
            },
            accessToken: 'mock-facebook-access-token',
          });
        }
      } catch (err) {
        onError(err);
      }
    }, 1500);
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={isLoading}
      className={cn(
        'btn flex w-full items-center justify-center gap-2 py-2.5',
        provider === 'google'
          ? 'btn-secondary'
          : 'bg-[#1877F2] text-white hover:bg-[#0E67E3]',
        isLoading && 'opacity-70 cursor-not-allowed'
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : provider === 'google' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
          />
        </svg>
      ) : (
        <Facebook className="h-5 w-5" />
      )}
      <span>Continue with {provider === 'google' ? 'Google' : 'Facebook'}</span>
    </button>
  );
}
