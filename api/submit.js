import { put } from '@vercel/blob';
import { kv } from '@vercel/kv';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') || '—';
    const location = formData.get('location') || 'Somewhere';
    const meaning = formData.get('meaning') || '';
    const file = formData.get('symbol');

    if (!file) {
      return Response.json({ error: 'No symbol uploaded' }, { status: 400 });
    }

    const blob = await put(file.name, file, { access: 'public' });

    const submission = {
      id: crypto.randomUUID(),
      name,
      location,
      meaning,
      imageUrl: blob.url,
      createdAt: new Date().toISOString(),
    };

    await kv.lpush('submissions', JSON.stringify(submission));

    return Response.json(submission, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
