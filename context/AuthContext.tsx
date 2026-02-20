import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '../types';
import apiFetch from '../api/axios';

interface AuthContextType extends AuthState {
  login: (identifier: string, password: string) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  initializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeRole = (role: string): UserRole => {
  if (!role) return UserRole.STUDENT;

  const r = role.replace('ROLE_', '').toUpperCase();

  if (r === 'ADMIN') return UserRole.ADMIN;
  if (r === 'HR') return UserRole.HR;
  if (r === 'TRAINER') return UserRole.TRAINER;

  return UserRole.STUDENT;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
  });

  const [initializing, setInitializing] = useState(true);

  // 🔥 Restore session on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      setAuth({
        user: JSON.parse(savedUser),
        token: savedToken,
        isAuthenticated: true,
      });
    }

    setInitializing(false);
  }, []);

  const login = async (identifier: string, password: string): Promise<User> => {
    try {
      const response = await apiFetch.post('/auth/login', {
        identifier,
        password,
      });

      const data = response.data;

      /*
        Expected backend response:
        {
          id,
          firstName,
          username,
          role,
          token
        }
      */

      if (!data?.token) {
        throw new Error("Token not received from server");
      }

      const role = normalizeRole(data.role || 'STUDENT');

      const user: User = {
        id: data.id || data.username,
        firstName: data.firstName,
        name: data.firstName,
        email: data.username,
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          data.firstName || 'User'
        )}&background=001a33&color=fff`,
        status: 'online',
        performance: 100,
      };

      // ✅ Save to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));

      // ✅ Update state
      setAuth({
        user,
        token: data.token,
        isAuthenticated: true,
      });

      return user;

    } catch (error: any) {
      console.error('Login Error:', error.response?.data || error.message);

      throw new Error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Invalid credentials'
      );
    }
  };

  const register = async (regData: any) => {
    try {
      await apiFetch.post('/auth/register', regData);
    } catch (error: any) {
      console.error('Registration Error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Registration failed'
      );
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, register, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
