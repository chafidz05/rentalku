import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase belum dikonfigurasi. Pastikan file .env.local ada di root " +
        "project (sejajar dengan package.json) dan berisi " +
        "NEXT_PUBLIC_SUPABASE_URL serta NEXT_PUBLIC_SUPABASE_ANON_KEY, " +
        "lalu restart server dengan `npm run dev`. Jika sudah dideploy ke " +
        "Vercel, tambahkan juga kedua variabel ini di Project Settings > " +
        "Environment Variables lalu redeploy."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Diabaikan jika dipanggil dari Server Component tanpa middleware.
        }
      },
    },
  });
}