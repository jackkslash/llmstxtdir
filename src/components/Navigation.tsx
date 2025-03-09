'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 p-4 z-10">
      <Link href="/" className="font-medium text-sm font-[family-name:var(--font-geist-sans)]">
        LLMS.TXT.DIR
      </Link>
    </nav>
  );
}
