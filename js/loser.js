$(".loser-pic a").on("click", function(){
  clockTick = -1;
  $(this).closest("#loser").fadeOut(function(){
    gameClock = setInterval(function(){
      clockTick++;
      sendTimeToClock(clockTick);
    }, 1000);
  });
  $("audio")[0].play();
});

$("#loser-button").on("click", function(){
  $("audio")[0].pause();
  clearInterval(gameClock);
  $("#loser").fadeIn();
});