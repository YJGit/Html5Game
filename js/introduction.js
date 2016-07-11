$(".intro-button").on('click', function(){
  $(this).closest("#introduction").addClass("fade-out");
  console.log("I clicked the button.");
});