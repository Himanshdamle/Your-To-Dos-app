const button = document.getElementById("priority-input");
const menu = document.getElementById("priority-dropdown");
let selectedPriority = "";

let rotated = false;
const duration = 0.5;

// Toggle animation visibility
function onComplete() {
  menu.classList.toggle("hidden");
}

button.addEventListener("click", () => {
  gsap.to("#dropdown-svg", {
    rotate: rotated ? -90 : 0,
    duration,
    onComplete() {
      rotated = !rotated;
    },
  });

  if (rotated) {
    gsap.set(menu, { height: 150 });
    gsap.to(menu, {
      height: 0,
      duration,
      onComplete,
    });
  } else {
    gsap.set(menu, { height: 0, onComplete });
    gsap.to(menu, {
      height: "auto",
      duration,
    });
  }
});

menu.querySelectorAll("li").forEach((item) => {
  item.addEventListener("click", () => {
    selectedPriority = item.dataset.value;

    button.innerHTML = `${item.innerHTML} <span id="dropdown-svg">
      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
        <path d="M480-384 288-576h384L480-384Z" />
      </svg>
    </span>`;

    // Animate closing the dropdown
    const currentHeight = menu.offsetHeight;
    gsap.set(menu, { height: currentHeight });
    gsap.to(menu, {
      height: 0,
      duration,
      onComplete() {
        menu.classList.add("hidden");
      },
    });

    // Rotate the arrow back
    gsap.to("#dropdown-svg", {
      rotate: -90,
      duration: 0.5,
      onComplete() {
        rotated = false;
      },
    });

    console.log("Selected Priority:", selectedPriority);
  });
});

// Close if clicking outside
document.addEventListener("click", (e) => {
  const clickedInsideButton = button.contains(e.target);
  const clickedInsideMenu = menu.contains(e.target);

  if (!clickedInsideButton && !clickedInsideMenu && rotated) {
    gsap.to("#dropdown-svg", {
      rotate: -90,
      duration: 0.5,
      onComplete() {
        rotated = false;
      },
    });

    const currentHeight = menu.offsetHeight;
    gsap.set(menu, { height: currentHeight });
    gsap.to(menu, {
      height: 0,
      duration,
      onComplete() {
        menu.classList.add("hidden");
      },
    });
  }
});
