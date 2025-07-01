import { addInHTML } from "./core.js";

const preMadeOptions = {
  keys: ["priority", "heading", "tags"],
};

const prioritiesSearchBtn = document.querySelectorAll(".priorities-search-btn");

prioritiesSearchBtn.forEach((priorityBtn) => {
  let isClickedOnce = false;

  let optionsArray = preMadeOptions.keys;

  priorityBtn.addEventListener("click", () => {
    let optionsLength = optionsArray.length;
    isClickedOnce = !isClickedOnce;

    const priorityName = priorityBtn.getAttribute("data-priority-name");

    if (isClickedOnce === true) {
      if (optionsLength < 1 || optionsLength === 3) optionsArray = [];
      optionsArray.push(priorityName);
    } else {
      optionsArray = optionsArray.filter((option) => option !== priorityName);
    }

    priorityBtn.classList.toggle("bg-[#2CB67D]");
    priorityBtn.classList.toggle("text-black");

    if (optionsLength - 1 === 0) optionsArray = ["priority", "heading", "tags"];
    preMadeOptions.keys = optionsArray;
  });
});

function search(searchingStr) {
  const data = JSON.parse(localStorage.getItem("todos"));

  const options = preMadeOptions;

  const fuse = new Fuse(data, options);
  const result = fuse.search(searchingStr);

  return result;
}

export function getUserSearchResult() {
  const searchInput = document.querySelector("#search-input");

  searchInput.addEventListener("input", () => {
    const userSearchedStr = searchInput.value.trim();
    const searchResult = search(userSearchedStr);

    const pendingTodosSection = document.querySelector("#pending-todo");

    if (searchResult[0] === undefined) {
      pendingTodosSection.innerHTML = `No Result found related to '${userSearchedStr}'`;
      if (userSearchedStr !== "") return;

      pendingTodosSection.innerHTML = "";
      addInHTML({ localTodoVarName: "todos" }, pendingTodosSection, {
        allowCRUD: true,
        localTodoVarName: "todos",
        todoMainSide: pendingTodosSection,
      });

      return;
    }

    pendingTodosSection.innerHTML = "";

    searchResult.forEach((todoData) => {
      addInHTML({ data: [todoData.item] }, pendingTodosSection, {
        allowCRUD: true,
        localTodoVarName: "todos",
        todoMainSide: pendingTodosSection,
      });
    });
  });
}
