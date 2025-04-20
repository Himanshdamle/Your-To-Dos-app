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
