CREATE TABLE names (
	id INT NOT NULL IDENTITY PRIMARY KEY,
	firstName VARCHAR(20) NOT NULL,
	email VARCHAR(50) NOT NULL ,
	teamName VARCHAR(20) NOT NULL
);

CREATE TABLE teams (
	id INT NOT NULL IDENTITY PRIMARY KEY,
	teamName VARCHAR(50) NOT NULL
);