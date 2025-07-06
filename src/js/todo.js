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

export function update(todoData) {
  window.updated = true;

  const dataArray = Object.values(todoData);
  const todoKeys = Object.keys(todoData);

  window.currTodoDetails.id = todoData.id;

  window.typingInputIds.forEach((inputid, index) => {
    const el = document.getElementById(inputid);
    const current = dataArray[index] || "";

    el.value = current;
    if (inputid === "priority-input") {
      el.innerText = priorityDropdown.preset[current];
    }
    window.currTodoDetails[todoKeys[index]] = current;

    const pTag = document.getElementById(`current-len-${inputid}`);
    const dataLen = current.length;

    if (pTag) {
      pTag.innerText =
        dataLen >= 1 ? dataLen : "0".repeat(pTag.getAttribute("maxDigit"));
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

  const header = document.querySelector("#rtd-header");
  const description = document.querySelector("#rtd-description");
  const date = document.querySelector("#rtd-date");
  const time = document.querySelector("#rtd-time");
  const priority = document.querySelector("#rtd-priority");
  const tagsWrapper = document.querySelector("#rtd-tags-wrapper");

  header.textContent = getTodoData.heading;
  description.textContent = getTodoData.description;
  date.textContent = getTodoData.date;
  time.textContent = getTodoData.time;
  priority.textContent = priorityDropdown["preset"][getTodoData.priority];

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
