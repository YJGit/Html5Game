$(".intro-button").on('click', function(){
  $(this).closest("#introduction").fadeOut('fast');
  console.log("I clicked the button.");
});