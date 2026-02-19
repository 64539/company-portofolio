import { Redis } from '@upstash/redis';
import { validateEnv } from './env';

// Perform initial environment check (will log warnings in console)
validateEnv();

// Initialize Redis with a safe fallback to prevent crashes if env is missing
// The application logic should handle connection errors gracefully
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || 'https://mock-redis-url.upstash.io';
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || 'mock-token';

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});
