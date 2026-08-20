-- =====================================================================
-- OAMS local database (MySQL / MariaDB)
-- Import in phpMyAdmin (XAMPP), or:  mysql -u root -p < schema.sql
-- Creates the `oams` database with tables + demo data.
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
  store_code VARCHAR(64) PRIMARY KEY,
  store_name VARCHAR(255),
  address    VARCHAR(255),
  phone      VARCHAR(128),
  city       VARCHAR(128),
  category   VARCHAR(64),
  brand      VARCHAR(128),
  ret_type   VARCHAR(64)
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

-- Element list (from client's Element List)
INSERT IGNORE INTO element_types (name) VALUES
  ('SUNBOARD 3MM'), ('SUNBOARD 5MM'), ('VINYL'), ('ONEWAY VISION'), ('TRANSLIT'),
  ('FABRIC PRINT'), ('FABRIC BOX NEW'), ('GSB FLEX CHANGE'), ('GSB NEW'), ('GSB NEW D/S'),
  ('NONLIT BOARD'), ('NONLIT FLEX CHANGE'), ('ACP BOARD'), ('FROSTED VINYL'),
  ('LIT ACRYLIC HEADER'), ('IRON ANGLE'), ('LIT CLIPON'), ('SCAFFOLDING/CRANE'),
  ('ROCKET PILLAR'), ('REPAIR'), ('ACRYLIC SANDWICH'), ('LIT FLANGE');

INSERT IGNORE INTO stores (store_code, store_name, address, phone, city, category, brand, ret_type) VALUES
  ('626425',   'Sharma Electronics Store',        'Opp. HDFC Bank, Chandigarh Road, Samrala (LDH)', '9888908988, 9464681941', 'Ludhiana',     'Consumer Electronics', 'Mi',              ''),
  ('STR-0478', 'Croma - Powai',                   'Powai Plaza, Powai',       '022-99870 44556', 'Mumbai',      'OT',  'Croma',            ''),
  ('STR-0451', 'Reliance Trends - Andheri West',  'Link Road, Andheri West',  '022-98200 11223', 'Mumbai',      'MBO', 'Reliance',         ''),
  ('STR-0502', 'Vijay Sales - Thane',             'Station Road, Thane West', '022-98330 77889', 'Thane',       'ISB', 'Vijay Sales',      ''),
  ('STR-0311', 'Big Bazaar - Malad',              'Mindspace, Malad West',    '022-98200 11223', 'Mumbai',      'OT',  'Big Bazaar',       ''),
  ('STR-0388', 'DMart - Kandivali',               'SV Road, Kandivali',       '022-99870 44556', 'Mumbai',      'MBO', 'DMart',            ''),
  ('STR-0450', 'Shoppers Stop - Ghatkopar',       'R City Mall, Ghatkopar',   '022-98330 77889', 'Mumbai',      'ISB', 'Shoppers Stop',    ''),
  ('STR-0604', 'Reliance Digital - Borivali',     'SV Road, Borivali West',   '022-99870 44556', 'Mumbai',      'OT',  'Reliance Digital', '');
