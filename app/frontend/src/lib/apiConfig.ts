export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://127.0.0.1:8000';

export function buildUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const suffix = path.replace(/^\/+/, '');
  return `${base}/${suffix}`;
}
