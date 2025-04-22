// src/components/AdminLink.tsx
import { useAuth } from '../hooks/useAuth';
import { Link } from 'wouter';

export default function AdminLink() {
  const { user } = useAuth();
  
  if (!user?.isAdmin) return null;
  
  return (
    <Link href="/admin" className="fixed bottom-4 right-4 p-2 bg-gray-800 rounded-lg">
      Admin Panel
    </Link>
  );
}