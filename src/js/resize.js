import { getPriorityColor } from "./core.js";

export function resize(wrapperId, sliderDirection) {
  const wrapper = document.querySelector(wrapperId);
  const todoWrapper = wrapper.querySelector(".todo-wrapper");
  const sliderGrabber = wrapper.querySelector(".slider-grabber");

  let isGrabbed = false;
  const body = document.body;

  const mouseUpFunc = () => {
    body.classList.remove("select-none");
    body.classList.remove("cursor-grabbing");
    isGrabbed = false;
  };

  sliderGrabber.addEventListener("mousedown", (e) => {
    body.classList.add("select-none");
    body.classList.add("cursor-grabbing");
    isGrabbed = true;
  });

  // if user mousedown and mouseup on the sliderGrabber
  sliderGrabber.addEventListener("mouseup", mouseUpFunc);
  body.addEventListener("mouseup", mouseUpFunc);

  const rect = todoWrapper.getBoundingClientRect();

  body.addEventListener("mousemove", (e) => {
    if (!isGrabbed) return;

    const center = rect.x + rect.width / 2;
    // 20 gap to prevent instant change
    const centerLeft = center - 20;
    const centerRight = center + 20;

    const direction = e.clientX;

    switch (sliderDirection) {
      case "right":
        if (direction < centerRight) getExpand(wrapper);
        else if (direction > centerLeft) getCollapse(wrapper);
        break;

      case "left":
        if (direction > centerRight) getExpand(wrapper);
        else if (direction < centerLeft) getCollapse(wrapper);
        break;
    }
  });
}

export function getCollapse(wrapperDOM) {
  const todoWrapper = wrapperDOM.querySelector(".todo-wrapper");
  const header = wrapperDOM.querySelector(".wrapper-header");

  const expandTodoWrapper = wrapperDOM.querySelector(".expand-todo-wrapper");
  const collapseTodoWrapper = wrapperDOM.querySelector(
    ".collapse-todo-wrapper"
  );

  gsap.to(todoWrapper, {
    width: 140,
    duration: 0.3,
  });
  header.textContent = header.getAttribute("data-collapse-header");
  expandTodoWrapper.classList.add("hidden");
  collapseTodoWrapper.classList.remove("hidden");
}

export function getExpand(wrapperDOM) {
  const todoWrapper = wrapperDOM.querySelector(".todo-wrapper");
  const header = wrapperDOM.querySelector(".wrapper-header");

  const expandTodoWrapper = wrapperDOM.querySelector(".expand-todo-wrapper");
  const collapseTodoWrapper = wrapperDOM.querySelector(
    ".collapse-todo-wrapper"
  );

  gsap.to(todoWrapper, {
    width: 307,
    duration: 0.3,
  });
  header.textContent = header.getAttribute("data-expand-header");
  expandTodoWrapper.classList.remove("hidden");
  collapseTodoWrapper.classList.add("hidden");
}

export function addTodoInCollapse(todoSideID, todoObject) {
  const collapseTodoWrapper = document.querySelector(todoSideID);
  if (!collapseTodoWrapper) return;

  const todoContainer = collapseTodoWrapper.querySelector(
    ".collapse-todo-container"
  );
  if (!todoContainer) return;

  for (const groupName in todoObject) {
    const splitGrpName = groupName.split(" ");

    let header = splitGrpName[splitGrpName.length - 1].toUpperCase();

    if (header === "MONTH") {
      header = `${splitGrpName[2]} ${header}`;
    }

    const todoWrapper = document.createElement("div");
    todoContainer.appendChild(todoWrapper);

    // Header Part
    todoWrapper.innerHTML += `
       <header class="flex flex-row gap-1 justify-center items-center">
          <span class="font-bold text-2xl text-nowrap">${header}</span>
          <div class="w-full h-[1px] bg-white/30"></div>
       </header>
    `;

    const main = document.createElement("main");
    const todoList = document.createElement("ol");

    todoList.classList.add("flex", "flex-col", "gap-5");

    todoWrapper.appendChild(main.appendChild(todoList));

    for (const todoDetails of todoObject[groupName]) {
      const splitDate = todoDetails.date.split("-");
      const dateTillMonth = `${splitDate[2]}-${splitDate[1]}`;

      const bgColor = getPriorityColor(todoDetails.priority);

      const ifExpiredClasses = header === "EXPIRED" ? `opacity-50` : "";

      todoList.innerHTML += `
      <li
        class="bg-[${bgColor}] ${ifExpiredClasses} rounded-xl w-full h-[100px] grid place-items-center"
      >
        <span class="font-extrabold text-[#1A1A1A]">${dateTillMonth}</span>
      </li>
      `;
    }
  }

  collapseTodoWrapper.classList.add("hidden");
}
