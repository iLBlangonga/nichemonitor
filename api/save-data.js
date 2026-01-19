import { put } from '@vercel/blob';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { body } = request;

        // Upload to Vercel Blob with overwrite enabled
        const blob = await put('data.json', JSON.stringify(body), {
            access: 'public',
            addRandomSuffix: false, // Keep the name 'data.json'
            contentType: 'application/json',
            // Explicitly allow overwriting the existing file
            allowOverwrite: true,
        });

        return response.status(200).json(blob);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.message });
    }
}
