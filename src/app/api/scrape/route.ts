import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { llmsDocuments, projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
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

    await db.insert(llmsDocuments).values({
      id: crypto.randomUUID(),
      projectId,
      urlType: 'standard',
      urlValue: baseUrl + '/llms.txt',
      contentHash: crypto.createHash('sha256').update(res).digest('hex'),
      content: res,
      fetchedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      data: {
        projectId,
        baseUrl,
        url,
        res
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
