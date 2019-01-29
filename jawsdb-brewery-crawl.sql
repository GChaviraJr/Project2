CREATE TABLE todos (
	id INT AUTO_INCREMENT NOT NULL,
	description VARCHAR(255),
    createdAt TIMESTAMP NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE login (
    id serial PRIMARY KEY,
    hash VARCHAR(100) NOT NULL,
    email text UNIQUE NOT NULL
);

CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(100),
    email text UNIQUE NOT NULL,
    entries BIGINT default 0,
    joined TIMESTAMP NOT NULL
);