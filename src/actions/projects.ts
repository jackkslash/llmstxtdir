import { db } from '@/db';
import { projects, llmsDocuments } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function getAllProjects() {
  try {
    const allProjects = await db.select().from(projects);

    const projectsWithLatestDocuments = await Promise.all(
      allProjects.map(async (project) => {
        const latestStandardDocument = await db.select()
          .from(llmsDocuments)
          .where(
            and(
              eq(llmsDocuments.projectId, project.id),
              eq(llmsDocuments.urlType, 'standard')
            )
          )
          .orderBy(desc(llmsDocuments.fetchedAt))
          .limit(1);

        const latestFullDocument = await db.select()
          .from(llmsDocuments)
          .where(
            and(
              eq(llmsDocuments.projectId, project.id),
              eq(llmsDocuments.urlType, 'full')
            )
          )
          .orderBy(desc(llmsDocuments.fetchedAt))
          .limit(1);

        return {
          project,
          latestStandardDocument: latestStandardDocument[0] || null,
          latestFullDocument: latestFullDocument[0] || null,
        };
      })
    );

    return projectsWithLatestDocuments;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch projects with latest documents');
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
