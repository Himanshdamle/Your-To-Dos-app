import { smoothInnOutTransition } from "./core.js";
import { setting } from "./settings/iniStorage.js";

const quoteBox = document.querySelector("#quote-box");

const quote = document.querySelector("#quotes");
const author = document.querySelector("#author");
const dashAuthorBefore = document.querySelector("#dash-author-before");

const selectPositiveMessage = {
  quotes: false, // Means Do no select Quotes
  affirmations: true, // Do not select Affimations
};

/**
 * Fetches and displays quotes or affirmations every 30 seconds.
 */
export function startQuoteRotation() {
  const turnOff = setting["quotes"]["turnOff"];

  if (turnOff === "both-quo-aff") return;
  quoteBox.style.display = "flex";
  quoteBox.setAttribute("data-keep-it", "visible");

  const select = selectPositiveMessage[turnOff] ?? Math.random() > 0.5;

  // First Fetch it
  fetchPositiveMessage(select);

  // then Start the rotation
  setInterval(() => {
    if (quoteBox.style.display === "none") return;

    smoothInnOutTransition({
      el: quoteBox,
      opacity: 1,
      duration: 0.5,
      onCompleteTransition: fetchPositiveMessage(select ?? Math.random() > 0.5),
    });
  }, 30 * 1000); // refresh after 30 sec.
}

function fetchPositiveMessage(positiveMessage) {
  const quoteAPI =
    "https://api.allorigins.win/raw?url=https://stoic.tekloon.net/stoic-quote";
  const affirmationsAPI =
    "https://api.allorigins.win/raw?url=https://www.affirmations.dev/";

  const isQuote = positiveMessage;

  const url = isQuote ? quoteAPI : affirmationsAPI;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (isQuote) {
        const quoteData = data.data;

        if (!quoteData) return;

        quote.innerText = `" ${quoteData.quote} "`;

        author.style.display = "block";
        author.innerText = quoteData.author;

        dashAuthorBefore.style.display = "block";

        smoothInnOutTransition(
          { el: quoteBox, opacity: 1, duration: 0.5 },
          false
        );
      } else {
        quote.innerHTML = `" ${data.affirmation} "`;
        author.style.display = "none";
        dashAuthorBefore.style.display = "none";

        smoothInnOutTransition(
          { el: quoteBox, opacity: 1, duration: 0.5 },
          false
        );
      }
    });
}
