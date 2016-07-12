var questionSet = null;
var currentQuestionOrder = -1;

$.getJSON("../data/question.json", function(data){
  questionSet = data;
  console.log(questionSet);
  //modifyWithQuestion(1);  
});

function modifyWithQuestion(i){
  console.log("I am in modified.");
  var $question = $("#question-page .ques-info");
  console.log($question);
  console.log(questionSet.questions[i].question);
  $question.find("p").text(questionSet.questions[i].question);
  var $choices = $question.find("span");
  $choices.eq(0).text("A. " + questionSet.questions[i].choiceA)[0].checked = true;
  $choices.eq(1).text("B. " + questionSet.questions[i].choiceB)[0].checked = false;
  $choices.eq(2).text("C. " + questionSet.questions[i].choiceC)[0].checked = false;
  $choices.eq(3).text("D. " + questionSet.questions[i].choiceD)[0].checked = false;
  $question.children().css({opacity: "1"});
  $question.find(".way-tip").css({opacity: "0"});
}

function getAnswerFromPlayer($inputs){
  var str = '';
  console.log($inputs.length);
  $inputs.each(function(){
    if (this.checked) {
      str = $(this).val();
    }
  });
  console.log(str);
  return str;
}

$(".ques-board .go").on("click", function(){
  var $quesInfoChildren = $(".ques-info").children();
  
  var badTips = "Sorry, Buddy. Your answer is wrong, choose ways by yourself *_*";
  
  if ($quesInfoChildren.filter(".way-tip").css("opacity") === "1"){
    
    console.log("I am here.");
    $(this).parents(".ques-board").animate({top: "-50%"}, 500);
    $(this).parents(".ques-board").animate({top: "-50%"}, 500);
    answered[currentQuestionOrder] = true;
    
  } else {
    
    if (getAnswerFromPlayer($quesInfoChildren.find('input')) === questionSet.questions[currentQuestionOrder].answer){
      $quesInfoChildren.filter(".way-tip").text(tips[currentQuestionOrder].ways);
    } else {
      $quesInfoChildren.filter(".way-tip").text(badTips);
    }
    
    $quesInfoChildren.not(".way-tip, .go").animate({opacity: "0"}, 500, function(){
    $quesInfoChildren.filter(".way-tip").animate({opacity:"1"}, 500); 
    });
    
  }
});

