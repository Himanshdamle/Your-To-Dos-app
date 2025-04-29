import {
  transitionBetweenPages,
  addInYoursTodo,
  addInHTML,
  initializeDragBehaviour,
} from "./core.js";
import { backend } from "./todo.js";

export function setupEventListeners() {
  window.typingInputIds = [
    "heading-input",
    "description-input",
    "date-input",
    "time-input",
    "priority-input",
  ];

  window.currTodoDetails = {
    heading: "",
    description: "",
    date: "",
    time: "",
    priority: "",
    tags: [],
  };

  window.typingInputIds.forEach((eachId) => {
    const input = document.getElementById(eachId);
    const key = input.name;

    window.currTodoDetails[key] = "";

    input.addEventListener("input", () => {
      if (key === "tag") window.currTodoDetails[key].push(input.value);
      else window.currTodoDetails[key] = input.value;

      const pTag = document.getElementById(`current-len-${eachId}`);

      if (pTag) {
        pTag.innerText = input.value.length
          .toString()
          .padStart(pTag.getAttribute("maxDigit"), "0");
      }
    });
  });

  document.querySelector("#quick-fill").addEventListener("click", () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    const dateInput = document.getElementById("date-input");
    const timeInput = document.getElementById("time-input");

    dateInput.value = formattedDate;
    timeInput.value = formattedTime;

    window.currTodoDetails.date = formattedDate;
    window.currTodoDetails.time = formattedTime;
  });

  document.querySelector("#add-todo").addEventListener("click", () => {
    if (
      window.currTodoDetails.heading === "" ||
      window.currTodoDetails.priority === ""
    )
      return;

    if (window.currTodoDetails.time.length <= 4) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      window.currTodoDetails.time = `${hours}:${minutes}`;
    }

    transitionBetweenPages(
      document.querySelector("#todo-page"),
      document.querySelector("#show-todo-created")
    );

    document.querySelector("#todo-name").innerText =
      window.currTodoDetails.heading;

    if (window.updated) {
      backend(
        window.currTodoDetails,
        "todos",
        true,
        window.getTodoData.localStorageIndex
      );

      const JSONData = JSON.parse(localStorage.getItem("todos"));

      addInYoursTodo(
        false,
        JSONData[window.getTodoData.localStorageIndex],
        document.querySelector("#left-main"),
        window.getTodoData.actualID
      );
    } else {
      const newTodo = { ...window.currTodoDetails, id: crypto.randomUUID() };
      backend(newTodo, "todos");
      addInHTML(
        [newTodo],
        document.querySelector("#left-main"),
        {
          allowCRUD: true,
          localTodoVarName: "todos",
          todoMainSide: document.querySelector("#left-main"),
        },
        true // add only new todo to the 'pendingTodosSection'.
      );
    }
  });

  document.querySelector("#reset-todo").addEventListener("click", () => {
    resetTodoPageFunc(true);
  });
}
