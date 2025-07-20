import {
  showToDoPage,
  showMessagePopup,
  showThis,
  removeThis,
} from "./core.js";
import { setTagValues } from "./tag.js";

export function backend(
  todoObject,
  localTodoVarName,
  shouldUpdate = false,
  updateIndex
) {
  const localStorageTodo = localStorage.getItem(localTodoVarName);
  const todo = localStorageTodo ? JSON.parse(localStorageTodo) : [];

  if (shouldUpdate) {
    todo[updateIndex] = todoObject;
  } else {
    todo.push(todoObject);
  }

  localStorage.setItem(localTodoVarName, JSON.stringify(todo));
}

export function fillData(idMap = {}, todoData, isForm = false) {
  const ids = Object.values(idMap);
  const todoKey = Object.keys(idMap);

  ids.forEach((id, index) => {
    const el = document.querySelector(id);
    const key = todoKey[index];
    const data = todoData[key];

    if (!el) return;

    el[!isForm ? "textContent" : "value"] = data;

    if (key == "priority") {
      el.textContent = priorityDropdown["preset"][data] || data;
    }
  });
}

export function update(todoData) {
  window.updated = true;
  window.currTodoDetails = todoData;
  const dataArray = Object.values(todoData);

  setTagValues(window.currTodoDetails.tags);
  fillData(
    {
      heading: "#heading-input",
      description: "#description-input",
      date: "#date-input",
      time: "#time-input",
      priority: "#priority-input",
    },
    todoData,
    true
  );

  window.typingInputIds.forEach((inputId, index) => {
    const el = document.getElementById(inputId);
    const value = dataArray[index] || "";

    if (!el) return;

    const lengthTag = document.getElementById(`current-len-${inputId}`);
    if (lengthTag) {
      const maxDigits = lengthTag.getAttribute("maxDigit");
      lengthTag.innerText =
        value.length >= 1 ? value.length : "0".repeat(maxDigits);
    }
  });

  showToDoPage();
}

const deleteToDoBtn = document.querySelector("#delete-to-do");

export function deleteTodoFrontend(delTodoFunction) {
  const confimationBox = document.querySelector("#delete-confirmation-box");

  if (!confimationBox) return;

  showThis(confimationBox, false);

  // When user DOES **NOT** confirmed to delete to-do
  const cancleDeleteBtn = document.querySelector("#cancle-delete");
  cancleDeleteBtn.addEventListener("click", () => {
    removeThis(confimationBox);
  });

  // When user confirmed to delete to-do
  deleteToDoBtn.addEventListener(
    "click",
    () => {
      const deletedTodoData = delTodoFunction();

      removeThis(confimationBox);

      // THEN SHOW MESSAGE.
      showMessagePopup({
        invertedBoldTxt: deletedTodoData.heading,
        boldTxt: "Task deleted!",
        emoji: "🗑️",
      });
    },
    { once: true }
  );
}

export function deleteTodo(localTodoVarName, todoIndex, todoHTML) {
  if (!todoHTML) return;
  todoHTML.remove();

  const JSONData = JSON.parse(localStorage.getItem(localTodoVarName)) || [];

  const deleteTodoData = JSONData[todoIndex];

  JSONData.splice(todoIndex, 1);
  localStorage.setItem(localTodoVarName, JSON.stringify(JSONData));

  return deleteTodoData;
}

export function readTodo(getTodoData) {
  showThis(document.querySelector("#read-todo-page"), true);

  fillData(
    {
      heading: "#rtd-header",
      description: "#rtd-description",
      date: "#rtd-date",
      time: "#rtd-time",
      priority: "#rtd-priority",
    },
    getTodoData
  );

  const tagsWrapper = document.querySelector("#rtd-tags-wrapper");

  if (!getTodoData.tags[0]) return;
  const tags = getTodoData.tags
    .map(
      (tag) => `
   <div class="flex justify-center items-center">
        <b class="z-10" class="z-10">#</b>
        <span>${tag}</span>
   </div>`
    )
    .join("");

  tagsWrapper.innerHTML = tags;
}

export function pickedTodoData(localTodoVarName, pickedItemHTML) {
  const JSONData = JSON.parse(localStorage.getItem(localTodoVarName)) || null;

  if (JSONData === null || !pickedItemHTML) return undefined;

  const actualID = pickedItemHTML.id || pickedItemHTML;

  const matchedId = JSONData.find((arr) => arr.id === actualID);

  return {
    matchedId,
    localStorageIndex: JSONData.indexOf(matchedId),
    actualID,
  };
}

export function toolTipForTodo(todoDetails) {
  const wrapper = document.querySelector("#tool-tip-wrapper");

  const header = wrapper.querySelector("#tooltip-header");
  const tagsWrapper = wrapper.querySelector("#tool-tip-tags-wrapper");

  header.textContent = todoDetails.heading;

  if (todoDetails.tags[0] !== undefined) {
    tagsWrapper.innerHTML = "";

    for (const tag of todoDetails.tags) {
      tagsWrapper.innerHTML += `
      <span title="#${tag}" class="font-light text-nowrap truncate">
        <b>#</b>${tag}
      </span>
      `;
    }
  } else {
    tagsWrapper.innerHTML = `
      <span title="#general" class="font-light text-nowrap truncate">
        <b>#</b>general
      </span>
      `;
  }
}

// download todo as notepad.
export function downloadTodos(todoHTML) {
  const storageKey = todoHTML.getAttribute("data-localtodovarname");
  const todoID = todoHTML.id;

  if (!storageKey || !todoID) return;

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

  showMessagePopup({
    invertedBoldTxt: todoDetails.heading,
    boldTxt: "Task downloaded!",
    emoji: "✅📥",
  });
}

export function copyTaskName(todoHTML) {
  const storageKey = todoHTML.getAttribute("data-localtodovarname");
  const todoID = todoHTML.id;

  if (!storageKey || !todoID) return;

  const todoDetails = pickedTodoData(storageKey, null, todoID).matchedId;

  const taskName = todoDetails.heading;
  navigator.clipboard.writeText(taskName).then(() => {
    showMessagePopup({
      boldTxt: taskName,
      boldTxt: "Copied",
      emoji: "📄✨",
    });
  });
}
