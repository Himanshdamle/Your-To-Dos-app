import { toggleClasses, resize } from "./core.js";

export function hoverEffect(el, bgEl, state) {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    window.hoverObject = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  });

  el.addEventListener("mouseenter", () => {
    toggleClasses("add", bgEl);
  });

  el.addEventListener("mouseleave", () => {
    if (!state.isClicked || window.countTags > 3) toggleClasses("remove", bgEl);
  });
}

export function clickingLogic(el, bgEl, state) {
  const tagsCounter = document.querySelector("#current-len-tags-input");

  el.addEventListener("click", () => {
    setTimeout(() => {
      if (state.isDblClick) return;

      state.isClicked = !state.isClicked;

      if (state.isClicked) {
        window.countTags++;
      } else {
        window.countTags--;
        toggleClasses("remove", bgEl);

        const enterTagName = el.querySelector("input");
        window.currTodoDetails.tags = window.currTodoDetails.tags.filter(
          (tag) => tag !== enterTagName.value
        );
      }

      if (window.countTags <= 3 && tagsCounter) {
        tagsCounter.innerText = window.countTags;

        if (state.isClicked) {
          const enterTagName = el.querySelector("input");
          window.currTodoDetails.tags.push(enterTagName.value);
        }
      }
    }, 250);
  });

  el.addEventListener("dblclick", () => {
    const enterTagName = el.querySelector("input");

    function toggleClassesAndAttribute(
      methodNameClasses,
      methodNameAttribute,
      boolean
    ) {
      enterTagName.classList[methodNameClasses](
        "pointer-events-none",
        "cursor-pointer"
      );
      enterTagName[methodNameAttribute]("disabled", boolean);
    }

    toggleClassesAndAttribute("remove", "removeAttribute");

    enterTagName.addEventListener(
      "blur",
      () => {
        toggleClassesAndAttribute("add", "setAttribute", true);
        toggleClasses("remove", bgEl);

        if (enterTagName.value.length <= 1) {
          enterTagName.value = enterTagName.getAttribute("value");
          enterTagName.setAttribute("value", enterTagName.value);
        } else {
          toggleClasses("add", bgEl);
          window.currTodoDetails.tags.push(enterTagName.value);
        }
      },
      { once: true }
    );

    state.isDblClick = true;
  });
}

export function initializeTagInputs() {
  const inputs = document.querySelectorAll('input[name="tag"]');
  inputs.forEach((input) => {
    resize(input);
    input.addEventListener("input", () => resize(input));
  });
}
