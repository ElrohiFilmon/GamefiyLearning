
import Link from 'next/link';
import { BookOpen } from 'lucide-react'; // Changed from Rocket to BookOpen

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-primary">
      <BookOpen className="h-7 w-7" /> {/* Changed icon here */}
      <span>Gamify Language Mastery</span>
    </Link>
  );
}
