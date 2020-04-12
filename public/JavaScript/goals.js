var column_num;
var row_num;
var button_num;

$(document).ready(function(){
    $("#buttonSet BTN").click(function() {
        column_num = parseInt( $(this).parent().parent().parent().parent().index()  ) + 1;
        row_num = parseInt( $(this).parent().parent().parent().parent().parent().parent().parent().index() )+1-10;
        button_num = parseInt( $(this).index() ) + 1;
    });
});



function myFunc(){

  alert(button_num);
  switch(button_num){
    // Set is pressed
    case 1:
      let goal = document.getElementById('totalGoal').value;

      document.getElementById('totalGoal').value = '';
      break;
    //View is pressed
    case 2:
      break;
    //Insert is pressed
    case 3:
      let amount = document.getElementById('amount').value;

      document.getElementById('amount').value = '';
      break;
    default:
  }
}
