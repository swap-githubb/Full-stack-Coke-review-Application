create database coke_poll;

use coke_poll;

CREATE TABLE flavors (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each flavor
    flavor VARCHAR(255) NOT NULL UNIQUE, -- Name of the flavor (e.g., 'Vanilla Coke')
    votes INT DEFAULT 0                 -- Number of votes for the flavor, defaulting to 0
);

CREATE TABLE poll_results (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each poll entry
    flavor_id INT NOT NULL,            -- Reference to the `id` in the `flavors` table
    vote_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the vote was recorded
    FOREIGN KEY (flavor_id) REFERENCES flavors(id) -- Foreign key to link with `flavors`
);

CREATE TABLE all_reviews(
id INT AUTO_INCREMENT PRIMARY KEY,
review TEXT 
);

INSERT INTO flavors (flavor) VALUES 
('Coca Cola'), 
('Diet Coke'), 
('Coke Zero'),
('Cherry Coke'),
('Cherry Vanilla'),
('Lemon Coke'),
('Lime Coke'),
('Orange Vanilla Coke'),
('Vanilla Coke'),
('Peach Coke'),
('Tropical Coke'),
('Caffeine Free');











