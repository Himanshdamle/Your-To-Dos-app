import { initializeUI, startQuoteRotation } from "./ui.js";
import { setupEventListeners } from "./event.js";
import { hoverEffect, clickingLogic, initializeTagInputs } from "./tag.js";
import {
  pickedTodoData,
  backend,
  update,
  readTodo,
  deleteTodo,
} from "./todo.js";
import {
  transitionBetweenPages,
  resetTodoPageFunc,
  resetTodoPageUI,
  showToDoPage,
} from "./core.js";

// Global variables
window.typingInputIds = [];
window.currTodoDetails = {};
window.countTags = 0;
window.tagStates = [];
window.updated = false;
window.getTodoData = {};
window.hoverObject = {};

document.addEventListener("DOMContentLoaded", () => {
  initializeUI();
  setupEventListeners();
  startQuoteRotation();
  initializeTagInputs();

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
  if (createTodoButton) {
    createTodoButton.addEventListener("click", () => {
      resetTodoPageFunc(true);
      resetTodoPageUI(true);
      showToDoPage();
    });
  }

  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    const bg = tag.querySelector("#bg-color-tag");
    const state = { isClicked: false, isDblClick: false };

    hoverEffect(tag, bg, state);
    clickingLogic(tag, bg, state);

    window.tagStates.push(state);
  });

  const articleWrappers = document.querySelectorAll(".article-wrappers");
  articleWrappers.forEach((wrapper) => {
    Sortable.create(wrapper, {
      group: {
        name: "shared",
        pull: true,
        put: true,
      },
      animation: 300,
      ghostClass: "drag-ghost",
      onAdd(evt) {
        window.getTodoData = pickedTodoData("completedTodos", evt.item);
        const JSONData =
          JSON.parse(localStorage.getItem("completedTodos")) || [];
        JSONData.splice(window.getTodoData.localStorageIndex, 1);
        localStorage.setItem("completedTodos", JSON.stringify(JSONData));
        backend(window.getTodoData.matchedId, "todos");
      },
      onEnd(evt) {
        const { clientX, clientY } = evt.originalEvent;
        const dropTarget = document.elementFromPoint(clientX, clientY);
        if (dropTarget) {
          ["#update", "#read", "#delete"].forEach((elID) => {
            const ancestor = dropTarget.closest(elID);
            if (ancestor) {
              window.getTodoData = pickedTodoData(
                "todos",
                evt.item.querySelector("section")
              );
              if (elID === "#update") {
                update(window.getTodoData.matchedId);
              } else if (elID === "#read") {
                readTodo(window.getTodoData.matchedId);
              } else if (elID === "#delete") {
                deleteTodo(
                  "todos",
                  window.getTodoData.localStorageIndex,
                  window.getTodoData.actualID
                );
              }
            }
          });
        }
      },
    });
  });

  ["#update", "#read", "#delete"].forEach((elID) => {
    const target = document.querySelector(elID);
    if (target) {
      target.addEventListener("dragover", (e) => {
        e.preventDefault();
        target.style.cursor = "copy";
      });

      target.addEventListener("dragleave", () => {
        target.style.cursor = "default";
      });

      target.addEventListener("drop", (e) => {
        e.preventDefault();
        target.style.cursor = "default";
      });
    }
  });

  const rightMain = document.querySelector("#right-main");
  if (rightMain) {
    Sortable.create(rightMain, {
      group: {
        name: "shared",
        pull: true,
        put: true,
      },
      animation: 300,
      ghostClass: "drag-ghost",
      onAdd(evt) {
        window.getTodoData = pickedTodoData("todos", evt.item);
        const JSONData = JSON.parse(localStorage.getItem("todos")) || [];
        JSONData.splice(window.getTodoData.localStorageIndex, 1);
        localStorage.setItem("todos", JSON.stringify(JSONData));
        backend(window.getTodoData.matchedId, "completedTodos");
      },
    });
  }
});
