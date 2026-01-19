import { put } from '@vercel/blob';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename') || 'newsletter.pdf';

        // The body of the request is the file content
        // We expect the client to send the file directly in the body
        const blob = await put(filename, request.body, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
            addRandomSuffix: false, // We want to overwrite or keep a predictable name if possible, or we just update the link
        });

        return new Response(JSON.stringify(blob), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Upload error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
