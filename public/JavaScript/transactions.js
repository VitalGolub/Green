
window.onload = function() {
    document.getElementById("newTransaction").onclick = function() {
        // let table = document.getElementByTagName("table");
        let date = document.getElementById('date').value;
        let description = document.getElementById('description').value;
        let category = document.getElementById('category').value;
        let amount = document.getElementById('amount').value;

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

        // table.insertAdjacentHTML('afterend', '<tr><td><input type="date" name="newTransDate" placeholder="MM/DD/YYYY"/></td><td><input type="text" name="newTransDate" placeholder="MM/DD/YYYY"></td><td><div id="myDropdown" class="dropdown-content"><a href="#">Link 1</a><a href="#">Link 2</a><a href="#">Link 3</a></div></td><td><input type="number" name="Amount" placeholder="$000.00"/></td></tr>');

        // <tr>
        //     <td>
        //         <input type="date" name="newTransDate" placeholder="MM/DD/YYYY"/>
        //     </td>

        //     <td>
        //         <input type="text" name="newTransDate" placeholder="MM/DD/YYYY">
        //     </td>

        //     <td>
        //         <div id="myDropdown" class="dropdown-content">
        //             <a href="#">Link 1</a>
        //             <a href="#">Link 2</a>
        //             <a href="#">Link 3</a>
        //         </div>
        //     </td>

        //     <td>
        //         <input type="number" name="Amount" placeholder="$000.00"/>
        //     </td>
        // </tr>