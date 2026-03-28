export function waitTransition(el: Element, time = 1000) {
  return new Promise((resolve) => {
    if (!el) {
      resolve(null);
      return;
    }
    let done = false;

    const clean = () => {
      if (done) return;
      done = true;
      clearInterval(timer);
      el.removeEventListener("transitionend", clean);
      resolve(null);
    };

    el.addEventListener("transitionend", clean);

    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      el.removeEventListener("transitionend", clean);
      resolve(null);
    }, time);
  });
}

export function animationEnter() {
  const items = document.querySelectorAll(".gallery-item");
  items.forEach((el) => el.classList.add("loading"));

  requestAnimationFrame(() => {
    items.forEach((el) => el.classList.remove("loading"));
  });
}
