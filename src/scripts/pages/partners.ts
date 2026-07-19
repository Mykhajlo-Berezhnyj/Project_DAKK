import Alpine from "alpinejs";
import { partners } from "../../data/partners";

export function renderPartners() {
  return {
    partners: partners,
    cards: partners,
    step: 0,
    n: 0,
    active: 0,
    timer: null as number | null,

    init() {
      Alpine.nextTick(() => {
        const track = document.querySelector(".partners-track") as HTMLElement;
        this.setTrackWidth();
        if (!this.isAuto) {
        track.style.justifyContent = "center";
        }
        this.autoScrol();
      });
      window.addEventListener("resize", () => {
        this.setTrackWidth();
        if (this.timer) {
          this.destroy();
        }
        this.autoScrol();
      });
    },

    setTrackWidth() {
       const track = document.querySelector(".partners-track") as HTMLElement;
     
       if (!this.isAuto) {
        track.style.justifyContent = "center";
        return;
      }
     
      const list = document.querySelector(
        ".footer-partner-list",
      ) as HTMLElement;
      const card = document.querySelector(".footer-partner-item");
      if (!track || !list || !card) return;
      track.style.width = "100%";
      track.style.justifyContent = "flex-start";
      const widhTrack = track.clientWidth;
      const widthCard = card.clientWidth;
      if (!widhTrack || !widthCard) return;
      const styleList = window.getComputedStyle(list);
      const gap = parseInt(styleList.columnGap);
      this.step = widthCard + gap;
      this.n = Math.floor((widhTrack + gap) / this.step);
      const calculateWidth = this.step * this.n - gap + "px";
      track.style.width = calculateWidth;
      this.cards = this.isAuto
        ? [...this.partners, ...this.partners.slice(0, this.n)]
        : this.partners;
    },

    get isAuto() {
      return this.partners.length > this.n;
    },

    autoScrol() {
      if (!this.isAuto) return;
      const list = document.querySelector(
        ".footer-partner-list",
      ) as HTMLElement;
      if (!list) return;
      const loop = () => {
        if (this.active === partners.length) {
          this.active = 0;
          list.style.transition = "none";
          list.style.transform = "translateX(0)";
          list.offsetHeight;
        }
        this.active++;
        list.style.transition = "transform 0.5s ease";
        list.style.transform = `translateX(-${this.active * this.step}px)`;
        this.timer = window.setTimeout(() => loop(), 1500);
      };
      loop();
    },

    destroy() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
  };
}
