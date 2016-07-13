$(".winner-pic a").on("click", function(){
  clockTick = -1;
  var str = $(".achievement").text();
  str = str.substr(0, str.length - 7);
  $(this).closest("#winner").fadeOut(function(){
    $(".achievement").text(str);
    gameClock = setInterval(function(){
      clockTick++;
      sendTimeToClock(clockTick);
    }, 1000);
  });
  playAgain = true;
  Game.start();
  $("audio")[0].play();
});

$("#winner-button").on("click", function(){
  $("audio")[0].pause();
  clearInterval(gameClock);
  var str = $(".achievement").text() + $(".time-show").text()
  $(".achievement").text(str);
  $("#winner").fadeIn();
});
