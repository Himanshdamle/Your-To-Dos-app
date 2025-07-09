import { addInHTML } from "./core.js";

const preMadeOptions = {
  keys: ["priority", "heading", "tags"],
};

const pendingTodosSection = document.querySelector("#pending-todo");
const searchTodosSection = document.querySelector("#search-todo");

const prioritiesSearchBtn = document.querySelectorAll(".priorities-search-btn");

let optionsArray = [...preMadeOptions.keys];
prioritiesSearchBtn.forEach((priorityBtn) => {
  let isClickedOnce = false;

  priorityBtn.addEventListener("click", () => {
    let optionsLength = optionsArray.length;

    isClickedOnce = !isClickedOnce;

    const priorityName = priorityBtn.getAttribute("data-priority-name");

    priorityBtn.classList.toggle("bg-[#2CB67D]");
    priorityBtn.classList.toggle("text-black");

    if (isClickedOnce === true) {
      if (optionsLength === 3) optionsArray.splice(0, optionsLength);
      optionsArray.push(priorityName);
    } else {
      optionsArray = optionsArray.filter((option) => option !== priorityName);
    }

    if (optionsArray.length === 0) {
      optionsArray = ["priority", "heading", "tags"];
    }

    preMadeOptions.keys = [...optionsArray];
  });
});

const data = JSON.parse(localStorage.getItem("todos")) || [];
function search(searchingStr, option) {
  const options = option;

  const fuse = new Fuse(data, options);
  const result = fuse.search(searchingStr);

  return result;
}

export function getUserSearchResult() {
  const searchInput = document.querySelector("#search-input");

  searchInput.addEventListener("input", () => {
    const userSearchedStr = searchInput.value.trim();
    const searchResult = search(userSearchedStr, preMadeOptions);

    if (searchResult[0] === undefined) {
      searchResult.innerHTML = `<p>No results found for '<strong>${userSearchedStr}</strong>'</p>`;

      // Means the input is clear so now show all the pending todos
      if (userSearchedStr !== "") return;

      pendingTodosSection.classList.remove("hidden");
      searchTodosSection.classList.add("hidden");
      return;
    }

    searchTodosSection.innerHTML = "";
    pendingTodosSection.classList.add("hidden");
    searchTodosSection.classList.remove("hidden");

    searchResult.forEach((todoData) => {
      addInHTML({ data: [todoData.item] }, searchTodosSection, {
        allowCRUD: true,
        localTodoVarName: "todos",
        todoMainSide: pendingTodosSection,
      });
    });
  });
}
