jQuery.ajaxSetup({async:false});

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
	//When the close/X button on the modal is clicked, hide the modal (essentially closing it)
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

				justTheUserName = data;				//Save the username
                userName = data;
                introductionMessage[0].innerText = "Welcome, " + data + "!";
             }
            });

	//If the admin is logged in
	if(justTheUserName == "admin"){
  
		//make div append to carousel array
		$(".carousel-inner").append(

			"<div class='carousel-item'><button type='button' class='btn' name='btnAdminLog'>View Registration Log</button></div>"
		);
  
		//make options and append
		$(".carousel-indicators").append(

			"<li data-target='#carouselExampleIndicators' data-slide-to='4'></li>"
		);

		//Grab the admin button, and make it visible. Initialize a socket
		let btnAdmin = document.getElementsByName('btnAdminLog');

		btnAdmin[0].style.visibility = "visible";
		socket = io();
  
		//Connect to the 'old register logs' socket which gets all registration information before the admin logged in
		socket.on('old register logs', function (data) {
			var olderLog = document.createElement("div");
			olderLog.setAttribute("class", "oldModalLog");
			olderLog.innerHTML += data.date + data.username + data.message;
			mData.appendChild(olderLog);
		});
  
		//Connect to the 'admin notification' socket, which checks to see when a new user registers
		socket.on('admin notification', function(data) {
			var currentLog = document.createElement("div");
			currentLog.setAttribute("class", "modalLog");
			currentLog.innerHTML += data.date + data.username + data.message;
			mData.appendChild(currentLog);
		});

		//When the admin button is clicked, make the registration log modal visible.
		btnAdmin[0].onclick = function(){
			theModal.style.visibility = "visible";
		}
	}

	var today = new Date();
	var dateString = today.getFullYear()+'-'+("00" + (today.getMonth()+1)).slice (-2)+'-'+("00" + today.getDate()).slice (-2);

	document.getElementById('d3date').value = dateString;
	displayD3(0);
}

function checkType(x)
{
  var indicatorWrapper = document.getElementsByTagName("ol");
  var indicator = indicatorWrapper[0].getElementsByTagName("li");

  for(let i=0; i<3; i++){
    if($(indicator[i]).hasClass('active')){
      if(i+x == 3)
        displayD3(0);
      else if(i+x == -1)
        displayD3(2);
      else
        displayD3(i+x);
    }
  }
}


function displayD3(x){
  let returnDates;
  let expenseData;
  let budgetData;
  switch(x){
    case 0:
      jQuery.ajaxSetup({async:false});
      returnDates = week();
      expenseData = getData(returnDates[0],returnDates[1])
      //Change pie chart
      change(expenseData);
      //Change progress Bar
      budgetData = getBudgetData();
      updateProgressBar(budgetData,expenseData,0.25);
      break;

    case 1:
      jQuery.ajaxSetup({async:false});
      returnDates = month();
      expenseData = getData(returnDates[0],returnDates[1])
      //Change pie chart
      change(expenseData);
      //Change progress Bar
      budgetData = getBudgetData();
      updateProgressBar(budgetData,expenseData,1);

      break;

    case 2:
      jQuery.ajaxSetup({async:false});
      let date = new Date(document.getElementById('d3date').value);
      let start = date.getFullYear() + "-01-01";
      let end = date.getFullYear() + "-12-31";
      expenseData = getData(start,end);
      //Change pie chart
      change(expenseData);
      //Change progress Bar
      budgetData = getBudgetData();
      updateProgressBar(budgetData,expenseData,12);

      break;

    default:

  }

}

function week(){
  let today = new Date(document.getElementById('d3date').value);

  let week = [];
  var StartOfWeek = today.getDate() - today.getDay() ;
  var day = new Date(today.setDate(StartOfWeek)).toISOString().slice(0, 10);
  week.push(day);

  StartOfWeek = today.getDate() - today.getDay() + 6;
  day = new Date(today.setDate(StartOfWeek)).toISOString().slice(0, 10);
  week.push(day);

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
  jQuery.ajaxSetup({async:false});
  var returnMap = [
    {label:"Entertainment",value:0},
    {label:"Education",value:0},
    {label:"Personal",value:0},
    {label:"Groceries",value:0},
    {label:"Restaurants",value:0},
    {label:"Utilities",value:0},
    {label:"Auto",value:0},
    {label:"Gifts",value:0},
    {label:"Investment",value:0}
  ];

  var jsonQuery = {username:userName, from:from, to:to};
  $.post("/api/getUserExpenses", jsonQuery, function(data) {
    $(jQuery.parseJSON(JSON.stringify(data))).each(function() {
      for(let i =0;i<9;i++)
      {
        if(returnMap[i].label == this.category)
        {
          returnMap[i].value += this.amount;

        }
      }
    });
  });
  return returnMap;
}

function getBudgetData()
{
  jQuery.ajaxSetup({async:false});

  var returnData;
  var jsonQuery = {username:userName};
  $.post("/api/getUserBudgets" ,jsonQuery,function(data) 
  {
    returnData = data;
  });
  return returnData[0];
}

function updateProgressBar(budgetData,expenseData,multiplier)
{
  jQuery.ajaxSetup({async:false});
  var holdData = budgetData;


  budgetData["auto"] = budgetData["auto"] * multiplier;
  budgetData["education"] = budgetData["education"] * multiplier;
  budgetData["entertainment"] = budgetData["entertainment"] * multiplier;
  budgetData["gifts"] = budgetData["gifts"] * multiplier;
  budgetData["groceries"] = budgetData["groceries"] * multiplier;
  budgetData["health"] = budgetData["health"] * multiplier;
  budgetData["investments"] = budgetData["investments"] * multiplier;
  budgetData["restaurants"] = budgetData["restaurants"] * multiplier;
  budgetData["utilities"] = budgetData["utilities"] * multiplier;

  $("#budgetEnt").empty().append("$",budgetData.entertainment.toFixed(2));
  $("#budgetEdu").empty().append("$",budgetData.education.toFixed(2));
  $("#budgetPer").empty().append("$",budgetData.health.toFixed(2));
  $("#budgetGro").empty().append("$",budgetData.groceries.toFixed(2));
  $("#budgetRes").empty().append("$",budgetData.restaurants.toFixed(2));
  $("#budgetUti").empty().append("$",budgetData.utilities.toFixed(2));
  $("#budgetAuto").empty().append("$",budgetData.auto.toFixed(2));
  $("#budgetGift").empty().append("$",budgetData.gifts.toFixed(2));
  $("#budgetInv").empty().append("$",budgetData.investments.toFixed(2));


  let proBarArray = $(".progress-bar").toArray();
  $(proBarArray[0]).css('width', ((expenseData[0].value/budgetData.entertainment) * 100).toFixed(2) +'%');
  $(proBarArray[1]).css('width', (expenseData[1].value/budgetData.education) * 100 +'%');
  $(proBarArray[2]).css('width', (expenseData[2].value/budgetData.health) * 100 +'%');
  $(proBarArray[3]).css('width', (expenseData[3].value/budgetData.groceries) * 100 +'%');
  $(proBarArray[4]).css('width', (expenseData[4].value/budgetData.restaurants) * 100 +'%');
  $(proBarArray[5]).css('width', (expenseData[5].value/budgetData.utilities) * 100 +'%');
  $(proBarArray[6]).css('width', (expenseData[6].value/budgetData.auto) * 100 +'%');
  $(proBarArray[7]).css('width', (expenseData[7].value/budgetData.gifts) * 100 +'%');
  $(proBarArray[8]).css('width', (expenseData[8].value/budgetData.investments) * 100 +'%');

  let innerText = $(".s").toArray();
  $(innerText[0]).empty().append("$",expenseData[0].value);
  $(innerText[1]).empty().append("$",expenseData[1].value);
  $(innerText[2]).empty().append("$",expenseData[2].value);
  $(innerText[3]).empty().append("$",expenseData[3].value);
  $(innerText[4]).empty().append("$",expenseData[4].value);
  $(innerText[5]).empty().append("$",expenseData[5].value);
  $(innerText[6]).empty().append("$",expenseData[6].value);
  $(innerText[7]).empty().append("$",expenseData[7].value);
  $(innerText[8]).empty().append("$",expenseData[8].value);

}


//STUFF FOR PIE CHART
var svg = d3.select("#chart")
	.append("svg")
	.append("g")

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

var width = 1443,
    height = 675,
	radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };

//Modify
var color = d3.scale.ordinal()
	.domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
	.range(["#e54138", "#0074d9", "#7fdbff", "#39cccc", "#3d9970", "#2ecc40", "#01ff70", "#ffdc00","#ff851b"]);



//Functions For pie charts
//http://bl.ocks.org/dbuezas/9306799 used as base code for function
function change(data) 
{
  var newData = [];
  for(let i = 0; i<data.length;i++)
  {
    if(data[i].value > 0)
    {
      newData.push(data[i]);
    }
  }
  data = newData;


	/* ------- PIE SLICES -------*/
	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	slice.enter()
		.insert("path")
		.style("fill", function(d) { return color(d.data.label); })
		.attr("class", "slice");

	slice
		.transition().duration(1000)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

  /* ------- TEXT LABELS -------*/

  for(let i =0; i<data.length;i++){
    console.log(i);
    data[i].label += " $" + data[i].value;
  }
  console.log(data);

	var text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d) {
        if(d.value != 0)
        {
          return d.data.label;
        }
		});

	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);


	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function(d){
      if(!(d.value == 0))
      {
  			this._current = this._current || d;
  			var interpolate = d3.interpolate(this._current, d);
  			this._current = interpolate(0);
  			return function(t) {
  				var d2 = interpolate(t);
  				var pos = outerArc.centroid(d2);
  				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
  				return [arc.centroid(d2), outerArc.centroid(d2), pos];
  			};
      }
		});

	polyline.exit()
    .remove();
};
