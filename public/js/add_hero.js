// Get the objects we need to modify
let addHeroForm = document.getElementById('add-hero-form-ajax');

// Modify the objects we need
addHeroForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("hero_name_ajax");
    let inputState = document.getElementById("hero_state_ajax");
    let inputSuperpower = document.getElementById("hero_superpower_ajax");
    let inputHourlyRate = document.getElementById("hero_hourly_rate_ajax");

    // Get the values from the form fields
    let heroNameValue = inputName.value;
    let heroStateValue = inputState.value;
    let heroSuperpowerValue = inputSuperpower.value;
    let heroHourlyRateValue = inputHourlyRate.value;

    // Put our data we want to send in a javascript object
    let data = {
        hero_name: heroNameValue,
        hero_state: heroStateValue,
        hero_superpower: heroSuperpowerValue,
        hero_hourly_rate: heroHourlyRateValue
    }

    console.log('add hero data')
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-hero-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputState.value = '';
            inputSuperpower.value = '';
            inputHourlyRate.value = '';
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
    let currentTable = document.getElementById("heroes-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let heroNameCell = document.createElement("TD");
    let heroStateCell = document.createElement("TD");
    let heroSuperpowerCell = document.createElement("TD");
    let heroHourlyRateCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.hero_id;
    heroNameCell.innerText = newRow.hero_name;
    heroSuperpowerCell.innerText = newRow.hero_superpower;
    heroHourlyRateCell.innerText = newRow.hero_hourly_rate;
    heroStateCell.innerText = newRow.hero_state_id;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteHero(newRow.id);
    }

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(heroNameCell);
    row.appendChild(heroSuperpowerCell);
    row.appendChild(heroHourlyRateCell);
    row.appendChild(heroStateCell);
    row.appendChild(deleteCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("update_hero_name");
    let option = document.createElement("option");
    option.text = newRow.hero_name;
    option.value = newRow.id;
    selectMenu.add(option);
    // End of new step 8 code.
    document.location.reload();
}
