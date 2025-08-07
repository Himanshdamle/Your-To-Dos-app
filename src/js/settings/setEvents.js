import { setting } from "./iniStorage.js";
import {
  updateObject,
  handleCustomQuotes,
  updateSettingFromButton,
} from "./iniStorage.js";
import { resetPsuedoPlaceholder, trackInputChar } from "../event.js";
import { showMessagePopup, smoothInnOutTransition } from "../core.js";
import { createAnimatedDropdown } from "../dropdown.js";

export function getSettingsInput() {
  tkInputTurnOffQuotes();
  tkInputSelectQuoteSource();
  tkInputSelectAffirmationSource();
  tkInputCustomPositiveMessage();

  toggleCustomMessageView();
}

/*  */
/* toggleOptions b/w multiple options */
/*  */
function deSelectOption(button) {
  gsap.to(button, {
    opacity: 0.5,
    scale: 1,
    duration: 0.2,
  });
}
function selectOption(button) {
  gsap.to(button, {
    opacity: 1,
    scale: 1.05,
    duration: 0.2,
  });
}
export function toggleOptions({
  buttonClass,
  selectedBtnAttribute,
  buttonsAttributeName,
  selfDeSelect = true,
  nowSelcted = () => {},
  nowDeSelected = () => {},
}) {
  const buttons = document.querySelectorAll(`${buttonClass}`);

  let userSelectedOne = false;
  let thisButtonisSelected = null;

  buttons.forEach((button) => {
    const attribute = button.getAttribute(`${buttonsAttributeName}`);
    let isSelected = selectedBtnAttribute === attribute;
    // Means already selected before

    if (isSelected) {
      button.style.opacity = "100%";
      userSelectedOne = true;
      thisButtonisSelected = button;
    }

    button.addEventListener("click", () => {
      if (button === thisButtonisSelected && !selfDeSelect) return;

      if (!isSelected) {
        // Select
        selectOption(button);
        nowSelcted(button);

        userSelectedOne = true;
        thisButtonisSelected = button;
      } else {
        // De-select
        deSelectOption(button);
        nowDeSelected(button);

        userSelectedOne = false;
        thisButtonisSelected = null;
      }

      isSelected = !isSelected;

      if (!userSelectedOne) return;

      buttons.forEach((eachBtn) => {
        if (eachBtn !== button) {
          deSelectOption(eachBtn);
        }
      });
    });

    button.addEventListener("mouseenter", () => {
      if (thisButtonisSelected === button) return;

      isSelected = false;
      selectOption(button);
    });

    button.addEventListener("mouseleave", () => {
      if (isSelected) return;

      deSelectOption(button);
    });
  });
}

/* take input from turn off quotes or affirmations or turn of both at once */
function tkInputTurnOffQuotes() {
  toggleOptions({
    buttonClass: ".turnoff-positive-message",
    selectedBtnAttribute: setting["quotes"]["turnOff"],
    buttonsAttributeName: "data-turn-off",
    selfDeSelect: true,

    nowSelcted: (button) =>
      updateSettingFromButton({
        button,
        buttonAttribute: "data-turn-off",
        path: "quotes.turnOff",
      }),
    nowDeSelected: () => updateObject("quotes.turnOff", null),
  });
}

/* take input from time interval dropdown */
createAnimatedDropdown({
  buttonId: "open-time-interval-dropdown",
  menuId: "time-interval-options",
  svgId: "dropdown-time-interval-svg",

  onSelect: (value) => {
    setting["quotes"]["rotationTimeInterval"] = Number(value);
  },
});

/* take input for the selection of quote source */
function tkInputSelectQuoteSource() {
  toggleOptions({
    buttonClass: ".select-quote-source",
    selectedBtnAttribute: setting["quotes"]["messageSource"]["useQuotesBy"],
    buttonsAttributeName: "data-select-quote-source",
    selfDeSelect: false,

    nowSelcted: (button) =>
      updateSettingFromButton({
        button,
        buttonAttribute: "data-select-quote-source",
        path: "quotes.messageSource.useQuotesBy",
      }),
  });
}
function tkInputSelectAffirmationSource() {
  toggleOptions({
    buttonClass: ".select-affirmation-source",
    selectedBtnAttribute:
      setting["quotes"]["messageSource"]["useAffirmationsBy"],
    buttonsAttributeName: "data-select-affirmation-source",
    selfDeSelect: false,

    nowSelcted: (button) =>
      updateSettingFromButton({
        button,
        buttonAttribute: "data-select-affirmation-source",
        path: "quotes.messageSource.useAffirmationsBy",
      }),
  });
}

/*  */
/* custom quotes/affirmation input */
/*  */
const positiveMessageInput = document.querySelector("#positive-message-input");
const authorInput = document.querySelector("#author-name-input");

const tractCharPM = document.querySelector("#current-len-postive-message");
const tractCharAN = document.querySelector("#current-len-author-name");

const authorNameWrapper = document.querySelector("#author-name-wrapper");
let isQuoteSelected = true;

function resetCustomQuoteForm() {
  positiveMessageInput.value = "";
  authorInput.value = "";

  resetPsuedoPlaceholder(
    document.querySelector("#positive-message-form"),
    true
  );
}
function chooseCustomPostiveMessage() {
  toggleOptions({
    buttonClass: ".button-custom-pos-msg",
    selectedBtnAttribute:
      setting["quotes"]["customMessage"]["customPostiveMessage"],
    buttonsAttributeName: "data-custom-selected",
    selfDeSelect: false,

    nowSelcted: (button) => {
      isQuoteSelected =
        button.getAttribute("data-custom-selected") === "quotes";

      const animationConfig = {
        el: authorNameWrapper,
        scale: 1.05,
        opacity: 1,
        duration: 0.35,
      };

      if (!isQuoteSelected) {
        smoothInnOutTransition({ ...animationConfig }, true);

        return;
      }

      smoothInnOutTransition({ ...animationConfig }, false, "flex");
    },
  });
}
function tkInputCustomPositiveMessage() {
  trackInputChar(positiveMessageInput, tractCharPM);
  trackInputChar(authorInput, tractCharAN);

  chooseCustomPostiveMessage();

  const savePositiveMessageButton = document.querySelector("#save-quote");
  const resetInputFieldButton = document.querySelector("#reset-form");

  savePositiveMessageButton.addEventListener("click", () => {
    const positiveMessage = positiveMessageInput.value;
    const authorName = authorInput.value;

    if (positiveMessage.length < 5 && authorName.length < 1) return;

    handleCustomQuotes({
      positiveMessage: positiveMessage,
      authorName: authorName,
      isQuote: isQuoteSelected,
    });

    const message = isQuoteSelected ? "Quote" : "Affirmation";
    showMessagePopup({
      emoji: "✅💬",
      invertedBoldTxt: positiveMessage,
      lightTxt: `${message} added Sucessfully`,
    });

    resetCustomQuoteForm();
  });

  resetInputFieldButton.addEventListener("click", resetCustomQuoteForm);
}

function toggleCustomMessageView() {
  const quoteBtn = document.querySelector("#quote-view");
  const affirmationBtn = document.querySelector("#affirmation-view");

  const wrapper = document.querySelector("#custom-message-container");

  quoteBtn.addEventListener("click", () => {
    const isInView = quoteBtn.getAttribute("data-inview");

    if (isInView == "true") return;

    gsap.to(wrapper, {
      x: 0,
      duration: 0.85,
      ease: "expo.out",
    });

    gsap.set(quoteBtn, { backgroundColor: "#242424" });
    gsap.set(affirmationBtn, { backgroundColor: "#1A1A1A" });

    quoteBtn.setAttribute("data-inview", "true");
    affirmationBtn.setAttribute("data-inview", "false");
  });

  affirmationBtn.addEventListener("click", () => {
    const isInView = affirmationBtn.getAttribute("data-inview");

    if (isInView == "true") return;

    gsap.to(wrapper, {
      x: "-50%",
      duration: 0.85,
      ease: "expo.out",
    });

    gsap.set(affirmationBtn, { backgroundColor: "#242424" });
    gsap.set(quoteBtn, { backgroundColor: "#1A1A1A" });

    affirmationBtn.setAttribute("data-inview", "true");
    quoteBtn.setAttribute("data-inview", "false");
  });
}
