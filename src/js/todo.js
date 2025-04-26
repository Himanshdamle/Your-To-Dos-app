import {
  addInYoursTodo,
  addInHTML,
  showToDoPage,
  resetTodoPageUI,
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

  window.currTodoDetails.id = dataArray[dataArray.length - 1];

  window.typingInputIds.forEach((inputid, index) => {
    const el = document.getElementById(inputid);
    const current = dataArray[index] || "";

    el.value = current;
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

export function deleteTodo(localTodoVarName, todoIndex, getHtmlID) {
  document.getElementById(getHtmlID).remove();

  const JSONData = JSON.parse(localStorage.getItem(localTodoVarName)) || [];
  JSONData.splice(todoIndex, 1);
  localStorage.setItem(localTodoVarName, JSON.stringify(JSONData));
}

export function readTodo(getTodoData) {
  resetTodoPageUI(false);
  update(getTodoData);
  window.updated = false;
  showToDoPage();
}

export function pickedTodoData(localTodoVarName, pickedItemHTML) {
  const JSONData = JSON.parse(localStorage.getItem(localTodoVarName)) || [];
  const actualID = pickedItemHTML.id;
  const matchedId = JSONData.find((arr) => arr.id === actualID);

  return {
    matchedId: matchedId,
    localStorageIndex: JSONData.indexOf(matchedId),
    actualID,
  };
}
