import { initializeUI, startQuoteRotation } from "./ui.js";
import { setupEventListeners } from "./event.js";
import { hoverEffect, clickingLogic, initializeTagInputs } from "./tag.js";
import { middle } from "./downNavbar.js";
import { initializeDragBehaviour } from "./core.js";
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
      const showTodoCreated = document.querySelector("#show-todo-created");
      const quoteBox = document.querySelector("#quote-box");

      if (todoPage && quoteBox) {
        transitionBetweenPages(todoPage, quoteBox);
      }
      if (showTodoCreated && quoteBox) {
        transitionBetweenPages(showTodoCreated, quoteBox);
      }

      resetTodoPageFunc(false);
      resetTodoPageUI(true);
    });
  });

  const createTodoButton = document.querySelector("#create-new-todo-page");
  createTodoButton.addEventListener("click", () => {
    resetTodoPageFunc(true);
    resetTodoPageUI(true);
    showToDoPage();
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

    onAdd(evt) {
      console.log("droped", evt.to);
      dragAndDropTodos({
        dragVarName: "todos",
        dropVarName: "completedTodos",
        dragedTodo: evt.item,
      });

      initializeDragBehaviour({
        allowCRUD: ["#delete"],
        localTodoVarName: "completedTodos",
        todoMainSide: completedTodosSection,
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

    onAdd(evt) {
      console.log("droped", evt.to);
      // Move todo card from 'completedTodos' back to 'todos'
      dragAndDropTodos({
        dragVarName: "completedTodos", // dragged FROM 'completedTodos'
        dropVarName: "todos", // dropped INTO todos
        dragedTodo: evt.item,
      });

      initializeDragBehaviour({
        allowCRUD: true, // means allow all the crud functions.
        localTodoVarName: "todos",
        todoMainSide: pendingTodosSection,
      });
    },
  });
  console.timeEnd("Performance");
});
