const tags = document.querySelectorAll(".tag");
const tagsCounter = document.querySelector("#current-len-tags-input");
let countTags = 0;
let hoverObject = {};

function toggleClasses(methodName, bgEl) {
  bgEl.classList[methodName]("scale-100");
  bgEl.style.transformOrigin = `${hoverObject.x}px ${hoverObject.y}px`;
}

function hoverEffect(el, bgEl, state) {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    hoverObject = { x, y };
  });

  el.addEventListener("mouseenter", () => {
    toggleClasses("add", bgEl);
  });

  el.addEventListener("mouseleave", () => {
    if (!state.isClicked || countTags > 3) toggleClasses("remove", bgEl);
  });
}

function clickingLogic(el, bgEl, state) {
  el.addEventListener("click", () => {
    setTimeout(() => {
      // delay to check if user had clicked twice times or not

      if (state.isDblClick) return;

      state.isClicked = !state.isClicked;

      if (state.isClicked) {
        countTags++;
      } else if (!state.isClicked) {
        countTags--;
        toggleClasses("remove", bgEl);
      }

      if (countTags <= 3) tagsCounter.innerText = countTags;
    }, 400);
  });

  el.addEventListener("dblclick", () => {
    const enterTagName = el.querySelector("input");

    enterTagName.classList.remove("pointer-events-none", "cursor-pointer");
    enterTagName.removeAttribute("disabled");

    enterTagName.addEventListener("blur", () => {
      enterTagName.classList.add("pointer-events-none", "cursor-pointer");
      enterTagName.setAttribute("disabled", true);
      toggleClasses("remove", bgEl);

      if (enterTagName.value.length <= 1)
        enterTagName.value = enterTagName.getAttribute("value");
      else {
      }
    });

    state.isDblClick = true;
  });
}

tags.forEach((tag) => {
  const bg = tag.querySelector("#bg-color-tag");
  const state = { isClicked: false, isDblClick: false };

  hoverEffect(tag, bg, state);
  clickingLogic(tag, bg, state);
});
