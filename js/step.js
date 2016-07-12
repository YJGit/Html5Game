$('.flip-cards li').on("click", function(){
  $(this).parent().animate({opacity: "1"}, 500).animate({opacity: "0"}, 500); 
});

$("#step-button").on("click", function(event, order){
  console.log("I am order", order);
  modifyWithQuestion(order);
  var $questionBoard = $(".ques-board");
  console.log("I got the question page.")
  $questionBoard.animate({top: "50%"}, 500);
});  

// Returns a random integer between min (included) and max (included)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIntArray(min, max){
  var randomArray = new Array(max - min + 1);
  var i = 0, j = 0;
  var num = 0;
  var equal = true;
  for (i = 0; i < randomArray.length; i++){
    equal = true;
    while (equal){
      equal = false;
      num = getRandomInt(min, max);
      for (j = 0; j < i; j++){
        if (randomArray[j] === num){
          equal = true;
        }
      }
    }
    randomArray[i] = num;
  }
  return randomArray;
}

function numToRom(num){
  switch (num){
    case 1:
      return "I";
    case 2:
      return "II";
    case 3:
      return "III";
    default:
      return "IV";
  }
}

function RomToNum(rom){
  switch (rom){
    case "I":
      return 1;
    case "II":
      return 2;
    case "III":
      return 3;
    default:
      return 4;
  }
}
