import Alpine from "alpinejs";
import { fetchData } from "../core/api";
import { NEWS_QUERY } from "../service/query";
import type { NewsStore } from "../type/news";

export const newsStore: NewsStore = {
  items: [],
  page: { current: 0, pageLength: 10 },
  publication: {
    currentItem: null,
    isOpened: false,
  },
  isLoading: false,

  getNews() {
    return this.items;
  },
  setNews(newsArr) {
    this.items = [...newsArr];
  },
  getCurrentPublication() {
    return this.publication.currentItem;
  },
  setCurrentPublication(id: number) {
    this.publication.currentItem = id;
  },
  getPublicationStatus() {
    return this.publication.isOpened;
  },
  setPublicationStatus(isOpened: boolean) {
    this.publication.isOpened = isOpened;
  },
};

export function init() {
  (Alpine.store("news") as NewsStore).isLoading = false;

  fetchData({
    query: NEWS_QUERY,
    options: {
      start: 0,
      end: 10,
    },
  })
    .then((data: any) => {
      (Alpine.store("news") as NewsStore).setNews(data.news);
    })
    .catch((err) => {
      console.error("Failed to load news items:", err);
    })
    .finally(() => {
      (Alpine.store("news") as NewsStore).isLoading = false;
    });
}

export function cutTextFn(text: string, length: number = 100) {
  return text.length <= length ? text : text.slice(0, length) + "...";
}

export function setPublication(id: number) {
  (Alpine.store("news") as NewsStore).setCurrentPublication(id);
  (Alpine.store("news") as NewsStore).setPublicationStatus(true);
  console.log(Alpine.store("news"));
}
