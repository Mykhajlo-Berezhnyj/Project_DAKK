import { localization } from "../core/localization";

type RedirectType = {
  url: string;
  time: number;
};
const locale = localization();

export function redirect({ url, time = 5 }: RedirectType) {
  let count = time;
  const notice = document.createElement("div");
  notice.classList.add("notice");
  notice.textContent = `${locale.t(locale.projectsData.redirect)} ${count} s `;
  document.body.appendChild(notice);

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      notice.textContent = `${locale.t(locale.projectsData.redirect)} ${count} s `;
    } else {
      clearInterval(interval);
      window.location.href = url;
    }
  }, 1000);
}
