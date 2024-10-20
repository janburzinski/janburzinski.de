$(document).ready(function () {
  const sections = $(".section");
  const icons = $(".icon");
  let isScrolling = false;
  let lastScrollTop = 0;
  const scrollThreshold = 50;

  function highlightSection(index) {
    icons.removeClass("active");
    icons.eq(index).addClass("active");
  }

  function getCurrentSection() {
    const windowHeight = $(window).height();
    const scrollMid = $(window).scrollTop() + windowHeight / 2;

    for (let i = 0; i < sections.length; i++) {
      const section = sections.eq(i);
      const sectionTop = section.offset().top;
      const sectionBottom = sectionTop + section.outerHeight();

      if (scrollMid >= sectionTop && scrollMid < sectionBottom) {
        return i;
      }
    }

    return sections.length - 1; // Default to last section if none found
  }

  function scrollToSection(index) {
    isScrolling = true;
    $("html, body").animate(
      {
        scrollTop: sections.eq(index).offset().top,
      },
      500,
      function () {
        isScrolling = false;
        highlightSection(index);
      }
    );
  }

  icons.click(function () {
    if (isScrolling) return;
    const index = icons.index(this);
    scrollToSection(index);
  });

  $(window).on(
    "wheel",
    $.throttle(100, function (event) {
      if (isScrolling) return;

      const currentScrollTop = $(window).scrollTop();
      const delta = event.originalEvent.deltaY;

      if (Math.abs(currentScrollTop - lastScrollTop) > scrollThreshold) {
        const currentSection = getCurrentSection();
        const direction = delta > 0 ? 1 : -1;
        const nextSection = Math.max(
          0,
          Math.min(sections.length - 1, currentSection + direction)
        );

        if (nextSection !== currentSection) {
          event.preventDefault();
          scrollToSection(nextSection);
        }
      }

      lastScrollTop = currentScrollTop;
    })
  );

  $(window).scroll(
    $.throttle(100, function () {
      if (!isScrolling) {
        const currentSection = getCurrentSection();
        highlightSection(currentSection);
      }
    })
  );
});
