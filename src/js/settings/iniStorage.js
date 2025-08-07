import { renderCustomQuotes } from "./setUI.js";

export const setting = {
  quotes: {
    turnOff: null,
    rotationTimeInterval: 30,
    messageSource: {
      useQuotesBy: "us",
      useAffirmationsBy: "us",
    },
    customMessage: {
      customPostiveMessage: "quotes",
      customQuotes: [],
      customAffirmations: [],
    },
  },
};

export function updateObject(path, value) {
  const splitedPath = path.split(".");
  const pathLength = splitedPath.length - 1;
  let currentObject = setting;

  for (let i = 0; i < pathLength; i++) {
    currentObject = currentObject[splitedPath[i]];
  }

  currentObject[splitedPath[pathLength]] = value;
  updateStorage();
}

function updateStorage() {
  const stringifiedSettingObj = JSON.stringify(setting);

  localStorage.setItem("settings", stringifiedSettingObj);
}

export function initializeStorage() {
  const isInitialized = localStorage.getItem("settings");

  if (isInitialized === null) updateStorage();
  else {
    const parsedStorage = JSON.parse(isInitialized);
    Object.assign(setting, parsedStorage);
  }
}

export function updateSettingFromButton({ button, buttonAttribute, path }) {
  const data = button.getAttribute(buttonAttribute);
  updateObject(path, data);
}

export function handleCustomQuotes({
  positiveMessage,
  authorName,
  isQuote = false,
}) {
  const path = setting["quotes"];

  if (isQuote) {
    const customQuotesObject = {
      quote: positiveMessage,
      author: authorName,
    };

    path["customMessage"]["customQuotes"].push(customQuotesObject);

    renderCustomQuotes([customQuotesObject]);
  } else {
    path["customMessage"]["customAffirmations"].push(positiveMessage);
  }

  updateStorage();
}
