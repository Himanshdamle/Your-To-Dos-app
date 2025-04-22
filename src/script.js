const closeTodoBtn = document.querySelectorAll(".close-todo-page");
const quoteBox = document.querySelector("#quote-box");

//CRUD
const createTodo = document.querySelector("#create-new-todo-page");
const updateU = document.querySelector("#update");
const readR = document.querySelector("#read");
const deleteD = document.querySelector("#delete");

const midMain = document.querySelector("#mid-main");
const leftMain = document.querySelector("#left-main");
const rightMain = document.querySelector("#right-main");
const todoPage = document.querySelector("#todo-page");
const todoName = document.querySelector("#todo-name");
const showTodoCreated = document.querySelector("#show-todo-created");
const psuedoPlaceholdersCURD = document.querySelectorAll(
  ".psuedo-placeholder-curd"
);
const crudInput = document.querySelectorAll(".crud-input");

let getTodoData;
let JSONData;
let articleWrapper;
let updated = false;

const priorityColors = {
  low: "#2ecc71",
  medium: "#f1c40f",
  high: "#e67e22",
  urgent: "#e74c3c",
};

function smoothInnOutTransition(gsapSettings, play, currentDisplay) {
  const body = document.body;

  if (play) {
    // PLAY ANIMATION == display: block || when we have to popup element

    gsap.set(body, { overflow: "hidden" });
    gsap.to(gsapSettings.el, {
      filter: `blur(${gsapSettings.blur || 10}px)`,
      scale: gsapSettings.scale || 1.1,
      opacity: 0,
      x: 10,
      duration: gsapSettings.duration || "0.3",
      ease: gsapSettings.ease || "none",
      onComplete() {
        gsap.set(gsapSettings.el, { display: "none" });
        gsap.set(body, { overflow: "unset" });
        gsapSettings.onCompleteTransition();
      },
    });
  } else {
    // PLAY IN REVERSE == display: none || when we have to close element

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
      x: 0,
      ease: gsapSettings.ease,
      duration: gsapSettings.duration,
      onComplete() {
        gsap.set(body, { overflow: "unset" });
      },
    });
  }
}

function getDateRange(date) {
  const today = new Date().toISOString().split("T")[0];
  const [year, month, day] = date.split("-").map((number) => number);
  const [currYear, currMonth, currDay] = today
    .split("-")
    .map((number) => number);

  let [diffYear, diffMonth, diffDay] = [
    year - currYear,
    month - currMonth,
    day - currDay,
  ];

  if (diffYear < 0 || month < currMonth || day < currDay)
    return "Expired todo's";

  if (diffDay < 0 || diffMonth) diffDay += 30;
  if (diffMonth < 0 || diffYear) diffMonth += 12;

  const isOverMonth = diffMonth >= 1 && diffMonth <= 11;

  if (diffDay <= 28 && !isOverMonth) {
    if (diffDay === 0) return "Due this day";

    for (let i = 1; i <= 4; i++) {
      if (i == 1) {
        if (diffDay / (7 * i) <= 1) return "due this week";
      } else {
        if (diffDay / (7 * i) <= 1) return `due over ${i} weeks`;
      }
    }
  }

  if (isOverMonth) {
    return `due over ${diffMonth} months`;
  }

  return `over a year`; // lastly if its over a year
}

function groupTodosWithDate(todoList) {
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

function getLocaleDateString(date) {
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
  const suffix = day == 3 ? "rd" : day == 2 ? "nd" : day == 1 ? "st" : "th";

  return `${day}${suffix} ${months[month - 1]}, ${year}`;
}

function addInHTML(localTodoVarName, main, addNewTodo) {
  const data = localStorage.getItem(localTodoVarName);
  if (data || addNewTodo) {
    JSONData = JSON.parse(data);
    // if (!JSONData[0]) return;

    const groupedData = groupTodosWithDate(JSONData);

    Object.keys(groupedData).forEach((todoDate) => {
      if (!addNewTodo) {
        main.innerHTML += `
        <div id="${todoDate}" class="grid place-items-center gap-2.5 w-full">
           <h1
                 class="relative z-10 text-xl px-3 tracking-wide bg-none before:content-[''] before:absolute before:w-full before:h-[1px] before:bg-gradient-to-l before:from-white before:to-transparent before:-left-full before:top-1/2 before:-translate-y-1/2 after:content-[''] after:absolute after:w-full after:h-[1px] after:bg-gradient-to-r after:from-white after:to-transparent after:left-full after:top-1/2 after:-translate-y-1/2 font-bold"
               >
                 ${todoDate.toUpperCase()}
           </h1>
           <!--  -->
        </div>
       `;
        articleWrapper = document.createElement("div");
        articleWrapper.classList.add(
          "article-wrappers",
          "grid",
          "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
          "w-full",
          "place-items-center",
          "gap-2.5"
        );
        document.getElementById(todoDate).append(articleWrapper);
      }

      const isExpired = todoDate === "Expired todo's";

      groupedData[todoDate].forEach((json) => {
        addInYoursTodo(isExpired, json, articleWrapper);
      });
    });
  }
}

addInHTML("todos", leftMain);
addInHTML("completedTodos", rightMain);

function showToDoPage() {
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

  psuedoPlaceholdersCURD.forEach((placeholder, crudInputIndex) => {
    if (crudInput[crudInputIndex].value.length === 0) {
      placeholder.classList.remove("!hidden");
      placeholder.style.display = "block"; // extra safety.
    } else {
      placeholder.classList.add("!hidden");
    }
  });
}

const resize = (inputEl) => {
  inputEl.style.width = `${inputEl.value.length + 0.5}ch`;
};
function toggleClasses(methodName, bgEl) {
  bgEl.classList[methodName]("scale-100", "bg-span-el-tags-hover-effect");
  bgEl.style.transformOrigin = `${hoverObject.x}px ${hoverObject.y}px`;
}
const tagStates = [];

const resetTodoPageFunc = (transitionPlaceholders = true) => {
  currTodoDetails = {
    heading: "",
    description: "",
    date: "",
    time: "",
    priority: "",

    tags: [],
  };

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

  // reset its CurrentLenght (tags: 0 / 3);
  resetCurrentLenghtPtag("tags-input");

  // reset the selected tags bg-color.
  bgSpanTagsHoverEffects.forEach((span) => {
    toggleClasses("remove", span);
  });

  // reset tags width and its original value.
  tagNameInputs.forEach((tag) => {
    tag.value = tag.getAttribute("value");
    resize(tag);
  });

  // reset state.
  tagStates.forEach((state) => {
    state.isClicked = false;
    state.isDblClick = false;
  });

  function resetCurrentLenghtPtag(getUniqueId) {
    const pTag = document.getElementById(`current-len-${getUniqueId}`);
    if (pTag) pTag.innerText = "0".repeat(pTag.getAttribute("maxDigit"));
  }

  typingInputIds.forEach((inputid) => {
    const el = document.getElementById(inputid);

    if (el.tagName === "SELECT") {
      el.selectedIndex = 0;
    } else if (el.value.length >= 1) {
      el.value = "";
    }

    resetCurrentLenghtPtag(inputid);
  });
};

function resetTodoPageUI(shouldReset) {
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
      header.innerHTML = header.getAttribute("data-heading");
    });
  }

  document.querySelectorAll("textarea, input, select").forEach((el) => {
    if (!shouldReset) {
      el.setAttribute("readonly", true); // Make readonly
    } else {
      el.removeAttribute("readonly"); // Make editable
    }
  });
}

function transitionBetweenPages(pageCloseEl, pageOpenEl) {
  smoothInnOutTransition(
    {
      el: pageCloseEl,
      duration: 0.5,
      ease: "power2.out",
      opacity: 1,
      blur: 20,
      scale: 1.2,
      onCompleteTransition() {
        smoothInnOutTransition(
          {
            el: pageOpenEl,
            duration: 0.5,
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

closeTodoBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    transitionBetweenPages(todoPage, quoteBox);
    smoothInnOutTransition(
      {
        el: showTodoCreated,
        duration: 0.5,
        ease: "power2.out",
        opacity: 1,
        blur: 20,
        scale: 1.2,
      },
      true
    );

    // reset all the inputs.
    resetTodoPageFunc(false);

    // reset the messages, border of input, placeholders.
    resetTodoPageUI(true);
  });
});

createTodo.addEventListener("click", () => {
  resetTodoPageFunc(true);
  resetTodoPageUI(true);

  // after resetting todo page, now show it.
  showToDoPage();
});

const addTodoBtn = document.querySelector("#add-todo");
const quickFill = document.querySelector("#quick-fill");
const resetBtn = document.querySelector("#reset-todo");
let currTodoDetails = {};

const typingInputIds = [
  "heading-input",
  "description-input",
  "date-input",
  "time-input",
  "priority-input",
];

typingInputIds.forEach((eachId) => {
  const input = document.getElementById(eachId);
  const key = input.name;

  currTodoDetails[key] = "";

  input.addEventListener("input", () => {
    if (key === "tag") currTodoDetails[key].push(input.value);
    else currTodoDetails[key] = input.value;

    const pTag = document.getElementById(`current-len-${eachId}`);

    if (pTag) {
      pTag.innerText = input.value.length
        .toString()
        .padStart(pTag.getAttribute("maxDigit"), "0");
    }
  });
});
quickFill.addEventListener("click", () => {
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

  currTodoDetails.date = formattedDate;
  currTodoDetails.time = formattedTime;
});

addTodoBtn.addEventListener("click", () => {
  if (currTodoDetails.heading == "" || currTodoDetails.priority == "") return;

  if (currTodoDetails.time.length <= 4) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    currTodoDetails.time = `${hours}:${minutes}`;
  }

  transitionBetweenPages(todoPage, showTodoCreated);

  todoName.innerText = currTodoDetails.heading;

  if (updated) {
    backend(currTodoDetails, "todos", true, getTodoData.localStorageIndex);
    JSONData = JSON.parse(localStorage.getItem("todos"));

    addInYoursTodo(
      JSONData[getTodoData.localStorageIndex],
      leftMain,
      getTodoData.actualID
    );
  } else {
    const newTodo = { ...currTodoDetails, id: crypto.randomUUID() };

    backend(newTodo, "todos");

    addInHTML("todos", leftMain, true);
  }
});

resetBtn.addEventListener("click", resetTodoPageFunc);

function backend(todoObject, localTodoVarName, shouldUpdate, updateIndex) {
  const localStorageTodo = localStorage.getItem(localTodoVarName);

  const todo = localStorageTodo ? JSON.parse(localStorageTodo) : [];

  shouldUpdate ? (todo[updateIndex] = todoObject) : todo.push(todoObject);

  localStorage.setItem(`${localTodoVarName}`, JSON.stringify(todo));
}

function addInYoursTodo(isExpiredTodo, userLatestTodo, mainDirection, id) {
  if (!userLatestTodo) {
    console.log("return addInYoursTodo()");
    return;
  }

  const localeDateString = getLocaleDateString(userLatestTodo.date);

  const expiredSticker = `
                        <span
                        class="absolute right-2 bottom-2 z-10 w-[100px] h-[100px]"
                      >
                        <span class="relative">
                          <img
                            class="w-full h-full"
                            src="assets/Group 16.svg"
                            alt="red-sticker"
                          />
                          <p
                            class="text-sm text-nowrap absolute left-[50%] top-[50%] translate-x-[-50%] px-2"
                          >
                            <i><b>${localeDateString}</b></i>
                          </p>
                        </span>
                      </span>
  `;

  const todoHTML = `
    <span class="absolute left-0 top-0 block z-10 rounded-t-2xl overflow-hidden">
      <span class="h-[40px] w-[40px] bg-[${
        priorityColors[userLatestTodo.priority]
      }] relative -top-2.5 -left-2.5 block rounded-full"></span>
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

  if (updated) {
    document.getElementById(id).innerHTML = todoHTML;
  } else {
    const crossMarkerClassTw =
      "before:content-[''] before:absolute before:w-[200%] before:h-[1px] before:bg-white before:block z-[100] before:rotate-30 before:-left-[75%] before:translate-y-10 overflow-hidden";
    const addCrossMarker = isExpiredTodo ? crossMarkerClassTw : "";

    mainDirection.innerHTML += `
      <article class="grid gap-3 relative z-50 max-w-[300px] w-full overflow-hidden">
        <div class="grid place-items-end">
                  <header class="relative z-10 w-full text-sm font-medium pl-8 before:pl-3 mb-1.5 bg-[#0f0f0f] before:content-[''] before:absolute before:w-full before:h-[1px] before:left-4 before:bottom-0 before:bg-white">
                    ${localeDateString}
                  </header>
              
                  <section
                    id="${userLatestTodo.id}"
                    class="todo-card bg-[#1A1A1A] relative border max-h-max rounded-2xl p-2 flex-1 w-full cursor-grab
                    ${addCrossMarker}
                    "
                  >
                    ${todoHTML}
                  </section>
        </div>
      </article>
    `;
  }
}

// U.R.D. OPERATION FUNCTION
function update(todoData) {
  updated = true;
  const dataArray = Object.values(todoData);
  const todoKeys = Object.keys(todoData);

  currTodoDetails.id = dataArray[dataArray.length - 1];

  typingInputIds.forEach((inputid, index) => {
    const el = document.getElementById(inputid);
    const current = dataArray[index];

    el.value = current;
    currTodoDetails[todoKeys[index]] = current;

    const pTag = document.getElementById(`current-len-${inputid}`);
    const dataLen = dataArray[index].length;

    if (pTag)
      pTag.innerText =
        dataLen >= 1 ? dataLen : "0".repeat(pTag.getAttribute("maxDigit"));
  });

  // after updating the input.value show it to user.
  showToDoPage();
}
function deleteTodo(localTodoVarName, todoIndex, getHtmlID) {
  document.getElementById(getHtmlID).remove();

  JSONData = JSON.parse(localStorage.getItem(localTodoVarName));
  JSONData.splice(todoIndex, 1);
  localStorage.setItem(localTodoVarName, JSON.stringify(JSONData));
}
function readTodo(getTodoData) {
  resetTodoPageUI(false);

  update(getTodoData);
  updated = false;

  showToDoPage();
}

function pickedTodoData(localTodoVarName, pickedItemHTML) {
  JSONData = JSON.parse(localStorage.getItem(localTodoVarName));

  const actualID = pickedItemHTML.id;
  const matchedId = JSONData.filter((arr) => arr.id == actualID);

  return {
    matchedId: matchedId[0],
    localStorageIndex: JSONData.indexOf(matchedId[0]),
    actualID,
  };
}

articleWrapper = document.querySelectorAll(".article-wrappers");

articleWrapper.forEach((wrapper) => {
  Sortable.create(wrapper, {
    group: {
      name: "shared",
      pull: true,
      put: true,
    },

    animation: 300,
    ghostClass: "drag-ghost",

    onAdd: function (evt) {
      getTodoData = pickedTodoData("completedTodos", evt.item);
      JSONData.splice(getTodoData.localStorageIndex, 1);
      localStorage.setItem("completedTodos", JSON.stringify(JSONData));
      backend(getTodoData.matchedId, "todos");
    },

    onEnd: function (evt) {
      const { clientX, clientY } = evt.originalEvent;
      const dropTarget = document.elementFromPoint(clientX, clientY);
      if (dropTarget) {
        ["#update", "#read", "#delete"].forEach((elID) => {
          const ancestor = dropTarget.closest(elID);
          if (ancestor) {
            getTodoData = pickedTodoData(
              "todos",
              evt.item.querySelector("section")
            );
            if (elID === "#update") update(getTodoData.matchedId);
            else if (elID === "#read") readTodo(getTodoData.matchedId);
            else if (elID === "#delete")
              deleteTodo(
                "todos",
                getTodoData.localStorageIndex,
                getTodoData.actualID
              );
          }
        });
      }
    },
  });
});

["#update", "#read", "#delete"].forEach((elID) => {
  const target = document.querySelector(elID);

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
});

Sortable.create(rightMain, {
  group: {
    name: "shared",
    pull: true,
    put: true,
  },
  animation: 300,
  ghostClass: "drag-ghost",

  onAdd: function (evt) {
    getTodoData = pickedTodoData("todos", evt.item);
    JSONData.splice(getTodoData.localStorageIndex, 1);
    localStorage.setItem("todos", JSON.stringify(JSONData));
    backend(getTodoData.matchedId, "completedTodos");
  },
});
