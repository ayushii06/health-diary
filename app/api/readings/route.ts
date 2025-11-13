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
  try {
    console.log("POST /api/readings called");

    // Clerk auth (await is required)
    const { userId } = await auth();

    // Local dev fallback to ease testing without Clerk
    // REMOVE this fallback in production!
    const effectiveUserId = userId ?? (process.env.NODE_ENV !== "production" ? "local_test_user" : null);

    if (!effectiveUserId) {
      console.warn("Unauthorized request to /api/readings");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // parse body
    const body = await req.json().catch((err) => {
      console.error("Failed to parse JSON body:", err);
      return null;
    });

    if (!body) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
    }

    const { level, unit = "mg/dL", context = "random" } = body;

    if (typeof level !== "number" || Number.isNaN(level)) {
      return new Response(JSON.stringify({ error: "Invalid input: level must be a number" }), { status: 400 });
    }

    // Insert into DB
    const inserted = await addReading({
      userId: effectiveUserId,
      level,
      unit,
      context,
    });

    // Return the inserted id (or object)
    return new Response(JSON.stringify({ ok: true, inserted }), { status: 201 });
  } catch (err: any) {
    // Log full error to server console for debugging
    console.log("API /api/readings POST error:", err && (err.stack || err.message || err));
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}