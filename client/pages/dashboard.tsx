import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
  }, [user]);

return user === null ? <p>Checking login status...</p> : <h1>Welcome, {user.email}</h1>;}