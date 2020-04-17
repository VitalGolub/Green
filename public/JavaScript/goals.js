jQuery.ajaxSetup({async:false});

var column_num;
var row_num;
var button_num;
let user = "Invalid-User";

var userGoalData;

var amountSet = 0;  
var amountSaved = 0;

$(document).ready(function(){
  $.get("/api/getSessionUser", function(data) {
      user = data;
      
  });

    $("#buttonSet BTN").click(function() {
        column_num = parseInt( $(this).parent().parent().parent().parent().index()  ) + 1;
        row_num = parseInt( $(this).parent().parent().parent().parent().parent().parent().parent().index() )+1-10;
        button_num = parseInt( $(this).index() ) + 1;

      
    });
    var amountSetLable = document.getElementById("amountLabel");
    var amountSavedLabel = document.getElementById("budgetLabel");
    /*
    *When user hits 'view' button for anyone of the goal categories 
    *Two functions will be called that pull information from database 
    * The information is then show on a progress bar that pops up on the screen using a modal
    */

    $("#tripView").click(function() {
      
      getGoalAmount('travel');
      console.log(amountSet);

      getSavedAmount('travel');
      console.log(amountSaved);

      var ProgressPercentage = (amountSaved / amountSet) * 100;
      if (ProgressPercentage > 0){
      $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);

                    amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
                    amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
      
      } else {
        $('.progress-bar').css('width', 0+'%').attr('aria-valuenow', 0);
                    amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
                        amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
      }

      
    });


    $("#carView").click(function() {
      getGoalAmount('car');
      console.log(amountSet);

      getSavedAmount('car');
      console.log(amountSaved);

      var ProgressPercentage = (amountSaved / amountSet) * 100;
      if (ProgressPercentage > 0){
      $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);
                     amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
                        amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
      } else {
        $('.progress-bar').css('width', 0+'%').attr('aria-valuenow', 0);
                  amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
                 amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
      }

    

    });

    $("#schoolView").click(function() {
      getGoalAmount('education');
      console.log(amountSet);

      getSavedAmount('education');
      console.log(amountSaved);

      var ProgressPercentage = (amountSaved / amountSet) * 100;
      if (ProgressPercentage > 0){
      $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);
        amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
        amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
      } else {
        $('.progress-bar').css('width', 0+'%').attr('aria-valuenow', 0);
        amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
        amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
      }
    });

    $("#buyHomeView").click(function() {
      getGoalAmount('home');
      console.log(amountSet);

      getSavedAmount('home');
      console.log(amountSaved);

      var ProgressPercentage = (amountSaved / amountSet) * 100;
        if (ProgressPercentage > 0){
        $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);
                amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
                amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
        } else {
          $('.progress-bar').css('width', 0+'%').attr('aria-valuenow', 0);
          amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
          amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
      }
    });

    $("#homeRenoView").click(function() {
      getGoalAmount('homeImprovement');
      console.log(amountSet);

      getSavedAmount('homeImprovement');
      console.log(amountSaved);

      var ProgressPercentage = (amountSaved / amountSet) * 100;
      if (ProgressPercentage > 0){
        $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);
        
        amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
        amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;;
      } else {
        $('.progress-bar').css('width', 0+'%').attr('aria-valuenow', 0);
        
        amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
        amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
      }
    });

    $("#retireView").click(function() {
      
      getGoalAmount('retirement');
      console.log(amountSet);

      getSavedAmount('retirement');
      console.log(amountSaved);

      var ProgressPercentage = (amountSaved / amountSet) * 100;
      if (ProgressPercentage > 0){
        $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);

        amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
        amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
      } else {
        $('.progress-bar').css('width', 0+'%').attr('aria-valuenow', 0);

        amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
        amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
      }
    });


    $("#creditDebtView").click(function() {
    
      getGoalAmount('creditcard');
      console.log(amountSet);

      getSavedAmount('creditcard');
      console.log(amountSaved);

      var ProgressPercentage = (amountSaved / amountSet) * 100;
      if (ProgressPercentage > 0){
        $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);
        amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
        amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
      } else {
        $('.progress-bar').css('width', 0+'%').attr('aria-valuenow', 0);
        amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
        amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
      }
    });


    $("#loanView").click(function() {
    
      getGoalAmount('loans');
      console.log(amountSet);

      getSavedAmount('loans');
      console.log(amountSaved);

      var ProgressPercentage = (amountSaved / amountSet) * 100;
      if (ProgressPercentage > 0){
        $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);

        amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
        amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;

      } else {
          $('.progress-bar').css('width', 0+'%').attr('aria-valuenow', 0);
          amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
          amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
      }
    });


      $("#emergenyView").click(function() {
        getGoalAmount('emergency');
        console.log("Set ", amountSet);
  
        getSavedAmount('emergency');
        console.log("Saved ", amountSaved);
  
        var ProgressPercentage = (amountSaved / amountSet) * 100;
        if (ProgressPercentage > 0){
        $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);

          amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
          amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;

        } else {
          $('.progress-bar').css('width', 0+'%').attr('aria-valuenow', 0);
          amountSetLable.innerHTML = 'Amount Set: ' + amountSet;
          amountSavedLabel.innerHTML = 'Amount Saved: ' + amountSaved;
        }
      });
});

//api call to green.js to pull goal total for selected Category
function getGoalAmount(categorySelected) {
  jQuery.ajaxSetup({async:false});
  $.post("/api/getUserGoals", {username:user}, function(data) {
    amountSet = 0;
    $(jQuery.parseJSON(JSON.stringify(data))).each(function() {
       amountSet = this[categorySelected];   
    });
  });
}
//api call to green.js to get information about money saved for selected goal
function getSavedAmount(categorySelected) {
  jQuery.ajaxSetup({async:false});
  $.post("/api/getGoalProgress", {username:user}, function(data) {
    amountSaved = 0;
    for(var i = 0; i < data.length; i++){
       //loops through all saving deposits and aggregates selected amount for selected goal category
      if (data[i].category == categorySelected){
        
        amountSaved += data[i].amount;
      }
    }
  });
}


function myFunc(){
  jQuery.ajaxSetup({async:true});
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

      if(user != "Invalid-User"){
        $.post("/api/setGoal", insertJson);
      }
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
