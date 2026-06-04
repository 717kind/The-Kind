import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const items = await kv.lrange('submissions', 0, -1);
    const submissions = items.map(s => JSON.parse(s));
    return Response.json(submissions);
  } catch {
    return Response.json([]);
  }
}
