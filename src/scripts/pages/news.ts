import Alpine from "alpinejs";
import { fetchData } from "../core/api";
import { NEWS_QUERY } from "../service/query";
import type { NewsStore } from "../type/news";
import { newsTmpData } from "../../data/news/news-tmp";
import { initNewsStore } from "../../stores/initNewsStore";
import { validationNew } from "./news-single";

const MAX_SYMBOLS_TO_SHOW = 150;

const newsSectionEl = document.querySelector(".section-news");

export const newsStore: NewsStore = {
  items: [],
  page: 1,
  perPage: 3,
  isLoading: false,
  curentNew: null,
  scrollY: null,

  getNews() {
    return this.items;
  },
  setNews(newsArr) {
    this.items = [...newsArr];
  },

  getCurrentNew() {
    return this.curentNew;
  },

  setCurrentNew(post) {
    this.scrollY = window.scrollY;
    this.curentNew = this.items.find((i) => i.slug === post.slug) ?? null;
    scrollToTopOfPublication();
  },

  resetCurrentNew() {
    this.curentNew = null;
    if (this.scrollY !== null) {
      window.scrollTo({ top: this.scrollY, behavior: "auto" });
    } else {
      scrollToTopOfPublication();
    }
  },

  get visible() {
    return this.items.slice(0, this.page * this.perPage);
  },

  get hasMore() {
    return this.items.length > this.page * this.perPage;
  },

  loadMore() {
    this.page++;
  },
};

export function init() {
  initNewsStore();
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
      newsStore.setNews(data.news);
      // // !! Temporary data
      newsStore.setNews(newsTmpData);
      validationNew();
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

export function scrollToTopOfPublication(): void {
  setTimeout(() => {
    newsSectionEl?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 1);
}
