const tags = document.querySelectorAll(".tag");
const tagsCounter = document.querySelector("#current-len-tags-input");
let countTags = 0;
let enterTagName;
let hoverObject = {};

// toggleClasses function is shifted to script.js file.
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

        enterTagName = el.querySelector("input");
        const updatedTags = currTodoDetails.tags.filter(
          (tag) => tag !== enterTagName.value
        );
        currTodoDetails.tags = updatedTags;
      }

      if (countTags <= 3) {
        tagsCounter.innerText = countTags;

        if (state.isClicked) {
          enterTagName = el.querySelector("input");
          currTodoDetails.tags.push(enterTagName.value);
        }
      }
    }, 300);
  });

  el.addEventListener("dblclick", () => {
    enterTagName = el.querySelector("input");

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

    enterTagName.addEventListener("blur", () => {
      toggleClassesAndAttribute("add", "setAttribute", true);

      toggleClasses("remove", bgEl);

      if (enterTagName.value.length <= 1) {
        enterTagName.value = enterTagName.getAttribute("value");
        enterTagName.setAttribute("value", enterTagName.value);
      } else {
        toggleClasses("add", bgEl);
        currTodoDetails.tags.push(enterTagName.value);
      }
    });

    state.isDblClick = true;
  });
}

tags.forEach((tag) => {
  const bg = tag.querySelector("#bg-color-tag");
  let state = { isClicked: false, isDblClick: false };

  hoverEffect(tag, bg, state);
  clickingLogic(tag, bg, state);

  tagStates.push(state);
});
