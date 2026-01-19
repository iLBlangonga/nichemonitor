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
        const url = new URL(request.url, `http://${request.headers.host}`);
        const filename = url.searchParams.get('filename') || 'newsletter.pdf';

        // Manually buffer the request body
        const chunks = [];
        for await (const chunk of request) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        const fileBuffer = Buffer.concat(chunks);

        // Upload the buffer
        const blob = await put(filename, fileBuffer, {
            access: 'public',
            addRandomSuffix: false,
            contentType: 'application/pdf',
        });

        return response.status(200).json(blob);
    } catch (error) {
        console.error('Upload error:', error);
        return response.status(500).json({ error: error.message });
    }
}
