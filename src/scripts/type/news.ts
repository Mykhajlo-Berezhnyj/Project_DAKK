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
  page: {
    current: number;
    pageLength: number;
  };
  isItemOpened: boolean;
  openedItemId: string | null;

  isLoading: boolean;

  getNews: () => New[] | [];
  setNews: ([]) => void;
  getCurrentPublication: () => string | null;
  setCurrentPublication: (id: string | null) => void;
  getPublicationStatus: () => boolean;
  setPublicationStatus: (isOpened: boolean) => void;
}
