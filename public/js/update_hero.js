
// Get the objects we need to modify
let updateHeroForm = document.getElementById('update-hero-form-ajax');

// Modify the objects we need
updateHeroForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputHeroID = document.getElementById("update_hero_name");
    let inputState = document.getElementById("update_hero_state");
    let inputSuperpower = document.getElementById("update_hero_superpower");
    let inputHourlyRate = document.getElementById("update_hero_hourly_rate");

    // Get the values from the form fields
    let heroIDValue = inputHeroID.value;
    let stateValue = inputState.value;
    let superpowerValue = inputSuperpower.value;
    let hourlyRateValue = inputHourlyRate.value;

    // return if the state is null

    if (isNaN(stateValue)) {
        console.log("nan state value")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        hero_id: heroIDValue,
        hero_state: stateValue,
        hero_superpower: superpowerValue,
        hero_hourly_rate: hourlyRateValue
    }

    console.log("update hero")
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-hero-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            console.log("updating row");
            updateRow(xhttp.response, heroIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, hero_id) {
    let parsedData = JSON.parse(data);
    console.log("update row");
    console.log(parsedData);

    let table = document.getElementById("heroes-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == hero_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td_superpower = updateRowIndex.getElementsByTagName("td")[2];
            td_superpower.innerHTML = parsedData[0].hero_superpower;

            // Get td of state value
            let td_state = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign state to our value we updated to
            td_state.innerHTML = parsedData[0].hero_state;
        }
    }
    document.location.reload();
}
