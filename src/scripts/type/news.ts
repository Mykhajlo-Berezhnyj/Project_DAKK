export interface New {
  description: string;
  images?: string[];
  publishedAt?: string;
  slug: string;
  title: string;
  _createdAt: string;
  _id: string;
  _updatedAt: string;
}

export interface NewsStore {
  items: New[] | [];
  page: number;
  perPage: number;
  curentNew: New | null;
  isLoading: boolean;

  getNews: () => New[] | [];
  setNews: ([]) => void;
  getCurrentNew: () => New | null;
  setCurrentNew: (post: New) => void;
  resetCurrentNew: () => void;
  loadMore: () => void;
  get visible(): New[] | [];
  get hasMore(): boolean;

  // getCurrentPublication: () => string | null;
  // setCurrentPublication: (id: string | null) => void;
  // getPublicationStatus: () => boolean;
  // setPublicationStatus: (isOpened: boolean) => void;
}
