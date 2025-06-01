import { addInHTML } from "./core.js";

function search(searchingStr) {
  const data = JSON.parse(localStorage.getItem("todos"));

  const options = {
    keys: ["priority", "heading", "tags"],
  };

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
