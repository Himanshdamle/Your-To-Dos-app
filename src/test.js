gsap.set("h1", { filter: "blur(5px)", y: 0, opacity: 0.5 });
gsap.to("h1", {
  y: "-100%",
  filter: "blur(0px)",
  opacity: 1,

  duration: 0.5,

  onComplete() {
    gsap.set("h1", { y: "100%", filter: "blur(5px)", opacity: 0.5 });
    document.querySelector("h1").textContent = "NAMASTE!";
    gsap.to("h1", {
      y: 0,
      filter: "blur(0px)",
      opacity: 1,

      duration: 0.5,
    });
  },
});
