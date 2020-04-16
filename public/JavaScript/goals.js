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

        //alert("row: "+ row_num +" col: " + column_num + " but: "+ button_num);
    });
  });

  window.onload = function() {
    
    $("#tripView").click(function() {
      
      getGoalAmount('travel');
      console.log(amountSet);

      getSavedAmount('travel');
      console.log(amountSaved);

      var ProgressPercentage = (amountSaved / amountSet) * 100;
      $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);
    });


    $("#carView").click(function() {
      getGoalAmount('car');
      console.log(amountSet);

      getSavedAmount('car');
      console.log(amountSaved);

      var ProgressPercentage = (amountSaved / amountSet) * 100;
      $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);
    });

          $("#schoolView").click(function() {
            getGoalAmount('education');
            console.log(amountSet);
      
            getSavedAmount('education');
            console.log(amountSaved);
      
            var ProgressPercentage = (amountSaved / amountSet) * 100;
            $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);
      

            });

            $("#buyHomeView").click(function() {
              getGoalAmount('home');
              console.log(amountSet);
        
              getSavedAmount('home');
              console.log(amountSaved);
        
              var ProgressPercentage = (amountSaved / amountSet) * 100;
              $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);

              });


              $("#homeRenoView").click(function() {
                getGoalAmount('homeImprovement');
                console.log(amountSet);
          
                getSavedAmount('homeImprovement');
                console.log(amountSaved);
          
                var ProgressPercentage = (amountSaved / amountSet) * 100;
                $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);

                });

                $("#retireView").click(function() {
                  
                  getGoalAmount('retirement');
                  console.log(amountSet);
            
                  getSavedAmount('retirement');
                  console.log(amountSaved);
            
                  var ProgressPercentage = (amountSaved / amountSet) * 100;
                  $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);

                  });


                  $("#creditDebtView").click(function() {
                  
                    getGoalAmount('creditcard');
                    console.log(amountSet);
              
                    getSavedAmount('creditcard');
                    console.log(amountSaved);
              
                    var ProgressPercentage = (amountSaved / amountSet) * 100;
                    $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);

                    });


                    $("#loanView").click(function() {
                    
                      getGoalAmount('loans');
                      console.log(amountSet);
                
                      getSavedAmount('loans');
                      console.log(amountSaved);
                
                      var ProgressPercentage = (amountSaved / amountSet) * 100;
                      $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);
                

                      });


                      $("#emergenyView").click(function() {
                        getGoalAmount('emergency');
                        console.log(amountSet);
                  
                        getSavedAmount('emergency');
                        console.log(amountSaved);
                  
                        var ProgressPercentage = (amountSaved / amountSet) * 100;
                        $('.progress-bar').css('width', ProgressPercentage+'%').attr('aria-valuenow', ProgressPercentage);

                        });
  }


function getGoalAmount(categorySelected) {
  jQuery.ajaxSetup({async:false});
  $.post("/api/getUserGoals", {username:user}, function(data) {
    amountSet = 0;
    $(jQuery.parseJSON(JSON.stringify(data))).each(function() {
       
       amountSet = this[categorySelected];
       
       });

      });
 

}

function getSavedAmount(categorySelected) {
  jQuery.ajaxSetup({async:false});
  $.post("/api/getGoalProgress", {username:user}, function(data) {
    amountSaved = 0;
    for(var i = 0; i < data.length; i++){
       
      if (data[i].category == categorySelected){
        
        amountSaved += data[i].amount;
      }
    }
  });
}


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
