// Get the objects we need to modify
let addMissionForm = document.getElementById('add-mission-form-ajax');

// Modify the objects we need
addMissionForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputMissionType = document.getElementById("mission_type_ajax");
    let inputMissionDescription = document.getElementById("mission_description_ajax");
    let inputMissionBaseCost = document.getElementById("mission_base_cost_ajax");

    // Get the values from the form fields
    let missionMissionType = inputMissionType.value;
    let missionMissionDescription = inputMissionDescription.value;
    let missionMissionBaseCost = inputMissionBaseCost.value;

    // Put our data we want to send in a javascript object
    let data = {
        mission_type: missionMissionType,
        mission_description: missionMissionDescription,
        mission_base_cost: missionMissionBaseCost
    }

    console.log('add mission data')
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-mission-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputMissionType.value = '';
            inputMissionDescription.value = '';
            inputMissionBaseCost.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("missions-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let missionMissionType = document.createElement("TD");
    let missionMissionDescription = document.createElement("TD");
    let missionMissionBaseCost = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.mission_id;
    missionMissionType.innerText = newRow.mission_type;
    missionMissionDescription.innerText = newRow.mission_description;
    missionMissionBaseCost.innerText = newRow.mission_base_cost;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteMission(newRow.id);
    }

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(missionMissionType);
    row.appendChild(missionMissionDescription);
    row.appendChild(missionMissionBaseCost);
    row.appendChild(deleteCell);

    //Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    //let selectMenu = document.getElementById("update_mission_description");
    //let option = document.createElement("option");
    //option.text = newRow.mission_description;
    //option.value = newRow.id;
    //selectMenu.add(option);
    // End of new step 8 code.
    document.location.reload();
}
