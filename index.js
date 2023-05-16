const cards = document.querySelectorAll(".pokeCard");
const frontFaces = document.querySelectorAll(".front_face");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (gameStarted) {
      flipCard(card);
    }
  });
});

let gameStarted = false;

function flipCard(card) {
  card.classList.toggle("flip");
}

/* Checks to see if the flipped cards match each other */
const setup = () => {
  let firstCard = undefined;
  let secondCard = undefined;
  let totalMatches = 0;

  $(".pokeCard").on("click", function () {
    $(this).toggleClass("flip");
    console.log("Clicked!");

    if (!firstCard) {
      firstCard = $(this).find(".front_face")[0];
    } else {
      secondCard = $(this).find(".front_face")[0];
      $(this).addClass("disabled");
      console.log(firstCard, secondCard);

      if (firstCard.src == secondCard.src) {
        console.log("Match!");
        $(`#${firstCard.id}`).parent().off("click");
        $(`#${secondCard.id}`).parent().off("click");
        firstCard = undefined;
        secondCard = undefined;

        totalMatches++;
        totalClicks++;

        const pairsMatched = document.getElementById("matches");
        pairsMatched.textContent = totalMatches;
        numClicks.textContent = totalClicks;

        if (totalMatches === $(".pokeCard").length / 2) {
          clearInterval(timer);
          const matchTimeout = setTimeout(() => {
            alert("Congratulations! You've won the game!");
          }, 500);
        }
      } else {
        console.log("No match!");
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip");
          $(`#${secondCard.id}`).parent().toggleClass("flip");
          firstCard = undefined;
          secondCard = undefined;
        }, 1000);
      }
    }
  });
};

/* Fetches data from the PokéAPI and dynamically generate sets of Pokémon cards for a game */
$(document).ready(() => {
  const apiUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=810";
  $.get(apiUrl, (data) => {
    const results = data.results;
    const randomPokemon = getRandomElements(results, 3);
    const pokemonSets = [];

    // Create 3 sets of the same Pokémon
    for (let i = 0; i < 3; i++) {
      pokemonSets.push(...randomPokemon);
    }

    // Set the images for the Pokémon cards
    $(".front_face").each(function (index) {
      const pokemonIndex = index % pokemonSets.length;
      $(this).attr(
        "src",
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          pokemonSets[pokemonIndex].url.split("/")[6]
        }.png`
      );
    });

    // Call the setup function to initialize the game
    setup();
  });
});

// Get random elements from the array of Pokémon
function getRandomElements(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/* Displays the header for the page */
function updateHeader() {
  let flippedCards = [];
  const totalPairs = document.getElementById("total");
  const pairsMatched = document.getElementById("matches");
  const pairsLeft = document.getElementById("left");
  const numClicks = document.getElementById("clicks");

  numClicks.textContent = flippedCards.length / 2;
  pairsLeft.textContent = totalPairs.textContent - pairsMatched.textContent;
}

/* Displays a timer for the page */
let timer;
let seconds = 0;
const timerDisplay = document.getElementById("time");
const timerText = document.getElementById("timer");

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = seconds;
    timerText.textContent = 100 - seconds;

    if (seconds === 100) {
      clearInterval(timer);
      alert("Time's up! You lost!");
    }
  }, 1000);
}

cards.forEach((card) => {
  card.addEventListener("click", () => {
    flipCard(card);
  });
});

/* Event listener for the "Reset" and "Start" buttons */
document.addEventListener("DOMContentLoaded", function () {
  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", resetGame);

  function resetGame() {
    const timerDisplay = document.getElementById("time");
    const timerText = document.getElementById("timer");
    timerDisplay.textContent = "0";
    clearInterval(timer);
    seconds = 0;
    timerText.textContent = 100;

    cards.forEach((card) => {
      card.classList.remove("flip");
    });

    // Reset the header
    const numClicks = document.getElementById("clicks");
    const pairsLeft = document.getElementById("left");
    const pairsMatched = document.getElementById("matches");
    const totalPairs = document.getElementById("total");

    numClicks.textContent = "0";
    pairsLeft.textContent = totalPairs.textContent;
    pairsMatched.textContent = "0";

    // Start the game
    startTimer();

    // Update the header
    updateHeader();

    // Activate power-up
    activatePowerUp();
  }

  const startButton = document.getElementById("start");
  startButton.addEventListener("click", startGame);

  function startGame() {
    gameStarted = true;

    // Start the game
    startTimer();

    // Update the header
    updateHeader();
  }
});

/* Allows the user to select the game's difficulty level */
const difficultyButtons = Array.from(
  document.querySelectorAll("#difficulty input")
);

difficultyButtons.forEach((button) => {
  button.addEventListener("change", () => {
    const selectedDifficulty = button.value;

    // Update the game difficulty based on the selected level
    // Update the game difficulty based on the selected level
    if (selectedDifficulty === "easy") {
      const pairsLeft = document.getElementById("left");
      const totalPairs = document.getElementById("total");
      pairsLeft.textContent = "3";
      totalPairs.textContent = "3";
      timerDisplay.textContent = "100";
    } else if (selectedDifficulty === "medium") {
      const pairsLeft = document.getElementById("left");
      const totalPairs = document.getElementById("total");
      pairsLeft.textContent = "6";
      totalPairs.textContent = "6";
      timerDisplay.textContent = "150";
    } else if (selectedDifficulty === "hard") {
      const pairsLeft = document.getElementById("left");
      const totalPairs = document.getElementById("total");
      pairsLeft.textContent = "9";
      totalPairs.textContent = "9";
      timerDisplay.textContent = "200";
    }

    resetGame();
  });
});

/* Allows the user to choose between dark and light mode */
document.addEventListener("DOMContentLoaded", function () {
  const darkButton = document.getElementById("darkButton");
  const lightButton = document.getElementById("lightButton");
  const gameGrid = document.getElementById("gameGrid");

  darkButton.addEventListener("click", () => {
    gameGrid.classList.add("darkMode");
    gameGrid.classList.remove("lightMode");
  });

  lightButton.addEventListener("click", () => {
    gameGrid.classList.remove("darkMode");
    gameGrid.classList.add("lightMode");
  });
});

/* Allows the user to see all the cards for a set amount of time */
function activatePowerUp() {
  if (!gameEnded) {
    powerUpActive = true;

    setTimeout(() => {
      cards.forEach((card) => {
        if (!card.classList.contains("flip")) {
          card.classList.add("flip");
        }
      });

      alert("Power up activated!");

      setTimeout(() => {
        cards.forEach((card) => {
          if (!flippedCards.includes(card)) {
            card.classList.remove("flip");
          }
        });
        powerUpActive = false;
        clickCount = 0;
      }, 3000);
    }, 10000);
  }
}
