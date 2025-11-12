// app/api/readings/route.ts
import { auth } from '@clerk/nextjs/server';
import { fetchReadings, addReading } from '../../lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const readings = await fetchReadings(userId);
  return new Response(JSON.stringify(readings), { status: 200 });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const body = await req.json();
  const { level, unit = 'mg/dL', context = 'Random' } = body;

  if (typeof level !== 'number') {
    return new Response(JSON.stringify({ error: 'Invalid level' }), { status: 400 });
  }

  const inserted = await addReading({ userId, level, unit, context });
  return new Response(JSON.stringify(inserted), { status: 201 });
}
