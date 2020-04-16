
window.onload = function() {

    // Listen to click event on the submit button
  // Listen to submit event on the <form> itself!
    $('#dateForm').submit(function (e) {

        e.preventDefault();

        var from = $("#from").val();
        var to = $("#to").val();

        let table=document.getElementById("table");
        $(table).empty();
        generateTable(table, user, from, to);
    });


    let user = "Invalid-User";
    $.get("/api/getSessionUser", function(data) {
        user = data;

        if(user!= "Invalid-User" && user != ''){
            var today = new Date();
            var dateString = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var dateStringPrev = (today.getFullYear()-10)+'-'+(today.getMonth()+1)+'-'+today.getDate();
            generateTable(table, user, dateStringPrev, dateString);
        }
    });

    document.getElementById("newTransaction").onclick = function() {
        let date = document.getElementById('date').value;
        let description = document.getElementById('description').value;
        let category = document.getElementById('category').value;
        let amount = document.getElementById('amount').value;


        let insertJson = {
            username:user, 
            category:category, 
            amount:amount,
            description:description,
            date:date
        };

        if(user != "Invalid-User")
            $.post("/api/addExpense", insertJson);

        let table=document.getElementById("table");

        var today = new Date();
        var dateString = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var dateStringPrev = (today.getFullYear()-10)+'-'+(today.getMonth()+1)+'-'+today.getDate();
        $(table).empty();
        generateTable(table, user, dateStringPrev, dateString);
    };
}

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
            amountCell.innerHTML = "$" + this.amount;

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

        container.appendChild(table);
    });
}
