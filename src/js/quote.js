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

const animationConfig = {
  el: quoteBox,
  scale: 1.15,
  opacity: 1,
  duration: 0.3,
};

function setvaluesOfQuotes(quoteData) {
  if (!quoteData) return;

  quote.innerText = `" ${quoteData.quote} "`;

  author.style.display = "block";
  author.innerText = quoteData.author;

  dashAuthorBefore.style.display = "block";
}

function setvaluesOfAffirmatives(affirmation) {
  if (!affirmation) return;

  quote.innerHTML = `" ${affirmation} "`;
  author.style.display = "none";
  dashAuthorBefore.style.display = "none";
}

function rotation(selectMessageType) {
  if (quoteBox.style.display === "none") return;

  const scaleUp = {
    ...animationConfig,
    onCompleteTransition() {
      const mode = selectMessageType ?? Math.random() > 0.5;

      if (true) fetchPositiveMessage(mode);
      else fetchUserCustomPositiveMessage(mode);
    },
  };

  smoothInnOutTransition(scaleUp, true);
}

/**
 * Fetches and displays quotes or affirmations every 30 seconds.
 */
export function startQuoteRotation() {
  const turnOff = setting["quotes"]["turnOff"];

  if (turnOff === "both-quo-aff") return;
  quoteBox.style.display = "flex";
  quoteBox.setAttribute("data-keep-it", "visible");

  const selectMessageType =
    selectPositiveMessage[turnOff] ?? Math.random() > 0.5;

  // First Fetch it
  rotation(selectMessageType);

  // then Start the rotation
  setInterval(() => rotation(selectMessageType), 20 * 1000); // refresh after 30 sec.
}

async function fetchPositiveMessage(positiveMessage) {
  const quoteAPI =
    "https://api.allorigins.win/raw?url=https://stoic.tekloon.net/stoic-quote";
  const affirmationsAPI =
    "https://api.allorigins.win/raw?url=https://www.affirmations.dev/";

  const isQuote = positiveMessage;

  const url = isQuote ? quoteAPI : affirmationsAPI;

  try {
    const fetchMessage = await fetch(url);
    const getPositiveMessage = await fetchMessage.json();

    if (isQuote) setvaluesOfQuotes(getPositiveMessage.data);
    else setvaluesOfAffirmatives(getPositiveMessage.affirmation);

    smoothInnOutTransition({ ...animationConfig }, false);
  } catch (error) {
    console.log(error);

    fetchPositiveMessage(positiveMessage);
  }
}

function fetchUserCustomPositiveMessage(positiveMessage) {
  const affirmations = setting["quotes"]["customAffirmations"];
  const quotes = setting["quotes"]["customQuotes"];

  const isQuote = positiveMessage;

  if (isQuote) setvaluesOfQuotes(quotes[0]);
  else setvaluesOfAffirmatives(affirmations[0]);

  smoothInnOutTransition({ ...animationConfig }, false);
}
