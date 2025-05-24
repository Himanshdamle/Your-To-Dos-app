import { initializeUI, startQuoteRotation } from "./ui.js";
import { setupEventListeners } from "./event.js";
import { hoverEffect, clickingLogic, initializeTagInputs } from "./tag.js";
import { middle } from "./downNavbar.js";
import { initializeDragBehaviour, showMessagePopup } from "./core.js";
import {
  transitionBetweenPages,
  resetTodoPageFunc,
  resetTodoPageUI,
  showToDoPage,
  dragAndDropTodos,
} from "./core.js";

// Global variables
window.typingInputIds = [];
window.currTodoDetails = {};
window.countTags = 0;
window.tagStates = [];
window.updated = false;
window.hoverObject = {};

document.addEventListener("DOMContentLoaded", () => {
  console.time("Performance");
  initializeUI();
  setupEventListeners();
  startQuoteRotation();
  initializeTagInputs();
  middle();

  const closeTodoButtons = document.querySelectorAll(".close-todo-page");

  closeTodoButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const todoPage = document.querySelector("#todo-page");
      const quoteBox = document.querySelector("#quote-box");

      if (todoPage && quoteBox) {
        transitionBetweenPages({ pageCloseEl: todoPage, pageOpenEl: quoteBox });
      }

      resetTodoPageFunc(false);
      resetTodoPageUI(true);
    });
  });

  function openCreateToDoPage() {
    resetTodoPageFunc(true);
    resetTodoPageUI(true);
    showToDoPage();
  }

  const createTodoButton = document.querySelector("#create-new-todo-page");
  createTodoButton.addEventListener("click", () => {
    openCreateToDoPage();
  });

  document.body.addEventListener("keydown", (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag !== "input" && tag !== "textarea" && e.key.toLowerCase() === "c") {
      openCreateToDoPage();
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

  const completedTodosSection = document.querySelector("#right-main");

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
      const movePendingTodo = dragAndDropTodos({
        dragVarName: "todos",
        dropVarName: "completedTodos",
        dragedTodo: evt.item,
      });

      initializeDragBehaviour({
        allowCRUD: ["#delete"],
        localTodoVarName: "completedTodos",
        todoMainSide: completedTodosSection,
      });

      showMessagePopup({
        invertedBoldTxt: movePendingTodo[0].heading || "To-Do",
        boldTxt: "Moved to Completed Tasks",
        lightTxt: " ",
        emoji: "🥳🎊",
      });
    },
  });

  const pendingTodosSection = document.querySelector("#left-main");
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
      // Move todo card from 'completedTodos' back to 'todos'
      const moveCompletedTodo = dragAndDropTodos({
        dragVarName: "completedTodos", // dragged FROM 'completedTodos'
        dropVarName: "todos", // dropped INTO todos
        dragedTodo: evt.item,
      });

      initializeDragBehaviour({
        allowCRUD: true, // means allow all the crud functions.
        localTodoVarName: "todos",
        todoMainSide: pendingTodosSection,
      });

      showMessagePopup({
        invertedBoldTxt: moveCompletedTodo[0].heading || "To-Do",
        boldTxt: "Moved to Pending Tasks",
        emoji: "🔄",
      });
    },
  });

  console.timeEnd("Performance");
});
