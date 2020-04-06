$(document).ready(function() {

    // let jsonStuff = {username:"Vital", from:"2019-04-05", to:"2020-04-05"}; 
    // $.post("/api/getUserExpenses", jsonStuff, function(data) {
    //     console.log(data);
    // });

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

    let jsonStuff = {username:"Vital", from:"2019-04-05", to:"2020-04-05"};
    //Get the min showtimes div for the table
    let div = document.getElementById('expenses-table');

    generateTable(div, "Vital", "2019-04-05", "2020-04-05");
});


function generateTable(container, user, from, to){
    
    let jsonQuery = {username:user, from:from, to:to}; 
    $.post("/api/getUserExpenses", jsonQuery, function(data) {

        //Create a new table using DOM
        let table = document.createElement('table');
        let headerRow = document.createElement('tr');

        //Delete the username field, we don't need it in our table
        delete data[0]["username"];
        Object.keys(data[0]).forEach(function(key) {
            let cell = document.createElement('td');
            cell.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            headerRow.appendChild(cell);
        });

        table.appendChild(headerRow);


        //Using jquery parse it and turn it into a string
        $(jQuery.parseJSON(JSON.stringify(data))).each(function() {
            
            let row = document.createElement('tr');

            let dateCell = document.createElement('td');
            dateCell.innerHTML = this.date;

            let amountCell = document.createElement('td');
            amountCell.innerHTML = this.amount;

            let categoryCell = document.createElement('td');
            categoryCell.innerHTML = this.category;

            let descriptionCell = document.createElement('td');
            descriptionCell.innerHTML = this.description;

            //Append the cell to the row and the row to the table and the table to the main div
            row.appendChild(dateCell);
            row.appendChild(amountCell);
            row.appendChild(categoryCell);
            row.appendChild(descriptionCell);
            table.appendChild(row);
        });

        table.className += " table";
        container.appendChild(table);
    });
}