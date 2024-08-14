
// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerID = document.getElementById("update_customer_name");
    let inputCustomerPhoneNumber = document.getElementById("update_customer_phone_number");
    let inputCustomerEmail = document.getElementById("update_customer_email");
    let inputCustomerState = document.getElementById("update_customer_state");

    // Get the values from the form fields
    let customerIDValue = inputCustomerID.value;
    let customerPhoneNumberValue = inputCustomerPhoneNumber.value;
    let customerEmailValue = inputCustomerEmail.value;
    let customerStateValue = inputCustomerState.value;

    // return if the state is null

    if (isNaN(customerStateValue)) {
        console.log("nan state value")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        customer_id: customerIDValue,
        customer_phone_number: customerPhoneNumberValue,
        customer_email: customerEmailValue,
        customer_state: customerStateValue
    }

    console.log("update hero")
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            console.log("updating row");
            updateRow(xhttp.response, customerIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, customer_id) {
    let parsedData = JSON.parse(data);
    console.log("update row");
    console.log(parsedData);

    let table = document.getElementById("customers-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == customer_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td_phone_number = updateRowIndex.getElementsByTagName("td")[2];
            td_phone_number.innerHTML = parsedData[0].customer_phone_number;

            // Get td of state value
            let td_state = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign state to our value we updated to
            td_state.innerHTML = parsedData[0].customer_state;
        }
    }
}
