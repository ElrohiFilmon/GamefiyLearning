
"use client";

import { Logo } from '@/components/shared/logo';
import { UserNav } from '@/components/layout/user-nav';
import { SearchBar } from '@/components/shared/search-bar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import type { Course } from '@/types';
import { MOCK_COURSES } from '@/lib/mock-data';

export function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    const filtered = MOCK_COURSES.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filtered);
    setShowSearchResults(true);
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleResultClick = () => {
    setShowSearchResults(false);
    setSearchTerm(''); // Clear search term after selection
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden md:block">
            <Logo />
          </div>
        </div>
        
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-md" ref={searchContainerRef}>
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.trim() && searchResults.length > 0 && setShowSearchResults(true)}
              placeholder="Search courses..."
            />
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 w-full bg-card border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <ul className="py-1">
                    {searchResults.map(course => (
                      <li key={course.id}>
                        <Link
                          href={`/courses/${course.id}`}
                          className="block px-4 py-2 text-sm text-card-foreground hover:bg-muted"
                          onClick={handleResultClick}
                        >
                          {course.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  searchTerm.trim() && (
                    <p className="p-4 text-sm text-muted-foreground">No courses found for "{searchTerm}".</p>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/settings/accessibility" passHref>
            <Button variant="ghost" size="icon" aria-label="Accessibility Settings">
              <Settings2 className="h-5 w-5" />
            </Button>
          </Link>
          <UserNav />
        </div>
      </div>
       {/* Logo for mobile, centered when sidebar is open */}
      <div className="md:hidden flex items-center justify-center pb-2 border-b md:border-none">
        <Logo />
      </div>
    </header>
  );
}
