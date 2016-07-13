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