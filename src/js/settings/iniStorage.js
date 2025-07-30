export const setting = {
  quotes: {
    turnOff: null,
    customPostiveMessage: "quotes",
    customQuotes: [],
    customAffirmations: [],
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

export function handleTurnOffQuotes(button) {
  const dataTurnOff = button.getAttribute("data-turn-off");

  setting["quotes"]["turnOff"] = dataTurnOff;
  updateStorage();
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

    path["customQuotes"].push(customQuotesObject);
  } else {
    path["customAffirmations"].push(positiveMessage);
  }

  updateStorage();
}
