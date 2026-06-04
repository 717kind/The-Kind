import { put, list, del } from '@vercel/blob';

const STORE_KEY = 'submissions-store.json';

async function getStore() {
  try {
    const { blobs } = await list({ prefix: STORE_KEY });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url);
    return await res.json();
  } catch {
    return [];
  }
}

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

    const blob = await put(`symbols/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    const submissions = await getStore();
    submissions.push({
      id: crypto.randomUUID(),
      name,
      location,
      meaning,
      imageUrl: blob.url,
      createdAt: new Date().toISOString(),
    });

    const existing = await list({ prefix: STORE_KEY });
    for (const b of existing.blobs) {
      await del(b.url);
    }
    await put(STORE_KEY, JSON.stringify(submissions, null, 2), {
      access: 'public',
    });

    return Response.json(submissions[submissions.length - 1], { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
