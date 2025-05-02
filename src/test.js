const toggle1 = document.querySelector(".togg_1");
const toggle2 = document.querySelector(".togg_2");
const slider = document.querySelector(".slider");

// Set initial position
const toggle1Rect = toggle1.getBoundingClientRect();
gsap.set(slider, {
  height: toggle1Rect.height,
  width: toggle1Rect.width,
  left: toggle1.offsetLeft,
});

toggle1.addEventListener("click", () => {
  if (toggle1.classList.contains("bg_1")) return; // already active

  toggle1.classList.add("bg_1");
  toggle2.classList.remove("bg_2");

  gsap.to(slider, {
    width: toggle1.offsetWidth,
    left: toggle1.offsetLeft,
    duration: 0.5,
  });
});

toggle2.addEventListener("click", () => {
  if (toggle2.classList.contains("bg_2")) return; // already active

  toggle2.classList.add("bg_2");
  toggle1.classList.remove("bg_1");

  gsap.to(slider, {
    width: toggle2.offsetWidth,
    left: toggle2.offsetLeft,
    duration: 0.5,
  });
});
