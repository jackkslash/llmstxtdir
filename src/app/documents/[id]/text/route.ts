import { NextResponse } from 'next/server';
import { getDocument } from '@/actions/projects';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const document = await getDocument(params.id);

        if (!document) {
            return new NextResponse('Document not found', { status: 404 });
        }

        // Set headers for displaying as plain text
        const headers = new Headers();
        headers.set('Content-Type', 'text/plain; charset=utf-8');

        return new NextResponse(document.content, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Error fetching document:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 