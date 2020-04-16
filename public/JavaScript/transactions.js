
window.onload = function() {

    // Listen to click event on the submit button
  // Listen to submit event on the <form> itself!
    $('#dateForm').submit(function (e) {

        e.preventDefault();

        var from = $("#from").val();
        var to = $("#to").val();

        $("table").empty();
        let table=document.getElementById("table");
        generateTable(table, user, from, to);    
    });


    var user = "Invalid-User";
    $.get("/api/getSessionUser", function(data) {
        user = data;

        if(user!= "Invalid-User" && user != ''){
            var today = new Date();
            var dateString = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var dateStringPrev = (today.getFullYear()-10)+'-'+(today.getMonth()+1)+'-'+today.getDate();
            generateTable(table, user, dateStringPrev, dateString);

            let budgetTable =document.getElementById("editBudget");
            generateBudgetsTable(budgetTable, user);
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
        $("table").empty();
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



function generateBudgetsTable(container, user) {

    $.post("/api/getUserBudgets", {username:user}, function(data) {

        let table = document.createElement('table');

        let headerRow = document.createElement('tr');

        let cell = document.createElement('th');
        cell.innerHTML = "Budgets";
        cell.colSpan = "2"; 
        cell.style.textAlign = "center";
        headerRow.appendChild(cell);

        table.appendChild(headerRow);

        $.each(jQuery.parseJSON(JSON.stringify(data[0])), function (key, data) {

            if(key == "username")
                return;

            let row = document.createElement('tr');

            let categoryCell = document.createElement('th');
            categoryCell.innerHTML = convertBudgetName(key);

            let amountCell = document.createElement('td');
            amountCell.innerHTML = "$" + parseFloat(data).toFixed(2);;
            amountCell.style.textAlign = "right"; 

            $(amountCell).click(function(e) {

                var text = $(this).text();
                $(this).text('');
                
                //Create a new input element and add the value from the table to it
                //Also add a key press listener that checks when enter is clicked and changes the table cell value
                //to the new value in the input element
                $('<input />').appendTo($(this)).val(text).select().on('keypress',function(e) {
                    if (e.which == 13) {
                        
                        //Remove all of the non-numeric characters and force to 2 decimal places
                        var enteredValue = parseFloat($(this).val().replace(/[^\d.-]/g, '')).toFixed(2);

                        //Check to make sure a number was entered
                        if(isNaN(enteredValue))
                            enteredValue = parseFloat("0.00").toFixed(2);

                        var newText = "$" + enteredValue;

                        $.post("/api/setUserBudget", {username:user, category:key, amount:enteredValue});

                        //remove the input element when enter is clicked
                        $(this).parent().text(newText).find('input').remove();
                    }
                });
            });

            $(categoryCell).click(function() {
                $(amountCell).click();
            });

            //Append the cell to the row and the row to the table and the table to the main div
            row.appendChild(categoryCell);
            row.appendChild(amountCell);
            table.appendChild(row);
        });

        table.className += " table";
        container.appendChild(table);
    });
}

function convertBudgetName(name){
    switch(name){
        case 'entertainment':
            return 'Entertainment';
        case 'education':
            return 'Education';
        case 'health':
            return 'Personal/Health Care';
        case 'groceries':
            return 'Restaurants';
        case 'restaurants':
            return 'Restaurants';
        case 'utilities':
            return 'Utilities & Bills';
        case 'auto':
            return 'Auto & Transportation';
        case 'gifts':
            return 'Gifts & Donations';
        case 'investments':
            return 'Investments';
    }

    return "";
}