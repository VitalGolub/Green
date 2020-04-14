
var justTheUserName = "";
var userName  = "";

window.onload = function() {
    var date = this.document.getElementsByName('date');
    var day = this.document.getElementsByName('day');
    var text = "";
    var introductionMessage = this.document.getElementsByName('welcomeMessage');
    let mData = document.getElementById('mBody');


	let theModal =  document.getElementById('theModal');
	var socket;

	var xClose = document.getElementsByClassName('close');
	xClose[0].onclick = function(){
		theModal.style.visibility = "hidden";
	}


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

				        justTheUserName = data;
                userName = data;
                introductionMessage[0].innerText = "Welcome, " + data + "!";
             }
            });


if(justTheUserName == "test"){
  //make div append to carousel array
  $(".carousel-inner").append( 

    "<div class='carousel-item'><button type='button' class='btn' name='btnAdminLog'>View Registration Log</button></div>"
  );
  //make options and append
  $(".carousel-indicators").append(

    "<li data-target='#carouselExampleIndicators' data-slide-to='4'></li>"
  );

  let btnAdmin = document.getElementsByName('btnAdminLog');

  btnAdmin[0].style.visibility = "visible";
  socket = io();
  socket.on('admin notification', function(data) {
    mData.innerHTML += "<div>" + data.username + data.message + "</div>";
    console.log('yea');
  })

  btnAdmin[0].onclick = function(){
    console.log('clicked');
    theModal.style.visibility = "visible";
  }
}

  var today = new Date();
  var dateString = today.getFullYear()+'-'+("00" + (today.getMonth()+1)).slice (-2)+'-'+("00" + today.getDate()).slice (-2);

  document.getElementById('d3date').value = dateString;  
  displayD3(0);
  
}


window.onclick=function(){
  var indicatorWrapper = document.getElementsByTagName("ol");
  var indicator = indicatorWrapper[0].getElementsByTagName("li");
  
  for(let i=0; i<3; i++){
    if($(indicator[i]).hasClass('active')){
      displayD3(i);
    }
  }
}


function displayD3(x){
  var returnDates;
  switch(x){
    case 0:
      returnDates = week();
      var chart = makePieChart(getData(returnDates[0],returnDates[1]));
      break;
    
    case 1:
      returnDates = month();
      // getData(returnDates[0],returnDates[1]);
      // console.log(getData(returnDates[0],returnDates[1]));
      
      break;

    case 2:
      break;

    default:

  }

}

function week(){
  let today = new Date(document.getElementById('d3date').value);

  let week = []
  var StartOfWeek = today.getDate() - today.getDay() 
  var day = new Date(today.setDate(StartOfWeek)).toISOString().slice(0, 10)
  week.push(day)

  StartOfWeek = today.getDate() - today.getDay() + 6
  day = new Date(today.setDate(StartOfWeek)).toISOString().slice(0, 10)
  week.push(day)

  console.log("Week start end: " + [week[0], week[1]]);
  return [week[0], week[1]];
}


function month(){
  let today = new Date(document.getElementById('d3date').value);

  var year = today.getFullYear(), month = today.getMonth();
  var first = new Date(year, month, 1);
  var last = new Date(year, month + 1, 0);
  var firstDay = first.getFullYear()+'-'+("00" + (first.getMonth()+1)).slice (-2)+'-'+("00" + first.getDate()).slice (-2);
  var lastDay = last.getFullYear()+'-'+("00" + (last.getMonth()+1)).slice (-2)+'-'+("00" + last.getDate()).slice (-2);

  return [firstDay, lastDay];
}


function getData(from, to){

  let returnJson = 
  {
    Entertainment:0, 
    Education:0, 
    Personal:0,
    Groceries:0,
    Restaurants:0,
    Utilities:0,
    Auto:0,
    Gifts:0,
    Investment:0
  };

  let jsonQuery = {username:userName, from:from, to:to}; 
  $.post("/api/getUserExpenses", jsonQuery, function(data) {
    $(jQuery.parseJSON(JSON.stringify(data))).each(function() {
    returnJson[this.category] += this.amount;
    });
  });

  return returnJson;
}


function makePieChart(addedTotal)
{
  
}