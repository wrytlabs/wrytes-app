import { useRouter } from 'next/router';

export function useActiveNavigation() {
  const router = useRouter();
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return router.pathname === '/dashboard';
    }
    return router.pathname.startsWith(path);
  };
  
  return { isActive };
} 