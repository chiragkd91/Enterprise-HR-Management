/**
 * Authentication Context - Simplified version to fix React error #31
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * User interface definition
 */
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

/**
 * Authentication context value interface
 */
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Authentication Provider Component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('globalcyber_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('globalcyber_user');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login function
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo credentials - Admin
      if (email === 'admin@globalcyberit.com' && password === 'admin123') {
        const newUser: User = {
          id: '1',
          name: 'Admin User',
          email: email,
          role: 'Administrator'
        };
        
        setUser(newUser);
        localStorage.setItem('globalcyber_user', JSON.stringify(newUser));
        setLoading(false);
        return true;
      }
      
      // Demo credentials - Employee: Alice Cooper
      if (email === 'alice.cooper@globalcyberit.com' && password === 'alice123') {
        const newUser: User = {
          id: 'EMP001',
          name: 'Alice Cooper',
          email: email,
          role: 'Employee'
        };
        
        setUser(newUser);
        localStorage.setItem('globalcyber_user', JSON.stringify(newUser));
        setLoading(false);
        return true;
      }
      
      // Demo credentials - Manager: John Smith
      if (email === 'john.smith@globalcyberit.com' && password === 'john123') {
        const newUser: User = {
          id: 'EMP002',
          name: 'John Smith',
          email: email,
          role: 'Manager'
        };
        
        setUser(newUser);
        localStorage.setItem('globalcyber_user', JSON.stringify(newUser));
        setLoading(false);
        return true;
      }
      
      // Demo credentials - HR: Sarah Wilson
      if (email === 'sarah.wilson@globalcyberit.com' && password === 'sarah123') {
        const newUser: User = {
          id: 'EMP003',
          name: 'Sarah Wilson',
          email: email,
          role: 'HR'
        };
        
        setUser(newUser);
        localStorage.setItem('globalcyber_user', JSON.stringify(newUser));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('globalcyber_user');
  };

  const contextValue: AuthContextValue = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
