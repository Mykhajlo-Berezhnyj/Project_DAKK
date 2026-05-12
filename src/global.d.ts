export {};
import type { Alpine as AlpineType } from "alpinejs";

declare global {
  interface Window {
    Alpine: AlpineType;
    CRISP_READY_TRIGGER?: () => void;
  }
}
