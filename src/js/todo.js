import {
  showToDoPage,
  resetTodoPageUI,
  showMessagePopup,
  showThis,
  smoothInnOutTransition,
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
      el.classList.remove("justify-start");
      el.classList.remove("cursor-pointer");

      el.classList.add("cursor-text");
      el.classList.add("justify-center");
      el.classList.add("pointer-events-none");
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
  const midMain = document.querySelector("#mid-main");
  if (!confimationBox) return;

  const transitionOptions = {
    el: confimationBox,
    duration: 0.5,
    ease: "power2.out",
    blur: 20,
    scale: 1.2,
  };

  showThis(confimationBox, midMain);
  smoothInnOutTransition(
    {
      ...transitionOptions,
      opacity: 1,
    },
    false
  );

  function closeConfirmationPage() {
    smoothInnOutTransition({ ...transitionOptions }, true);
  }

  // When user DOES **NOT** confirmed to delete to-do
  const cancleDeleteBtn = document.querySelector("#cancle-delete");
  cancleDeleteBtn.addEventListener("click", () => {
    closeConfirmationPage();
  });

  // When user confirmed to delete to-do
  const deleteToDoBtn = document.querySelector("#delete-to-do");

  deleteToDoBtn.addEventListener("click", () => {
    const deletedTodoData = delTodoFunction();

    closeConfirmationPage();

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
  resetTodoPageUI(false);
  update(getTodoData);
  window.updated = false;
  showToDoPage();
}

export function pickedTodoData(
  localTodoVarName,
  pickedItemHTML,
  pickedItemHTMLID
) {
  const JSONData = JSON.parse(localStorage.getItem(localTodoVarName)) || [];
  const actualID = pickedItemHTMLID || pickedItemHTML.id;
  const matchedId = JSONData.find((arr) => arr.id === actualID);

  return {
    matchedId,
    localStorageIndex: JSONData.indexOf(matchedId),
    actualID,
  };
}
