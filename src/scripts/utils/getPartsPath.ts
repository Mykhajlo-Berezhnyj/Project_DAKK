import { SUPPORTED_LANG } from "../../data/lang";

export type PageType =
  | "index"
  | "projects"
  | "project-category"
  | "project-single"
  | "news"
  | "news-single"
  | "videos"
  | "contacts"
  | "about"
  | "404";

export interface PageInfo {
  page: PageType;
  category?: string | null;
  slug?: string | null;
}

export function getPartsPath(): PageInfo {
  const path = window.location.pathname;
  const parts = path
    .replace(new RegExp(`^\\/(${SUPPORTED_LANG.join("|")})`), "")
    .split("/")
    .filter(Boolean);

  if (parts.length === 0) {
    return { page: "index", category: null, slug: null };
  }

  switch (parts[0]) {
    case "projects":
      {
        if (parts.length === 1)
          return { page: "projects", category: null, slug: null };
        if (parts.length === 2)
          return { page: "project-category", category: parts[1], slug: null };
        if (parts.length === 3)
          return { page: "project-single", category: parts[1], slug: parts[2] };
        return { page: "404", category: null, slug: null };
      }
    case "news": {
      if (parts.length === 1) return { page: "news", slug: null };
      if (parts.length === 2) return { page: "news", slug: parts[1] };
      return { page: "404", slug: null };
    }
    case "videos":
      return { page: "videos" };
    case "contacts":
      return { page: "contacts" };
    case "about":
      return { page: "about" };
  }
  return { page: "404" };
}
