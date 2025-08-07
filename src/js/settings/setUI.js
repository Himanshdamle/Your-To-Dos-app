import { smoothInnOutTransition } from "../core.js";
import { getSettingsInput } from "./setEvents.js";
import { initializeStorage, setting } from "./iniStorage.js";

export function initializeSettings() {
  initializeStorage();
  selectOption();
  getSettingsInput();

  rotationTimeInterval();
  renderCustomQuotes(setting["quotes"]["customMessage"]["customQuotes"]);
  renderCustomAffirmations(
    setting["quotes"]["customMessage"]["customAffirmations"]
  );
}

/* Select settings from options */
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

// set rotation time interval
function rotationTimeInterval() {
  const timeInterval = setting["quotes"]["rotationTimeInterval"];
  const heading = document.querySelector("#heading-time-interval");

  heading.textContent = timeInterval;
}

// render custom quotes if any
let countQuotes = 0;
export function renderCustomQuotes(customQuotesArray = []) {
  const placeholder = document.querySelector("#custom-quotes-placeholder");

  if (!customQuotesArray[0]) {
    placeholder.classList.remove("hidden");
    return;
  }

  placeholder.classList.add("hidden");

  const customQuoteSection = document.querySelector("#custom-quotes");

  for (const quoteObj of customQuotesArray) {
    countQuotes++;
    const { quote, author } = quoteObj;

    const loadContent = `
                            <!-- message -->
                            <blockqoute>
                              <section class="font-bold flex flex-col">
                                  <p class="-mb-2"> ${countQuotes} </p>

                                  <!-- quote -->
                                  <div>
                                    <p> ${quote} </p>
  
                                    <textarea
                                      name="quote"
                                      readonly
                                      maxlength="200"
                                      minlength="5"
                                      class="hidden border rounded-lg quote-1-textarea"
                                    >   ${quote} 
                                    </textarea>
                                  </div>
                                  </section>
  
                                  <section class="flex flex-row items-center">
                                    <!-- author name -->
                                    <div
                                      class="flex flex-row items-center gap-2 w-full"
                                    >
                                      <div class="w-[10%] h-[1px] bg-white"></div>
  
                                      <p class="italic"> ${author} </p>
                                      
                                      <textarea
                                        name="quote-author"
                                        readonly
                                        maxlength="30"
                                        class="hidden border rounded-lg quote-1-textarea"
                                      > ${author} </textarea>
                                    </div>
  
                                    <!-- controls -->
                                    <div class="flex flex-row items-center gap-3.5">
                                      <button class="cursor-pointer">
                                        <!-- Edit -->
                                        <img
                                          src="assets/edit-2.svg"
                                          alt="edit-svg"
                                          class="w-7 h-7 opacity-70 hover:opacity-100 hover:scale-110 transition-transform duration-200"
                                        />
                                      </button>
  
                                      <!-- delete -->
                                      <button class="cursor-pointer">
                                        <img
                                          src="assets/red-trash-2.svg"
                                          alt="red-trash-svg"
                                          class="w-7 h-7 opacity-70 hover:opacity-100 hover:scale-110 transition-transform duration-200"
                                        />
                                      </button>
                                    </div>
                                  </section>

                                  <div class="mx-auto w-[80%] h-[2px] rounded-2xl bg-white my-2.5">
                              </blockquote>
    `;

    const template = document.createElement("template");
    template.innerHTML = loadContent;

    customQuoteSection.appendChild(template.content.firstElementChild);
  }
}

let countAffirmation = 0;
export function renderCustomAffirmations(customAffirmationsArray = []) {
  const placeholder = document.querySelector(
    "#custom-affirmations-placeholder"
  );

  if (!customAffirmationsArray[0]) {
    placeholder.classList.remove("hidden");
    return;
  }

  placeholder.classList.add("hidden");

  const customAffirmationsSection = document.querySelector(
    "#custom-affirmations"
  );

  for (const affirmation of customAffirmationsArray) {
    countAffirmation++;

    const loadContent = `
                            <!-- message -->
                            <blockqoute>
                              <section class="font-bold flex flex-col">
                                  <p class="-mb-2"> ${countAffirmation} </p>

                                  <!-- affirmation -->
                                  <div>
                                    <p> ${affirmation} </p>
  
                                    <textarea
                                      name="quote"
                                      readonly
                                      maxlength="200"
                                      minlength="5"
                                      class="hidden border rounded-lg quote-1-textarea"
                                    >   ${affirmation} 
                                    </textarea>
                                  </div>
                                  </section>
  
                                  <!-- controls -->
                                  <section class="flex flex-row items-center justify-end gap-3.5">
                                    <button class="cursor-pointer">
                                      <!-- Edit -->
                                      <img
                                        src="assets/edit-2.svg"
                                        alt="edit-svg"
                                        class="w-7 h-7 opacity-70 hover:opacity-100 hover:scale-110 transition-transform duration-200"
                                      />
                                    </button>

                                    <!-- delete -->
                                    <button class="cursor-pointer">
                                      <img
                                        src="assets/red-trash-2.svg"
                                        alt="red-trash-svg"
                                        class="w-7 h-7 opacity-70 hover:opacity-100 hover:scale-110 transition-transform duration-200"
                                      />
                                    </button>
                                  </section>

                                  <div class="mx-auto w-[80%] h-[2px] rounded-2xl bg-white my-2.5">
                              </blockquote>
    `;

    const template = document.createElement("template");
    template.innerHTML = loadContent;

    customAffirmationsSection.appendChild(template.content.firstElementChild);
  }
}
