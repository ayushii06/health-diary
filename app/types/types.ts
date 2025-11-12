export type Context = 'Fasting' | 'Before Breakfast' | 'After Breakfast' | '2 Hours Post Lunch' | 'Before Dinner' | 'After Dinner' | 'Bedtime' | 'Other';
export type Label = 'Optimal' | 'Controlled' | 'Medium' | 'High' | 'Low';

export interface Reading {
    id: string; // UUID from DB
    date: string; // YYYY-MM-DD (Extracted from created_at)
    time: string; // HH:MM (Extracted from created_at)
    context: Context;
    level: number;
    unit: string;
    label: Label; // Calculated server-side or client-side based on level/context
    userId: string;
}