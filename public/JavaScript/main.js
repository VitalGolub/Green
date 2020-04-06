$(document).ready(function() {

    let jsonStuff = {username:"Vital", from:"2019-04-05", to:"2020-04-05"}; 
    $.post("/api/getUserExpenses", jsonStuff, function(data) {
        console.log(data);
    });

    let insertJson = {
        username:"Vital", 
        category:"Other", 
        amount:50.01,
        description:"This is a test description",
        date:"2020-04-05"
    };

    $.get("/api/getExpenses", function(data) {
        console.log(data);
    });

    $.get("/api/getUsers", function(data) {
        console.log(data);
    });

    //Add a pause as a temporary fix just to show that it is adding the values into the db
    setTimeout(function(){
        $.post("/api/addExpense", insertJson);

        $.get("/api/getExpenses", function(data) {
            console.log(data);
        });
    }, 100);
});