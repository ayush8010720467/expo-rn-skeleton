import { MMKV } from 'react-native-mmkv';

// Initialize MMKV with error handling for native module
let storage: MMKV;
let mmkvDisabled = false;

try {
  storage = new MMKV();
} catch (error) {
  const errorMessage = String(error);

  // Check if it's a debugger issue
  if (errorMessage.includes('remote debugger') || errorMessage.includes('JSI')) {
    console.warn('⚠️ MMKV requires disabling remote debugger. Disable JS Debugging to use MMKV.');
    mmkvDisabled = true;
  } else {
    console.error('MMKV initialization failed:', error);
  }

  // Create a mock storage object for when MMKV can't initialize
  storage = {
    set: (key: string, value: any) => {
      if (mmkvDisabled) {
        console.warn(`MMKV disabled: Would set ${key}=${value}`);
        return;
      }
      throw new Error('MMKV not initialized');
    },
    getString: (key: string) => {
      if (mmkvDisabled) {
        console.warn(`MMKV disabled: Would get ${key}`);
        return undefined;
      }
      throw new Error('MMKV not initialized');
    },
    getNumber: (key: string) => {
      if (mmkvDisabled) return undefined;
      throw new Error('MMKV not initialized');
    },
    getBoolean: (key: string) => {
      if (mmkvDisabled) return undefined;
      throw new Error('MMKV not initialized');
    },
    delete: (key: string) => {
      if (mmkvDisabled) return;
      throw new Error('MMKV not initialized');
    },
    clearAll: () => {
      if (mmkvDisabled) return;
      throw new Error('MMKV not initialized');
    },
  } as any;
}

export { storage };

export const storageUtils = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: string): string | undefined => {
    return storage.getString(key);
  },
  setObject: <T>(key: string, value: T) => {
    storage.set(key, JSON.stringify(value));
  },
  getObject: <T>(key: string): T | undefined => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : undefined;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
  clearAll: () => {
    storage.clearAll();
  },
};

