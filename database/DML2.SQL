--
-- Heroes entity 
--

-- get all heroes and the state that they are from for the browse Heroes page, heroes.html
SELECT hero_id, hero_name, hero_superpower, hero_hourly_rate, States.state_name AS hero_state_id FROM Heroes
INNER JOIN States ON hero_state_id = States.state_id;

-- get all State IDs and state names to populate the State dropdown for the hero_new.html
SELECT state_id, state_name FROM States;

-- add a new hero
INSERT INTO Heroes (hero_name, hero_superpower, hero_hourly_rate, hero_state_id) 
VALUES (hero_nameInput, hero_superpowerInput, hero_hourly_rateInput, hero_state_id_from_dropdown_Input);

-- update a hero
UPDATE Heroes SET hero_name = hero_nameInput, hero_superpower = hero_superpowerInput, hero_hourly_rate = hero_hourly_rateInput, hero_state_id = hero_state_id_from_dropdown_Input;

-- delete a hero
DELETE FROM Heroes WHERE hero_id = hero_id_selected_from_browse_customers_page;

-- Search for a hero by State
SELECT Heroes.hero_id, States.state_name FROM Heroes
INNER JOIN States ON States.state_id = Heroes.hero_state_id;


--
-- Customers entity 
--

-- get all customers and the state that they are from for the browse Customers page, customers.html
SELECT customer_id, customer_name, customer_phone_number, customer_email, States.state_name AS customer_state_id FROM Customers
INNER JOIN States ON customer_state_id = States.state_id;

-- get all State IDs and state names to populate the State dropdown for the hero_new.html
SELECT state_id, state_name FROM States;

-- add a new customer
INSERT INTO Customers (customer_name, customer_phone_number, customer_email, customer_state_id) 
VALUES (customer_nameInput, customer_phone_numberInput, customer_emailInput, customer_state_id_from_dropdownInput);

-- update a customer
Update Customers SET customer_name = customer_nameInput, customer_phone_number = customer_phone_numberInput, customer_email = customer_emailInput, customer_state =customer_state_id_from_dropdown_Input;

-- delete a customer
DELETE FROM Customers WHERE customer_id = customer_id_selected_from_browse_customers_page;


--
-- Missions entity 
--

-- get all missions for the browse Missions page, missions.html
SELECT mission_id, mission_type, mission_description, mission_base_cost FROM Missions;

-- add a new mission
INSERT INTO Missions (mission_type, mission_description, mission_base_cost) 
VALUES (mission_typeInput, mission_descriptionInput, mission_base_costInput);

-- update a mission
UPDATE Missions SET mission_type = mission_typeInput, mission_description = mission_descriptionInput, mission_base_cost = mission_base_costInput;

-- delete a mission
DELETE FROM Missions WHERE mission_id = mission_id_selected_from_browse_missions_page;


--
-- States entity 
--

-- get all states for the browse States page, states.html
SELECT state_id, state_name FROM States;

-- add a new state
INSERT INTO States (state_name) 
VALUES (state_nameInput);


--
-- Hero Ratings entity 
--

-- get all Hero Ratings for the browse Hero Ratings page, hero_ratings.html
SELECT hero_rating_id, hero_rating_date, hero_rating_stars, hero_rating_header, hero_rating_comments, Customers.customer_id AS hero_rating_customer_id, Heroes.hero_id AS hero_rating_hero_id FROM Hero_Ratings
INNER JOIN Customers ON hero_rating_customer_id = Customers.customer_id
INNER JOIN Heroes ON hero_rating_hero_id = Heroes.hero_id;

-- add a new Hero Rating
INSERT INTO Hero_Ratings (hero_rating_date, hero_rating_stars, hero_rating_header, hero_rating_comments, hero_rating_customer_id, hero_rating_hero_id) 
VALUES (hero_rating_dateInput, hero_rating_starsInput, hero_rating_headerInput, hero_rating_commentsInput, hero_rating_customer_idInput, hero_rating_hero_idInput);

-- delete a Hero Rating
DELETE FROM Hero_Ratings WHERE hero_rating_id = hero_rating_id_selected_from_browse_hero_ratings_page;

-- update a Hero Rating
UPDATE Hero_Ratings SET hero_rating_customer_id = hero_rating_customer_id_from_dropdown, hero_rating_hero_id = hero_rating_hero_id_from_dropdown, hero_rating_stars = hero_rating_stars_from_dropdown, hero_rating_header = hero_rating_headerInput, hero_rating_comments = hero_rating_commentsInput WHERE Hero_Ratings.hero_rating_id = hero_rating_id_from_dropdown;
