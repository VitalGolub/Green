window.onload = function() {
    var date = this.document.getElementsByName('date');
    var day = this.document.getElementsByName('day');
    var text = "";
    $.ajax({
        method: 'GET',
        url: 'http://worldclockapi.com/api/json/est/now', 
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log(data);
           for(var i = 0; i < 10; i++){
              text += data.currentDateTime[i];
           }
           day[0].innerText = data.dayOfTheWeek;
           date[0].innerText = text;
         }

        });









}