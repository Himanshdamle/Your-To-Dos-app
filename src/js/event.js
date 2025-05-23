import {
  transitionBetweenPages,
  addInYoursTodo,
  addInHTML,
  resetTodoPageFunc,
  showMessagePopup,
  closeOpenSmoothAnimation,
} from "./core.js";

import {
  backend,
  pickedTodoData,
  update,
  readTodo,
  deleteTodoFRONTEND,
  deleteTodo,
} from "./todo.js";

import { showLongText } from "./ui.js";

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

  function addTodoInBackend(todoDetailsObject) {
    const newTodo = {
      ...todoDetailsObject.todoObject,
      id: crypto.randomUUID(),
    };
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

  //  match current typed character lenght of input fields
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

  // reset quick fill current date and time
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

  // reset add new todo
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

    transitionBetweenPages({
      pageCloseEl: "#todo-page",
      pageOpenEl: "#quote-box",
    });

    if (window.updated) {
      if (!window.getTodoData) {
        showMessagePopup({
          boldTxt: "ERROR FAILED TO UPDATE",
          lightTxt: " ",
          emoji: "❗",
        });

        return;
      }

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

      showMessagePopup({
        invertedBoldTxt: window.currTodoDetails.heading,
        boldTxt: "Task updated!",
        emoji: "✏️🛠️",
      });
    } else {
      addTodoInBackend({ todoObject: window.currTodoDetails });

      showMessagePopup({
        invertedBoldTxt: window.currTodoDetails.heading,
        boldTxt: "Task added!",
        emoji: "✨🚀",
      });
    }
  });

  // reset input fields
  document.querySelector("#reset-todo").addEventListener("click", () => {
    resetTodoPageFunc(true);
  });

  // MouseEnter && MouseLeave ---> todo card
  const todoCardList = document.querySelectorAll(".todo-card");

  todoCardList.forEach((todoCard) => {
    const downloadButton = todoCard.querySelector(
      ".download-todo-button-parent"
    );

    const aninateTxt = showLongText(todoCard);

    // mouseenter event listner code.
    todoCard.addEventListener("mouseenter", () => {
      closeOpenSmoothAnimation(downloadButton).open();
      aninateTxt.run();
    });

    // mouseLeave event listner code.
    todoCard.addEventListener("mouseleave", () => {
      closeOpenSmoothAnimation(downloadButton).close();
      aninateTxt.stop();
    });
  });
}

// download todo as notepad.
export function downloadTodos(downloadBtns) {
  downloadBtns.forEach((button) => {
    button.addEventListener("click", () => {
      const storageKey = button.getAttribute("localtodovarname");
      const todoID = button.getAttribute("todoid");
      const todoDetails = pickedTodoData(storageKey, null, todoID).matchedId;

      const formatted = [todoDetails]
        .map((todo) => {
          return `
  ==================== 📌 TODO ====================
            
  📝 Title     : ${todo.heading}
  🗓️  Due Date  : ${todo.date}
  ⏰ Time      : ${todo.time}
  🎯 Priority  : ${todo.priority.toUpperCase()}
  🏷️  Tags      : ${todo.tags.length ? "#" + todo.tags.join(", #") : "None"}
  📝 Description:\n
           ${todo.description}
  
  ======================================================
            
              `;
        })
        .join("\n\n");

      const blob = new Blob([formatted], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      const safeTitle = todoDetails.heading
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();

      // Then use it as the file name
      a.download = `todo_${safeTitle}.txt`;

      // Simulate click
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    });
  });
}

export function clickToCrudOperation(todoCard) {
  todoCard.setAttribute("tabindex", "0");

  const selectedTick = todoCard.querySelector(".selected-tick-visual");

  // FOCUS
  todoCard.addEventListener("click", () => {
    todoCard.classList.add("border-[#2CB67D]");
    selectedTick.classList.remove("hidden");
  });

  todoCard.addEventListener("blur", () => {
    todoCard.classList.remove("border-[#2CB67D]");
    selectedTick.classList.add("hidden");
  });

  // KEY DOWN EVENT
  todoCard.addEventListener("keydown", (e) => {
    const keyPressed = e.key.toLowerCase();

    window.getTodoData = pickedTodoData(
      todoCard.getAttribute("data-localtodovarname"),
      todoCard
    );

    if (keyPressed === "r") readTodo(getTodoData.matchedId);
    else if (keyPressed === "u") update(getTodoData.matchedId);
    else if (keyPressed === "d")
      deleteTodoFRONTEND(() =>
        deleteTodo(
          todoCard.getAttribute("data-localtodovarname"),
          getTodoData.localStorageIndex,
          getTodoData.actualID
        )
      );
  });
}
