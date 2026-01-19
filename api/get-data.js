import { list } from '@vercel/blob';

export default async function handler(request, response) {
    try {
        // 1. Find the blob named 'data.json'
        // Since we use addRandomSuffix: false, there should be one recent one.
        // List returns blobs sorted by default?
        const { blobs } = await list({
            limit: 1,
            prefix: 'data.json',
        });

        if (!blobs || blobs.length === 0) {
            return response.status(404).json({ error: 'Data not found' });
        }

        const blobUrl = blobs[0].url;

        // 2. Fetch the content of the blob
        // We fetch it server-side to avoid CORS issues if any (though blobs are public)
        // and to provide a clean API endpoint for the frontend.
        const dataRes = await fetch(blobUrl, { cache: 'no-store' }); // Ensure fresh fetch

        if (!dataRes.ok) {
            throw new Error('Failed to fetch blob content');
        }

        const data = await dataRes.json();

        // 3. Return the JSON
        response.setHeader('Cache-Control', 'no-store, max-age=0');
        return response.status(200).json(data);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.message });
    }
}
