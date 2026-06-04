import { list } from '@vercel/blob';

const STORE_KEY = 'submissions-store.json';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: STORE_KEY });
    if (blobs.length === 0) return Response.json([]);
    const res = await fetch(blobs[0].url);
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json([]);
  }
}
