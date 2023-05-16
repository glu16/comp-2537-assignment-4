/* Fetches data from the PokéAPI and dynamically generate sets of Pokémon cards for the game */
async function getRandomPokemon(numPokemonPairs) {
  const randomPokemon = [];
  for (let i = 0; i < numPokemonPairs; i++) {
    let randomPokemonID;
    do {
      randomPokemonID = Math.floor(Math.random() * 810) + 1;
    } while (randomPokemon.includes(randomPokemonID));
    randomPokemon.push(randomPokemonID);
    randomPokemon.push(randomPokemonID);
  }
  randomPokemon.sort(() => Math.random() - 0.5);
  for (let i = 0; i < randomPokemon.length; i++) {
    const pokemonID = randomPokemon[i];
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonID}`
    );
    $("#gameGrid").append(`
      <div class="pokeCard">
        <img id="img${i}" class="front_face" src=${res.data.sprites.other["official-artwork"].front_default} alt="">
        <img class="back_face" src="back.webp" alt="">
      </div>
    `);
  }
}

/* Sets up the whole functionality of the memory card game */
const setup = () => {

  // Event listener for Easy mode
  $("#easy").click(function () {
    difficulty = "easy";
    console.log("Easy mode");
  });

  // Event listener for Medium mode
  $("#medium").click(function () {
    difficulty = "medium";
    console.log("Medium mode");
  });

  // Event listener for Hard mode
  $("#hard").click(function () {
    difficulty = "hard";
    console.log("Hard mode");
  });
  
  // Event listener for reset button
  $("#resetButton").click(function () {
    location.reload();
  });

  // Starts the game
  function startGame() {
    // Event listeners for users to switch between dark and light mode
    $("#darkMode").click(function () {
      $("#gameGrid").css("background-color", "black");
    });
    $("#lightMode").click(function () {
      $("#gameGrid").css("background-color", "white");
    });

    $("#start").css("display", "none");
    $("#gameGrid").css("display", "");
    $("#info").css("display", "");
    $("#themes").css("display", "");

    var firstCard = undefined;
    var secondCard = undefined;
    var totalPairs = 0;
    var matches = 0;
    var clicks = 0;
    var matchesLeft = totalPairs;
    var timer = 0;
    var time = 0;

    if (difficulty === "medium") {
      $("#gameGrid").css("width", "800px");
      $("#gameGrid").css("height", "600px");
      totalPairs = 6;
      timer = 200;
      matchesLeft = totalPairs;
    } else if (difficulty === "hard") {
      $("#gameGrid").css("width", "1200px");
      $("#gameGrid").css("height", "800px");
      totalPairs = 12;
      matchesLeft = totalPairs;
      timer = 300;
    } else {
      timer = 100;
      totalPairs = 3;
      matchesLeft = totalPairs;
    }

    $("#clicks").text(clicks);
    $("#total").text(totalPairs);
    $("#matches").text(matches);
    $("#left").text(matchesLeft - matches);
    $("#timer").text(timer);
    $("#time").text(time);

    time++;

    let timerInterval;
    let gameEnded = false;

    // Sets the timer for the game
    timerInterval = setInterval(() => {
      if (time - 1 === timer) {
        clearInterval(timerInterval);
        alert("Time's up! You lost the game!");
        return;
      }
      $("#time").text(time++);
    }, 1000);

    // Allows the user to see all the cards for a set amount of time
    function powerUp() {
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

    // Generates random pairs of Pokémon for the card game
    getRandomPokemon(totalPairs).then(() => {
      $(".pokeCard").on("click", function () {
        if (!firstCard) {
          firstCard = $(this).find(".front_face")[0];
          $(this).toggleClass("flip");
          $(this).toggleClass("disabled");
          clicks++;
          $("#clicks").text(clicks);
        } else {
          if ($(this).find(".front_face")[0] === firstCard) {
            return;
          }
          if (!secondCard) {
            secondCard = $(this).find(".front_face")[0];
            $(this).toggleClass("flip");
            $(this).toggleClass("disabled");
            clicks++;
            $("#clicks").text(clicks);
            console.log(clicks);
          } else {
            return;
          }
          if (firstCard.src == secondCard.src) {
            matches++;
            $("#matches").text(matches);
            $("#left").text(matchesLeft - matches);

            $(`#${firstCard.id}`).parent().off("click");
            $(`#${secondCard.id}`).parent().off("click");

            firstCard = undefined;
            secondCard = undefined;
          } else {
            setTimeout(() => {
              $(`#${firstCard.id}`).parent().toggleClass("flip");
              $(`#${firstCard.id}`).parent().toggleClass("disabled");
              $(`#${secondCard.id}`).parent().toggleClass("flip");
              $(`#${secondCard.id}`).parent().toggleClass("disabled");
              firstCard = undefined;
              secondCard = undefined;
            }, 1000);
          }
        }
        // Ends the game and stops everything once the player wins
        if (matches === totalPairs) {
          setTimeout(() => {
            alert("Congratulations! You won the game!");
            clearInterval(timerInterval);
          }, 500);
          gameEnded = true;
        }
      });
    });
  }
  $("#start").click(function () {
    startGame();
  });
};

$(document).ready(setup);
