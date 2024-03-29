import imagesArray from "./data.js";

const imageWrapper = document.querySelector(".img-wrapper");
const scoreElem = document.getElementById("score");
const startBtns = document.querySelectorAll(".start-btn");

const cards = [];
let flippedCards = [];
let score = 0;
let isChecking = false;

startBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    const startModal = document.getElementById("start");
    const finishModal = document.getElementById("finish");
    startModal.style.display = "none";
    finishModal.style.display = "none";
    cards.forEach((card) => {
      card.classList.remove("flipped");
    });
    flippedCards = [];
    isChecking = false;
    score = 0;
    scoreElem.innerHTML = score;
    shuffleArray(cards);
    cards.forEach((card) => {
      imageWrapper.appendChild(card);
    });
    startGame();
  });
});

imagesArray.forEach((img) => {
  const card = document.createElement("div");
  const card2 = document.createElement("div");
  createCard(img, card);
  createCard(img, card2);
  cards.push(card, card2);
});

function createCard(img, card) {
  const html = `<img src="${img}" alt="image">`;
  card.innerHTML = html;
  card.classList.add("card");
  card.addEventListener("click", clickHandler);
}

function disableCardClicks() {
  cards.forEach((card) => {
    card.removeEventListener("click", clickHandler);
  });
}

function enableCardClicks() {
  cards.forEach((card) => {
    card.addEventListener("click", clickHandler);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffleArray(cards);

cards.forEach((card) => {
  imageWrapper.appendChild(card);
});

function clickHandler() {
  if (flippedCards.length < 2 && !isChecking) {
    const card = this;
    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      disableCardClicks();
      setTimeout(checkMatch, 800);
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  isChecking = true;

  if (card1.innerHTML === card2.innerHTML) {
    card1.removeEventListener("click", clickHandler);
    card2.removeEventListener("click", clickHandler);
    score += 1;
    scoreElem.innerHTML = score;

    if (score === imagesArray.length) {
      const finishModal = document.getElementById("finish");
      finishModal.style.display = "block";

      const closeButton = document.querySelector(".close");
      closeButton.addEventListener("click", () => {
        finishModal.style.display = "none";
      });
    }

    flippedCards = [];
    isChecking = false;
    enableCardClicks();
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
      isChecking = false;
      enableCardClicks();
    }, 800);
  }
}

function startGame() {
  cards.forEach((card) => {
    setTimeout(() => {
      card.classList.add("flipped");
    }, 1000);
    setTimeout(() => {
      card.classList.remove("flipped");
    }, 4000);
  });
}
