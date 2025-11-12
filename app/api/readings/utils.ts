import { Context, Label } from '../../types/types'; // Assuming you define your types in a separate file

// NOTE: For simplicity, I'm defining types here, but in a real Next.js app, 
// these should be imported from a shared `types.ts` file.
// export type Context = 'Fasting' | 'Before Breakfast' | 'After Breakfast' | '2 Hours Post Lunch' | 'Before Dinner' | 'After Dinner' | 'Bedtime' | 'Other';
// export type Label = 'Optimal' | 'Controlled' | 'Medium' | 'High' | 'Low';


/**
 * Simple logic to assign a health label based on the blood sugar level and context.
 * This logic should match any display logic on the client side.
 */
export const assignLabel = (level: number, context: Context): Label => {
    // Thresholds are highly simplified for this example and should be adjusted based on medical guidelines.
    if (context === 'Fasting') {
        if (level < 80) return 'Low';
        if (level >= 80 && level <= 100) return 'Optimal';
        if (level > 100 && level <= 125) return 'Controlled';
        return 'High';
    } 
    // Post-meal checks (general context)
    if (level < 70) return 'Low';
    if (level >= 70 && level <= 140) return 'Optimal';
    if (level > 140 && level <= 180) return 'Controlled';
    if (level > 180 && level <= 220) return 'Medium';
    return 'High';
};