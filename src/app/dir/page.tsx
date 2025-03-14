"use server";

import Link from 'next/link';
import { getAllProjects } from '@/actions/projects';

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  console.log(projects);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
          <ul className="flex flex-col gap-2 w-full">
            {projects.map((projectData) => (
              <li key={projectData.project.id}>
                <Link href={`/dir/${projectData.project.id}`} className="font-medium text-sm uppercase">
                  {projectData.project.name}
                </Link>
                <p>{projectData.project.description}</p>
                <div className="flex flex-row gap-1 text-gray-500">
                  {projectData.latestStandardDocument && (
                    <a href={projectData.latestStandardDocument.urlValue} className="font-medium text-sm uppercase">
                      llms.txt
                    </a>
                  )}
                  {projectData.latestFullDocument && (
                    <a href={projectData.latestFullDocument.urlValue} className="font-medium text-sm uppercase">
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

// [
//   {
//     project: {
//       id: '1',
//       name: 'Project One',
//       slug: 'project-one',
//       description: 'A simple description of Project One',
//       website: 'http://example.com',
//       category: 'Category A',
//       publishedAt: 2025-03-10T14:57:48.795Z,
//       updatedAt: 2025-03-10T14:57:48.795Z,
//       logoUrl: 'http://example.com/logo.png',
//       repoUrl: 'http://example.com/repo',
//       isOpenSource: true
//     },
//     latestStandardDocument: {
//       id: '3da3626a-680a-454e-ac16-46ecf2855eda',
//       projectId: '1',
//       urlType: 'standard',
//       urlValue: 'http://localhost:3000//llms.txt',
//       contentHash: '0c1a3f0e53f563f5d27e5dec614c7dfbb24f57fa4e8c9559f724f8a8d141f79e',
//       content: 'llms.txt.dir d',
//       fetchedAt: 2025-03-12T20:04:24.889Z
//     },
//     latestFullDocument: {
//       id: '2',
//       projectId: '1',
//       urlType: 'full',
//       urlValue: 'http://example.com/doc2',
//       contentHash: 'hash2',
//       content: 'Content of document 2 for Project Two',
//       fetchedAt: 2025-03-10T14:58:20.092Z
//     }
//   },
//   {
//     project: {
//       id: '2',
//       name: 'Project Two',
//       slug: 'project-two',
//       description: 'A simple description of Project Two',
//       website: 'http://example.com',
//       category: 'Category B',
//       publishedAt: 2025-03-10T14:57:48.795Z,
//       updatedAt: 2025-03-10T14:57:48.795Z,
//       logoUrl: 'http://example.com/logo.png',
//       repoUrl: 'http://example.com/repo',
//       isOpenSource: true
//     },
//     latestStandardDocument: null,
//     latestFullDocument: null
//   },
//   {
//     project: {
//       id: '3',
//       name: 'Project Three',
//       slug: 'project-three',
//       description: 'A simple description of Project Three',
//       website: 'http://example.com',
//       category: 'Category C',
//       publishedAt: 2025-03-10T14:57:48.795Z,
//       updatedAt: 2025-03-10T14:57:48.795Z,
//       logoUrl: 'http://example.com/logo.png',
//       repoUrl: 'http://example.com/repo',
//       isOpenSource: false
//     },
//     latestStandardDocument: {
//       id: '3',
//       projectId: '3',
//       urlType: 'standard',
//       urlValue: 'http://example.com/doc3',
//       contentHash: 'hash3',
//       content: 'Content of document 3 for Project Three',
//       fetchedAt: 2025-03-10T14:58:20.092Z
//     },
//     latestFullDocument: null
//   }
// ]
