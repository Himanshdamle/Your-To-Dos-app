import { getLocaleDateString, getPriorityColor } from "./core.js";

export function resize() {
  const pendingSection = document.querySelector("#left-main");
  const sliderGrabber = document.querySelector("#slider-grabber");

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

  body.addEventListener("mousemove", (e) => {
    if (!isGrabbed) return;

    // move center 100px towards right
    const center = pendingSection.getBoundingClientRect().width / 2 + 100;
    // 50px gap to prevent instant change
    const centerLeft = center - 50;
    const centerRight = center + 50;
    const direction = e.clientX;

    if (direction > centerRight) {
      getExpand();
    } else if (direction < centerLeft) {
      getCollapse();
    }
  });
}

function getCollapse() {
  const pendingSection = document.querySelector("#left-main");
  const header = document.querySelector("#pending-section-header");

  const expandTodoWrapper = document.querySelector(
    "#expand-pending-todo-wrapper"
  );
  const collapseTodoWrapper = document.querySelector(
    "#collapse-pending-todo-wrapper"
  );

  gsap.to(pendingSection, {
    width: 140,
    duration: 0.3,
  });
  header.textContent = "YTD";
  expandTodoWrapper.classList.add("hidden");
  collapseTodoWrapper.classList.remove("hidden");
}

function getExpand() {
  const pendingSection = document.querySelector("#left-main");
  const header = document.querySelector("#pending-section-header");

  const expandTodoWrapper = document.querySelector(
    "#expand-pending-todo-wrapper"
  );
  const collapseTodoWrapper = document.querySelector(
    "#collapse-pending-todo-wrapper"
  );

  gsap.to(pendingSection, {
    width: 330,
    duration: 0.3,
  });
  header.textContent = "YOUR TO-DOs";
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

    if (header === "MONTH" || header === "WEEK") {
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
