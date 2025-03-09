"use server";

import Link from 'next/link';
import { getAllProjects } from '@/actions/projects';

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <div className="flex flex-col items-center gap-8 w-full max-w-md">
          <ul className="flex flex-col items-center gap-2 w-full">
            {projects.map((project) => (
              <li key={project.id}>
                <Link href={`/dir/${project.id}`} className="font-medium text-sm uppercase">
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
