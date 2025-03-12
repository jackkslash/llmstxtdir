import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { llmsDocuments, projects } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import crypto from 'crypto';

/**
 * Scrape API - Fetches and stores llms.txt or llms-full.txt content for projects
 *
 * Usage:
 * 1. Scrape using project's website (for cron jobs):
 *    - GET /api/scrape?projectId=123
 *    - GET /api/scrape?projectId=123&type=full
 *
 * 2. Scrape with explicit URL:
 *    - GET /api/scrape?projectId=123&url=https://example.com/llms.txt
 *    - GET /api/scrape?projectId=123&url=https://example.com/llms-full.txt
 *
 * 3. Scrape with base URL and type:
 *    - GET /api/scrape?projectId=123&url=https://example.com&type=standard
 *    - GET /api/scrape?projectId=123&url=https://example.com&type=full
 *
 * Parameters:
 * - projectId: Required. The ID of the project to associate the content with.
 * - url: Optional. The URL to scrape. If not provided, uses the project's website from the database.
 * - type: Optional. The type of URL to scrape ('standard' or 'full'). Default is 'standard'.
 *   If an explicit URL with a valid suffix is provided, the type is determined from the URL.
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "projectId": "123",
 *     "url": "https://example.com/llms.txt",
 *     "urlType": "standard",
 *     "unchanged": false,
 *     "contentUpdated": true
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');
    let urlParam = url.searchParams.get('url');
    let urlType = url.searchParams.get('type') as 'standard' | 'full' || 'standard';

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    // Check if project exists
    const projectExists = await db.select({ id: projects.id, website: projects.website })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (projectExists.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // If URL is not provided, use the project's website
    if (!urlParam) {
      const baseUrl = projectExists[0].website;
      
      // Append the appropriate suffix based on the type
      if (urlType === 'full') {
        urlParam = baseUrl.endsWith('/') ? `${baseUrl}llms-full.txt` : `${baseUrl}/llms-full.txt`;
      } else {
        urlParam = baseUrl.endsWith('/') ? `${baseUrl}llms.txt` : `${baseUrl}/llms.txt`;
      }
    } else {
      // If URL is provided, validate it has the correct ending
      const isStandardUrl = urlParam.endsWith('/llms.txt');
      const isFullUrl = urlParam.endsWith('/llms-full.txt');
      
      if (!isStandardUrl && !isFullUrl) {
        // If URL doesn't have the correct ending, append it based on the type
        if (urlType === 'full') {
          urlParam = urlParam.endsWith('/') ? `${urlParam}llms-full.txt` : `${urlParam}/llms-full.txt`;
        } else {
          urlParam = urlParam.endsWith('/') ? `${urlParam}llms.txt` : `${urlParam}/llms.txt`;
        }
      } else {
        // If URL has a valid ending, determine the type from it
        if (isFullUrl) {
          // Override the type parameter if the URL has a specific ending
          urlType = 'full';
        } else {
          urlType = 'standard';
        }
      }
    }

    // Fetch URL content
    const response = await fetch(urlParam);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }
    const content = await response.text();
    
    // Calculate content hash
    const contentHash = crypto.createHash('sha256').update(content).digest('hex');
    
    // Check if we already have this exact content
    const existingDocument = await db
      .select({ id: llmsDocuments.id, contentHash: llmsDocuments.contentHash })
      .from(llmsDocuments)
      .where(
        and(
          eq(llmsDocuments.projectId, projectId),
          eq(llmsDocuments.urlType, urlType),
          eq(llmsDocuments.urlValue, urlParam)
        )
      )
      .orderBy(desc(llmsDocuments.fetchedAt))
      .limit(1);
      
    // If we have an existing document with the same hash, don't store it again
    let unchanged = false;
    if (existingDocument.length > 0) {
      if (existingDocument[0].contentHash === contentHash) {
        unchanged = true;
      }
    }

    if (!unchanged) {
      // Store the new document as content has changed (or this is the first fetch)
      await db.insert(llmsDocuments).values({
        id: crypto.randomUUID(),
        projectId,
        urlType,
        urlValue: urlParam,
        contentHash,
        content,
        fetchedAt: new Date()
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        projectId,
        url: urlParam,
        urlType,
        unchanged,
        contentUpdated: !unchanged
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
