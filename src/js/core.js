/**
 * Animates smooth in/out transitions for elements using GSAP.
 */
export function smoothInnOutTransition(gsapSettings, play, currentDisplay) {
  const body = document.body;

  if (play) {
    gsap.set(body, { overflow: "hidden" });
    gsap.to(gsapSettings.el, {
      filter: `blur(${gsapSettings.blur || 10}px)`,
      scale: gsapSettings.scale || 1.1,
      opacity: 0,
      duration: gsapSettings.duration || 0.3,
      ease: gsapSettings.ease || "none",
      onComplete() {
        gsap.set(gsapSettings.el, { display: "none" });
        gsap.set(body, { overflow: "unset" });
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
        gsap.set(body, { overflow: "unset" });
      },
    });
  }
}

/**
 * Transitions between two pages using smoothInnOutTransition.
 */
export function transitionBetweenPages(pageCloseEl, pageOpenEl) {
  smoothInnOutTransition(
    {
      el: pageCloseEl,
      duration: 0.7,
      ease: "power2.out",
      opacity: 1,
      blur: 20,
      scale: 1.2,
      onCompleteTransition() {
        smoothInnOutTransition(
          {
            el: pageOpenEl,
            duration: 0.7,
            ease: "power2.out",
            opacity: 1,
            blur: 20,
            scale: 1.2,
          },
          false,
          "flex"
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
  const suffix = day === 3 ? "rd" : day === 2 ? "nd" : day === 1 ? "st" : "th";
  return `${day}${suffix} ${months[month - 1]}, ${year}`;
}

/**
 * Resizes an input element based on its content.
 */
export function resize(inputEl) {
  inputEl.style.width = `${inputEl.value.length + 0.5}ch`;
}

/**
 * Toggles CSS classes for tag hover effects.
 */
export function toggleClasses(methodName, bgEl) {
  bgEl.classList[methodName]("scale-100", "bg-span-el-tags-hover-effect");
  bgEl.style.transformOrigin = `${window.hoverObject?.x || 0}px ${
    window.hoverObject?.y || 0
  }px`;
}

/**
 * Determines the date range for a todo item (e.g., "Expired todo's").
 */
export function getDateRange(date) {
  const today = new Date();
  const todoDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  todoDate.setHours(0, 0, 0, 0);

  const diffTime = todoDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Expired todo's";
  if (diffDays === 0) return "Due this day";

  if (diffDays <= 28) {
    for (let i = 1; i <= 4; i++) {
      if (diffDays <= 7 * i) {
        return i === 1 ? "due this week" : `due over ${i} weeks`;
      }
    }
  }

  if (diffDays <= 365) {
    const months = Math.floor(diffDays / 30);
    return `due over ${months} months`;
  }

  return "over a year";
}

/**
 * Groups todos by date range for display.
 */
export function groupTodosWithDate(todoList) {
  const result = todoList.reduce((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) {
      acc[date] = [curr];
    } else {
      acc[date].push(curr);
    }
    return acc;
  }, {});

  const keysNdValues = {
    keys: Object.keys(result),
    values: Object.values(result),
  };

  const range = keysNdValues.keys.map((date) => getDateRange(date));

  const nlp = range.reduce((acc, curr, index) => {
    const todo = keysNdValues.values[index];
    if (!acc[curr]) {
      acc[curr] = [...todo];
    } else {
      acc[curr].push(...todo);
    }
    return acc;
  }, {});

  return nlp;
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
 * Adds a to-do item's HTML representation to the DOM.
 */
export function addInYoursTodo(
  isExpiredTodo,
  userLatestTodo,
  mainDirection,
  id
) {
  if (!userLatestTodo) return;

  const localeDateString = getLocaleDateString(userLatestTodo.date);
  const priorityColor = getPriorityColor(userLatestTodo.priority);

  const expiredSticker = `
    <span class="absolute right-2 bottom-2 z-10 w-[100px] h-[100px]">
      <span class="relative">
        <img class="w-full h-full" src="assets/Group 16.svg" alt="red-sticker" />
        <p class="text-sm text-nowrap absolute left-[50%] top-[50%] translate-x-[-50%] px-2">
          <i><b>${localeDateString}</b></i>
        </p>
      </span>
    </span>
  `;

  const todoHTML = `
    <span class="absolute left-0 top-0 block z-10 rounded-t-2xl overflow-hidden">
      <span class="h-[40px] w-[40px] bg-[${priorityColor}] relative -top-2.5 -left-2.5 block rounded-full"></span>
    </span>
    ${isExpiredTodo ? expiredSticker : ""}
    <header class="flex flex-col pb-2 justify-center items-center border-b">
      <p>Header</p>
      <h3 id="show-heading" class="text-center p-1.5 w-[95%] font-bold text-xl italic">
        ${userLatestTodo.heading}
      </h3>
    </header>
    <div class="flex flex-col py-2 relative justify-center items-center">
      <p>Description</p>
      <p id="show-description" class="text-center p-1.5 w-[95%] overflow-hidden max-h-20 font-normal text-xl italic">
        ${userLatestTodo.description || "No description provided."}
      </p>
      <div class="absolute bottom-2 left-0 w-full h-6 bg-gradient-to-t from-[#1a1a1a] to-transparent pointer-events-none"></div>
    </div>
  `;

  if (id && window.updated) {
    const element = document.getElementById(id);
    if (element) element.innerHTML = todoHTML;
  } else {
    const crossMarkerClassTw =
      "before:content-[''] before:absolute before:w-[200%] before:h-[1px] before:bg-white before:block z-[100] before:rotate-30 before:-left-[75%] before:translate-y-10 overflow-hidden";
    const addCrossMarker = isExpiredTodo ? crossMarkerClassTw : "";

    mainDirection.innerHTML += `
      <article class="grid gap-3 relative z-50 max-w-[300px] w-full overflow-hidden" title="${userLatestTodo.heading}">
        <div class="grid place-items-end">
          <header class="relative z-10 w-full text-sm font-medium pl-8 before:pl-3 mb-1.5 bg-[#0f0f0f] before:content-[''] before:absolute before:w-full before:h-[1px] before:left-4 before:bottom-0 before:bg-white">
            ${localeDateString}
          </header>
          <section
            id="${userLatestTodo.id}"
            class="todo-card bg-[#1A1A1A] relative border max-h-max rounded-2xl p-2 flex-1 w-full cursor-grab ${addCrossMarker}"
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
export function addInHTML(localTodoVarName, main, addNewTodo = false) {
  const data = localStorage.getItem(localTodoVarName);
  if (!data && !addNewTodo) return;

  const JSONData = JSON.parse(data) || [];
  if (!JSONData.length && !addNewTodo) return;

  const groupedData = groupTodosWithDate(JSONData);
  let expiredTodoCount = 0;

  Object.keys(groupedData).forEach((todoDate) => {
    let articleWrapper;
    if (!addNewTodo) {
      main.innerHTML += `
        <div id="${todoDate}" class="grid place-items-center gap-2.5 w-full">
          <h1
            class="relative z-10 text-xl px-3 tracking-wide bg-none before:content-[''] before:absolute before:w-full before:h-[1px] before:bg-gradient-to-l before:from-white before:to-transparent before:-left-full before:top-1/2 before:-translate-y-1/2 after:content-[''] after:absolute after:w-full after:h-[1px] after:bg-gradient-to-r after:from-white after:to-transparent after:left-full after:top-1/2 after:-translate-y-1/2 font-bold"
          >
            ${todoDate.toUpperCase()}
          </h1>
        </div>
      `;

      const dateFilterDropdown = document.querySelector(
        "#date-filter-dropdown"
      );
      if (dateFilterDropdown) {
        dateFilterDropdown.innerHTML += `
          <li data-value="${todoDate}" class="text-start px-2 py-1 cursor-pointer">
            Due on <b class="underline"><i>${todoDate}</i></b>
          </li>
        `;
      }

      articleWrapper = document.createElement("div");
      articleWrapper.classList.add(
        "article-wrappers",
        "grid",
        "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
        "w-full",
        "place-items-center",
        "gap-2.5"
      );
      if (todoDate) document.getElementById(todoDate).append(articleWrapper);
    }

    const isExpired = todoDate === "Expired todo's";
    groupedData[todoDate].forEach((json) => {
      if (isExpired) expiredTodoCount++;
      addInYoursTodo(isExpired, json, articleWrapper);
    });
  });

  const pendingTodoCountPtag = document.querySelector("#pending-todo-count");
  const expiredTodoCountPtag = document.querySelector("#expired-todo-count");

  const pendingTodoCount = JSONData.length - expiredTodoCount;

  if (pendingTodoCountPtag) {
    pendingTodoCountPtag.innerText = pendingTodoCount;
    pendingTodoCountPtag.style.color = statusColors(pendingTodoCount);
  }
  if (expiredTodoCountPtag) {
    expiredTodoCountPtag.innerText = expiredTodoCount;
    expiredTodoCountPtag.style.color = statusColors(expiredTodoCount);
  }
}

/**
 * Shows the to-do page with animations and placeholder updates.
 */
export function showToDoPage() {
  const todoPage = document.querySelector("#todo-page");
  const midMain = document.querySelector("#mid-main");
  const psuedoPlaceholdersCURD = document.querySelectorAll(
    ".psuedo-placeholder-curd"
  );
  const crudInput = document.querySelectorAll(".crud-input");

  if (todoPage && midMain) {
    smoothInnOutTransition(
      {
        el: todoPage,
        duration: 0.7,
        ease: "power2.out",
        opacity: 1,
        blur: 20,
        scale: 1.2,
      },
      false
    );

    [...midMain.children].forEach((el) => {
      if (el !== todoPage) el.style.display = "none";
    });
  }

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
 * Resets the to-do page UI, toggling input states and headers.
 */
export function resetTodoPageUI(shouldReset) {
  const elTwPropertiesPairArray = [
    [["textarea", ".borderd-div", "#priority-input"], shouldReset, "border"],
    [
      ["#description-input", "#priority-section", "#priority-input"],
      !shouldReset,
      "text-center",
    ],
    [
      ["#quick-fill", ".count-limit", ".psuedo-placeholder-curd", "#tip-box"],
      !shouldReset,
      "!hidden",
    ],
    [["#priority-pTag"], !shouldReset, "!block"],
  ];

  elTwPropertiesPairArray.forEach(([selectorArray, shouldAdd, ...classes]) => {
    selectorArray.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        shouldAdd
          ? el.classList.add(...classes)
          : el.classList.remove(...classes);
      });
    });
  });

  const changeHeader = document.querySelectorAll(".must-section");
  if (!shouldReset) {
    changeHeader.forEach((header) => {
      const arr = header.innerHTML.trim().split(/\s+/);
      const heading = arr.slice(0, -1);
      header.innerHTML = heading.join(" ");
    });
  } else {
    changeHeader.forEach((header) => {
      header.innerHTML =
        header.getAttribute("data-heading") || header.innerHTML;
    });
  }

  document.querySelectorAll("textarea, input, select").forEach((el) => {
    if (!shouldReset) {
      el.setAttribute("readonly", true);
    } else {
      el.removeAttribute("readonly");
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
    priority: "",
    tags: [],
  };

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

  const priorityBtnHTML = `                    <p>Priority [must]</p>
                    <span id="dropdown-svg" style="transform: rotateZ('-90deg')"
                      ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#FFFFFF"
                      >
                        <path d="M480-384 288-576h384L480-384Z" />
                      </svg>
                    </span>`;

  window.typingInputIds.forEach((inputid) => {
    const el = document.getElementById(inputid);
    if (el) {
      if (inputid === "priority-input") {
        el.innerHTML = priorityBtnHTML;
        el.classList.remove("justify-center");
        el.classList.remove("cursor-text");
        el.classList.remove("pointer-events-none");

        el.classList.add("cursor-pointer");
        el.classList.add("justify-start");
      }

      if (el.value.length >= 1) el.value = "";
      const pTag = document.getElementById(`current-len-${inputid}`);
      if (pTag) {
        pTag.innerText = "0".repeat(pTag.getAttribute("maxDigit") || 2);
      }
    }
  });
}
