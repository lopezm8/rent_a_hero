
// Get the objects we need to modify
let updateMissionForm = document.getElementById('update-mission-form-ajax');

// Modify the objects we need
updateMissionForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputMissionID = document.getElementById("update_mission_id_ajax");
    let inputMissionType = document.getElementById("update_mission_type_ajax");
    let inputMissionDescription = document.getElementById("update_mission_description_ajax");
    let inputMissionBaseCost = document.getElementById("update_mission_base_cost_ajax");

    // Get the values from the form fields
    let missionIDValue = inputMissionID.value;
    let missionTypeValue = inputMissionType.value;
    let missionDescriptionValue = inputMissionDescription.value;
    let missionBaseCostValue = inputMissionBaseCost.value;

    // return if the mission id is null

    if (isNaN(missionIDValue)) {
        console.log("nan state value")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        mission_id: missionIDValue,
        mission_type: missionTypeValue,
        mission_description: missionDescriptionValue,
        mission_base_cost: missionBaseCostValue
    }

    console.log("update mission:")
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-mission-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            console.log("updating row");
            updateRow(xhttp.response, missionIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, mission_id) {
    let parsedData = JSON.parse(data);
    console.log("update row");
    console.log(parsedData);

    let table = document.getElementById("missions-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == mission_id) {

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

    document.location.reload();
}
