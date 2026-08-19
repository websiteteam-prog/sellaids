<?php
/* =========================================================================
 * OAMS PHP backend — configuration
 * Edit the values below for your cPanel MySQL database, then upload.
 * (In cPanel: "MySQL Databases" -> create a DB + user, add user to DB with
 *  ALL PRIVILEGES. Use those exact names here — they are usually prefixed
 *  with your cPanel username, e.g. "cpuser_oams".)
 * ========================================================================= */
return [
    // 'mysql' on cPanel (real). 'sqlite' only for quick local testing.
    'driver'      => getenv('OAMS_DRIVER') ?: 'mysql',

    'host'        => getenv('DB_HOST')     ?: 'localhost',
    'port'        => getenv('DB_PORT')     ?: '3306',
    'name'        => getenv('DB_NAME')     ?: 'CPANELUSER_oams',
    'user'        => getenv('DB_USER')     ?: 'CPANELUSER_oamsadmin',
    'password'    => getenv('DB_PASSWORD') ?: 'CHANGE_ME',

    // used only when driver = sqlite (local testing)
    'sqlite_path' => __DIR__ . '/data/oams.sqlite',

    // allow the app (any origin) to call this API
    'cors_origin' => '*',
];
