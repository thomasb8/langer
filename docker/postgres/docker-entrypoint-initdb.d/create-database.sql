CREATE DATABASE langer_db;
CREATE DATABASE langer_test;

\connect langer_db;
CREATE EXTENSION pg_trgm;

\connect langer_test;
CREATE EXTENSION pg_trgm;
