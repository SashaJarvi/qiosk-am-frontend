const bodyElement: HTMLBodyElement = document.querySelector("body") as HTMLBodyElement;
let scrollPosition: number = 0;

export default {
  enable() {
    scrollPosition = window.scrollY;
    bodyElement.style.position = "fixed";
    bodyElement.style.top = `-${scrollPosition}px`;
    bodyElement.style.width = "100%";
    bodyElement.style.height = "100vh";
  },
  disable() {
    bodyElement.style.removeProperty("position");
    bodyElement.style.removeProperty("top");
    bodyElement.style.removeProperty("width");
    bodyElement.style.removeProperty("height");
    window.scrollTo(0, scrollPosition);
  },
};
