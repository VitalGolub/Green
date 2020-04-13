window.onload = function() {
    var date = this.document.getElementsByName('date');
    var day = this.document.getElementsByName('day');
    var text = "";
    var userName = "";
    var introductionMessage = this.document.getElementsByName('welcomeMessage');
   
   
	var justTheUserName = "";
	let btnAdmin = document.getElementsByName('btnAdminLog');
	let theModal =  document.getElementById('theModal');
	var socket;
	
	var xClose = document.getElementsByClassName('close');
	xClose[0].onclick = function(){
		theModal.style.visibility = "hidden";
	}
	
	btnAdmin[0].onclick = function(){
		console.log('clicked');
		theModal.style.visibility = "visible";
		/*socket.on('admin notification', function(data) {
			console.log('User has registered');
		});*/
		socket.on('admin notification', function(data) {
			let mData = document.getElementById('mBody');
			mData.innerHTML += "<div>" + data.username + data.message + "</div>";
			console.log('yea');
		})
	
		
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
                
                userName += "Welcome " + data + "!";
				justTheUserName = data;
            
             }
             
            });

            introductionMessage[0].innerText = userName;
       

			//CHANGE TO ADMIN
			//If the user is admin, allow them to access the registration log
			if(justTheUserName == "test"){
				btnAdmin[0].style.visibility = "visible";
				socket = io();
			}
			else{
				btnAdmin[0].style.visibility = "hidden";
			}






}