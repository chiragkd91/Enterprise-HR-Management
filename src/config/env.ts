/**
 * Environment configuration
 * Handles environment variables with fallbacks
 */

// Safe access to environment variables with multiple fallback strategies
const getEnvValue = (key: string, fallback: string | boolean = '') => {
  try {
    // Try import.meta.env first
    if (typeof import !== 'undefined' && import.meta?.env?.[key] !== undefined) {
      return import.meta.env[key];
    }
    
    // Try process.env as backup
    if (typeof window !== 'undefined' && (window as any).process?.env?.[key] !== undefined) {
      return (window as any).process.env[key];
    }
    
    // Try window environment variables
    if (typeof window !== 'undefined' && (window as any)[key] !== undefined) {
      return (window as any)[key];
    }
    
    return fallback;
  } catch (error) {
    return fallback;
  }
};

export const ENV_CONFIG = {
  API_BASE_URL: getEnvValue('VITE_API_BASE_URL', 'http://localhost:5000') as string,
  WS_BASE_URL: getEnvValue('VITE_WS_URL', 'ws://localhost:5000') as string,
  APP_NAME: getEnvValue('VITE_APP_NAME', 'Global Cyber IT HR') as string,
  APP_VERSION: getEnvValue('VITE_APP_VERSION', '1.0.0') as string,
  NODE_ENV: getEnvValue('MODE', 'development') as string,
  IS_PRODUCTION: getEnvValue('PROD', false) as boolean,
  IS_DEVELOPMENT: getEnvValue('DEV', true) as boolean
} as const;

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key: string, fallback: string = ''): string {
  try {
    return import.meta?.env?.[key] || fallback;
  } catch (error) {
    return fallback;
  }
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return ENV_CONFIG.IS_DEVELOPMENT;
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return ENV_CONFIG.IS_PRODUCTION;
}
