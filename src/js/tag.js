import { resize } from "./core.js";

/**
 * Toggles CSS classes for tag hover effects.
 */
export function toggleClasses(methodName, bgEl) {
  bgEl.classList[methodName]("scale-100", "bg-span-el-tags-hover-effect");
  bgEl.style.transformOrigin = `${window.hoverObject?.x || 0}px ${
    window.hoverObject?.y || 0
  }px`;
}

function removeThisTag(tagName) {
  window.currTodoDetails.tags = window.currTodoDetails.tags.filter(
    (tag) => tag !== tagName
  );
  window.countTags--;
}

export function hoverEffect(el, bgEl) {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    window.hoverObject = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  });

  el.addEventListener("mouseenter", () => {
    toggleClasses("add", bgEl, el);
  });

  el.addEventListener("mouseleave", () => {
    const isTagSelected = el.querySelector("input").getAttribute("data-active");

    if (isTagSelected === "false" || window.countTags > 3) {
      toggleClasses("remove", bgEl, el);
    }
  });
}

export function clickingLogic(el, bgEl, state) {
  const tagsCounter = document.querySelector("#current-len-tags-input");
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

  el.addEventListener("click", () => {
    setTimeout(() => {
      if (enterTagName === document.activeElement) {
        state.isClicked = true;
        return;
      }

      state.isClicked = !state.isClicked;

      if (state.isClicked) {
        window.countTags++;
      } else {
        enterTagName.setAttribute("data-active", false);

        toggleClasses("remove", bgEl, el);
        removeThisTag(enterTagName.value);
      }

      if (window.countTags <= 3) {
        tagsCounter.textContent = window.countTags;

        if (state.isClicked) {
          window.currTodoDetails.tags.push(enterTagName.value);
          enterTagName.setAttribute("data-active", true);
        }
      }
    }, 250);
  });

  el.addEventListener("dblclick", () => {
    const enterTagName = el.querySelector("input");
    if (
      (window.countTags >= 3 && !el.querySelector("input")) ||
      enterTagName === document.activeElement
    )
      return;

    toggleClassesAndAttribute("remove", "removeAttribute");

    // if user selected and again want to edit the tag then remove the selected tag
    removeThisTag(enterTagName.value);

    // as user dbl click focus input
    enterTagName.focus();

    enterTagName.addEventListener(
      "blur",
      () => {
        toggleClassesAndAttribute("add", "setAttribute", true);

        if (enterTagName.value.length <= 1) {
          enterTagName.value = enterTagName.getAttribute("value");
          enterTagName.setAttribute("value", enterTagName.value);

          toggleClasses("remove", bgEl, el);
        } else {
          if (enterTagName.getAttribute("data-active") === "true") {
            window.currTodoDetails.tags.push(enterTagName.value);
            return;
          }

          enterTagName.setAttribute("data-active", true);
          toggleClasses("add", bgEl, el);

          removeThisTag(enterTagName.value);
          window.countTags += 1;

          window.currTodoDetails.tags.push(enterTagName.value);

          window.countTags += 2;

          document.querySelector("#current-len-tags-input").textContent =
            window.countTags;
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

function cleanTagStates(tagStates) {
  tagStates.forEach((state) => {
    state.isClicked = false;
    state.isDblClick = false;
  });
}

export function cleanTagUI() {
  const tagNameInputs = document.querySelectorAll(".tag-name");
  const bgSpanTagsHoverEffects = document.querySelectorAll(
    ".bg-span-el-tags-hover-effect"
  );

  const tagsCounter = document.querySelector("#current-len-tags-input");
  if (tagsCounter) {
    tagsCounter.innerText = "0";
  }

  bgSpanTagsHoverEffects.forEach((span) => {
    toggleClasses("remove", span);
  });

  tagNameInputs.forEach((tag) => {
    tag.value = tag.getAttribute("value") || "";
    tag.setAttribute("data-active", "false");

    resize(tag);
  });

  window.countTags = 0;
  cleanTagStates(window.tagStates);
}

export function setTagValues(todoTagsArray) {
  const hoverBalloon = document.querySelectorAll(".bg-color-tag");

  todoTagsArray.forEach((tag, tagNumber) => {
    const tagInput = document.querySelector(`#tag-input-${tagNumber + 1}`);

    if (!tagInput) return;

    window.countTags++;

    tagInput.value = tag;
    tagInput.setAttribute("data-active", "true");
    window.tagStates[tagNumber].isClicked = true;

    toggleClasses("add", hoverBalloon[tagNumber]);
  });
}
