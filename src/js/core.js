import {
  pickedTodoData,
  backend,
  update,
  readTodo,
  deleteTodo,
  deleteTodoFRONTEND,
  fillData,
} from "./todo.js";

import { toggleClasses } from "./tag.js";
import { addTodoInCollapse } from "./resize.js";

/**
 * Control all the ***CRUD and Drag and Drop operation.***
 */
export function operations(
  taskInfo = {
    todoCard,

    dragVarName,
    dropVarName,
    allowCRUD,
    todoMainSide,
    popupBoldText,
    popupEmoji,
  },
  operationName
) {
  const todoCardHTML = taskInfo.todoCard;

  if (!todoCardHTML) return;

  /**
   *  Drag and Drop operation.
   */
  if (operationName === "dragAndDrop") {
    const movedTodo = dragAndDropTodos({
      dragVarName: taskInfo.dragVarName,
      dropVarName: taskInfo.dropVarName,
      dragedTodo: todoCardHTML,
    });

    if (movedTodo === undefined) return;

    initializeDragBehaviour({
      allowCRUD: taskInfo.allowCRUD,
      localTodoVarName: taskInfo.dropVarName,
      todoMainSide: taskInfo.todoMainSide,
    });

    showMessagePopup({
      invertedBoldTxt: movedTodo[0].heading || "To-Do",
      boldTxt: taskInfo.popupBoldText,
      emoji: taskInfo.popupEmoji,
    });

    return;
  }

  /**
   * CRUD operation.
   */
  window.getTodoData = pickedTodoData(
    todoCardHTML.getAttribute("data-localtodovarname"),
    todoCardHTML
  );

  if (window.getTodoData === undefined) return;

  switch (operationName.toLowerCase()) {
    case "read":
      readTodo(getTodoData.matchedId);
      break;

    case "update":
      update(getTodoData.matchedId);
      break;

    case "delete":
      deleteTodoFRONTEND(() =>
        deleteTodo(
          todoCardHTML.getAttribute("data-localtodovarname"),
          getTodoData.localStorageIndex,
          getTodoData.actualID
        )
      );
      break;
  }
}

/**
 * Animates smooth in/out transitions for elements using GSAP.
 */
export function smoothInnOutTransition(gsapSettings, play, currentDisplay) {
  const body = document.body;
  const bodyOverflow = window.getComputedStyle(body).overflow;

  if (play) {
    gsap.set(body, { overflow: "hidden" });

    gsap.to(gsapSettings.el || document.querySelector(gsapSettings.el), {
      filter: `blur(${gsapSettings.blur || 10}px)`,
      scale: gsapSettings.scale || 1.1,
      opacity: 0,
      delay: gsapSettings.delay || 0,
      duration: gsapSettings.duration || 0.3,
      ease: gsapSettings.ease || "none",
      onComplete() {
        gsap.set(gsapSettings.el, { display: "none" });
        gsap.set(body, { overflow: bodyOverflow });
        if (gsapSettings.onCompleteTransition)
          gsapSettings.onCompleteTransition();
      },
    });
  } else {
    gsap.set(gsapSettings.el, {
      display: currentDisplay || "block",
      filter: `blur(${gsapSettings.blur || 10}px)`,
      scale: gsapSettings.scale || 1.1,
    });
    gsap.set(body, { overflow: "hidden" });

    gsap.to(gsapSettings.el, {
      filter: "blur(0px)",
      scale: 1,
      opacity: gsapSettings.opacity || 0.5,
      ease: gsapSettings.ease,
      duration: gsapSettings.duration,
      onComplete() {
        gsap.set(body, { overflow: bodyOverflow });

        if (gsapSettings.onCompleteTransition)
          gsapSettings.onCompleteTransition();
      },
    });
  }
}

/**
 * Animates smooth Close and open animation on any element
 */
export function closeOpenSmoothAnimation(element) {
  const commonSettings = {
    el: element,
    blur: 10,
    scale: 1.5,
    duration: 0.3,
  };

  const open = () =>
    smoothInnOutTransition(
      {
        opacity: 1,
        ...commonSettings,
      },
      false // means show
    );

  const close = () =>
    smoothInnOutTransition(
      {
        ...commonSettings,
      },
      true // means hide
    );

  return {
    open,
    close,
  };
}

/**
 * Animates smooth **Slide in** and **slide out** animation on any element
 */
export function slideAnimation(gsapSettings, play) {
  const element =
    typeof gsapSettings.el === "string"
      ? document.querySelector(gsapSettings.el)
      : gsapSettings.el;

  const slideInDirection = gsapSettings.direction;
  const slideInValue = gsapSettings.directionValue;

  function onCompleteGsap() {
    if (gsapSettings.onAnimationComplete) {
      gsapSettings.onAnimationComplete();
    }
  }

  if (play) {
    // 👉 SLIDE OUT (hide element)
    gsap.set(element, { display: gsapSettings.display || "block", opacity: 1 });

    const animationConfig = {
      filter: `blur(${gsapSettings.blur || 10}px)`,
      opacity: gsapSettings.opacity || 0,
      duration: gsapSettings.duration || 1,
      ease: gsapSettings.ease || "none",
      onComplete() {
        gsap.set(element, { display: "none" });
        onCompleteGsap();
      },
    };

    if (slideInDirection && slideInValue) {
      animationConfig[slideInDirection] = slideInValue;
    }

    gsap.to(element, animationConfig);
  } else {
    gsap.set(element, { display: gsapSettings.display || "block" });

    const fromVars = {
      opacity: 0,
      filter: `blur(${gsapSettings.blur || 10}px)`,
    };
    const toVars = {
      opacity: 1,
      filter: "blur(0px)",
      duration: gsapSettings.duration || 1,
      ease: gsapSettings.ease || "none",
      onComplete: onCompleteGsap(),
    };

    if (slideInDirection && slideInValue !== undefined) {
      toVars[slideInDirection] = "0%";
    }

    gsap.fromTo(element, fromVars, toVars);
  }
}

/**
 * Show message to user.
 */
let isAnimationRunning = false;
let timerAnimation = null;
export function showMessagePopup(messageObject) {
  const messageInvertedBold = document.querySelector("#message-bold-inverted");
  const messageBold = document.querySelector("#message-bold");
  const messageLight = document.querySelector("#message-light");
  const emoji = document.querySelector("#emoji");

  /**
   * SEND MESSAGE TO USER IN FORMAT.
   */
  emoji.textContent = messageObject.emoji;
  messageInvertedBold.textContent = `${messageObject.invertedBoldTxt || ""}`;
  messageBold.textContent = `${messageObject.boldTxt || ""}`;
  messageLight.textContent = messageObject.lightTxt || "SUCESSFULLY";

  const messageBox = document.querySelector("#message-popup");

  const timer = document.querySelector("#timer-message-popup-end");

  //POPOUT GSAP SETTINGS.
  const popOut = {
    top: `-170%`,
    opacity: 0,
    filter: "blur(10px)",
    duration: 0.5,
    scale: 0.9,
    ease: "power3.in",

    onComplete() {
      messageBox.style.display = "none";
    },
  };

  // CHANGE CONIC TIMER ANGLE (ARC)
  function timerCircle(angle) {
    timer.style.background = `
      conic-gradient(
        #008950 0deg ${angle}deg,
        transparent ${angle}deg 360deg
      )`;
  }

  //POPOUT ANIMATION FUNC.
  function popOutAnimation(onAnimationComplete) {
    gsap.to(messageBox, {
      ...popOut,
      onComplete() {
        onAnimationComplete();
      },
    });
  }

  if (isAnimationRunning || timerAnimation) {
    timerAnimation.kill();

    popOutAnimation(() => {
      isAnimationRunning = false;
      timerCircle(0);
    });
  }

  // TIMER COUNTDOWN ANIMATION
  timerAnimation = gsap.to(
    { count: 0 },
    {
      count: 360,
      duration: 3,
      ease: "none", // linear timing

      onUpdate() {
        isAnimationRunning = true;
        const angle = this.targets()[0].count;
        timerCircle(angle);
      },

      onComplete() {
        popOutAnimation(() => {
          isAnimationRunning = false;
        });
      },
    }
  );

  // INITIAL SETUP
  timerAnimation.pause();
  gsap.set(messageBox, {
    display: "flex",
    filter: "blur(10px)",
    opacity: 0.3,
    scale: 0.9,
    top: "-30%",
  });

  const popUpPosition = -(
    (messageBox.getBoundingClientRect().width / 400) *
    100
  );
  // POPUP ANIMATION
  gsap.to(messageBox, {
    filter: "blur(0px)",
    opacity: 1,
    top: popUpPosition,
    duration: 0.5,
    scale: 1,
    ease: "power4.out",
    onComplete() {
      timerAnimation.play();
    },
  });

  // CONTROL MESSAGE WITH **HOVER TO STOP** || **CLICK TO POPOUT** || **UNHOVER TO PLAY TIMER**
  timer.addEventListener("click", () => {
    popOutAnimation(() => {
      isAnimationRunning = false;
      timerCircle(0);
    });
    timerAnimation.kill();
  });

  messageBox.addEventListener("mouseenter", () => {
    timerAnimation.pause();
  });

  messageBox.addEventListener("mouseleave", () => {
    timerAnimation.play();
  });
}

/**
 * Transitions between two pages using smoothInnOutTransition.
 */
export function transitionBetweenPages(settings = {}) {
  const {
    // Common settings
    duration = 0.6,
    ease = "power2.out",

    // Close animation target & styles
    pageCloseEl,
    opacityClose,
    blurClose,
    scaleClose,

    // Open animation target & styles
    pageOpenEl,
    opacityOpen,
    blurOpen,
    scaleOpen,

    // Fallback/general styles
    opacity = 1,
    blur = 20,
    scale = 1.2,

    // Display type after opening
    display = "flex",

    // Optional callbacks
    onCloseComplete = () => {},
    onOpenComplete = () => {},
    onBothComplete = () => {},
  } = settings;

  const closeElement =
    typeof pageCloseEl === "string"
      ? document.querySelector(pageCloseEl)
      : pageCloseEl;
  const openElement =
    typeof pageOpenEl === "string"
      ? document.querySelector(pageOpenEl)
      : pageOpenEl;

  if (!closeElement || !openElement) {
    console.warn("Invalid elements passed to transitionBetweenPages");
    return;
  }

  smoothInnOutTransition(
    {
      el: closeElement,
      duration,
      ease,
      opacity: opacityClose ?? opacity,
      blur: blurClose ?? blur,
      scale: scaleClose ?? scale,
      onCompleteTransition() {
        onCloseComplete();

        smoothInnOutTransition(
          {
            el: openElement,
            duration,
            ease,
            opacity: opacityOpen ?? opacity,
            blur: blurOpen ?? blur,
            scale: scaleOpen ?? scale,
            onCompleteTransition() {
              onOpenComplete();
              onBothComplete();
            },
          },
          false,
          display
        );
      },
    },
    true
  );
}

/**
 * Gets the locale date string for a given date (e.g., "1st Jan, 2025").
 */
export function getLocaleDateString(date) {
  const [year, month, day] = date.split("-").map(Number);
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (!day || !month || !year) return "Invalid date input!";

  const dayStr = day.toString().split("").at(-1);
  let suffix;

  if (dayStr.includes("3")) suffix = "rd";
  else if (dayStr.includes("2")) suffix = "nd";
  else if (dayStr.includes("1")) suffix = "st";
  else suffix = "th";

  return `${day}${suffix} ${months[month - 1]}, ${year}`;
}

/**
 * Resizes an input element based on its content.
 */
export function resize(inputEl) {
  inputEl.style.width = `${inputEl.value.length + 0.5}ch`;
}

/**
 * returns number of task in each **due date** like "DUE THIS DAY"
 */
export function getTaskNumber(
  dueDateInfo = { todoDates: undefined },
  targetedDate = { selectAll: false, selectorDate: "" }
) {
  if (!dueDateInfo.todoDates) return { totalTask: 0, taskNumber: 0 };

  const taskNumber = {};

  dueDateInfo.todoDates.forEach((date) => {
    if (!targetedDate.selectAll && date !== targetedDate.selectorDate) return;

    let countToDo = 0;

    dueDateInfo.userAllToDos[date].forEach(() => {
      countToDo++;
    });

    taskNumber[date] = countToDo;
  });

  return {
    totalTask:
      JSON.parse(localStorage.getItem(dueDateInfo.localTodoVarName)).length ||
      0,
    taskNumber: targetedDate.selectAll
      ? taskNumber
      : taskNumber[targetedDate.selectorDate],
  };
}

/**
 * Determines the date range for a todo item (e.g., "Expired todo's").
 */
export function getDateRange(date, preWord) {
  const today = new Date();
  const todoDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  todoDate.setHours(0, 0, 0, 0);

  const diffTime = todoDate.getTime() - today.getTime();
  let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    if (preWord.toLowerCase() == "completed") diffDays = Math.abs(diffDays);
    else return { 0: "Expired" };
  }

  if (diffDays === 0) return { 1: `${preWord} today` };

  if (diffDays <= 28) {
    for (let i = 1; i <= 4; i++) {
      if (diffDays <= 7 * i) {
        return i === 1
          ? { 2: `${preWord} this week` }
          : { [i + 1]: `${preWord} over ${i} weeks` };
      }
    }
  }

  if (diffDays <= 365) {
    const months = Math.floor(diffDays / 30);
    return { [months * 5]: `${preWord} over ${months} month` };
  }

  return { 100: `over a year` };
}

/**
 * Groups todos by date range for display.
 */
export function groupTodosWithDate(todoList, preWord = "") {
  const result = todoList.reduce((acc, curr) => {
    if (!curr) {
      console.error("null value found in the todo storage");
      return acc;
    }

    const date = curr.date;

    if (!acc[date]) {
      acc[date] = [curr];
    } else {
      acc[date].push(curr);
    }

    return acc;
  }, {});

  const dateAndTodo = {
    keys: Object.keys(result),
    values: Object.values(result),
  };

  const range = dateAndTodo.keys.reduce((acc, curr, index) => {
    const dateRange = getDateRange(curr, preWord);

    const key = Number(Object.keys(dateRange)[0]);

    if (acc[key]) acc[key].index.push(index);
    else {
      // Use the numeric key as the index and store the label in the accumulator object
      acc[key] = { dueDate: dateRange[key], index: [index] };
    }

    return acc;
  }, {});

  const getValues = Object.keys(range);

  // Sort the keys in ascending order and then use them to get the corresponding labels
  const sortedRange = getValues
    .sort((a, b) => a + b)
    // Finally, map each key back to its human-readable label
    .map((value) => range[value].dueDate);

  const getRangeIndex = Object.values(range);

  const groupedTodosByRange = sortedRange.reduce((acc, curr, index) => {
    getRangeIndex[index].index.forEach((JsonTodoLocation) => {
      const todo = dateAndTodo.values[JsonTodoLocation];

      if (!acc[curr]) {
        acc[curr] = [...todo];
      } else {
        acc[curr].push(...todo);
      }
    });
    return acc;
  }, {});

  return groupedTodosByRange;
}

/**
 * Gets the priority color based on the priority level.
 */
export function getPriorityColor(priority) {
  const priorityColors = {
    low: "#2ecc71",
    medium: "#f1c40f",
    high: "#e67e22",
    urgent: "#FF3D3D",
  };
  return priorityColors[priority] || "#2ecc71";
}

/**
 * Gets the status color based on the count.
 */
export function statusColors(count) {
  if (count >= 20) return "#e74c3c";
  if (count >= 10) return "#e67e22";
  if (count >= 5) return "#f1c40f";
  return "#2ecc71";
}

/**
 * gets percentage of any value
 */
export function getPercentageOf(currValue, maxValue) {
  const percentage = (currValue / maxValue) * 100;
  return {
    decimal: percentage,
    roundOff: Math.floor(percentage),
  };
}

/**
 * Adds a to-do item's HTML representation to the DOM.
 */
export function addInYoursTodo(
  looksSettings,
  userLatestTodo,
  mainDirection,
  id,
  localTodoVarName
) {
  if (!userLatestTodo) return;

  const localeDateString = getLocaleDateString(userLatestTodo.date);

  let tagsHTMLPresentation = userLatestTodo.tags
    .map(
      (tag) => `
             <span title="#${tag}" class="font-light text-nowrap truncate max-w-[80px]">
               <b>#</b>${tag}
             </span>
     `
    )
    .join("");

  const todoHTML = `
    <span title="Priority - ${
      userLatestTodo.priority
    }" class="absolute left-0 top-0 block z-10 rounded-t-2xl overflow-hidden">
      <span class="h-[40px] w-[40px] bg-[${getPriorityColor(
        userLatestTodo.priority
      )}] relative -top-2.5 -left-2.5 block rounded-full"></span>
    </span>

    <span
       class="absolute -top-1 -left-1 bg-[#00FF96] rounded-full z-[500] flex justify-center items-cente border border-[#008950] w-10 h-10 hidden selected-tick-visual"
     >
       <div
         class="bg-[#00FF96] w-[80%] h-[80%] rounded-full text-center flex justify-center items-centerr"
       >
         <svg
           xmlns="http://www.w3.org/2000/svg"
           height="45px"
           viewBox="0 -960 960 960"
           width="45px"
           fill="#222"
         >
           <path
             d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
           ></path>
         </svg>
       </div>
     </span>

    <header class="flex flex-col pb-2 justify-center items-center border-b">
     <div class="show-heading-container relative max-w-[185px] w-[185px] text-2xl italic overflow-hidden text-center">
        <h3 class="show-heading whitespace-nowrap font-bold relative z-10">
           ${userLatestTodo.heading}
        </h3>

        <!-- Left gradient -->
        <div class="absolute left-0 top-0 h-full w-3 bg-gradient-to-r from-[#1A1A1A] to-transparent z-20 pointer-events-none"></div>

        <!-- Right gradient -->
        <div class="absolute right-0 top-0 h-full w-3 bg-gradient-to-l from-[#1A1A1A] to-transparent z-20 pointer-events-none">
        </div>       
     </div>

      <div class="absolute z-50 right-3 top-1 opacity-0 menu-button-box">
        <button 
            class="cursor-pointer menu-button"
            title="Controls"
        >
          <span
            class="flex flex-col gap-0.5 hover:scale-115 transition-[scale] duration-300"
          >
            <div
              class="w-1.5 h-1.5 bg-white rounded-full"
            ></div>
            <div
              class="w-1.5 h-1.5 bg-white rounded-full"
            ></div>
            <div
              class="w-1.5 h-1.5 bg-white rounded-full"
            ></div>
          </span>
        </button>
      </div>
    </header>

    <div class="flex flex-col py-2 relative justify-center items-center">
      <span
        class="flex text-xl gap-2 w-full justify-center items-center font-light"
      >
        ${
          tagsHTMLPresentation ||
          `
        <p title="#general" class="font-light">
          <b class="font-bold">#</b>general
        </p> `
        }
      </span>
    </div>
  `;

  if (id && window.updated) {
    const element = document.getElementById(id);
    element.innerHTML = todoHTML;
  } else {
    const crossMarkerClassTw =
      "before:content-[''] before:absolute before:w-[200%] before:h-[1px] before:bg-white before:block before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 before:rotate-20 before:z-[100] overflow-hidden";
    const addCrossMarker = looksSettings.isExpired ? crossMarkerClassTw : "";
    const reduceOpacity = looksSettings.isExpired ? "opacity-50" : "";

    mainDirection.innerHTML += `
      <article class="grid todo-item gap-3 relative z-50 w-full ${reduceOpacity}" title="${userLatestTodo.heading}">
        <div class="grid place-items-start">
          <header class="relative z-10 w-full text-sm font-light pl-4 flex flex-row gap-1.5">
           <span>On, <span class="font-medium ">${localeDateString}</span></span>
          </header>
          <section
            id="${userLatestTodo.id}"
            data-localTodoVarName="${localTodoVarName}"
            class="todo-card max-w-[270px] bg-[#1A1A1A] relative border max-h-max rounded-2xl p-2 flex-1 w-full cursor-grab ${addCrossMarker}"
          >
            ${todoHTML}
          </section>
        </div>
      </article>
    `;
  }
}

/**
 * Adds all to-do items from localStorage to the DOM, grouped by date range.
 */
export function addInHTML(
  getData = { localTodoVarName: "", data: [] },
  main,
  initializeDragBehaviourParams,
  addNewTodo = false
) {
  if (!getData.data) getData.data = [];

  const data = getData.data[0]
    ? getData.data
    : localStorage.getItem(getData.localTodoVarName);

  if (!data && !addNewTodo) return;

  let JSONData = [];

  if (addNewTodo) JSONData = getData.localTodoVarName;
  else if (typeof data === "string") JSONData = JSON.parse(data);
  else JSONData = getData.data;

  if (!JSONData.length && !addNewTodo) return;

  const preWord = main.getAttribute("data-preWord");
  const groupedData = groupTodosWithDate(JSONData, preWord);

  addTodoInCollapse(`#collapse-${main.id}-wrapper`, groupedData);

  Object.keys(groupedData).forEach((todoDate) => {
    const noSpaceID = todoDate.replace(/\s/g, "");
    const isDueDateSectionPresent = main.querySelector(`#${noSpaceID}`);

    if (!isDueDateSectionPresent) {
      const wordArray = todoDate.toUpperCase().split(" ");

      const first = wordArray[0];
      const last = wordArray.slice(1, todoDate.length - 1).join(" ");

      main.innerHTML += `
      <div id="${noSpaceID}" class="grid cards-wrapper place-items-start gap-2 w-full pl-2">
       <div class="relative w-full flex flex-row justify-start items-center">
         <span
          class="z-10 text-xl pr-1 tracking-wide bg-non flex gap-2"
        >
          <p class="font-light">${first}</p>
          <p class="italic font-bold tracking-wider text-nowrap">${last}</p>
        </span>

        <div class="w-full h-[1px] bg-white/30"></div>
       </div>
      </div>
    `;
    }

    let articleWrapper = document.createElement("div");
    articleWrapper.classList.add(
      "todo-card-box",
      "article-wrappers",
      "grid",
      "grid-cols-[repeat(auto-fit,minmax(238px,1fr))]",
      "w-full",
      "pl-3.5",
      "place-items-start",
      "gap-3.5",
      "selectable-item"
    );
    main.querySelector(`#${noSpaceID}`).append(articleWrapper);

    const isExpired = todoDate === "Expired";

    groupedData[todoDate].forEach((json) => {
      addInYoursTodo(
        {
          isExpired,
        },
        json,
        articleWrapper,
        null,
        initializeDragBehaviourParams.localTodoVarName
      );
    });
  });

  initializeDragBehaviour(initializeDragBehaviourParams);

  return {
    todoDates: Object.keys(groupedData),
    userAllToDos: groupedData,
    localTodoVarName: getData.localTodoVarName,
  };
}

/**
 * shows only a perticular page at a perticular container at one time.
 */
export function showThis(page, slideDownPanel = true) {
  const container = document.querySelector("#mid-main");

  if (slideDownPanel) {
    slideAnimation(
      {
        el: "#down-nav-bar",
        direction: "bottom",
        directionValue: "-100%",
        duration: 0.5,
        display: "flex",
      },
      true
    );

    slideAnimation(
      {
        el: "#crud-operation-wrapper",
        direction: "top",
        directionValue: "-100%",
        duration: 1,
        display: "flex",
      },
      true
    );
  }

  smoothInnOutTransition(
    {
      el: page,
      duration: 0.7,
      ease: "power2.out",
      opacity: 1,
      blur: 20,
      scale: 1.2,
    },
    false
  );

  page.classList.toggle("hidden");

  [...container.children].forEach((el) => {
    if (el !== page) el.style.display = "none";
  });
}

/**
 * remove only a perticular page at a perticular container at one time.
 */
export function removeThis(page) {
  const quoteBox = document.querySelector("#quote-box");

  slideAnimation(
    {
      el: "#down-nav-bar",
      direction: "bottom",
      directionValue: "0%",
      display: "flex",
      duration: 0.5,
    },
    false
  );

  slideAnimation(
    {
      el: "#crud-operation-wrapper",
      direction: "top",
      directionValue: "0%",
      duration: 1,
      display: "flex",
    },
    false
  );

  if (page && quoteBox) {
    transitionBetweenPages({ pageCloseEl: page, pageOpenEl: quoteBox });
  }
}

/**
 * Shows the to-do page with animations and placeholder updates.
 */
export function showToDoPage() {
  const todoPage = document.querySelector("#todo-page");
  const psuedoPlaceholdersCURD = document.querySelectorAll(
    ".psuedo-placeholder-curd"
  );
  const crudInput = document.querySelectorAll(".crud-input");

  showThis(todoPage);

  psuedoPlaceholdersCURD.forEach((placeholder, crudInputIndex) => {
    if (crudInput[crudInputIndex]?.value.length === 0) {
      placeholder.classList.remove("!hidden");
      placeholder.style.display = "block";
    } else {
      placeholder.classList.add("!hidden");
    }
  });
}

/**
 * Resets the to-do page form and state.
 */
export function resetTodoPageFunc(transitionPlaceholders = true) {
  window.currTodoDetails = {
    heading: "",
    description: "",
    date: "",
    time: "",
    priority: "Priority",
    tags: [],
  };

  // Reset the form values if user switch from update to create todo page
  fillData(
    {
      heading: "#heading-input",
      description: "#description-input",
      date: "#date-input",
      time: "#time-input",
      priority: "#priority-input",
    },
    window.currTodoDetails,
    true
  );

  const psuedoPlaceholdersCURD = document.querySelectorAll(
    ".psuedo-placeholder-curd"
  );
  psuedoPlaceholdersCURD.forEach((placeholder) => {
    smoothInnOutTransition(
      {
        duration: 0.5,
        ease: "power2.out",
        el: placeholder,
      },
      !transitionPlaceholders
    );
  });

  const tagNameInputs = document.querySelectorAll(".tag-name");
  const bgSpanTagsHoverEffects = document.querySelectorAll(
    ".bg-span-el-tags-hover-effect"
  );

  const tagsCounter = document.querySelector("#current-len-tags-input");
  if (tagsCounter) {
    tagsCounter.innerText = "0";
  }

  bgSpanTagsHoverEffects.forEach((span) => {
    toggleClasses("remove", span);
  });

  tagNameInputs.forEach((tag) => {
    tag.value = tag.getAttribute("value") || "";
    resize(tag);
  });

  window.tagStates.forEach((state) => {
    state.isClicked = false;
    state.isDblClick = false;
  });
}

/**
 * Helps to switch todo data from one storage to another
 */
export function dragAndDropTodos(getLocalTodoVarNameObject) {
  const fromDragVarName = getLocalTodoVarNameObject.dragVarName;
  const toDropVarName = getLocalTodoVarNameObject.dropVarName;
  const evt = getLocalTodoVarNameObject.dragedTodo;

  const getTodoData = pickedTodoData(
    fromDragVarName,
    evt.querySelector(".todo-card") || evt
  );

  if (getTodoData.matchedId === undefined) return;

  const JSONData = JSON.parse(localStorage.getItem(fromDragVarName)) || null;

  if (JSONData === null || !JSONData[0]) return undefined;

  const movedTodo = JSONData.splice(getTodoData.localStorageIndex, 1);

  const currentDate = new Date();
  movedTodo[0].date = `${currentDate.getFullYear()}-0${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`;

  localStorage.setItem(fromDragVarName, JSON.stringify(JSONData));
  backend(movedTodo[0], toDropVarName);

  return movedTodo;
}

/**
 * Initialize drag and drop behaviour on todo card.
 */
export function initializeDragBehaviour(getSettings) {
  const todoSectionContainer =
    getSettings.todoMainSide.querySelectorAll(".article-wrappers");

  // short cut for allowing all the crud operations - true.
  const allowCRUDArray =
    getSettings.allowCRUD === true
      ? ["#update", "#read", "#delete"]
      : getSettings.allowCRUD;

  todoSectionContainer.forEach((wrapper) => {
    Sortable.create(wrapper, {
      group: {
        name: "shared",
        pull: true,
        // only allow drop into the same section
        put: (to, from) => {
          return to.el === from.el;
        },
      },
      animation: 300,

      // fires when droped a todo card.
      onEnd(evt) {
        const { clientX, clientY } = evt.originalEvent;
        const dropTarget = document.elementFromPoint(clientX, clientY);

        if (!dropTarget) return;

        allowCRUDArray.forEach((elID) => {
          const ancestor = dropTarget.closest(elID);

          if (!ancestor) return;

          const todoCard = evt.item.querySelector("section");

          if (elID === "#update") operations({ todoCard }, "update");
          else if (elID === "#read") operations({ todoCard }, "read");
          else if (elID === "#delete") operations({ todoCard }, "delete");
        });
      },
    });
  });

  allowCRUDArray.forEach((elID) => {
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
        target.style.cursor = "not-allowed";
      });
    }
  });
}
