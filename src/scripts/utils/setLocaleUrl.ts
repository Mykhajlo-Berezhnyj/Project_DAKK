import { DEFAULT_LANG, SUPPORTED_LANG, type Lang } from "../../data/lang";

export function setLocaleUrl(locale: Lang) {
  const path = window.location.pathname.split("/").filter(Boolean);
  const firstSegmentIsLocale = SUPPORTED_LANG.includes(path[0] as Lang);

  if (locale === DEFAULT_LANG) {
    if (firstSegmentIsLocale) {
      path.splice(0, 1);
    }
  } else {
    if (firstSegmentIsLocale) {
      path[0] = locale;
    } else {
      path.unshift(locale);
    }
  }

  const newPath =
    "/" +
    path.join("/") +
    (path.length ? "/" : "") +
    window.location.search +
    window.location.hash;

  window.history.pushState({}, "", newPath);
}
