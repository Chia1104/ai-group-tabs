export function setStorage<V = any>(key: string, value: V) {
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

export function getStorage<V = any>(key: string): Promise<V | undefined> {
  return new Promise<V>((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
}

export function getMultipleStorage<V extends Record<string, unknown>>(
  keys: string[],
) {
  return new Promise<{ [K in keyof V]: V[K] | undefined }>(
    (resolve, reject) => {
      chrome.storage.local.get(keys, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result as V);
        }
      });
    },
  );
}

export const DEFAULT_GROUP = [
  "Social",
  "Entertainment",
  "Read Material",
  "Education",
  "Productivity",
  "Utilities",
];

/**
 * @todo Remove unnecessary keys
 */
export enum StorageKeys {
  /**
   * @deprecated use the new StorageKeys for backwards compatibility,
   * currently only used for migration
   */
  LEGACY_OPEN_API_KEY = "openai_key",
  OPEN_API_KEY = "OPEN_API_KEY",
  /**
   * @deprecated use the new StorageKeys for backwards compatibility,
   * currently only used for migration
   */
  LEGACY_GROUP_TYPES = "types",
  GROUP_TYPES = "GROUP_TYPES",
  /**
   * @deprecated use the new StorageKeys for backwards compatibility,
   * currently only used for migration
   */
  LEGACY_AUTO_GROUP = "isOn",
  AUTO_GROUP = "AUTO_GROUP",
}
