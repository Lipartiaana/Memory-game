import imagesArray from "./data.js";

const imageWrapper = document.querySelector(".img-wrapper");
const scoreElem = document.getElementById("score");
const startBtns = document.querySelectorAll(".start-btn");
const startModal = document.getElementById("start");
const finishModal = document.getElementById("finish");
const finishMessage = document.getElementById("finish-message");
const winImage = document.getElementById("win-image");
const timer = document.getElementById("timer");

const closeButton = document.querySelector(".close");
closeButton.addEventListener("click", () => {
  finishModal.style.display = "none";
  timer.textContent = "01:00";
});

startBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    startGame();
  });
});

let timerInterval;
let cards = [];
let flippedCards = [];
let score = 0;
let isChecking = false;
let timeLeft = 60;

// Clears results
function clearResults() {
  cards = [];
  flippedCards = [];
  score = 0;
  isChecking = false;
  timeLeft = 60;
  timer.textContent = "01:00";
  startModal.style.display = "none";
  finishModal.style.display = "none";
}

// Shufles images
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Shows modal with wining or loosing message
function showMessage(message) {
  finishModal.style.display = "block";
  if (message === "win") {
    finishMessage.textContent = "You Win";
    winImage.style.display = "block";
  } else if (message === "lose") {
    finishMessage.textContent = "You Lose";
    winImage.style.display = "none";
  }
}

// Starts/restarts game
function startGame() {
  disableCardClicks();
  imageWrapper.innerHTML = "";
  clearResults();
  cards.forEach((card) => {
    card.classList.remove("flipped");
  });
  scoreElem.innerHTML = score;
  chooseCards();
  shuffleArray(cards);
  cards.forEach((card) => {
    imageWrapper.appendChild(card);
  });
  clearInterval(timerInterval);
  cards.forEach((card) => {
    setTimeout(() => {
      card.classList.add("flipped");
    }, 1000);
    setTimeout(() => {
      card.classList.remove("flipped");
      enableCardClicks();
    }, 4000);
  });

  setTimeout(() => {
    timerInterval = setInterval(updateTimer, 1000);
  }, 3000);
}

// Takes 8 random cards for game board
function chooseCards() {
  shuffleArray(imagesArray);

  for (let i = 0; i < 8; i++) {
    const img = imagesArray[i];
    const card = document.createElement("div");
    const card2 = document.createElement("div");
    createCard(img, card);
    createCard(img, card2);
    cards.push(card, card2);
  }
}

// Creates card
function createCard(img, card) {
  const html = `<img src="${img}" alt="image">`;
  card.innerHTML = html;
  card.classList.add("card");
  card.addEventListener("click", clickHandler);
}

// Card click functions
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

// Checks match
function checkMatch() {
  const [card1, card2] = flippedCards;
  isChecking = true;

  if (card1.innerHTML === card2.innerHTML) {
    card1.removeEventListener("click", clickHandler);
    card2.removeEventListener("click", clickHandler);
    score += 1;
    scoreElem.innerHTML = score;

    if (score === 8) {
      showMessage("win");
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

// Updates timer
function updateTimer() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = Math.floor(timeLeft % 60);

  let formattedTime =
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds);

  timer.textContent = formattedTime;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    timer.textContent = "00:00";
    showMessage("lose");
  } else {
    timeLeft--;
  }
}
