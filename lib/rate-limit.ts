// Simple in-memory rate limiter (resets on cold start, which is fine for Vercel serverless)
const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string, maxRequests = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry || now > entry.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (entry.count >= maxRequests) {
    return false; // blocked
  }

  entry.count++;
  return true; // allowed
}
