var column_num;
var row_num;
var button_num;
let user = "Invalid-User";

$(document).ready(function(){
  $.get("/api/getSessionUser", function(data) {
      user = data;
  });

    $("#buttonSet BTN").click(function() {
        column_num = parseInt( $(this).parent().parent().parent().parent().index()  ) + 1;
        row_num = parseInt( $(this).parent().parent().parent().parent().parent().parent().parent().index() )+1-10;
        button_num = parseInt( $(this).index() ) + 1;

        alert("row: "+ row_num +" col: " + column_num + " but: "+ button_num);
    });
});


function myFunc(){
  let insertJson;
  let category;
  switch(button_num){
    // Set is pressed
    case 1:
      let goal = document.getElementById('totalGoal').value;
      category = getCategory();
      insertJson = {
          username:user,
          amount:goal,
          category:category
      };

      console.log(insertJson);

      if(user != "Invalid-User")
          $.post("/api/setGoal", insertJson);
      document.getElementById('totalGoal').value = '';
      break;
    //View is pressed
    case 2:
      break;
    //Insert is pressed
    case 3:
      let amount = document.getElementById('amount').value;
      category = getCategory();
      insertJson = {
          username:user,
          amount:amount,
          category:category
      };

      console.log(insertJson);

      if(user != "Invalid-User")
          $.post("/api/addGoalProgress", insertJson);
      document.getElementById('amount').value = '';
      break;
    default:
  }
}

function getCategory(){
  switch(row_num){
    case 1:
      switch(column_num)
      {
        case 1:
          return "travel";
          break;
        case 2:
          return "car";
          break
        case 3:
          return "education";
          break;
        default:
      }
      break;
    case 2:
      switch(column_num)
      {
        case 1:
        return "home";
          break;
        case 2:
        return "homeImprovement";
          break
        case 3:
        return "retirement";
          break;
        default:
      }
      break;
    case 3:
      switch(column_num)
      {
        case 1:
        return "creditcard";
          break;
        case 2:
        return "loans";
          break
        case 3:
        return "emergency";
          break;
        default:
      }
      break;
    default:
  }
}
