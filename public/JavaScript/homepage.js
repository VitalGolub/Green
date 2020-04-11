window.onload = function() {
    var date = this.document.getElementsByName('date');
    var day = this.document.getElementsByName('day');
    var text = "";
    var userName = "";
    var introductionMessage = this.document.getElementsByName('welcomeMessage');
   
   
   
   //This ajax call get the date and day of the week and displays it on the screen
    $.ajax({
        method: 'GET',
        url: 'http://worldclockapi.com/api/json/est/now', 
        dataType: 'json',
        async: false,
        success: function (data) {
         
           for(var i = 0; i < 10; i++){
              text += data.currentDateTime[i];
           }
           day[0].innerText = data.dayOfTheWeek;
           date[0].innerText = text;
         }

        });

        //this ajax call gets the username from the server and prints a welcome message
        $.ajax({
            method: 'GET',
            url: 'http://localhost:3000/api/getSessionUser', 
            dataType: 'TEXT',
            async: false,
            success: function (data) {
                
                userName += "Welcome " + data + "!";
            
             }
             
            });

            introductionMessage[0].innerText = userName;
       








}