import { smoothInnOutTransition } from "./core.js";

/**
 * Fetches and displays quotes or affirmations every 30 seconds.
 */
export function startQuoteRotation() {
  const quoteBox = document.querySelector("#quote-box");

  const quote = document.querySelector("#quotes");
  const author = document.querySelector("#author");
  const dashAuthorBefore = document.querySelector("#dash-author-before");

  const isStoic = Math.random() > 0.5;
  const url = isStoic
    ? "https://api.allorigins.win/raw?url=https://stoic.tekloon.net/stoic-quote"
    : "https://api.allorigins.win/raw?url=https://www.affirmations.dev/";

  function fetchQuote() {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (isStoic) {
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

  function updateQuote() {
    smoothInnOutTransition({
      el: quoteBox,
      duration: 0.5,
      onCompleteTransition: fetchQuote(),
    });
  }

  setInterval(() => {
    if (quoteBox.style.display === "none") return;

    updateQuote();
  }, 30 * 1000); // refresh after 30 secound
}
