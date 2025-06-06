
"use client";

import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import type React from 'react';

interface SearchBarProps {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search topics, courses...", 
  className 
}: SearchBarProps) {
  return (
    <div className={`relative w-full ${className || 'max-w-md'}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
