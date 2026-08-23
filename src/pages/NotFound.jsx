import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-50 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-white">
        <Compass size={24} />
      </span>
      <h1 className="mt-6 font-[var(--font-display)] text-3xl font-bold text-navy-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-navy-500">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/">
        <Button className="mt-6">Back to Home</Button>
      </Link>
    </div>
  );
}
