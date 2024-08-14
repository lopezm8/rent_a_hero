// Get the objects we need to modify
let addHeroRatingForm = document.getElementById('add-hero-rating-form-ajax');

// Modify the objects we need
addHeroRatingForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRatingDate = document.getElementById("hero_rating_date_ajax");
    let inputRatingStars = document.getElementById("hero_rating_stars_ajax");
    let inputRatingHeader = document.getElementById("hero_rating_header_ajax");
    let inputRatingComments = document.getElementById("hero_rating_comments_ajax");
    let inputRatingCustomerName = document.getElementById("hero_rating_customer_name_ajax");
    let inputRatingHeroName = document.getElementById("hero_rating_hero_name_ajax");

    // Get the values from the form fields
    let heroratingRatingDate = inputRatingDate.value;
    let heroratingRatingStars = inputRatingStars.value;
    let heroratingRatingHeader = inputRatingHeader.value;
    let heroratingRatingComments = inputRatingComments.value;
    let heroratingRatingCustomerName = inputRatingCustomerName.value;
    let heroratingRatingHeroName = inputRatingHeroName.value;

    // Put our data we want to send in a javascript object
    let data = {
        hero_rating_date: heroratingRatingDate,
        hero_rating_stars: heroratingRatingStars,
        hero_rating_header: heroratingRatingHeader,
        hero_rating_comments: heroratingRatingComments,
        hero_rating_customer_name: heroratingRatingCustomerName,
        hero_rating_hero_name: heroratingRatingHeroName
    }

    console.log('add hero rating data')
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-hero-rating-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputRatingDate.value = '';
            inputRatingStars.value = '';
            inputRatingHeader.value = '';
            inputRatingComments.value = '';
            inputRatingCustomerName.value = '';
            inputRatingHeroName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("hero-ratings-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let heroratingRatingDate = document.createElement("TD");
    let heroratingRatingStars = document.createElement("TD");
    let heroratingRatingHeader = document.createElement("TD");
    let heroratingRatingComments = document.createElement("TD");
    let heroratingRatingCustomerName = document.createElement("TD");
    let heroratingRatingHeroName = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.hero_rating_id;
    heroratingRatingDate.innerText = newRow.hero_rating_date;
    heroratingRatingStars.innerText = newRow.hero_rating_stars;
    heroratingRatingHeader.innerText = newRow.hero_rating_header;
    heroratingRatingComments.innerText = newRow.hero_rating_comments;
    heroratingRatingCustomerName.innerText = newRow.hero_rating_customer_name;
    heroratingRatingHeroName.innerText = newRow.hero_rating_hero_name;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteHeroRating(newRow.id);
    }

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(heroratingRatingDate);
    row.appendChild(heroratingRatingStars);
    row.appendChild(heroratingRatingHeader);
    row.appendChild(heroratingRatingComments);
    row.appendChild(heroratingRatingCustomerName);
    row.appendChild(heroratingRatingHeroName);
    row.appendChild(deleteCell);

    //Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
}

