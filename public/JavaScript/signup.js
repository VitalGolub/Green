

window.onload = function() {

$('.step2').hide();						//Hides the other two windows, only showing step1 initially
$('.step3').hide();

$('.submit').click(function() {
	let socket = io();
	socket.emit('Send', {
			//data.username: TODO,
			username: "User ",
			message: "has registered",
		});
});

//will be used to shuffle throught sets
var current_fs, next_fs, previous_fs; 

//variables for animation
var left, right, opacity, scale, animating;

$(".next").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	
	
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
	 
	//theStep2[0].style.display = 'inline';
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