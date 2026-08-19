-- =====================================================================
-- OAMS local database (MySQL / MariaDB)
-- Import in phpMyAdmin (XAMPP), or:  mysql -u root -p < schema.sql
-- Creates the `oams` database with tables + demo data (admin, users,
-- stores, element types). The `submissions` table fills when recces are
-- submitted from the app.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `oams` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `oams`;

CREATE TABLE IF NOT EXISTS admins (
  username VARCHAR(64) PRIMARY KEY,
  password VARCHAR(255),
  name     VARCHAR(128)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  emp_code VARCHAR(64) PRIMARY KEY,
  password VARCHAR(255),
  name     VARCHAR(128),
  mode     VARCHAR(32)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS stores (
  store_code         VARCHAR(64) PRIMARY KEY,
  store_name         VARCHAR(255),
  city               VARCHAR(128),
  category           VARCHAR(64),
  coordinator_name   VARCHAR(128),
  coordinator_number VARCHAR(64)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS element_types (
  name VARCHAR(128) PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS submissions (
  id                VARCHAR(64) PRIMARY KEY,
  store_code        VARCHAR(64),
  store_name        VARCHAR(255),
  city              VARCHAR(128),
  category          VARCHAR(64),
  user_emp_code     VARCHAR(64),
  user_name         VARCHAR(128),
  store_photo_count INT,
  store_remark      TEXT,
  final_remark      TEXT,
  elements_count    INT,
  elements_json     LONGTEXT,
  ppt_file          VARCHAR(255),
  submitted_at      DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------- seed data ----------------------

INSERT IGNORE INTO admins (username, password, name) VALUES
  ('admin', 'admin', 'OAMS Admin');

INSERT IGNORE INTO users (emp_code, password, name, mode) VALUES
  ('EMP1024', '1234', 'Rahul Mehta', 'Recce'),
  ('EMP2048', '1234', 'Sneha Kulkarni', 'Recce');

INSERT IGNORE INTO element_types (name) VALUES
  ('Sunboard'), ('Art Board'), ('Flex'), ('Acrylic Signage'), ('LED'),
  ('Vinyl'), ('ACP Panel'), ('Glow Sign Board'), ('One Way Vision'), ('Fabric Backlit');

INSERT IGNORE INTO stores (store_code, store_name, city, category, coordinator_name, coordinator_number) VALUES
  ('STR-0451', 'Reliance Trends - Andheri West', 'Mumbai', 'MBO', 'Rahul Mehta', '+91 98200 11223'),
  ('STR-0478', 'Croma - Powai', 'Mumbai', 'OT', 'Sneha Kulkarni', '+91 99870 44556'),
  ('STR-0502', 'Vijay Sales - Thane', 'Thane', 'ISB', 'Amit Sharma', '+91 98330 77889'),
  ('STR-0311', 'Big Bazaar - Malad', 'Mumbai', 'OT', 'Rahul Mehta', '+91 98200 11223'),
  ('STR-0388', 'DMart - Kandivali', 'Mumbai', 'MBO', 'Sneha Kulkarni', '+91 99870 44556'),
  ('STR-0450', 'Shoppers Stop - Ghatkopar', 'Mumbai', 'ISB', 'Amit Sharma', '+91 98330 77889'),
  ('STR-0561', 'Croma - Vashi', 'Navi Mumbai', 'OT', 'Rahul Mehta', '+91 98200 11223'),
  ('STR-0604', 'Reliance Digital - Borivali', 'Mumbai', 'MBO', 'Sneha Kulkarni', '+91 99870 44556');
