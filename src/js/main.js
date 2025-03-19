const menuBtn = document.querySelector(".header__mobile-menu");
const nav0 = document.querySelector(".header__nav");
let menuOpen = false;
menuBtn.addEventListener("click", () => {
  if (!menuOpen) {
    menuBtn.classList.add("open");
    nav0.classList.add("open");
    menuOpen = true;
  } else {
    menuBtn.classList.remove("open");
    nav0.classList.remove("open");
    menuOpen = false;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const nav = document.querySelector(".header__nav");
  const page = document.querySelector("body");

  // Проверяем, есть ли нужные элементы. Если нет — выходим из функции
  if (!header || !page) {
    console.warn(
      "Отсутствует header или page, выполнение кода остановлено.",
    );
    return;
  }

  let lastScrollTop = 0;
  let headerHeight = header.offsetHeight;

  function updateNavPosition() {
    headerHeight = header.offsetHeight;
    const headerBottom = header.offsetTop + headerHeight;

    if (nav) {
      nav.style.top = `${headerBottom}px`;
    }
    page.style.paddingTop = `${headerBottom}px`;
  }

  window.addEventListener("resize", updateNavPosition);

  updateNavPosition();

  function handleScroll() {
    const currentScrollTop = window.scrollY;

    if (currentScrollTop > 0) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }

    if (currentScrollTop <= headerHeight) {
      header.classList.add("header--at-top");
      header.classList.remove("header--fixed", "header--hidden");
      return;
    } else {
      header.classList.remove("header--at-top");
    }

    // Определяем направление скролла
    if (currentScrollTop < lastScrollTop) {
      header.classList.add("header--fixed");
      header.classList.remove("header--hidden");
    } else {
      header.classList.add("header--hidden");
      header.classList.remove("header--fixed");
    }

    lastScrollTop = currentScrollTop;
  }

  // Убеждаемся, что при загрузке в середине страницы header фиксирован
  if (window.scrollY > 0) {
    header.classList.add("header--fixed", "header--scrolled");
    header.classList.remove("header--at-top");
  }

  window.addEventListener("scroll", handleScroll);
});

AOS.init();

Fancybox.bind("[data-fancybox]", {
  Thumbs: {
    autoStart: false,
  },
  Toolbar: {
    display: {
      left: ["infobar"],
      middle: [
        "zoomIn",
        "zoomOut",
        "toggle1to1",
        "rotateCCW",
        "rotateCW",
        "flipX",
        "flipY",
      ],
      right: ["slideshow", "thumbs", "close"],
    },
  },
});

$(document).ready(function() {
  console.log('jQuery работает!');
});
