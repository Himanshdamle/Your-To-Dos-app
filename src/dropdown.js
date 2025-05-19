function createAnimatedDropdown({
  buttonId,
  menuId,
  svgId = null,
  onSelect = null,
}) {
  const button = document.getElementById(buttonId);
  const menu = document.getElementById(menuId);
  const preset = {
    low: "🟦 Low - Do whenever",
    medium: "🟨 Medium - Soon",
    high: "  🟥 High - Do ASAP",
    urgent: " 🔴 Urgent - Emergency",
  };

  let selectedValue = "";
  let isOpen = false;
  const duration = 0.5;

  const rotateIcon = (angle) => {
    gsap.to(`#${svgId}`, {
      rotate: angle,
      duration,
    });
  };

  const openDropdown = () => {
    menu.classList.remove("hidden");

    gsap.set(menu, { height: 0 });
    gsap.to(menu, {
      height: "auto",
      duration,
    });
    rotateIcon(0);
    isOpen = true;
  };

  const closeDropdown = () => {
    const currentHeight = menu.offsetHeight;
    gsap.set(menu, { height: currentHeight });
    gsap.to(menu, {
      height: 0,
      duration,
      onComplete: () => {
        menu.classList.add("hidden");
      },
    });
    rotateIcon(-90);
    isOpen = false;
  };

  button.addEventListener("click", () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  menu.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      selectedValue = item.dataset.value;
      button.innerHTML = `${item.innerHTML}${
        svgId
          ? ` <span id="${svgId}">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
          <path d="M480-384 288-576h384L480-384Z" />
        </svg>
      </span>`
          : ""
      }`;
      closeDropdown();
      if (onSelect) onSelect(selectedValue);
    });
  });

  document.addEventListener("click", (e) => {
    if (!button.contains(e.target) && !menu.contains(e.target) && isOpen) {
      closeDropdown();
    }
  });

  return {
    preset,
  };
}

const priorityDropdown = createAnimatedDropdown({
  buttonId: "priority-input",
  menuId: "priority-dropdown",
  svgId: "dropdown-svg",
  onSelect: (value) => {
    currTodoDetails.priority = value;
  },
});

const dateFilterDropdown = createAnimatedDropdown({
  buttonId: "date-filter-input",
  menuId: "date-filter-dropdown",
  onSelect: (value) => {
    console.log("Selected priority:", value);
    // Do something with value here
  },
});

const priorityFilterDropdown = createAnimatedDropdown({
  buttonId: "priority-filter-input",
  menuId: "priority-filter-dropdown",
  onSelect: (value) => {
    console.log("Selected priority:", value);
    // Do something with value here
  },
});

const statusFilterDropdown = createAnimatedDropdown({
  buttonId: "status-filter-input",
  menuId: "status-filter-dropdown",
  onSelect: (value) => {
    console.log("Selected priority:", value);
    // Do something with value here
  },
});
