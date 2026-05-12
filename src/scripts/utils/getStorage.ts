export function getStorage<T>(key: string): T | null {
  try {
    const cashed = localStorage.getItem(key);
    return cashed ? JSON.parse(cashed) : null;
  } catch (error) {
    return null;
  }
}
