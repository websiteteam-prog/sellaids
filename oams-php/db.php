<?php
/* PDO connection + schema auto-create + seed. Works on MySQL (cPanel) and
   SQLite (local testing). Same portable SQL for both. */

function oams_cfg() { static $c = null; if ($c === null) $c = require __DIR__ . '/config.php'; return $c; }

function oams_db() {
    static $pdo = null;
    if ($pdo) return $pdo;
    $cfg = oams_cfg();
    if ($cfg['driver'] === 'sqlite') {
        @mkdir(dirname($cfg['sqlite_path']), 0775, true);
        $pdo = new PDO('sqlite:' . $cfg['sqlite_path']);
    } else {
        $dsn = "mysql:host={$cfg['host']};port={$cfg['port']};dbname={$cfg['name']};charset=utf8mb4";
        $pdo = new PDO($dsn, $cfg['user'], $cfg['password']);
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    oams_init($pdo);
    return $pdo;
}

function oams_init($pdo) {
    $pdo->exec("CREATE TABLE IF NOT EXISTS admins (username VARCHAR(64) PRIMARY KEY, password VARCHAR(255), name VARCHAR(128))");
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (emp_code VARCHAR(64) PRIMARY KEY, password VARCHAR(255), name VARCHAR(128), mode VARCHAR(32))");
    $pdo->exec("CREATE TABLE IF NOT EXISTS stores (store_code VARCHAR(64) PRIMARY KEY, store_name VARCHAR(255), city VARCHAR(128), category VARCHAR(64), coordinator_name VARCHAR(128), coordinator_number VARCHAR(64))");
    $pdo->exec("CREATE TABLE IF NOT EXISTS element_types (name VARCHAR(128) PRIMARY KEY)");
    $pdo->exec("CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(64) PRIMARY KEY,
        store_code VARCHAR(64), store_name VARCHAR(255), city VARCHAR(128), category VARCHAR(64),
        user_emp_code VARCHAR(64), user_name VARCHAR(128),
        store_photo_count INT, store_remark TEXT, final_remark TEXT,
        elements_count INT, elements_json TEXT, ppt_file VARCHAR(255),
        submitted_at VARCHAR(32))");

    if (oams_count($pdo, 'admins') == 0)
        $pdo->prepare("INSERT INTO admins (username,password,name) VALUES (?,?,?)")->execute(['admin', 'admin', 'OAMS Admin']);

    if (oams_count($pdo, 'element_types') == 0) {
        $st = $pdo->prepare("INSERT INTO element_types (name) VALUES (?)");
        foreach (['Sunboard','Art Board','Flex','Acrylic Signage','LED','Vinyl','ACP Panel','Glow Sign Board','One Way Vision','Fabric Backlit'] as $n)
            $st->execute([$n]);
    }
    if (oams_count($pdo, 'stores') == 0) {
        $st = $pdo->prepare("INSERT INTO stores (store_code,store_name,city,category,coordinator_name,coordinator_number) VALUES (?,?,?,?,?,?)");
        $seed = [
            ['STR-0451','Reliance Trends - Andheri West','Mumbai','MBO','Rahul Mehta','+91 98200 11223'],
            ['STR-0478','Croma - Powai','Mumbai','OT','Sneha Kulkarni','+91 99870 44556'],
            ['STR-0502','Vijay Sales - Thane','Thane','ISB','Amit Sharma','+91 98330 77889'],
            ['STR-0311','Big Bazaar - Malad','Mumbai','OT','Rahul Mehta','+91 98200 11223'],
            ['STR-0388','DMart - Kandivali','Mumbai','MBO','Sneha Kulkarni','+91 99870 44556'],
            ['STR-0450','Shoppers Stop - Ghatkopar','Mumbai','ISB','Amit Sharma','+91 98330 77889'],
            ['STR-0561','Croma - Vashi','Navi Mumbai','OT','Rahul Mehta','+91 98200 11223'],
            ['STR-0604','Reliance Digital - Borivali','Mumbai','MBO','Sneha Kulkarni','+91 99870 44556'],
        ];
        foreach ($seed as $s) $st->execute($s);
    }
    if (oams_count($pdo, 'users') == 0) {
        $st = $pdo->prepare("INSERT INTO users (emp_code,password,name,mode) VALUES (?,?,?,?)");
        $st->execute(['EMP1024', '1234', 'Rahul Mehta', 'Recce']);
        $st->execute(['EMP2048', '1234', 'Sneha Kulkarni', 'Recce']);
    }
}

function oams_count($pdo, $table) { return (int) $pdo->query("SELECT COUNT(*) c FROM $table")->fetch()['c']; }
