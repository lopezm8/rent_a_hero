
// Get the objects we need to modify
let updateHeroRatingForm = document.getElementById('update-hero-rating-form-ajax');

// Modify the objects we need
updateHeroRatingForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputHeroRatingID = document.getElementById("update_hero_rating_id");
    let inputCustomerID = document.getElementById("update_hero_rating_customer");
    let inputHeroID = document.getElementById("update_hero_rating_hero");
    let inputStars = document.getElementById("update_hero_rating_stars");
    let inputDate = document.getElementById("update_hero_rating_date");
    let inputHeader = document.getElementById("update_hero_rating_header");
    let inputComments = document.getElementById("update_hero_rating_comments");

    // Get the values from the form fields
    let heroRatingIDValue = inputHeroRatingID.value;
    let customerIDValue = inputCustomerID.value;
    let heroIDValue = inputHeroID.value;
    let starsValue = inputStars.value;
    let dateValue = inputDate.value;
    let headerValue = inputHeader.value;
    let commentsValue = inputComments.value;

    // return if the hero rating id is null

    if (isNaN(heroRatingIDValue)) {
        console.log("nan hero rating ID value")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        hero_rating_id: heroRatingIDValue,
        hero_rating_customer_id: customerIDValue,
        hero_rating_hero_id: heroIDValue,
        hero_rating_stars: starsValue,
        hero_rating_date: dateValue,
        hero_rating_header: headerValue,
        hero_rating_comments: commentsValue
    }

    console.log("update hero rating:")
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-hero-rating-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            console.log("updating row");
            updateRow(xhttp.response, heroRatingIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, hero_rating_id) {
    let parsedData = JSON.parse(data);
    console.log("update row");
    console.log(parsedData);

    let table = document.getElementById("hero-ratings-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == hero_rating_id) {

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
