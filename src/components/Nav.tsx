"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      <div className="flex justify-between items-start px-6 py-5 md:px-10 md:py-8">
        <Link
          href="/"
          className="text-[11px] tracking-[0.15em] uppercase text-fg pointer-events-auto hover:opacity-60 transition-opacity duration-300"
        >
          Work
        </Link>
        <Link
          href="/info"
          className="text-[11px] tracking-[0.15em] uppercase text-fg pointer-events-auto hover:opacity-60 transition-opacity duration-300"
        >
          Info
        </Link>
      </div>
    </nav>
  );
}
