const h1 = document.querySelector("h1");
const wordList = ["HIMANSH", "ABHAY"];

const tl = gsap.timeline({
  defaults: {
    duration: 0.3,
    ease: "power1.inOut",
  },
});

const wordWrapper = document.querySelector("span");

let count = 0;
let letters = [];
function animate(wordWrapper) {
  const tl2 = gsap.timeline({
    defaults: {
      duration: 0.3,
      ease: "power1.inOut",
    },
    onComplete() {
      count++;
      if (count === wordList.length) {
        console.log("done", letters);
        animateFromStart();
        count = 0;
      }
    },
  });

  wordWrapper.querySelectorAll("h1").forEach((h1) => {
    tl2.to(h1, {
      y: "-200%",
      onComplete() {
        gsap.set(h1, { y: "100%" });
      },
    });
  });
}

function animateFromStart() {
  letters.forEach((h1List) => {
    h1List.forEach((h1) => {
      tl.to(h1, {
        y: 0,
      });
    });
  });
}

wordList.forEach((element, index) => {
  const el = document.createElement("div");
  el.id = element;

  letters.push([]);
  for (let i = 0; i < element.length; i++) {
    const word = element[i];

    const h1 = document.createElement("h1");
    h1.textContent = word;
    el.append(h1);

    letters.at(-1).push(h1);

    tl.to(h1, {
      y: "-100%",
    });
  }
  wordWrapper.append(el);
  el.classList.add("flex", "gap-0.5", "font-medium");
  tl.add(() => {
    console.log(`✅ Done animating word: ${element}`);
    setTimeout(() => {
      animate(document.querySelector(`#${element}`));
    }, 1000);
  });
});
