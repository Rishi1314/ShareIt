import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const token = router.query.token;
    if (token && typeof token === 'string') {
      localStorage.setItem('token', token);
      router.push('/dashboard');
    }
  }, [router.isReady, router.query]);

  return <p>Logging you in...</p>;
}
