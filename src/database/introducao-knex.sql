-- Active: 1681166155988@@127.0.0.1@3306

-- Tabelas já foram criadas
CREATE TABLE bands (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE songs (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    band_id TEXT NOT NULL,
    FOREIGN KEY (band_id) REFERENCES bands (id)
);

SELECT * FROM bands;

INSERT INTO bands (id, name) VALUES
("001", "BTS");

SELECT * FROM bands
WHERE id = "FULANO";

UPDATE bands
SET name = "BABYSHARK"
WHERE id = "500";