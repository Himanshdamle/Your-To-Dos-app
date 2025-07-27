import { handleTurnOffQuotes, setting } from "./iniStorage.js";
import { updateObject } from "./iniStorage.js";

export function getSettingsInput() {
  tkInputTurnOffQuotes();
}

function tkInputTurnOffQuotes() {
  const turnoffQuoteButtons = document.querySelectorAll(
    ".turnoff-positive-message"
  );
  const turnOffedAlready = setting["quotes"]["turnOff"];

  let userSelectedOne = false;

  turnoffQuoteButtons.forEach((btns) => {
    const btnWillTurnOff = btns.getAttribute("data-turn-off");
    let selected = turnOffedAlready === btnWillTurnOff;
    // Means already selected before

    if (selected) {
      btns.style.opacity = "100%";
      userSelectedOne = true;
    }

    btns.addEventListener("click", () => {
      if (!selected && userSelectedOne) return;
      // means allow only the selected one to toggle

      if (!selected) {
        btns.style.opacity = "100%";
        handleTurnOffQuotes(btns);

        userSelectedOne = true;
      } else {
        btns.style.opacity = "50%";
        updateObject("quotes.turnOff", null);

        userSelectedOne = false;
      }

      selected = !selected; // toggle
    });

    btns.addEventListener("mouseenter", () => {
      if (userSelectedOne && !selected) {
        btns.style.cursor = "not-allowed";
        return;
      }

      btns.style.cursor = "pointer";
      gsap.to(btns, {
        opacity: 1,
        duration: 0.2,
      });
      gsap.to(btns, {
        scale: 1.05,
        duration: 0.2,
      });
    });

    btns.addEventListener("mouseleave", () => {
      gsap.to(btns, {
        scale: 1,
        duration: 0.2,
      });
      if (selected) return;

      gsap.to(btns, {
        opacity: 0.5,
        duration: 0.2,
      });
    });
  });
}
