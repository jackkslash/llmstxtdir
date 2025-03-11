import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { llmsDocuments, projects } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');
    const baseUrl = url.searchParams.get('baseUrl');

    if (!projectId || !baseUrl) {
      return NextResponse.json({ error: 'Missing projectId or baseUrl' }, { status: 400 });
    }

    // Check if project exists
    const projectExists = await db.select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (projectExists.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const response = await fetch(baseUrl + '/llms.txt');
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }
    const res = await response.text();
    
    // Calculate content hash
    const contentHash = crypto.createHash('sha256').update(res).digest('hex');
    
    // Check if we already have this exact content
    const existingDocument = await db
      .select({ id: llmsDocuments.id, contentHash: llmsDocuments.contentHash })
      .from(llmsDocuments)
      .where(
        and(
          eq(llmsDocuments.projectId, projectId),
          eq(llmsDocuments.urlValue, baseUrl + '/llms.txt')
        )
      )
      .orderBy(desc(llmsDocuments.fetchedAt))
      .limit(1);
      
    // If we have an existing document with the same hash, don't store it again
    if (existingDocument.length > 0 && existingDocument[0].contentHash === contentHash) {
      return NextResponse.json({
        success: true,
        data: {
          projectId,
          baseUrl,
          unchanged: true,
          message: 'Content unchanged since last fetch'
        },
      });
    }

    // Store the new document as content has changed (or this is the first fetch)
    await db.insert(llmsDocuments).values({
      id: crypto.randomUUID(),
      projectId,
      urlType: 'standard',
      urlValue: baseUrl + '/llms.txt',
      contentHash,
      content: res,
      fetchedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      data: {
        projectId,
        baseUrl,
        unchanged: false,
        contentUpdated: true
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
