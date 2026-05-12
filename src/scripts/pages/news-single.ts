import Alpine from "alpinejs";
import type { NewsStore } from "../type/news";
import { getPartsPath } from "../utils/getPartsPath";
import { localization } from "../core/localization";
import { redirect } from "../utils/redirect";


export function getActuellPosts(quantity: number = 3) {
  const newsStore = Alpine.store("news") as NewsStore;
  return newsStore.getNews().reverse().slice(0, quantity);
}

export function validationNew() {
  const newsStore = Alpine.store("news") as NewsStore;
  const news = newsStore.getNews();
  const { page, slug } = getPartsPath();
  console.log("🚀 ~ validationNew ~ page:", page)
  const locale = localization();
  const url = `${locale.l("/news")}`;

  if (page === "404") {
    console.log("🚀 ~ if ~ page:", page);
    redirect({ url, message: "newsPage", type: "push" });
    newsStore.resetCurrentNew();
  }
  if (!slug) return;

  const post = news.find((n) => n.slug === slug) ?? null;

  if (!post) {
    console.log("🚀 ~ if ~ page:", page);
    redirect({ url, message: "newsPage", type: "push" });
    newsStore.resetCurrentNew();
  } else {
    newsStore.setCurrentNew(post)
  }
}

export function getUrl(newSlug: string) {
  const { slug } = getPartsPath();
  if (!slug) {
    const newUrl = window.location.pathname + "/" + newSlug;
    window.history.pushState({}, "", newUrl);
  } else {
    const newUrl = window.location.pathname.replace(slug, newSlug);
    window.history.pushState({}, "", newUrl);
  }
}
