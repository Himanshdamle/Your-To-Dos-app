function placeholderEffect(psuedoPlaceholder, inputBox) {
  inputBox.addEventListener("input", () => {
    const setting = {
      duration: 0.5,
      ease: "power2.out",
      el: psuedoPlaceholder,
    };
    if (inputBox.value) {
      smoothInnOutTransition(setting, true);
    } else {
      smoothInnOutTransition(setting, false);
    }
  });
}

const psuedoPlaceholders = document.querySelectorAll(".psuedo-placeholder");
const input = document.querySelectorAll(".input");

psuedoPlaceholders.forEach((placeholder, index) => {
  placeholderEffect(placeholder, input[index]);
});

const inputs = document.querySelectorAll('input[name="tag"]');

inputs.forEach((input) => {
  const resize = () => {
    input.style.width = `${input.value.length + 0.5}ch`;
  };
  resize();
  input.addEventListener("input", resize);
});

document.querySelectorAll(".tag").forEach((tag) => {
  const bg = tag.querySelector("#bg-color-tag");
  console.log(bg);

  tag.addEventListener("mouseenter", (e) => {
    const rect = tag.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    bg.style.transformOrigin = `${x}px ${y}px`;
    bg.classList.add("scale-100");
  });

  tag.addEventListener("mouseleave", () => {
    bg.classList.remove("scale-100");
  });
});
