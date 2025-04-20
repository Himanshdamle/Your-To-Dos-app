const quote = document.querySelector("#quotes");
const author = document.querySelector("#author");
const dashAuthorBefore = document.querySelector("#dash-author-before");

setInterval(() => {
  if (Math.random() > 0.5) {
    fetch(
      "https://api.allorigins.win/raw?url=https://stoic.tekloon.net/stoic-quote"
    )
      .then((res) => res.json())
      .then((data) => {
        const quoteData = data.data;

        quote.innerText = `" ${quoteData.quote} "`;

        author.style.display = "block";
        author.innerText = quoteData.author;

        dashAuthorBefore.style.width = `${
          (25 / 100) * author.innerText.length
        }ch`;
      });
  } else {
    fetch("https://api.allorigins.win/raw?url=https://www.affirmations.dev/")
      .then((res) => res.json())
      .then((data) => {
        quote.innerHTML = `" ${data.affirmation} "`;
        author.style.display = "none";
        dashAuthorBefore.style.display = "none";
      })
      .catch((err) => console.error("Error fetching affirmation:", err));
  }
}, 30000);
