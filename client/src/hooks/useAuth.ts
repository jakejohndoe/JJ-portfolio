import { useState, useEffect } from 'react';

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function useAuth() {
  const [user, setUser] = useState<{ isAdmin: boolean } | null>(null);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    setUser(await res.json());
  };

  const logout = () => {
    fetch(`${BASE}/api/auth/logout`, { credentials: 'include' });
    setUser(null);
  };

  useEffect(() => {
    fetch(`${BASE}/api/auth/profile`, { credentials: 'include' })
      .then(res => res.json())
      .then(setUser);
  }, []);

  return { user, login, logout };
}
