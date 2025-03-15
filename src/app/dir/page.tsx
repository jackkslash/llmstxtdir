import Link from 'next/link';
import { getAllProjects } from '@/actions/projects';

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  console.log(projects);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
          <ul className="flex flex-col gap-4 w-full">
            {projects.map((projectData) => (
              <li key={projectData.project.id} className="p-4 rounded-lg hover:border-gray-400 transition-colors">
                <Link href={`/dir/${projectData.project.id}`} className="font-medium text-sm uppercase hover:text-gray-600 transition-colors">
                  {projectData.project.name}
                </Link>
                <p className="mt-2 text-sm text-gray-400">{projectData.project.description}</p>
                <div className="flex flex-row gap-2 mt-3 text-gray-500">
                  {projectData.latestStandardDocument && (
                    <a
                      href={projectData.latestStandardDocument.urlValue}
                      className="text-xs uppercase py-1 px-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                      llms.txt
                    </a>
                  )}
                  {projectData.latestFullDocument && (
                    <a
                      href={projectData.latestFullDocument.urlValue}
                      className="text-xs uppercase py-1 px-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                      llms-full.txt
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
