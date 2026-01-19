import { put } from '@vercel/blob';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Vercel Serverless Functions (Node.js) receive the body already parsed if it's JSON
        // or we might need to buffer it. For standard setup, let's assume body is available.
        // If not, we'd need to parse. But usually standard body-parser is there.
        // Actually, creating a blob from `request.body` directly is best.

        // We want to overwrite 'data.json' so the URL stays consistent or predictable? 
        // Wait, update: Vercel Blob URLs are unique per upload unless we manage them.
        // But we are using a fixed "pathname" 'data.json'.
        // `addRandomSuffix: false` is required to keep the filename clean, 
        // BUT this caches heavily on Vercel's CDN.
        // For dynamic data, we might want the predictable URL but strict revalidation,
        // OR we rely on `api/get-data` to always serve fresh content by reading the blob.

        // Let's use `addRandomSuffix: false` so it overwrites logically "at the key".

        const { body } = request;

        const blob = await put('data.json', JSON.stringify(body), {
            access: 'public',
            addRandomSuffix: false, // Keep the name 'data.json'
            contentType: 'application/json',
        });

        return response.status(200).json(blob);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.message });
    }
}
