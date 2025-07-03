import { useState, useEffect, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  name: string;
  generationsUsed: number;
  maxGenerations: number;
  communicationStyle?: {
    formality: 'casual' | 'professional' | 'formal';
    length: 'short' | 'medium' | 'long';
    tone: 'friendly' | 'neutral' | 'direct';
  };
}

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  guestGenerationsUsed: number;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  incrementGeneration: () => void;
  canGenerate: () => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [guestGenerationsUsed, setGuestGenerationsUsed] = useState(0);

  useEffect(() => {
    // Load from localStorage
    const savedUser = localStorage.getItem('user');
    const savedGuestGenerations = localStorage.getItem('guestGenerationsUsed');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedGuestGenerations) {
      setGuestGenerationsUsed(parseInt(savedGuestGenerations));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      generationsUsed: 0,
      maxGenerations: 3,
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return true;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const id = uuidv4();

    const mockUser: User = {
      id: id,
      email,
      name,
      generationsUsed: 0,
      maxGenerations: 100,
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const incrementGeneration = () => {
    if (user) {
      const updatedUser = { ...user, generationsUsed: user.generationsUsed + 1 };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      const newCount = guestGenerationsUsed + 1;
      setGuestGenerationsUsed(newCount);
      localStorage.setItem('guestGenerationsUsed', newCount.toString());
    }
  };

  const canGenerate = (): boolean => {
    return true;
    /*
    if (user) {
      return user.generationsUsed < user.maxGenerations;
    }
    return guestGenerationsUsed < 10;
    */
  };

  return {
    user,
    isGuest: !user,
    guestGenerationsUsed,
    login,
    register,
    logout,
    incrementGeneration,
    canGenerate,
  };
};