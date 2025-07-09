import {
  addInHTML,
  smoothInnOutTransition,
  getTaskNumber,
  getPercentageOf,
  operations,
} from "./core.js";

import { hotKeysFunction, downloadTodos, copyTaskName } from "./event.js";

/**
 * Initializes the UI, including todo rendering and placeholder effects.
 */
export function initializeUI() {
  const pendingTodosSection = document.querySelector("#pending-todo");
  const completedTodosSection = document.querySelector("#completed-todo");

  const renderTaskProcess = {
    pendingTask: 0,
    completedTask: 0,
  };

  const renderTotalTask = {
    pendingTask: 0,
    completedTask: 0,
  };

  const addPendingTask = addInHTML(
    { localTodoVarName: "todos", hideCollapseTodo: true },
    pendingTodosSection,
    {
      allowCRUD: true,
      localTodoVarName: "todos",
      todoMainSide: pendingTodosSection,
    }
  );
  hotKeysFunction(["r", "u", "d"], pendingTodosSection);

  const getPendingTaskNumInfo = getTaskNumber(addPendingTask, {
    selectorDate: "Due today",
  });
  renderTaskProcess.pendingTask = getPendingTaskNumInfo.taskNumber || 0;
  renderTotalTask.pendingTask = getPendingTaskNumInfo.totalTask || 0;

  const addCompletedTask = addInHTML(
    { localTodoVarName: "completedTodos", hideCollapseTodo: true },
    completedTodosSection,
    {
      allowCRUD: ["#delete", "#read"],
      localTodoVarName: "completedTodos",
      todoMainSide: completedTodosSection,
    }
  );
  hotKeysFunction(["d", "r"], completedTodosSection);

  const getCompletedTaskNumInfo = getTaskNumber(addCompletedTask, {
    selectorDate: "Completed today",
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
 * "SEARCH BY" changes every 10 seconds.
 */
export function searchByRotation() {
  const searchBy = ["TASK NAME", "DUE DATE", "TAG NAME"];

  const searchByEl = document.querySelector("#search-by");

  let countIndex = 0;

  function change() {
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
            false,
            "flex"
          );
        },
      },
      true
    );
  }

  setInterval(change, 10 * 1000);
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
        smoothInnOutTransition(settings, false, "flex");
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

  box.addEventListener(
    "click",
    (e) => {
      const target = e.target;

      if (target !== box && target.classList.contains("menu-buttons")) {
        const operationName = target.getAttribute("data-function");
        const completedTodosSection = document.querySelector("#completed-todo");
        const clickedTodoHTML = window.clickedTodoHTML;

        switch (operationName) {
          case "dragAndDrop":
            completedTodosSection.append(window.clickedTodoHTML);

            operations(
              {
                todoCard: window.clickedTodoHTML,

                dragVarName: "todos",
                dropVarName: "completedTodos",
                allowCRUD: ["#delete", "#read"],
                todoMainSide: completedTodosSection,

                popupBoldText: "Moved to Completed Tasks",
                popupEmoji: "🥳🎊",
              },
              "dragAndDrop"
            );
            break;

          case "Download":
            downloadTodos(clickedTodoHTML);
            break;

          case "copyTask":
            copyTaskName(clickedTodoHTML);
            break;

          default:
            operations({ todoCard: clickedTodoHTML }, operationName);
            break;
        }
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
