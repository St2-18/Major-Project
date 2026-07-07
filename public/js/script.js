// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// ── Listing Image Carousel ────────────────────────────────────────────────────
document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track   = carousel.querySelector(".carousel-track");
  const slides  = carousel.querySelectorAll(".carousel-slide");
  const dots    = carousel.querySelectorAll(".carousel-dot");
  const btnPrev = carousel.querySelector(".carousel-arrow-left");
  const btnNext = carousel.querySelector(".carousel-arrow-right");
  const total   = slides.length;

  if (total <= 1) return; // nothing to do for single images

  let current = 0;

  function goTo(index) {
    // Wrap around
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    // Update dots
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  if (btnPrev) btnPrev.addEventListener("click", () => goTo(current - 1));
  if (btnNext) btnNext.addEventListener("click", () => goTo(current + 1));

  // Dot clicks
  dots.forEach((dot) => {
    dot.addEventListener("click", () => goTo(parseInt(dot.dataset.index, 10)));
  });

  // Keyboard support when carousel is focused
  carousel.setAttribute("tabindex", "0");
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  // Touch / swipe support
  let touchStartX = 0;
  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  carousel.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });
});
