export function setStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}
