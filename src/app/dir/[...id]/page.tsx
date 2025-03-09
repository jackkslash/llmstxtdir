import React from 'react';
import { getProjectWithDocuments } from '@/actions/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Document {
    id: string;
    projectId: string;
    urlType: 'standard' | 'full';
    urlValue: string;
    contentHash: string;
    content: string;
    fetchedAt: Date;
}

export default async function ProjectPage({ params }: { params: { id: number } }) {
    const { id } = await params

    const { project, documents } = await getProjectWithDocuments(String(id));

    if (!project) {
        notFound();
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="row-start-2 max-w-4xl w-full mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="font-medium text-sm uppercase">{project.name}</div>
                    <Link href="/projects" className="font-medium text-sm">
                        BACK
                    </Link>
                </div>

                {project.description && (
                    <div className="text-sm mb-8">{project.description}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="font-medium text-sm mb-4">PROJECT LINKS</div>
                        <ul className="space-y-2">
                            {project.website && (
                                <li>
                                    <a href={project.website} target="_blank" rel="noopener noreferrer" className="font-medium text-sm">
                                        WEBSITE
                                    </a>
                                </li>
                            )}
                            {project.repoUrl && (
                                <li>
                                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-sm">
                                        REPOSITORY
                                    </a>
                                </li>
                            )}
                            {project.category && (
                                <li className="font-medium text-sm">
                                    CATEGORY: {project.category}
                                </li>
                            )}
                            {project.publishedAt && (
                                <li className="font-medium text-sm">
                                    PUBLISHED: {new Date(project.publishedAt).toLocaleDateString()}
                                </li>
                            )}
                        </ul>
                    </div>

                    {documents.length > 0 && (
                        <div>
                            <div className="font-medium text-sm mb-4">DOCUMENTS</div>
                            <ul className="space-y-2">
                                {documents.map((doc: Document) => (
                                    <li key={doc.id}>
                                        <a href={doc.urlValue} target="_blank" rel="noopener noreferrer" className="font-medium text-sm">
                                            {doc.urlValue}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
