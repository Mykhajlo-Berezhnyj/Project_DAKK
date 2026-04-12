import Alpine from "alpinejs";
import type { NewsStore, New } from "../type/news";
import { scrollToTopOfPublication } from "./news";

export function getPost() {
  const newsStore = Alpine.store("news") as NewsStore;
  const currentId = newsStore.getCurrentPublication();
  const currentPost = newsStore
    .getNews()
    .find((item: New) => item._id === currentId);

  return currentPost || null;
}

export function resetCurrentPost() {
  const newsStore = Alpine.store("news") as NewsStore;

  newsStore.setCurrentPublication(null);
  newsStore.setPublicationStatus(false);
  scrollToTopOfPublication();
}

export function getActuellPosts(quantity: number = 3) {
  const newsStore = Alpine.store("news") as NewsStore;
  return newsStore.getNews().reverse().slice(0, quantity);
}
