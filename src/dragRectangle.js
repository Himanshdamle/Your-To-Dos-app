const selectable = new Selectable({
  appendTo: "body",
  container: "#card-container", // Make it easier to detect items
  filter: ".selectable-item",
  toggle: true,
  lasso: {
    border: "1px solid #1e90ff",
    backgroundColor: "rgba(30, 144, 255, 0.1)",
    zIndex: 500,
  },
});

document.addEventListener("click", (e) => {
  // If the clicked element is NOT one of the selectable-items
  if (!e.target.closest(".selectable-item")) {
    selectable.clear(); // deselect all
  }
});
