import { put } from '@vercel/blob';

// Disable the default body parser to handle file streams
export const config = {
    api: {
        bodyParser: false,
    },
    runtime: 'nodejs',
};

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Construct URL object to parse query params
        // In Node.js serverless functions, request.url is just the path (e.g. '/api/upload-pdf?filename=...')
        // We need a base to constructor URL, though for searchParams it doesn't matter much.
        const url = new URL(request.url, `http://${request.headers.host}`);
        const filename = url.searchParams.get('filename') || 'newsletter.pdf';

        // Upload to Vercel Blob
        // We pass the 'request' object directly, which is a Readable stream in Node.js
        // put() handles reading the stream.
        const blob = await put(filename, request, {
            access: 'public',
            addRandomSuffix: false, // Overwrite or keep predictable name
            contentType: 'application/pdf', // Assuming PDF as per feature name
        });

        return response.status(200).json(blob);
    } catch (error) {
        console.error('Upload error:', error);
        return response.status(500).json({ error: error.message });
    }
}
