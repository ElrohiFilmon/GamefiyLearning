
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8 text-center">
      <div className="mb-12">
        <Rocket className="h-24 w-24 text-primary animate-pulse" />
      </div>
      <h1 className="text-5xl font-bold mb-6 tracking-tight text-foreground">
        Welcome to Gamify Language Mastery!
      </h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
        Embark on an interstellar journey to master your chosen language.
        Interactive lessons, AI assistance, and gamified challenges await you.
      </p>
      <Link href="/dashboard" passHref>
        <Button size="lg" className="px-10 py-6 text-lg shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
          Launch Your Learning Odyssey
        </Button>
      </Link>
      <footer className="absolute bottom-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Gamify Language Mastery. All rights reserved.
      </footer>
    </div>
  );
}
