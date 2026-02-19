// Environment Variable Validation Utility
// Ensures critical variables are present at runtime

const REQUIRED_ENV_VARS = [
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'RESEND_API_KEY',
  'ADMIN_PASSWORD'
] as const;

export const validateEnv = () => {
  const missingVars: string[] = [];

  REQUIRED_ENV_VARS.forEach((key) => {
    if (!process.env[key]) {
      missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    if (process.env.NODE_ENV === 'production') {
      console.error(
        `[CRITICAL] Missing environment variables in production: ${missingVars.join(', ')}`
      );
      // In strict environments, we might want to throw error to prevent startup
      // throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    } else {
      console.warn(
        `[WARN] Missing environment variables: ${missingVars.join(', ')}. Some features may not work.`
      );
    }
    return false;
  }

  return true;
};

// Safe getter with fallback
export const getEnv = (key: string, fallback: string = ''): string => {
  return process.env[key] || fallback;
};
