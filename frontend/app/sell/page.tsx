"use client";

import Link from "next/link";

export default function Sell() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">What electronics do you have?</h1>
      <div className="space-y-4">
        <Link
          href="/broken"
          className="block w-64 p-4 text-center bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Broken Electronic
        </Link>
        <Link
          href="/unused"
          className="block w-64 p-4 text-center bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Unused Electronic
        </Link>
      </div>
    </main>
  );
}
