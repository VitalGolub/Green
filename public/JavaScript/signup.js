//will be used to shuffle throught sets
var current_fs, next_fs, previous_fs; 

//variables for animation
var left, right, opacity, scale, animating;

window.onload = function() {


$('.step2').hide();						//Hides the other two windows, only showing step1 initially
$('.step3').hide();


$('.submit').click(function() {
	//Initializes the socket
	let socket = io({
		transports: ['websocket', 'server-events', 'htmlfile', 'xhr-multipart', 'xhr-polling']

	});
	//Creates a new date, and gets the month, day, hour, minute, and second (and AM or PM)
	var getCurrentTime = new Date();
	var currentDate = getMonthDate(getCurrentTime.getMonth()) + " " + 
						getCurrentTime.getDate() + ", " + 
						getProperHour(getCurrentTime.getHours()) + ":" +
						get2DigitTime(getCurrentTime.getMinutes()) + ":" + 
						get2DigitTime(getCurrentTime.getSeconds()) + " " +
						getAMorPM(getCurrentTime.getHours()) + ":    ";
	
	//Stores the username variable from the pug file in a variable
	var theUserName = document.getElementsByName('username');
	
	//Socket sends the date, the username, and a "has registered" message
	socket.emit('Send', {
			date: currentDate,
			username: theUserName[0].value + " ",
			message: "has registered",
		});
	alert("Welcome to Green "+ theUserName[0].value + "!");				//Welcomes the user to Green.
		
});

$(".step1").children().keypress(function(event){
	if(event.keyCode === 13){				//If the user presses enter, prevent the page from doing its default action, and load the next form
		event.preventDefault()				
		goToNext(this);						
	}
});


$(".step2").children().keypress(function(event){
	if(event.keyCode === 13){				//If the user presses enter, prevent the page from doing its default action, and load the next form
		event.preventDefault()				
		goToNext(this);
	}
});

$(".next").click(function(){
	goToNext(this);							//Load the next form
});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	
	 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//will scale the current field set down
			scale = 0.8 + (1 - now) * 0.2;
			
			//will bring in previous fieldset
			left = ((1-now) * 60)+"%";
			
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': 100});
		}, 
		duration: 900, 
		complete: function(){
			current_fs.hide();
			animating = false;
			
			//show the previous fieldset
			previous_fs.show();
		}, 
		//using the easing plugin for jquery UI
		//There are differnt types of easing 
		//I use easeInOutElastic as a place holder
		easing: 'easeInOutElastic'
	});
});

}

function goToNext(currentForm){
	if(animating) return false;
	animating = true;
	
	current_fs = $(currentForm).parent();
	next_fs = $(currentForm).parent().next();
	
	
	
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//will scale the current field set down
			scale = 1 - (1 - now) * 0.2;
			
			//will bring in next fieldset
			right = (now * 60)+"%";
			current_fs.css({
        		'transform': 'scale('+scale+')'
			 });
			next_fs.css({'right': right, 'opacity': 100});
		}, 
		duration: 900, 
		complete: function(){
			current_fs.hide();
			animating = false;
			
			//show the next fieldset
			next_fs.show();
		}, 
		//using the easing plugin for jquery UI
		//There are differnt types of easing 
		//I use easeInOutElastic as a place holder
		easing: 'easeInOutElastic'
	});
}

//This function takes in the numerical month determined by .getMonth() and turns it into the corresponding month
function getMonthDate(numberMonth){
	if(numberMonth == 0) return 'January';
	else if (numberMonth == 1) return 'February';
	else if (numberMonth == 2) return 'March';
	else if (numberMonth == 3) return 'April';
	else if (numberMonth == 4) return 'May';
	else if (numberMonth == 5) return 'June';
	else if (numberMonth == 6) return 'July';
	else if (numberMonth == 7) return 'August';
	else if (numberMonth == 8) return 'September';
	else if (numberMonth == 9) return 'October';
	else if (numberMonth == 10) return 'November';
	else if (numberMonth == 11) return 'December';
}

function getProperHour(militaryHour){
	//Checks if the time is midnight
	if (militaryHour == 0){
		return militaryHour+12;
	}
	//Checks if the time is between 1am and noon
	else if(militaryHour <=12){
		return militaryHour;
	}
	//Checks if the time is past noon, if it is, convert it to AM/PM time
	else{
		return militaryHour-12;
	}
}

//Determines if the time passed (the hour) is an AM or PM time
function getAMorPM(miliHour){
	 if(miliHour <=12){
		return "AM";
	}
	else{
		return "PM";
	}
}

//If minutes or seconds is less than 10, it initially only shows 1 digit
//This function changes it to be 2 digits.
function get2DigitTime(theTime){
	if (theTime <10){
		return "0"+theTime;
	}
	else{
		return theTime;
	}
}
