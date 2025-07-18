import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export default function AuthSuccess() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    if (!router.isReady) return;

    const token = router.query.token;
    if (token && typeof token === 'string') {
      localStorage.setItem('token', token);
      login(token); // 🔥 Force update AuthContext immediately
      router.push('/dashboard');
    }
  }, [router.isReady, router.query]);

  return <p className="text-center mt-20 text-lg">Logging you in...</p>;
}
