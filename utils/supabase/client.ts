import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`));
          if (!cookie) return undefined;
          const value = cookie.split('=')[1];
          // Handle base64-encoded cookies
          if (value.startsWith('base64-')) {
            try {
              const base64Value = value.replace('base64-', '');
              return atob(base64Value);
            } catch (e) {
              console.error('Failed to decode base64 cookie:', e);
              return undefined;
            }
          }
          return value;
        },
        set(name: string, value: string, options: any) {
          // Encode the value as base64
          const encodedValue = `base64-${btoa(value)}`;
          let cookie = `${name}=${encodedValue}`;
          if (options.maxAge) {
            cookie += `; Max-Age=${options.maxAge}`;
          }
          if (options.path) {
            cookie += `; Path=${options.path}`;
          }
          document.cookie = cookie;
        },
        remove(name: string, options: any) {
          document.cookie = `${name}=; Max-Age=0${options?.path ? `; Path=${options.path}` : ''}`;
        },
      },
    }
  );
