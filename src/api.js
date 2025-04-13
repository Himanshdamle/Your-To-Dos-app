const quote = document.querySelector("#quotes");
const author = document.querySelector("#author");

if (Math.random() > 0.5) {
  fetch(
    "https://api.allorigins.win/raw?url=https://stoic.tekloon.net/stoic-quote"
  )
    .then((res) => res.json())
    .then((data) => {
      quote.innerText = `" ${data.data.quote} "`;
      author.style.display = "block";
      author.innerText = data.data.author;
    });
} else {
  fetch("https://api.allorigins.win/raw?url=https://www.affirmations.dev/")
    .then((res) => res.json())
    .then((data) => {
      quote.innerHTML = `" ${data.affirmation} "`;
      author.style.display = "none";
    })
    .catch((err) => console.error("Error fetching affirmation:", err));
}
