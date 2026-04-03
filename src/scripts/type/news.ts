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
  items: Publication[] | [];
  page: {
    current: number;
    pageLength: number;
  };
  publication: {
    currentItem: number | null;
    isOpened: boolean;
  };
  isLoading: boolean;
  getNews: () => Publication[] | [];
  setNews: ([]) => void;
  getCurrentPublication: () => number | null;
  setCurrentPublication: (id: number) => void;
  getPublicationStatus: () => boolean;
  setPublicationStatus: (isOpened: boolean) => void;
}

export interface Publication {
  id: number;
  title: string;
  description: string;
  logoSm: string;
  logoXl: string;
}
