import { initializeUI, searchByRotation } from "./ui.js";
import { setupEventListeners } from "./event.js";
import { hoverEffect, clickingLogic, initializeTagInputs } from "./tag.js";
import { middle } from "./downNavbar.js";
import { operations } from "./core.js";
import { resetTodoPageFunc, showToDoPage, removeThis } from "./core.js";
import { getUserSearchResult } from "./search.js";

import { startQuoteRotation } from "./quote.js";
import { resize } from "./resize.js";

// Global variables
window.typingInputIds = [];
window.currTodoDetails = {};
window.countTags = 0;
window.tagStates = [];
window.updated = false;
window.hoverObject = {};
window.clickedTodoHTML;

document.addEventListener("DOMContentLoaded", () => {
  console.time("Performance");

  initializeUI();
  setupEventListeners();
  startQuoteRotation();
  initializeTagInputs();
  middle();
  searchByRotation();

  getUserSearchResult();

  resize("#ytd-wrapper", "left");
  resize("#dtd-wrapper", "right");

  const closeTodoButtons = document.querySelector(".close-todo-page");
  const closeReadTodoButton = document.querySelector("#close-read-todo-page");

  closeReadTodoButton.addEventListener("click", () => {
    const todoPage = document.querySelector("#read-todo-page");
    removeThis(todoPage);
  });
  closeTodoButtons.addEventListener("click", () => {
    const todoPage = document.querySelector("#todo-page");
    window.updated = false;
    removeThis(todoPage);
    resetTodoPageFunc(false);
  });

  function openCreateToDoPage() {
    resetTodoPageFunc(true);
    showToDoPage();
  }

  const createTodoButton = document.querySelector("#create-new-todo-page");
  createTodoButton.addEventListener("click", () => {
    openCreateToDoPage();
  });

  document.body.addEventListener("keydown", (e) => {
    const tag = e.target.tagName.toLowerCase();

    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (tag === "input" || tag === "textarea") return;

    if (e.key.toLowerCase() === "c") {
      openCreateToDoPage();
    } else if (e.key.toLowerCase() === "f") {
      const elem = document.documentElement;

      // Check if not already fullscreen
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else {
          console.warn("Fullscreen not supported on this browser.");
        }
      } else {
        // Exit fullscreen if already in it
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  });

  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    const bg = tag.querySelector("#bg-color-tag");
    const state = { isClicked: false, isDblClick: false };

    hoverEffect(tag, bg, state);
    clickingLogic(tag, bg, state);

    window.tagStates.push(state);
  });

  //DRAG AND DROP TODO...
  const completedTodosSection = document.querySelector("#completed-todo");
  Sortable.create(completedTodosSection, {
    group: {
      name: "shared",
      pull: true,
      put: true,
    },
    animation: 300,
    ghostClass: "drag-ghost",

    draggable: ".todo-item",

    onAdd(evt) {
      operations(
        {
          todoCard: evt.item,

          dragVarName: "todos",
          dropVarName: "completedTodos",
          allowCRUD: ["#delete", "#read"],
          todoMainSide: completedTodosSection,

          popupBoldText: "Moved to Completed Tasks",
          popupEmoji: "🥳🎊",
        },
        "dragAndDrop"
      );
    },
  });

  const pendingTodosSection = document.querySelector("#pending-todo");
  Sortable.create(pendingTodosSection, {
    group: {
      name: "shared",
      pull: true,
      put: true,
    },
    animation: 300,
    ghostClass: "drag-ghost",

    draggable: ".todo-item",

    onAdd(evt) {
      operations(
        {
          todoCard: evt.item,

          dragVarName: "completedTodos",
          dropVarName: "todos",
          allowCRUD: true, // means allow all the crud functions.
          todoMainSide: pendingTodosSection,

          popupBoldText: "Moved to Pending Tasks",
          popupEmoji: "🔄",
        },
        "dragAndDrop"
      );
    },
  });

  console.timeEnd("Performance");
});
