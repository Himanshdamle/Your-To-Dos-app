import { addInHTML, smoothInnOutTransition } from "./core.js";

/**
 * Initializes the UI, including todo rendering and placeholder effects.
 */
export function initializeUI() {
  const leftMain = document.querySelector("#left-main");
  const rightMain = document.querySelector("#right-main");

  addInHTML("todos", leftMain, {
    allowCRUD: true,
    localTodoVarName: "todos",
    todoMainSide: leftMain,
  });

  addInHTML("completedTodos", rightMain, {
    allowCRUD: ["#delete"],
    localTodoVarName: "completedTodos",
    todoMainSide: rightMain,
  });

  // placeholder effect
  const psuedoPlaceholders = document.querySelectorAll(".psuedo-placeholder");
  const inputs = document.querySelectorAll(".input");

  psuedoPlaceholders.forEach((placeholder, index) => {
    placeholderEffect(placeholder, inputs[index]);
  });

  const psuedoPlaceholdersCURD = document.querySelectorAll(
    ".psuedo-placeholder-curd"
  );
  const crudInputs = document.querySelectorAll(".crud-input");

  psuedoPlaceholdersCURD.forEach((placeholder, index) => {
    placeholderEffect(placeholder, crudInputs[index]);
  });
}

/**
 * Fetches and displays quotes or affirmations every 30 seconds.
 */
export function startQuoteRotation() {
  const quote = document.querySelector("#quotes");
  const author = document.querySelector("#author");
  const dashAuthorBefore = document.querySelector("#dash-author-before");

  setInterval(() => {
    if (Math.random() > 0.5) {
      fetch(
        "https://api.allorigins.win/raw?url=https://stoic.tekloon.net/stoic-quote"
      )
        .then((res) => res.json())
        .then((data) => {
          const quoteData = data.data;
          if (quoteData) {
            quote.innerText = `" ${quoteData.quote} "`;

            author.style.display = "block";
            author.innerText = quoteData.author;

            dashAuthorBefore.style.width = `${
              (25 / 100) * (author?.innerText.length || 0)
            }ch`;
            dashAuthorBefore.style.display = "block";
          }
        })
        .catch((err) => console.error("Error fetching stoic quote:", err));
    } else {
      fetch("https://api.allorigins.win/raw?url=https://www.affirmations.dev/")
        .then((res) => res.json())
        .then((data) => {
          if (quote) quote.innerHTML = `" ${data.affirmation} "`;
          if (author) author.style.display = "none";
          if (dashAuthorBefore) dashAuthorBefore.style.display = "none";
        })
        .catch((err) => console.error("Error fetching affirmation:", err));
    }
  }, 30000);
}

/**
 * Animates placeholder effects for input fields.
 */
function placeholderEffect(psuedoPlaceholder, inputBox) {
  if (psuedoPlaceholder && inputBox) {
    const settings = {
      el: psuedoPlaceholder,
      scale: 1.2,
      duration: 0.3,
      blur: 20,
    };

    inputBox.addEventListener("input", () => {
      if (inputBox.value) {
        smoothInnOutTransition(settings, true);
      } else {
        smoothInnOutTransition(settings, false);
      }
    });
  }
}
