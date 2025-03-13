import { db } from '@/db';
import { projects, llmsDocuments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getAllProjects() {
  try {
    return await db.select().from(projects);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch projects');
  }
}

export async function getProjectWithDocuments(id: string) {
  try {
    const project = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

    if (project.length === 0) {
      return { project: null, documents: [] };
    }
    const documents = await db.select()
      .from(llmsDocuments)
      .where(eq(llmsDocuments.projectId, id))
      .orderBy(desc(llmsDocuments.fetchedAt));

    return {
      project: project[0],
      documents
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch project with documents');
  }
}
