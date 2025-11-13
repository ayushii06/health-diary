// lib/db.ts
import postgres from 'postgres';
import { assignLabel } from '../api/readings/utils';
import { Reading, Context } from '../types/types';

export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});

type ReadingInsertData = Omit<Reading, 'id' | 'date' | 'time' | 'label' | 'created_at' >;

export async function fetchReadings(userId: string): Promise<Reading[]> {
  try {
    const dbReadings = await sql<{
      id: string;
      level: string;
      unit: string;
      context:string;
      user_id: string;
      created_at: string;
    }[]>`
      SELECT id, level, unit, context, user_id, created_at
      FROM readings
      WHERE user_id = ${userId}
      ORDER BY created_at DESC;
    `;

    return dbReadings.map((r) => {
      const date = new Date(r.created_at);
      const level = parseFloat(r.level);
      const label = assignLabel(level, (r.context as Context) || 'Random');

      return {
        id: r.id,
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().split(' ')[0].substring(0, 5),
        context: (r.context as Context) || ('Random' as Context),
        level,
        unit: r.unit,
        label,
        userId: r.user_id,
      };
    });
  } catch (error) {
    console.error('Postgres Query Error during fetch:', error);
    return [];
  }
}

export async function addReading(readingData: ReadingInsertData) {
  const result = await sql`
    INSERT INTO readings (user_id, level, unit, context)
    VALUES (${readingData.userId}, ${readingData.level}, ${readingData.unit}, ${readingData.context})
    RETURNING id;
  `;
  return result[0];
}
