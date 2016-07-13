var gameClock = null;
var clockTick = 0;

$(".intro-button").on('click', function(){
  $(this).closest("#introduction").fadeOut(function(){
    gameClock = setInterval(function(){
      clockTick++;
      sendTimeToClock(clockTick);
    }, 1000);
  });
  $("audio")[0].play();
});

function sendTimeToClock(count){
  var minute = String(Math.floor(count / 60));
  var second = String(count % 60);
  if (minute.length === 1){
    minute = "0" + minute;
  }
  if (second.length === 1){
    second = "0" + second;
  }
  var timeStr = minute + "\':" + second + '"';
  $("#clock .time-show").text(timeStr);
}