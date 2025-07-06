import {
  showToDoPage,
  showMessagePopup,
  showThis,
  removeThis,
} from "./core.js";

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
  window.currTodoDetails.id = todoData.id;

  const dataArray = Object.values(todoData);

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

    // Update character length indicator if exists
    const lengthTag = document.getElementById(`current-len-${inputId}`);
    if (lengthTag) {
      const maxDigits = lengthTag.getAttribute("maxDigit");
      lengthTag.innerText =
        value.length >= 1 ? value.length : "0".repeat(maxDigits);
    }
  });

  showToDoPage();
}

export function deleteTodoFRONTEND(delTodoFunction) {
  const confimationBox = document.querySelector("#delete-confirmation-box");
  if (!confimationBox) return;

  showThis(confimationBox, false);

  // When user DOES **NOT** confirmed to delete to-do
  const cancleDeleteBtn = document.querySelector("#cancle-delete");
  cancleDeleteBtn.addEventListener("click", () => {
    removeThis(confimationBox);
  });

  // When user confirmed to delete to-do
  const deleteToDoBtn = document.querySelector("#delete-to-do");

  deleteToDoBtn.addEventListener("click", () => {
    const deletedTodoData = delTodoFunction();

    removeThis(confimationBox);

    // THEN SHOW MESSAGE.
    showMessagePopup({
      invertedBoldTxt: deletedTodoData.heading,
      boldTxt: "Task deleted!",
      emoji: "🗑️",
    });
  });
}

export function deleteTodo(localTodoVarName, todoIndex, getHtmlID) {
  document.getElementById(getHtmlID).remove();

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

export function pickedTodoData(
  localTodoVarName,
  pickedItemHTML,
  pickedItemHTMLID
) {
  const JSONData = JSON.parse(localStorage.getItem(localTodoVarName)) || null;

  if (JSONData === null) return undefined;

  const actualID = pickedItemHTMLID || pickedItemHTML.id;

  const matchedId = JSONData.find((arr) => arr.id === actualID);

  return {
    matchedId,
    localStorageIndex: JSONData.indexOf(matchedId),
    actualID,
  };
}
