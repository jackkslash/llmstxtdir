import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center justify-center">
        <div className="font-medium text-sm">LLMS.TXT.DIR</div>
        <Link href="/dir" className="font-medium text-sm">
          DIRECTORY
        </Link>
      </main>
    </div>
  );
}
