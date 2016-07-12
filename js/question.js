var questionSet = null;

$.getJSON("../data/question.json", function(data){
  questionSet = data;
  console.log(questionSet);
  modifyWithQuestion(1);  
});

function modifyWithQuestion(i){
  console.log("I am in modified.");
  var $question = $("#question-page .ques-info");
  console.log($question);
  console.log(questionSet.questions[i].question);
  $question.find("p").text(questionSet.questions[i].question);
  var $choices = $question.find("span");
  $choices.eq(0).text("A. " + questionSet.questions[i].choiceA);
  $choices.eq(1).text("B. " + questionSet.questions[i].choiceB);
  $choices.eq(2).text("C. " + questionSet.questions[i].choiceC);
  $choices.eq(3).text("D. " + questionSet.questions[i].choiceD);
}
  
$(".ques-board .go").on("click", function(){
  var $quesInfoChildren = $(".ques-info").children();
  if ($quesInfoChildren.filter(".way-tip").css("opacity") === "1"){
    console.log("I am here.");
    $(this).parents(".ques-board").animate({top: "-50%"}, 500);
  } else {
    $quesInfoChildren.not(".way-tip, .go").animate({opacity: "0"}, 500, function(){
      $quesInfoChildren.filter(".way-tip").text("This is the right way.").animate({opacity:"1"}, 500); 
    });
  }
});

