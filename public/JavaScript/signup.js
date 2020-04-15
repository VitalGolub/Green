//will be used to shuffle throught sets
var current_fs, next_fs, previous_fs; 

//variables for animation
var left, right, opacity, scale, animating;

window.onload = function() {


$('.step2').hide();						//Hides the other two windows, only showing step1 initially
$('.step3').hide();


$('.submit').click(function() {
	let socket = io({
		transports: ['websocket', 'server-events', 'htmlfile', 'xhr-multipart', 'xhr-polling']

	});
	var theUserName = document.getElementsByName('username');
	socket.emit('Send', {
			username: theUserName[0].value + " ",
			message: "has registered",
		});
	alert("Welcome to Green "+ theUserName[0].value + "!");
		
});

$(".step1").children().keypress(function(event){
	if(event.keyCode === 13){
		event.preventDefault()				//Prevents the page from loading the default enter button command
		goToNext(this);
	}
});


$(".step2").children().keypress(function(event){
	if(event.keyCode === 13){
		event.preventDefault()				//Prevents the page from loading the default enter button command
		goToNext(this);
	}
});

$(".next").click(function(){
	goToNext(this);
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
