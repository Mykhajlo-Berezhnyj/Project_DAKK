import { createClient, isHttpError } from "@sanity/client";
import Alpine from "alpinejs";
import type { LocaleStore } from "../type/lang";

const client = createClient({
  projectId: "syvh0wsw",
  dataset: "production",
  apiVersion: "2023-03-01",
  useCdn: true,
});

let loadingQuery = new Map<string, Promise<any>>();

export async function fetchData<T>({
  query,
  options = {},
}: {
  query: string;
  options?: Record<string, unknown>;
}): Promise<T> {
  const locale = (Alpine.store("locale") as LocaleStore).current;
  const key = query + JSON.stringify(options) + locale;

  if (loadingQuery.has(key)) return loadingQuery.get(key);

  const promise = (async () => {
    try {
      const response = await client.fetch(query, {
        ...options,
        locale,
      });
      return response as T;
    } catch (err) {
      if (isHttpError(err)) {
        const body = err?.response?.body as any;
        const message =
          body?.error?.description ||
          body?.error?.message ||
          err?.message ||
          "Sanity error";
        throw new Error(message);
      } else {
        throw new Error("Unknown error");
      }
    }
  })();
  loadingQuery.set(key, promise);
  return promise;
}
