import Alpine from "alpinejs";
import { projectsData } from "../../data/dictionary/projects";
import type { Field, LocaleStore } from "../type/lang";
import { indexData } from "../../data/dictionary/indexData";

export function localization() {
  return {
    projectsData,
    indexData,

    t(field: Field) {
      return (
        field[(Alpine.store("locale") as LocaleStore).current] ||
        field.uk ||
        field.en
      );
    },
  };
}
