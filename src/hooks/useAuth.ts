// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

export default function useAuth() {
  const [user, setUser] = useState<{ isAdmin: boolean } | null>(null);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include', // Needed for cookies
      body: JSON.stringify({ email, password })
    });
    setUser(await res.json());
  };

  const logout = () => {
    fetch('/api/auth/logout', { credentials: 'include' });
    setUser(null);
  };

  useEffect(() => {
    fetch('/api/auth/profile', { credentials: 'include' })
      .then(res => res.json())
      .then(setUser);
  }, []);

  return { user, login, logout };
}