import {
  addInHTML,
  smoothInnOutTransition,
  getTaskNumber,
  getPercentageOf,
} from "./core.js";

/**
 * Initializes the UI, including todo rendering and placeholder effects.
 */
export function initializeUI() {
  const pendingTodosSection = document.querySelector("#pending-todo");
  const completedTodosSection = document.querySelector("#right-main");

  const renderTaskProcess = {
    pendingTask: 0,
    completedTask: 0,
  };

  const renderTotalTask = {
    pendingTask: 0,
    completedTask: 0,
  };

  const addPendingTask = addInHTML(
    { localTodoVarName: "todos" },
    pendingTodosSection,
    {
      allowCRUD: true,
      localTodoVarName: "todos",
      todoMainSide: pendingTodosSection,
    }
  );

  const getPendingTaskNumInfo = getTaskNumber(addPendingTask, {
    selectorDate: "Due this day",
  });
  renderTaskProcess.pendingTask = getPendingTaskNumInfo.taskNumber || 0;
  renderTotalTask.pendingTask = getPendingTaskNumInfo.totalTask || 0;

  const addCompletedTask = addInHTML(
    { localTodoVarName: "completedTodos" },
    completedTodosSection,
    {
      allowCRUD: ["#delete"],
      localTodoVarName: "completedTodos",
      todoMainSide: completedTodosSection,
    }
  );

  const getCompletedTaskNumInfo = getTaskNumber(addCompletedTask, {
    selectorDate: "Due this day",
  });
  renderTaskProcess.completedTask = getCompletedTaskNumInfo.taskNumber || 0;
  renderTotalTask.completedTask = getCompletedTaskNumInfo.totalTask || 0;

  // update todays task progress
  updateTaskProgress(renderTaskProcess, {
    task: "todays-task",
    progress: "progress",
  });

  // update all time task progress
  updateTaskProgress(renderTotalTask, {
    task: "all-time-task",
    progress: "all-time-progress",
  });

  // placeholder effect
  const psuedoPlaceholders = document.querySelectorAll(".psuedo-placeholder");
  const inputs = document.querySelectorAll(".input");

  psuedoPlaceholders.forEach((placeholder, index) => {
    placeholderEffect(placeholder, inputs[index]);
  });

  const psuedoPlaceholdersCURD = document.querySelectorAll(
    ".psuedo-placeholder-curd"
  );
  const crudInputs = document.querySelectorAll(".crud-input");

  psuedoPlaceholdersCURD.forEach((placeholder, index) => {
    placeholderEffect(placeholder, crudInputs[index]);
  });
}

/**
 * Fetches and displays quotes or affirmations every 30 seconds.
 */
export function startQuoteRotation() {
  const quote = document.querySelector("#quotes");
  const author = document.querySelector("#author");
  const dashAuthorBefore = document.querySelector("#dash-author-before");

  setInterval(() => {
    if (Math.random() > 0.5) {
      fetch(
        "https://api.allorigins.win/raw?url=https://stoic.tekloon.net/stoic-quote"
      )
        .then((res) => res.json())
        .then((data) => {
          const quoteData = data.data;

          if (quoteData) {
            quote.innerText = `" ${quoteData.quote} "`;

            author.style.display = "block";
            author.innerText = quoteData.author;

            dashAuthorBefore.style.width = `${
              (25 / 100) * (author?.innerText.length || 0)
            }ch`;
            dashAuthorBefore.style.display = "block";
          }
        })
        .catch((err) => console.error("Error fetching stoic quote:", err));
    } else {
      fetch("https://api.allorigins.win/raw?url=https://www.affirmations.dev/")
        .then((res) => res.json())
        .then((data) => {
          if (quote) quote.innerHTML = `" ${data.affirmation} "`;
          if (author) author.style.display = "none";
          if (dashAuthorBefore) dashAuthorBefore.style.display = "none";
        })
        .catch((err) => console.error("Error fetching affirmation:", err));
    }
  }, 30 * 1000);
}

/**
 * SEARCH BY CHANGES every 10 seconds.
 */
export function searchByRotation() {
  const searchBy = ["TASK NAME", "DUE DATE", "TAG NAME"];

  const searchByEl = document.querySelector("#search-by");

  let countIndex = 0;

  setInterval(() => {
    if (countIndex === 3) countIndex = 0;

    smoothInnOutTransition(
      {
        el: searchByEl,
        scale: 1.1,
        blur: 10,
        duration: 0.35,
        onCompleteTransition() {
          searchByEl.textContent = searchBy[countIndex++ || 0];

          smoothInnOutTransition(
            { el: searchByEl, blur: 10, duration: 0.35, opacity: 1 },
            false
          );
        },
      },
      true
    );
  }, 10 * 1000);
}

/**
 * Animates text horizontally to show it.
 */
export function showLongText(txtContainer) {
  if (!txtContainer) return;

  const txt = txtContainer.querySelector(".show-heading");

  if (!txt) return;

  const maxContainerWidth = 185;
  const textWidth = txt.scrollWidth;

  const isOverflowing = textWidth > maxContainerWidth;

  if (!isOverflowing) return;

  let animation;
  let currentAnimation = [];

  function clearAllAnimation() {
    currentAnimation.forEach((tween) => tween.kill());
    gsap.set(txt, { clearProps: "all" });
    currentAnimation = [];
  }

  function runHorizonrally() {
    const slide = gsap.to(txt, {
      x: -textWidth,
      duration: 5,
      ease: "linear",
      onComplete() {
        const fadeOut = gsap.to(txt, {
          opacity: 0,
          duration: 0.5,
          onComplete() {
            reSet();
          },
        });

        currentAnimation.push(fadeOut);
      },
    });

    currentAnimation.push(slide);
  }

  function reSet() {
    gsap.set(txt, { x: 0 });

    animation = gsap.to(txt, {
      opacity: 1,
      duration: 0.5,
      onComplete: runHorizonrally,
    });

    currentAnimation.push(animation);
  }

  return {
    run() {
      clearAllAnimation();
      reSet();
    },
    stop() {
      clearAllAnimation();
    },
  };
}

/**
 * Animates placeholder effects for input fields.
 */
function placeholderEffect(psuedoPlaceholder, inputBox) {
  if (psuedoPlaceholder && inputBox) {
    const settings = {
      el: psuedoPlaceholder,
      scale: 1.2,
      duration: 0.3,
      blur: 20,
    };

    inputBox.addEventListener("input", () => {
      if (inputBox.value) {
        smoothInnOutTransition(settings, true);
      } else {
        smoothInnOutTransition(settings, false);
      }
    });
  }
}

/**
 * Render's the today's task process bar.
 */
function updateTaskProgress(
  taskNumber = { pendingTask: "", completedTask: "" },
  processBarId = { task: "", progress: "" }
) {
  const task = document.querySelector(`#${processBarId.task}`);
  const progress = document.querySelector(`#${processBarId.progress}`);

  const completedTask = taskNumber.completedTask;
  const totalTask = completedTask + taskNumber.pendingTask;

  //update task bar txt content
  task.textContent = `${completedTask} / ${totalTask}`;

  // update task bar process fill.
  progress.classList.add(
    `w-[${getPercentageOf(completedTask, totalTask).decimal}%]`
  );
}

/**
 * Animates the side bar of todo menu.
 */
const menuOptionBox = document.querySelectorAll(".menu-option-box");

const todoCardMenu = document.querySelector("#menu-todoCard");

menuOptionBox.forEach((box) => {
  box.addEventListener(
    "mouseenter",
    (e) => {
      if (e.target !== box && e.target.classList.contains("menu-buttons")) {
        const option = e.target;
        const color = option.getAttribute("data-color");
        const offsetTop = option.offsetTop;

        gsap.to("#hover-navigator", {
          y: offsetTop,
          duration: 0.6,
          backgroundColor: color || "white",
          ease: "back.out(1.2)",
        });
      }
    },
    true
  );
});

document.addEventListener("click", (e) => {
  if (
    !todoCardMenu.contains(e.target) && // Is the click not inside the dropdown menu?
    !e.target.closest(".menu-button-box") // And also not on the button that opened it?
  ) {
    gsap.fromTo(
      todoCardMenu,
      { y: 0 },
      {
        y: -20,
        duration: 0.4,
        opacity: 0,
        filter: "blur(5px)",
        ease: "power4.out",
        onComplete() {
          todoCardMenu.classList.add("hidden");
        },
      }
    );
  }
});
