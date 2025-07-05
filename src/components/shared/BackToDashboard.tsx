import Link from 'next/link';

export default function BackToDashboard() {
  return (
    <div className="mb-6">
      <Link 
        href="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
} 