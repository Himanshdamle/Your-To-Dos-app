import {
  transitionBetweenPages,
  addInYoursTodo,
  addInHTML,
  resetTodoPageFunc,
  showMessagePopup,
  closeOpenSmoothAnimation,
  slideAnimation,
  operations,
} from "./core.js";

import { backend, pickedTodoData } from "./todo.js";

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
    tags: ["#general"],
  };

  function addTodoInBackend(todoDetailsObject) {
    const newTodo = {
      ...todoDetailsObject.todoObject,
      id: crypto.randomUUID(),
    };
    backend(newTodo, "todos");
    addInHTML(
      { localTodoVarName: [newTodo] },
      document.querySelector("#pending-todo"),
      {
        allowCRUD: true,
        localTodoVarName: "todos",
        todoMainSide: document.querySelector("#pending-todo"),
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

  // add new todo
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

    let messageInfo;

    if (window.updated) {
      if (!window.getTodoData) return;

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

      messageInfo = {
        invertedBoldTxt: window.currTodoDetails.heading,
        boldTxt: "Task updated!",
        emoji: "✏️🛠️",
      };
    } else {
      addTodoInBackend({ todoObject: window.currTodoDetails });

      messageInfo = {
        invertedBoldTxt: window.currTodoDetails.heading,
        boldTxt: "Task added!",
        emoji: "✨🚀",
      };
    }

    slideAnimation(
      {
        el: "#down-nav-bar",
        direction: "bottom",
        directionValue: "0%",
        display: "flex",
        duration: 0.5,
        onAnimationComplete() {
          showMessagePopup(messageInfo);
        },
      },
      false
    );
  });

  // reset input fields
  document.querySelector("#reset-todo").addEventListener("click", () => {
    resetTodoPageFunc(true);
  });

  // MouseEnter && MouseLeave ---> todo card
  const todoCardBox = document.querySelectorAll(".todo-card-box");
  const menu = document.querySelector("#menu-todoCard");

  let aninateTxt;

  todoCardBox.forEach((box) => {
    box.setAttribute("tabindex", "0");

    // dont accept the default focus border and outline.
    box.classList.add("outline-none", "border-none");

    // MOUSE **ENTER**
    box.addEventListener(
      "mouseenter",
      (e) => {
        if (e.target === box || !e.target.classList.contains("todo-card"))
          return;

        const todoCard = e.target;

        aninateTxt = showLongText(todoCard);

        const menuBtn = todoCard.querySelector(".menu-button-box");

        closeOpenSmoothAnimation(menuBtn).open();
        if (aninateTxt) aninateTxt.run();
      },
      true
    );

    // MOUSE **LEAVE**
    box.addEventListener(
      "mouseleave",
      (e) => {
        if (e.target === box || !e.target.classList.contains("todo-card"))
          return;

        const todoCard = e.target;

        const menuBtn = todoCard.querySelector(".menu-button-box");

        closeOpenSmoothAnimation(menuBtn).close();
        if (aninateTxt) aninateTxt.stop();
      },
      true
    );

    // **CLICK**
    box.addEventListener(
      "click",
      (e) => {
        const menuBtn = e.target.closest(".menu-button-box");
        const todoCard = e.target.closest(".todo-card");

        window.clickedTodoHTML = todoCard;

        if (menuBtn !== null) {
          const todoCardPosition = menuBtn.getBoundingClientRect();

          // means its opened so now we have to hide it.
          if (!menu.classList.contains("hidden")) {
            gsap.fromTo(
              menu,
              { y: 0 },
              {
                y: -10,
                duration: 0.3,
                opacity: 0,
                ease: "power2.out",
                onComplete() {
                  menu.classList.toggle("hidden");
                },
              }
            );

            return;
          }

          menu.classList.toggle("hidden");

          // ADD TASK NAME TO MENU
          const taskName = todoCard
            .querySelector(".show-heading")
            .innerText.toUpperCase();

          const taskNameMenu = menu.querySelector("#task-name");
          taskNameMenu.textContent = taskName;
          taskNameMenu.title = taskName;

          // check if its not overflowing
          let top = todoCardPosition.top;
          if (Math.abs(top - window.innerHeight) <= 400) {
            top = menu.getBoundingClientRect().width;
          }

          // animate it.
          gsap.set(menu, {
            left: todoCardPosition.left + 20,
            top,
          });
          gsap.fromTo(
            menu,
            { y: -10, opacity: 0, filter: "blur(5px)" },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              filter: "blur(0px)",
              onComplete() {
                gsap.set(menu, { backdropFilter: "blur(15px)" });
              },
              ease: "power4.out",
            }
          );
        } else if (todoCard !== null) {
          // select todo card
          const selectedTick = todoCard.querySelector(".selected-tick-visual");

          todoCard.classList.add("border-[#2CB67D]");
          selectedTick.classList.remove("hidden");
        }
      },
      true
    );

    // **BLUR**
    box.addEventListener("blur", (e) => {
      // unSelect todo card
      const todoCard = e.target.querySelector(".todo-card");

      if (todoCard === null) return;

      const selectedTick = todoCard.querySelector(".selected-tick-visual");

      todoCard.classList.remove("border-[#2CB67D]");
      selectedTick.classList.add("hidden");
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

export function hotKeysFunction(allowCRUDArray, todoMainSide) {
  const todoCardBox = todoMainSide.querySelectorAll(".todo-card-box");

  todoCardBox.forEach((box) => {
    box.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const todoCard = e.target.querySelector(".todo-card");
      if (todoCard === null) return;

      const keyPressed = e.key.toLowerCase();

      const isAllowed = allowCRUDArray.includes(keyPressed);
      if (keyPressed === "r" && isAllowed) operations({ todoCard }, "read");
      else if (keyPressed === "u" && isAllowed)
        operations({ todoCard }, "update");
      else if (keyPressed === "d" && isAllowed)
        operations({ todoCard }, "delete");
    });
  });
}
