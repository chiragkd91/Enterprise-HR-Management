/**
 * Browser polyfills for Node.js globals
 * Fixes "process is not defined" errors from dependencies
 */

// Polyfill for import.meta.env
if (typeof window !== 'undefined' && (typeof import.meta === 'undefined' || !import.meta.env)) {
  if (typeof import.meta === 'undefined') {
    (window as any).importMeta = {
      env: {
        MODE: 'development',
        PROD: false,
        DEV: true,
        VITE_API_BASE_URL: 'http://localhost:5000',
        VITE_WS_URL: 'ws://localhost:5000',
        VITE_APP_NAME: 'Global Cyber IT HR',
        VITE_APP_VERSION: '1.0.0'
      }
    };
  }
}

// Polyfill for process.env
if (typeof window !== 'undefined' && typeof (window as any).process === 'undefined') {
  (window as any).process = {
    env: {
      NODE_ENV: 'development',
      REACT_APP_API_BASE_URL: 'http://localhost:5000',
      REACT_APP_WS_URL: 'ws://localhost:5000',
      VITE_API_BASE_URL: 'http://localhost:5000',
      VITE_WS_URL: 'ws://localhost:5000'
    },
    browser: true,
    version: '',
    platform: 'browser',
    nextTick: (callback: () => void) => setTimeout(callback, 0),
    cwd: () => '/',
    argv: [],
    pid: 0,
    ppid: 0,
    title: 'browser',
    arch: 'x64',
    stderr: {},
    stdin: {},
    stdout: {}
  };
}

// Polyfill for global
if (typeof window !== 'undefined' && typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

// Polyfill for Buffer (if needed)
if (typeof window !== 'undefined' && typeof (window as any).Buffer === 'undefined') {
  (window as any).Buffer = {
    from: (data: any) => new TextEncoder().encode(data),
    isBuffer: () => false
  };
}
