SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;
DROP TABLES IF EXISTS Missions, States, Customers, Heroes, Hero_Ratings, Heroes_Has_Missions, Customers_Has_Heroes;


CREATE OR REPLACE TABLE Missions (
    mission_id int NOT NULL AUTO_INCREMENT,
    mission_type varchar(100),
    mission_description varchar(100),
    mission_base_cost decimal(19,4),
    PRIMARY KEY (mission_id)
);

CREATE OR REPLACE TABLE States (
    state_id int NOT NULL AUTO_INCREMENT,
    state_name varchar(100),
    PRIMARY KEY (state_id)
);

CREATE OR REPLACE TABLE Customers (
    customer_id int NOT NULL AUTO_INCREMENT,
    customer_name varchar(100),
    customer_phone_number varchar(50),
    customer_email varchar(100),
    customer_state_id int,
    PRIMARY KEY (customer_id),
    FOREIGN KEY (customer_state_id) REFERENCES States(state_id)
);

CREATE OR REPLACE TABLE Heroes (
    hero_id int NOT NULL AUTO_INCREMENT,
    hero_name varchar(100),
    hero_superpower varchar(100),
    hero_hourly_rate int,
    hero_state_id int,
    PRIMARY KEY (hero_id),
    FOREIGN KEY (hero_state_id) REFERENCES States(state_id)
);

CREATE OR REPLACE TABLE Hero_Ratings (
    hero_rating_id int NOT NULL AUTO_INCREMENT,
    hero_rating_date datetime,
    hero_rating_stars int,
    hero_rating_header varchar(200),
    hero_rating_comments varchar(2000),
    hero_rating_customer_id int,
    hero_rating_hero_id int,
    PRIMARY KEY (hero_rating_id),
    FOREIGN KEY (hero_rating_customer_id) REFERENCES Customers(customer_id)
        ON DELETE SET NULL
        ON UPDATE NO ACTION,
    FOREIGN KEY (hero_rating_hero_id) REFERENCES Heroes(hero_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE OR REPLACE TABLE Heroes_Has_Missions (
    heroes_hero_id int,
    missions_mission_id int,
    FOREIGN KEY (heroes_hero_id) REFERENCES Heroes(hero_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (missions_mission_id) REFERENCES Missions(mission_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE OR REPLACE TABLE Customers_Has_Heroes (
    customers_customer_id int,
    heroes_hero_id int,
    FOREIGN KEY (customers_customer_id) REFERENCES Customers(customer_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (heroes_hero_id) REFERENCES Heroes(hero_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO Heroes (hero_name, hero_superpower, hero_hourly_rate, hero_state_id)
VALUES ('Aero Tornado', 'Subsonic Flight', 84, 1),
('Chronomaster', 'Time Manipulation', 105, 2),
('Comet Girl', 'Super Speed', 96, 1),
('Mechanisma', 'Talking to Machines', 55, 3);

INSERT INTO Customers (customer_name, customer_phone_number, customer_email, customer_state_id)
VALUES ('Rosemarie Butler', '5100929321', 'r_butler@ca.com', 1),
('Tony Kirkland', '6029329591', 't_kirkland@az.com', 2),
('Gwen Patel', '9710234513', 'g_patel@or.com', 3);

INSERT INTO States (state_name)
VALUES ('California'),
('Arizona'),
('Oregon'),
('Washington'),
('Nevada');

INSERT INTO Missions (mission_type, mission_description, mission_base_cost)
VALUES ('Flying', 'Fly to the destination of your choice, pack lightly, pack heavy, we''ve got you covered.', 250),
('Time Travel', 'Forgot to turn off the stove on time? Forgot to unfreeze tonight''s dinner? We''ve got you covered with our time travel mission!', 500),
('Speed', 'Need to get somewhere quick? Do you have a plane to catch and only have two minutes to get there? Get there in style with our speed mission!', 150),
('Intelligence', 'Do you have an exam coming up? Or maybe you''re trying to impress your colleagues? Our intelligence mission will have you thinking like Sir Isaac Newton in no time. ', 100);

INSERT INTO Heroes_Has_Missions (missions_mission_id, heroes_hero_id)
VALUES (1, 1),
(2, 2),
(3, 3),
(4, 4),
(1, 3);

INSERT INTO Customers_Has_Heroes(customers_customer_id, heroes_hero_id)
VALUES (1,1),
(2,2),
(1,3),
(3,4);

INSERT INTO Hero_Ratings (hero_rating_date, hero_rating_stars, hero_rating_header, hero_rating_comments, hero_rating_customer_id, hero_rating_hero_id)
VALUES ('2022-02-03', 4, 'Great adventure', 'It was a dark and stormy night and I had no idea of the adventure that awaited. ', 1, 1),
('2022-03-14', 4, 'Saved my life!', 'Narrowly avoided an embarrassing moment. Don''t want to get into specifics but will definitely use this service again!', 2, 2),
('2022-04-05', 5, 'Went fast', 'Saved our track team from last place', 1, 3),
('2022-04-10', 4, 'Miracle worker!', 'Managed to convince my car to start after talking for a bit - never knew my car felt that way.', 3, 4),
('2022-03-18', 3, 'Not what I expected', 'More like jumping really far than flying, and got to my destination feeling dizzier than expected - was the main hero on leave that day?', 1, 3);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

