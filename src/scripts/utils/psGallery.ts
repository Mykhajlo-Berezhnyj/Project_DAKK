import Alpine from "alpinejs";

export function psGallery() {
  return {
    photos: [] as string[],
    activeIndex: 0,
    activeImage: null as string | null,
    escHandler: null as ((e: KeyboardEvent) => void) | null,
    width: 0,
    n: 0,
    autoScrollTimeOut: null as number | null,
    resizeHandler: null as (() => void) | null,

    init() {
      const track = document.querySelector(".gallery-track") as HTMLDivElement;
      this.resizeHandler = () => this.setTrackWidth();
      window.addEventListener("resize", this.resizeHandler);
      Alpine.nextTick(() => {
        this.setTrackWidth();
        if (!this.isSlaider) return;
        track.style.justifyContent = "flex-start";
        this.activeIndex = this.photos.length;
        track.scrollLeft = this.activeIndex * this.width;
      });
      this.autoScroll();
    },

    setTrackWidth() {
      const track = document.querySelector(".gallery-track") as HTMLDivElement;
      if (!track) return;
      track.style.width = "auto";

      const firstImg = track.querySelector(".thumbnail");
      if (!firstImg) return;
      const widthTrack = track.clientWidth;
      const widthImg = firstImg.clientWidth;
      const styleTrack = window.getComputedStyle(track);
      const gap = parseInt(styleTrack.columnGap);
      this.width = widthImg + gap;
      this.n = Math.floor((widthTrack + gap) / this.width);
      track.style.justifyContent = this.isSlaider ? "flex-start" : "center";

      const calcWidth = this.width * this.n - gap + "px";
      track.style.width = calcWidth;
    },

    get isSlaider() {
      return this.n > 0 && this.n < this.photos.length;
    },

    autoScroll(delay = 3000) {
      this.stopAutoScroll();

      this.autoScrollTimeOut = window.setTimeout(() => {
        this.next(true);
        this.autoScroll();
      }, delay);
    },

    stopAutoScroll() {
      if (this.autoScrollTimeOut) {
        clearTimeout(this.autoScrollTimeOut);
        this.autoScrollTimeOut = null;
      }
    },

    setPhotos(newPhotos: string[]) {
      this.photos = newPhotos || [];
      this.activeIndex = 0;
    },

    prev() {
      if (this.activeImage || this.isSlaider) {
        this.autoScroll(10000);
      }

      this.activeIndex = this.activeImage
        ? (this.activeIndex - 1 + this.photos.length) % this.photos.length
        : this.activeIndex - 1;
      this.scrollToActive();
      if (this.activeImage) {
        this.activeImage = this.photos[this.activeIndex];
        this.activeImage ?? this.openModal(this.activeImage);
      }
    },

    next(auto = false) {
      if (!this.photos || this.photos.length === 0) return;

      if ((!auto && this.activeImage) || (!auto && this.isSlaider)) {
        this.autoScroll(10000);
      }
      this.activeIndex = this.activeImage
        ? (this.activeIndex + 1) % this.photos.length
        : this.activeIndex + 1;
      console.log("🚀 ~ psGallery ~ activeIndex:", this.activeIndex);
      this.scrollToActive();
      if (this.activeImage) {
        this.activeImage = this.photos[this.activeIndex];
        this.activeImage ?? this.openModal(this.activeImage);
      }
    },

    scrollToActive() {
      const track = document.querySelector(".gallery-track") as HTMLDivElement;
      if (!track) return;

      if (!this.activeImage) {
        if (this.activeIndex > this.photos.length * 2 - 1) {
          this.activeIndex = this.photos.length;
          console.log("🚀 ~ psGallery ~ auto:");
          track.style.scrollBehavior = "auto";
          track.scrollLeft = (this.activeIndex - 1) * this.width;

          track.offsetHeight;
        } else if (this.activeIndex < 1) {
          this.activeIndex = this.photos.length;
          console.log("🚀 ~ psGallery ~ auto:");
          track.style.scrollBehavior = "auto";
          track.scrollLeft = (this.activeIndex + 1) * this.width;

          track.offsetHeight;
        }
      }
      track.style.scrollBehavior = "smooth";

      track.scrollTo({
        left: this.activeIndex * this.width,
      });
    },

    openModal(img: string) {
      this.activeImage = img;
      document.documentElement.style.overflow = "hidden";
      this.escHandler = (e) => {
        if (
          e.key === "Escape" ||
          e.key === "5" ||
          e.key === "Num5" ||
          e.key === "S" ||
          e.key === "s"
        ) {
          this.closeModal();
        }
        if (
          e.key === "ArrowRight" ||
          e.key === "ArrowUp" ||
          e.key === "6" ||
          e.key === "Num6" ||
          e.key === "D" ||
          e.key === "d"
        ) {
          this.next();
        }
        if (
          e.key === "ArrowLeft" ||
          e.key === "ArrowDown" ||
          e.key === "4" ||
          e.key === "Num4" ||
          e.key === "A" ||
          e.key === "a"
        ) {
          this.prev();
        }
      };

      document.addEventListener("keydown", this.escHandler);
    },
    closeModal() {
      this.activeImage = null;
      document.documentElement.style.overflow = "";
      if (this.escHandler) {
        document.removeEventListener("keydown", this.escHandler);
        this.escHandler = null;
      }
    },

    destroy() {
      this.stopAutoScroll();
      if (this.resizeHandler) {
        window.removeEventListener("resize", this.resizeHandler);
        this.resizeHandler = null;
      }
    },
  };
}
