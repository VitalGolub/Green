
window.onload = function() {

    let user = "Invalid-User";
    $.get("/api/getSessionUser", function(data) {
        user = data;
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

        table=document.getElementById("table");
        tr=document.getElementById("tr");

        let r1 = document.createElement("tr");
        
        let c1 = document.createElement("td");
        let c2 = document.createElement("td");
        let c3 = document.createElement("td");
        let c4 = document.createElement("td");
        
        c1.innerHTML = date;
        c2.innerHTML = description;
        c3.innerHTML = category;
        c4.innerHTML = amount;

        r1.appendChild(c1);
        r1.appendChild(c2);
        r1.appendChild(c3);
        r1.appendChild(c4);
        
        table.appendChild(r1);

    };
}
