




const setup = () => {
  let firstCard = undefined;
  let secondCard = undefined;
  $(".card").on("click", function () {
    $(this).toggleClass("flip");
    console.log("Clicked!");

    if (!firstCard) {
      firstCard = $(this).find(".front_face")[0];
    } else {
      secondCard = $(this).find(".front_face")[0];
      $(this).addClass("disabled");
      console.log(firstCard, secondCard);
      if (firstCard.src == secondCard.src)
        if (firstCard.src == secondCard.src) {
          console.log("Match");
          $(`#${firstCard.id}`).parent().off("click");
          $(`#${secondCard.id}`).parent().off("click");
          firstCard = undefined;
          secondCard = undefined;
        } else {
          console.log("No match");
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

$(document).ready(setup);
