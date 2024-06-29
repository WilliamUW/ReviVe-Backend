'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to ReviVe</h1>
      <div className="space-y-4">
        <Link href="/sell" className="block w-64 p-4 text-center bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          I have electronics
        </Link>
        <Link href="/buy" className="block w-64 p-4 text-center bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          I want electronics
        </Link>
      </div>
    </main>
  );
}