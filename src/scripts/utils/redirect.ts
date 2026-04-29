import { localization } from "../core/localization";

type RedirectMessageKey = keyof typeof locale.projectsData;

type RedirectType = {
  url: string;
  message: RedirectMessageKey;
  time?: number;
  type?: "redirect" | "push";
};
const locale = localization();

export function redirect({
  url,
  message,
  time = 5,
  type = "redirect",
}: RedirectType) {
  let count = time;
  const container = document.createElement("div");

  container.innerHTML = `
  <div class="error-container">
  <div class="container-404"
    <h1 style="font-size:100px;color:white">404</h1>
    <h2 style="font-size:48px">${locale.t(locale.projectsData["404"])}</h2>
  <div class="notice"></div>
  </div>
  </div>
`;
  document.body.appendChild(container);
  const notice = container.querySelector(".notice") as HTMLDivElement;
  notice.textContent = `${locale.t(locale.projectsData.redirect)} ${locale.t(locale.projectsData[message])} ${count} s `;

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      notice.textContent = `${locale.t(locale.projectsData.redirect)} ${locale.t(locale.projectsData[message])} ${count} s `;
    } else {
      clearInterval(interval);
      if (type === "redirect") {
        window.location.href = url;
      } else {
        window.history.replaceState({}, "", url);
        container.remove();
      }
    }
  }, 1000);
}
