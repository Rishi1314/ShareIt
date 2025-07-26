import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ComponentType } from 'react';

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function AuthGuard(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/');
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen text-white">
          <p className="animate-pulse text-lg">⏳ Loading...</p>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex justify-center items-center h-screen text-white">
          <p className="animate-pulse text-lg">🔐 Redirecting to login...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
