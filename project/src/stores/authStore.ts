import { create } from 'zustand';
import { User } from '../types';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  name: string;
  email: string;
  picture: string;
  sub: string;
  exp: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (response: any, provider: 'google' | 'facebook') => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (response, provider) => {
    set({ isLoading: true, error: null });
    
    try {
      let user: User;
      
      if (provider === 'google') {
        const credential = response.credential;
        const decoded = jwtDecode<JwtPayload>(credential);
        
        user = {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture
        };
        
        localStorage.setItem('auth_token', credential);
      } else if (provider === 'facebook') {
        // Simplified Facebook login handling
        user = {
          id: response.userID,
          name: response.name,
          email: response.email,
          picture: response.picture?.data?.url || ''
        };
        
        localStorage.setItem('auth_token', response.accessToken);
      } else {
        throw new Error('Unsupported auth provider');
      }
      
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Login error:', error);
      set({ 
        error: 'Authentication failed. Please try again.', 
        isLoading: false 
      });
    }
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('auth_token');
    const userString = localStorage.getItem('user');
    
    if (token && userString) {
      try {
        const user = JSON.parse(userString) as User;
        set({ user, isAuthenticated: true });
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
      }
    }
  },
}));