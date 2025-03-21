'use server'
import { db } from '@/db';
import { projects, llmsDocuments } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { redirect } from 'next/navigation';

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

export async function getDocument(id: string) {
  try {
    const document = await db.select({
      id: llmsDocuments.id,
      content: llmsDocuments.content,
      fetchedAt: llmsDocuments.fetchedAt,
    })
      .from(llmsDocuments)
      .where(eq(llmsDocuments.id, id));

    return document[0];
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
}

export interface ProjectData {
  name: string;
  slug: string;
  description: string;
  website: string;
  category: string;
  isOpenSource: boolean;
}

export async function submitProject(prevState: any, formData: FormData) {
  try {
    const requiredFields = ['name', 'slug', 'description', 'website', 'category'];
    const errorFields = [];

    for (const field of requiredFields) {
      if (!formData.get(field)) {
        errorFields.push(field);
      }
    }

    if (errorFields.length > 0) {
      return {
        error: `Missing required field: ${errorFields.join(', ')}`,
        success: false,
      };
    }

    const rawFromData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      website: formData.get('website') as string,
      category: formData.get('category') as string,
      isOpenSource: formData.get('isOpenSource') === 'true',
      logoUrl: (formData.get('logoUrl') as string) || null,
      repoUrl: (formData.get('repoUrl') as string) || null,
      publishedAt: new Date(),
      updatedAt: new Date(),
    };

    const id = crypto.randomUUID();

    await db.insert(projects).values({
      id: id,
      ...rawFromData,
    });

    await fetch(process.env.BASE_URL + '/api/scrape?projectId=' + id);
    await fetch(process.env.BASE_URL + '/api/scrape?projectId=' + id + '&type=full');

    return {
      error: '',
      success: true,
    };
  } catch (error) {
    console.error('Error creating project:', error);
    return {
      error: 'Internal Server Error',
      success: false,
    };
  }
}