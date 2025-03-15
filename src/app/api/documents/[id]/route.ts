import { NextResponse } from 'next/server';
import { getDocument } from '@/actions/projects'; // We'll create this action

export async function GET(
    { params }: { params: { id: string } }
) {
    try {
        const document = await getDocument(params.id);

        if (!document) {
            return new NextResponse('Document not found', { status: 404 });
        }

        return new NextResponse(document.content, {
            status: 200,
        });
    } catch (error) {
        console.error('Error fetching document:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 