import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

class SecureStorage {
  private memoryFallback: Map<string, string> = new Map();
  private isSecureStoreAvailable: boolean;

  constructor() {
    // SecureStore is not available on web
    this.isSecureStoreAvailable = Platform.OS !== 'web';
  }

  async getItem(key: string): Promise<string | null> {
    try {
      if (this.isSecureStoreAvailable) {
        return await SecureStore.getItemAsync(key);
      }
      return this.memoryFallback.get(key) ?? null;
    } catch (error) {
      console.error(`SecureStorage.getItem error for key "${key}":`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<boolean> {
    try {
      if (this.isSecureStoreAvailable) {
        await SecureStore.setItemAsync(key, value);
      } else {
        this.memoryFallback.set(key, value);
      }
      return true;
    } catch (error) {
      console.error(`SecureStorage.setItem error for key "${key}":`, error);
      return false;
    }
  }

  async removeItem(key: string): Promise<boolean> {
    try {
      if (this.isSecureStoreAvailable) {
        await SecureStore.deleteItemAsync(key);
      } else {
        this.memoryFallback.delete(key);
      }
      return true;
    } catch (error) {
      console.error(`SecureStorage.removeItem error for key "${key}":`, error);
      return false;
    }
  }

  async clear(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.removeItem(key)));
  }

  async multiGet(keys: string[]): Promise<Record<string, string | null>> {
    const results: Record<string, string | null> = {};
    await Promise.all(
      keys.map(async (key) => {
        results[key] = await this.getItem(key);
      })
    );
    return results;
  }

  async multiSet(items: Record<string, string>): Promise<boolean> {
    try {
      await Promise.all(
        Object.entries(items).map(([key, value]) => this.setItem(key, value))
      );
      return true;
    } catch {
      return false;
    }
  }
}

export const secureStorage = new SecureStorage();
