// ─────────────────────────────────────────────────────────────────────────────
// data/events.ts  — Event type definition only.
// All events are now managed via the admin panel and stored in Supabase.
// ─────────────────────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  name: string;
  nameTamil: string;
  image: string;
  description: string;
  descriptionTamil: string;
  date?: string;
  dateTamil?: string;
  details: string;
  detailsTamil: string;
}

// Static events array is intentionally empty.
// Events are fetched from Supabase via /api/events.
export const events: Event[] = [];
