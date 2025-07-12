import {
  renderTodoCard,
  addInHTML,
  resetTodoPageFunc,
  showMessagePopup,
  closeOpenSmoothAnimation,
  operations,
  removeThis,
} from "./core.js";
import { backend, pickedTodoData, toolTipForTodo } from "./todo.js";
import { showLongText } from "./ui.js";
import { getCollapse, getExpand } from "./resize.js";

export function setupEventListeners() {
  setupSideBarResize("#ytd-wrapper");
  setupSideBarResize("#dtd-wrapper");

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
    tags: ["general"],
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
    const currTodoDetails = window.currTodoDetails;

    if (currTodoDetails.heading === "" || currTodoDetails.date === "") return;

    let messageInfo;

    if (window.updated) {
      console.log(window.getTodoData);
      if (!window.getTodoData) return;

      backend(
        currTodoDetails,
        "todos",
        true,
        window.getTodoData.localStorageIndex
      );

      const JSONData = JSON.parse(localStorage.getItem("todos"));

      renderTodoCard(
        false,
        JSONData[window.getTodoData.localStorageIndex],
        document.querySelector("#left-main"),
        window.getTodoData.actualID
      );

      messageInfo = {
        invertedBoldTxt: currTodoDetails.heading,
        boldTxt: "Task updated!",
        emoji: "✏️🛠️",
      };
      window.updated = false;
    } else {
      addTodoInBackend({ todoObject: currTodoDetails });

      messageInfo = {
        invertedBoldTxt: currTodoDetails.heading,
        boldTxt: "Task added!",
        emoji: "✨🚀",
      };
    }

    removeThis(document.querySelector("#todo-page"));
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
  });
}

function setupSideBarResize(wrapperId) {
  const wrapper = document.querySelector(wrapperId);

  if (!wrapper) return;
  const clickToCollaspeButton = wrapper.querySelector(
    ".clickto-collapse-button"
  );
  const clickToExpandButton = wrapper.querySelector(".clickto-expand-button");

  clickToCollaspeButton.addEventListener("click", () => {
    getCollapse(wrapper);
  });
  clickToExpandButton.addEventListener("click", () => {
    getExpand(wrapper);
  });
}

export function hotKeysFunction(allowCRUDArray, todoMainSide) {
  const todoCardBox = todoMainSide.querySelectorAll(".todo-card-box");

  todoCardBox.forEach((box) => {
    box.addEventListener(
      "keydown",
      (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        const todoCard = e.target.closest(".todo-card");

        if (todoCard === null) return;

        const keyPressed = e.key.toLowerCase();
        const isAllowed = allowCRUDArray.includes(keyPressed);

        switch (true) {
          case keyPressed === "r" && isAllowed:
            operations({ todoCard }, "read");
            break;

          case keyPressed === "u" && isAllowed:
            operations({ todoCard }, "update");
            break;

          case keyPressed === "d" && isAllowed:
            operations({ todoCard }, "delete");
            break;
        }
      },
      true
    );
  });
}

export function hoverEventCollapseTodo(todoWrapperDOM) {
  todoWrapperDOM.addEventListener(
    "mouseenter",
    (e) => {
      const target = e.target;
      if (target.getAttribute("data-mouseevent-target") === "true") {
        const todoDetails = pickedTodoData(
          target.getAttribute("data-storage-varible-name"),
          target.getAttribute("data-todo-id")
        );

        toolTipForTodo(todoDetails.matchedId);

        const wrapper = document.querySelector("#tool-tip-wrapper");

        const wrapperWidth = wrapper.getBoundingClientRect().width;
        const boundingRect = target.getBoundingClientRect();

        let xAxis = 0;
        if (boundingRect.x + wrapperWidth > window.innerWidth) {
          xAxis = boundingRect.x - wrapperWidth;
        }

        gsap.fromTo(
          wrapper,
          { y: -10, opacity: 0 },
          { y: 0, duration: 0.3, opacity: 1 }
        );
        gsap.set(wrapper, {
          top: boundingRect.top,
          x: xAxis ? xAxis : boundingRect.x,
        });
      }
    },
    true
  );

  todoWrapperDOM.addEventListener(
    "mouseleave",
    (e) => {
      const target = e.target;
      if (target.getAttribute("data-mouseevent-target") === "true") {
        const wrapper = document.querySelector("#tool-tip-wrapper");

        gsap.fromTo(
          wrapper,
          { y: 0, opacity: 1 },
          { y: 10, duration: 0.3, opacity: 0 }
        );
      }
    },
    true
  );
}
