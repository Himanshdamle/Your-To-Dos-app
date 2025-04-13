const closeTodoBtn = document.querySelectorAll(".close-todo-page");
const quoteBox = document.querySelector("#quote-box");

//CURD
const createTodo = document.querySelector("#create-new-todo-page");
const updateU = document.querySelector("#update");
const readR = document.querySelector("#read");
const deleteD = document.querySelector("#delete");

const midMain = document.querySelector("#mid-main");
const rightMain = document.querySelector("#right-main");
const leftMain = document.querySelector("#left-main");
const todoPage = document.querySelector("#todo-page");
const todoName = document.querySelector("#todo-name");
const showTodoCreated = document.querySelector("#show-todo-created");

let getTodoData;
let JSONData;
let updated = false;

const priorityColors = {
  low: "#2ecc71",
  medium: "#f1c40f",
  high: "#e67e22",
  urgent: "#e74c3c",
};

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

  if (diffDay < 0 || diffMonth) diffDay += 30;
  if (diffMonth < 0 || diffYear) diffMonth += 12;

  const isOverMonth = diffMonth >= 1 && diffMonth <= 12;

  if (diffDay <= 28 && !isOverMonth) {
    if (diffDay === 0) return "Due this day.";

    for (let i = 1; i <= 4; i++) {
      if (i == 1) {
        if (diffDay / (7 * i) <= 1) return "due this week";
      } else {
        if (diffDay / (7 * i) <= 1) return `due over ${i} weeks`;
      }
    }
  }

  // condition for over a months
  if (isOverMonth) {
    return `due over ${diffMonth} months`;
  }

  return `over a year`; // lastly if its over a year
}

// console.log(getDateRange("2025-05-15"));

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

function addInHTML(localTodoVarName, main) {
  const data = localStorage.getItem(localTodoVarName);
  if (data) {
    JSONData = JSON.parse(data);
    const groupedData = groupTodosWithDate(JSONData);

    Object.keys(groupedData).forEach((todoDate) => {
      main.innerHTML += `
       <div id="${todoDate}" class="grid place-items-center gap-2.5 w-full">
          <h1
                class="relative z-10 text-xl px-3 tracking-wide bg-[#0f0f0f] before:content-[''] before:absolute before:w-full before:h-[1px] before:bg-gradient-to-l before:from-white before:to-transparent before:-left-full before:top-1/2 before:-translate-y-1/2 after:content-[''] after:absolute after:w-full after:h-[1px] after:bg-gradient-to-r after:from-white after:to-transparent after:left-full after:top-1/2 after:-translate-y-1/2 font-bold"
              >
                ${todoDate.toUpperCase()}
          </h1>
          <!--  -->
       </div>
      `;

      const articaleWrapper = document.createElement("div");
      articaleWrapper.classList.add(
        "grid",
        "grid-cols-[repeat(auto-fit,minmax(230px,1fr))]",
        "w-full",
        "place-items-center",
        "gap-2.5"
      );
      document.getElementById(todoDate).append(articaleWrapper);
      groupedData[todoDate].forEach((json) => {
        addInYoursTodo(json, articaleWrapper);
      });
    });
  }
}

addInHTML("todos", rightMain);
addInHTML("completedTodos", leftMain);

const resetTodoPageFunc = () => {
  currTodoDetails = {
    heading: "",
    description: "",
    date: "",
    time: "",
    priority: "",
  };

  typingInputIds.forEach((inputid) => {
    const el = document.getElementById(inputid);

    if (el.tagName === "SELECT") {
      el.selectedIndex = 0;
    } else if (el.value.length >= 1) {
      el.value = "";
    }

    const pTag = document.getElementById(`current-len-${inputid}`);
    if (pTag) pTag.innerText = "0".repeat(pTag.getAttribute("maxDigit"));
  });
};

closeTodoBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    todoPage.style.display = "none";
    showTodoCreated.style.display = "none";
    quoteBox.style.display = "flex";
    resetTodoPageFunc();
  });
});
createTodo.addEventListener("click", () => {
  resetTodoPageFunc();
  todoPage.style.display = "block";
  [...midMain.children].forEach((el) => {
    if (el !== todoPage) el.style.display = "none";
  });
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
    currTodoDetails[key] = input.value;
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

  todoPage.style.display = "none";
  showTodoCreated.style.display = "flex";
  todoName.innerText = currTodoDetails.heading;

  if (updated) {
    backend(currTodoDetails, "todos", true, getTodoData.localStorageIndex);
    JSONData = JSON.parse(localStorage.getItem("todos"));
    addInYoursTodo(
      JSONData[getTodoData.localStorageIndex],
      rightMain,
      getTodoData.actualID
    );
  } else {
    const newTodo = { ...currTodoDetails, id: crypto.randomUUID() };

    backend(newTodo, "todos");

    JSONData = JSON.parse(localStorage.todos);
    const lastestData = JSONData[JSONData.length - 1];
    addInYoursTodo(lastestData, rightMain);
  }
});

resetBtn.addEventListener("click", resetTodoPageFunc);

function backend(todoObject, localTodoVarName, shouldUpdate, updateIndex) {
  const localStorageTodo = localStorage.getItem(localTodoVarName);

  const todo = localStorageTodo ? JSON.parse(localStorageTodo) : [];

  shouldUpdate ? (todo[updateIndex] = todoObject) : todo.push(todoObject);

  localStorage.setItem(`${localTodoVarName}`, JSON.stringify(todo));
}

function addInYoursTodo(userLatestTodo, mainDirection, id) {
  if (!userLatestTodo) return;

  const todoHTML = `
    <span class="drag-handle absolute left-0 top-0 block z-10 rounded-t-2xl overflow-hidden">
      <span class="h-[40px] w-[40px] bg-[${
        priorityColors[userLatestTodo.priority]
      }] relative -top-2.5 -left-2.5 block rounded-full"></span>
    </span>

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
    mainDirection.innerHTML += `
      <article class="grid gap-3 max-w-[300px] w-full overflow-hidden">
        <div class="draggable-wrapper grid place-items-end">
                  <header class="relative z-10 w-full text-sm font-medium pl-8 before:pl-3 mb-1.5 bg-[#0f0f0f] before:content-[''] before:absolute before:w-full before:h-[1px] before:left-4 before:bottom-0 before:bg-white">
                    ${userLatestTodo.date}
                  </header>
              
                  <section
                    id="${userLatestTodo.id}"
                    class="todo-card bg-[#1A1A1A] relative border max-h-max rounded-2xl p-2 flex-1 w-full cursor-grab"
                  >
                    ${todoHTML}
                  </section>
        </div>
      </article>
    `;
  }
}

function update(todoData) {
  updated = true;

  todoPage.style.display = "block";
  [...midMain.children].forEach((el) => {
    if (el !== todoPage) el.style.display = "none";
  });

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

Sortable.create(rightMain, {
  group: {
    name: "shared",
    pull: true,
    put: true,
  },

  animation: 300,
  ghostClass: "drag-ghost",
  draggable: ".draggable-wrapper", // make the div around section draggable
  handle: ".drag-handle",

  onAdd: function (evt) {
    // console.log("Moved to completed:", evt.item.getAttribute("actualID"));

    getTodoData = pickedTodoData("completedTodos", evt.item);

    JSONData.splice(getTodoData.localStorageIndex, 1);

    localStorage.setItem("completedTodos", JSON.stringify(JSONData));
    backend(getTodoData.matchedId, "todos");
  },

  onEnd: function (evt) {
    const { clientX, clientY } = evt.originalEvent;

    const dropTarget = document.elementFromPoint(clientX, clientY);
    if (dropTarget) {
      ["#update", "#read", "#delete"].forEach((ElID) => {
        const ancestor = dropTarget.closest(ElID);
        if (ancestor) {
          getTodoData = pickedTodoData("todos", evt.item);
          update(getTodoData.matchedId);
        }
      });
    }
  },
});

Sortable.create(leftMain, {
  group: {
    name: "shared",
    pull: true, // can drag from here
    put: true, // can receive from others
  },

  animation: 300,
  ghostClass: "drag-ghost",
  draggable: ".draggable-wrapper", // make the div around section draggable
  handle: ".drag-handle",

  onAdd: function (evt) {
    getTodoData = pickedTodoData("todos", evt.item);
    JSONData.splice(getTodoData.localStorageIndex, 1);

    localStorage.setItem("todos", JSON.stringify(JSONData));
    backend(getTodoData.matchedId, "completedTodos");
  },
});
