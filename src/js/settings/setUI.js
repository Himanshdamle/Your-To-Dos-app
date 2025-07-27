import { smoothInnOutTransition } from "../core.js";
import { getSettingsInput } from "./setEvents.js";
import { initializeStorage } from "./iniStorage.js";

export function initializeSettings() {
  initializeStorage();
  selectOption();
  getSettingsInput();
}

const selectedWrapper = document.querySelector("#selected-option-wrapper");
const selectedWrapperRect = selectedWrapper.getBoundingClientRect();

let pastDirection = 0;
let centerTxt = document.querySelector("#center-selected");
let bottomText = document.querySelector("#bottom-selected");
const optionsWrapper = document.querySelector("#option-wrapper");

const settingNameDOM = document.querySelector("#setting-name");

function updateSettingNameInDOM(settingName) {
  // Heading
  smoothInnOutTransition(
    {
      el: settingNameDOM,
      opacity: 1,
      duration: 0.25,
      onCompleteTransition() {
        settingNameDOM.textContent = settingName;

        smoothInnOutTransition(
          { el: settingNameDOM, opacity: 1, duration: 0.25 },
          false
        );
      },
    },
    true
  );

  // selected
  bottomText.textContent = settingName;
  centerTxt.textContent = settingName;
}

function selectOption() {
  const wrappers = document.querySelectorAll(".settings-options");

  wrappers.forEach((option) => {
    const optionRect = option.getBoundingClientRect();
    const settingName = option.getAttribute("data-setting-name");
    const nextStep = Number(option.getAttribute("data-index"));

    option.addEventListener("click", () =>
      coreLogic(optionRect, settingName, nextStep)
    );
  });

  document.querySelector("#settings-page").classList.add("hidden");
}

function coreLogic(optionRect, settingName, nextStep) {
  // Is currently animating
  if (gsap.isTweening(optionsWrapper)) return;

  const currentIndex = Number(
    selectedWrapper.getAttribute("data-current-index")
  );

  const step = Math.abs(currentIndex - nextStep);
  selectedWrapper.setAttribute("data-current-index", nextStep);

  const coverYDistance = selectedWrapperRect.y - optionRect.y;

  const isUpDirection = coverYDistance > pastDirection; // Y +ive
  updateSettingNameInDOM(settingName);

  for (let i = 1; i <= step; i++) {
    scrollSelectedOption(isUpDirection, {
      centerTxt,
      bottomText,
    });
    [centerTxt, bottomText] = [bottomText, centerTxt];
  }

  pastDirection = coverYDistance;

  gsap.to(optionsWrapper, {
    y: coverYDistance + 3,
    duration: 0.5,
  });
}

function scrollSelectedOption(upDirection, info = {}) {
  const centerTxt = info.centerTxt;
  const bottomText = info.bottomText;

  switch (true) {
    case upDirection:
      gsap.set(bottomText, { y: "-100%" }); // go up

      gsap.to(centerTxt, {
        y: "100%",
        duration: 0.5,
      });
      gsap.to(bottomText, {
        y: 0,
        duration: 0.5,
      });
      break;

    default:
      gsap.set(bottomText, { y: "100%" }); // go down

      gsap.to(centerTxt, {
        y: "-100%",
        duration: 0.5,
      });
      gsap.to(bottomText, {
        y: 0,
        duration: 0.5,
      });
      break;
  }
}
