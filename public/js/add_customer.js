// Get the objects we need to modify
let addCustomerForm = document.getElementById('add-customer-form-ajax');

// Modify the objects we need
addCustomerForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("customer_name_ajax");
    let inputPhoneNumber = document.getElementById("customer_phone_number_ajax");
    let inputEmail = document.getElementById("customer_email_ajax");
    let inputState = document.getElementById("customer_state_ajax");

    // Get the values from the form fields
    let customerNameValue = inputName.value;
    let customerPhoneNumberValue = inputPhoneNumber.value;
    let customerEmailValue = inputEmail.value;
    let customerStateValue = inputState.value;

    // Put our data we want to send in a javascript object
    let data = {
        customer_name: customerNameValue,
        customer_phone_number: customerPhoneNumberValue,
        customer_email: customerEmailValue,
        customer_state: customerStateValue
    }

    console.log('add customer data')
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputPhoneNumber.value = '';
            inputEmail.value = '';
            inputState.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("customers-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let customerNameCell = document.createElement("TD");
    let customerPhoneNumberCell = document.createElement("TD");
    let customerEmailCell = document.createElement("TD");
    let customerStateCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.customer_id;
    customerNameCell.innerText = newRow.customer_name;
    customerPhoneNumberCell.innerText = newRow.customer_phone_number;
    customerEmailCell.innerText = newRow.customer_email;
    customerStateCell.innerText = newRow.customer_state;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteCustomer(newRow.id);
    }

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(customerNameCell);
    row.appendChild(customerPhoneNumberCell);
    row.appendChild(customerEmailCell);
    row.appendChild(customerStateCell);
    row.appendChild(deleteCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("update_customer_name");
    let option = document.createElement("option");
    option.text = newRow.customer_name;
    option.value = newRow.id;
    selectMenu.add(option);
    // End of new step 8 code.
    document.location.reload();
}
