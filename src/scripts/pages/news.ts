import Alpine from "alpinejs";
import { fetchData } from "../core/api";
import { NEWS_QUERY } from "../service/query";
import type { NewsStore } from "../type/news";
import { newsTmpData } from "../../data/news/news-tmp";

const MAX_SYMBOLS_TO_SHOW = 150;

const newsSectionEl = document.querySelector(".section-news");

export const newsStore: NewsStore = {
  items: [],
  page: { current: 0, pageLength: 10 },
  isItemOpened: false,
  openedItemId: null,
  isLoading: false,

  getNews() {
    return this.items;
  },
  setNews(newsArr) {
    this.items = [...newsArr];
  },
  getCurrentPublication() {
    return this.openedItemId;
  },
  setCurrentPublication(id: string | null) {
    this.openedItemId = id;
  },
  getPublicationStatus() {
    return this.isItemOpened;
  },
  setPublicationStatus(isOpened: boolean) {
    this.isItemOpened = isOpened;
  },
};

export function init() {
  const newsStore = Alpine.store("news") as NewsStore;
  newsStore.isLoading = false;

  fetchData({
    query: NEWS_QUERY,
    options: {
      start: 0,
      end: 10,
    },
  })
    .then((data: any) => {
      // newsStore.setNews(data.news);
      // // !! Temporary data
      newsStore.setNews(newsTmpData);
    })
    .catch((err) => {
      console.error("Failed to load news items:", err);
    })
    .finally(() => {
      newsStore.isLoading = false;
    });
}

export function cutTextFn(text: string, length: number = MAX_SYMBOLS_TO_SHOW) {
  return text.length <= length ? text : text.slice(0, length) + " ...";
}

export function setPublication(id: string) {
  const newsStore = Alpine.store("news") as NewsStore;

  newsStore.setCurrentPublication(id);
  newsStore.setPublicationStatus(true);
  scrollToTopOfPublication();
}

export function scrollToTopOfPublication(): void {
  setTimeout(() => {
    newsSectionEl?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 1);
}
