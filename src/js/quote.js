import { setting } from "./settings/iniStorage.js";
import { smoothInnOutTransition } from "./core.js";
import { initializeSettings } from "./settings/setUI.js";

initializeSettings();
const quoteSetting = setting["quotes"];

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
    onCompleteTransition: () => fetchPositiveMessage(selectMessageType),
  };

  smoothInnOutTransition(scaleUp, true);
}

/**
 * Fetches and displays quotes or affirmations every 30 seconds.
 */
export function startQuoteRotation() {
  const turnOff = quoteSetting["turnOff"];

  if (turnOff === "both-quo-aff") return;
  quoteBox.style.display = "flex";
  quoteBox.setAttribute("data-keep-it", "visible");

  const selectMessageType = selectPositiveMessage[turnOff];
  console.log(selectMessageType);

  // First Fetch it
  rotation(selectMessageType ?? Math.random() > 0.5);

  // then Start the rotation
  const rotationTimeInterval = quoteSetting["rotationTimeInterval"];
  setInterval(() => {
    const randomMessage = Math.random() > 0.5;

    rotation(selectMessageType ?? randomMessage);
  }, rotationTimeInterval * 1000); // refresh after 30 sec.
}

function fetchPositiveMessage(isQuote) {
  const quoteAPI =
    "https://api.allorigins.win/raw?url=https://stoic.tekloon.net/stoic-quote";
  const affirmationsAPI =
    "https://api.allorigins.win/raw?url=https://www.affirmations.dev/";

  const url = isQuote ? quoteAPI : affirmationsAPI;

  const getMessageSource = quoteSetting["messageSource"];

  const useUserQuoteSource =
    getMessageSource["useQuotesBy"] === "user" && isQuote;
  const useUserAffirmationSource =
    getMessageSource["useAffirmationsBy"] === "user" && !isQuote;

  if (useUserQuoteSource || useUserAffirmationSource) {
    fetchUserCustomPositiveMessage(isQuote);
    return;
  }

  sendRequestToFetch(url, isQuote);
}

let retryCount = 0;
async function sendRequestToFetch(url, isQuote) {
  retryCount++;

  try {
    const fetchMessage = await fetch(url);
    const getPositiveMessage = await fetchMessage.json();

    if (isQuote) setvaluesOfQuotes(getPositiveMessage.data);
    else setvaluesOfAffirmatives(getPositiveMessage.affirmation);

    smoothInnOutTransition({ ...animationConfig }, false);

    retryCount = 0;
  } catch (error) {
    console.log(error);

    if (retryCount == 3) return;

    fetchPositiveMessage(isQuote);
  }
}

function getRandomValues(min, max) {
  return Math.floor(Math.random() * (max - (min + 1))) + min;
}

function fetchUserCustomPositiveMessage(isQuote) {
  const getCustomMessage = quoteSetting["customMessage"];

  const affirmations = getCustomMessage["customAffirmations"];
  const quotes = getCustomMessage["customQuotes"];

  if (!quotes[0] || !affirmations[0]) return;

  const quoteLength = quotes.length;
  const affirnationLength = affirmations.length;

  switch (true) {
    case isQuote:
      const randomQuotesIndex = getRandomValues(0, quoteLength);
      setvaluesOfQuotes(quotes[randomQuotesIndex]);

      break;

    case !isQuote:
      const randomAffirmationIndex = getRandomValues(0, affirnationLength);
      setvaluesOfAffirmatives(affirmations[randomAffirmationIndex]);

      break;
  }

  smoothInnOutTransition({ ...animationConfig }, false);
}
