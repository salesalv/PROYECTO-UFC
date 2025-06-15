--
-- PostgreSQL database cluster dump
--

-- Started on 2025-06-15 12:34:45

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:LoFoxgiLLbzpjGO1Y+HtXQ==$b/tArdeqo4JlFM9jRpwYbZHOHybKLdiPC2tOSzgGsmQ=:/0bbmhAOBJ74G0+Z2fXyHXJuyG+P2e9H9J4Pl6THhww=';

--
-- User Configurations
--








-- Completed on 2025-06-15 12:34:45

--
-- PostgreSQL database cluster dump complete
--

