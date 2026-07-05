import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
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

  return createBrowserClient(url, anonKey);
}