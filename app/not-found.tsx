import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-blue bg-grid-pattern p-4">
      <div className="px-8 py-12 bg-white/90 border-4 border-blue-600 shadow-glow max-w-md w-full text-center">
        <h1 className="text-5xl font-bold font-pressStart mb-6 text-blue-600">404</h1>
        
        <h2 className="text-2xl font-bold font-vt323 mb-4">PAGE NOT FOUND</h2>
        
        <p className="mb-8 font-vt323 text-lg">
          The page you're looking for might have been moved or deleted.
        </p>
        
        <Link href="/login" passHref>
          <Button className="w-full">
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
