export function psGallery() {
    return {
        photos: [] as string[],
        activeIndex: 0,
        activeImage: null as string | null,
        escHandler: null as ((e: KeyboardEvent) => void) | null,
        init() { this.scrollToActive(); },

        setPhotos(newPhotos: string[]) {
            this.photos = newPhotos || [];
            this.activeIndex = 0;
        },

        prev() {
            /*if (this.activeIndex > 0) {
                            this.activeIndex--;
                            this.scrollToActive();
                        } */

            this.activeIndex = (this.activeIndex - 1 + this.photos.length) % this.photos.length;
            this.scrollToActive();
            if (this.activeImage) {
                this.activeImage = this.photos[this.activeIndex];
                this.activeImage ?? this.openModal(this.activeImage);
            }
        },
        next() {
            if (!this.photos || this.photos.length === 0) return;

            /*  if (this.activeIndex < this.photos.length - 1) {
                 this.activeIndex++;
                 this.scrollToActive();
             } */

            this.activeIndex = (this.activeIndex + 1) % this.photos.length;
            this.scrollToActive();
            if (this.activeImage) {
                this.activeImage = this.photos[this.activeIndex];
                this.activeImage ?? this.openModal(this.activeImage);
            }
        },

        scrollToActive() {
            const track = document.querySelector('.gallery-track');
            if (!track) return;

            const width = track.clientWidth;

            track.scrollTo({
                left: this.activeIndex * width,
                behavior: "smooth"
            });
        },

        openModal(img: string) {
            this.activeImage = img;
            document.documentElement.style.overflow = 'hidden';
            this.escHandler = (e) => {
                if (
                    e.key === 'Escape' ||
                    e.key === '5' ||
                    e.key === 'Num5' ||
                    e.key === 'S' ||
                    e.key === 's'
                ) {
                    this.closeModal();
                }
                if (
                    e.key === 'ArrowRight' ||
                    e.key === 'ArrowUp' ||
                    e.key === '6' ||
                    e.key === 'Num6' ||
                    e.key === 'D' ||
                    e.key === 'd'
                ) {
                    this.next();
                }
                if (
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowDown' ||
                    e.key === '4' ||
                    e.key === 'Num4' ||
                    e.key === 'A' ||
                    e.key === 'a'
                ) {
                    this.prev();
                }
            };

            document.addEventListener('keydown', this.escHandler);
        },
        closeModal() {
            this.activeImage = null;
            document.documentElement.style.overflow = '';
            if (this.escHandler) {
                document.removeEventListener('keydown', this.escHandler);
                this.escHandler = null;
            }
        }
    }
}