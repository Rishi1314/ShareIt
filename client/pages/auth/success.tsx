import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    const token = router.query.token;
    if (token && typeof token === 'string') {
      localStorage.setItem('token', token);
      router.push('/dashboard');
    }
  }, [router.query]);

  return <p>Logging you in...</p>;
};

export default AuthSuccess;