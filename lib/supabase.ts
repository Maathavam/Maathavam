import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key (for API routes)
export function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface DbEvent {
  id: string;
  slug: string;
  name: string;
  name_tamil: string;
  image_url: string;
  description: string;
  description_tamil: string;
  date: string;
  date_tamil: string;
  details: string;
  details_tamil: string;
  created_at: string;
}
