import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export function withAuth<P>(Component: React.ComponentType<P>) {
  return function AuthGuard(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) return () => { null };
      if (!user) {
        router.push('/');
      }
    }, [user]);

    if (!user) return null;

    return <Component {...props} />;
  };
}
