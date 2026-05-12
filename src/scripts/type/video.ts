export interface Video {
  cover?: string;
  publishedAt?: string;
  slug: string;
  title: string;
  videoUrl: string;
  _createdAt?: string;
  _id: string;
  _updatedAt?: string;
}

export interface VideoStore {
  items: Video[] | [];
  isItemOpened: boolean;
  openedItemId: string | null;

  readonly openedVideo: Video | null;
  readonly embedUrl: string;

  getVideos: () => Video[] | [];
  openModal: (id: string) => void;
  closeModal: () => void;
}