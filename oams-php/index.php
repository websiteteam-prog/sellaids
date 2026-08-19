<?php
/* =========================================================================
 * OAMS PHP backend — API router.
 * All /api/* requests are rewritten here by .htaccess.
 * ========================================================================= */
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);

// local `php -S` testing: serve real static files + directory index.html
// (on real Apache, .htaccess + DirectoryIndex handle this automatically)
if (php_sapi_name() === 'cli-server') {
    $rel = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $f = __DIR__ . $rel;
    if (is_file($f)) return false;
    if (is_dir($f) && is_file(rtrim($f, '/') . '/index.html')) {
        header('Content-Type: text/html'); readfile(rtrim($f, '/') . '/index.html'); exit;
    }
}

require_once __DIR__ . '/db.php';

$cfg = oams_cfg();
header('Access-Control-Allow-Origin: ' . ($cfg['cors_origin'] ?: '*'));
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token, Authorization');

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') { http_response_code(204); exit; }

// resolve path relative to this script's folder.
// On Apache the .htaccess rewrites to index.php, so SCRIPT_NAME = "/<base>/index.php".
// Under the local `php -S` router, force base = "" (root).
if (php_sapi_name() === 'cli-server') {
    $base = '';
} else {
    $sn = str_replace('\\', '/', $_SERVER['SCRIPT_NAME']);
    $base = (substr($sn, -10) === '/index.php') ? rtrim(dirname($sn), '/') : '';
}
$uri  = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = '/' . ltrim(substr($uri, strlen($base)), '/');
$path = rtrim($path, '/'); if ($path === '') $path = '/';
$seg  = array_values(array_filter(explode('/', $path)));

function body() { $j = json_decode(file_get_contents('php://input'), true); return is_array($j) ? $j : []; }
function json($data, $code = 200) { http_response_code($code); header('Content-Type: application/json'); echo json_encode($data); exit; }
function admin_token() {
    $h = function_exists('getallheaders') ? getallheaders() : [];
    foreach ($h as $k => $v) if (strtolower($k) === 'x-admin-token') return $v;
    return isset($_SERVER['HTTP_X_ADMIN_TOKEN']) ? $_SERVER['HTTP_X_ADMIN_TOKEN'] : (isset($_GET['t']) ? $_GET['t'] : '');
}
function require_admin() { if (strpos((string) admin_token(), 'admin-token-') !== 0) json(['error' => 'Admin auth required'], 401); }

$pdo = oams_db();
$REPORTS = __DIR__ . '/reports';
if (!is_dir($REPORTS)) @mkdir($REPORTS, 0775, true);

/* ------------------------ routes ------------------------ */

// health
if ($path === '/' || $path === '/health') json(['ok' => true, 'service' => 'OAMS PHP backend']);

// POST /login
if ($method === 'POST' && $path === '/login') {
    $b = body();
    $st = $pdo->prepare("SELECT * FROM users WHERE LOWER(emp_code)=LOWER(?)");
    $st->execute([trim($b['empCode'] ?? '')]);
    $u = $st->fetch();
    if (!$u || $u['password'] !== ($b['password'] ?? '')) json(['error' => 'Invalid Employee Code or Password'], 401);
    json(['token' => 'user-token-' . $u['emp_code'], 'name' => $u['name'], 'empCode' => $u['emp_code'], 'mode' => $u['mode']]);
}

// GET /master
if ($method === 'GET' && $path === '/master') {
    $rows = $pdo->query("SELECT name FROM element_types ORDER BY name")->fetchAll();
    json(['elementTypes' => array_column($rows, 'name')]);
}

// GET /stores  (only stores whose recce is not done)
if ($method === 'GET' && $path === '/stores') {
    $rows = $pdo->query("SELECT * FROM stores WHERE store_code NOT IN (SELECT DISTINCT store_code FROM submissions) ORDER BY store_name")->fetchAll();
    json(array_map('oams_store_out', $rows));
}

// POST /recce/submit
if ($method === 'POST' && $path === '/recce/submit') {
    $b = body();
    $store = $b['store'] ?? []; $user = $b['user'] ?? []; $work = $b['work'] ?? [];
    if (!$store || !$work) json(['error' => 'Missing store or work'], 400);
    $id = 'REC-' . round(microtime(true) * 1000);
    $submittedAt = date('Y-m-d H:i:s');
    $pptFile = $id . '.pptx';
    require_once __DIR__ . '/report.php';
    try {
        oams_build_pptx($store, $work, ['userName' => $user['name'] ?? '', 'userEmpCode' => $user['empCode'] ?? '', 'submittedAt' => $submittedAt], $REPORTS . '/' . $pptFile);
    } catch (Throwable $e) {
        json(['error' => 'Failed to build report: ' . $e->getMessage()], 500);
    }
    $elements = array_map(function ($e) {
        return ['type' => $e['type'] ?? '', 'width' => $e['width'] ?? '', 'height' => $e['height'] ?? '', 'total' => $e['total'] ?? '', 'photoCount' => count($e['photos'] ?? []), 'remark' => $e['remark'] ?? ''];
    }, $work['elements'] ?? []);
    $st = $pdo->prepare("INSERT INTO submissions (id,store_code,store_name,city,category,user_emp_code,user_name,store_photo_count,store_remark,final_remark,elements_count,elements_json,ppt_file,submitted_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $st->execute([$id, $store['storeCode'] ?? '', $store['storeName'] ?? '', $store['city'] ?? '', $store['category'] ?? '',
        $user['empCode'] ?? '', $user['name'] ?? '', count($work['storeImages'] ?? []), $work['storeRemark'] ?? '', $work['finalRemark'] ?? '',
        count($elements), json_encode($elements), $pptFile, $submittedAt]);
    json(['ok' => true, 'id' => $id]);
}

/* ------------------------ admin ------------------------ */

// POST /admin/login
if ($method === 'POST' && $path === '/admin/login') {
    $b = body();
    $st = $pdo->prepare("SELECT * FROM admins WHERE LOWER(username)=LOWER(?)");
    $st->execute([trim($b['username'] ?? '')]);
    $a = $st->fetch();
    if (!$a || $a['password'] !== ($b['password'] ?? '')) json(['error' => 'Invalid admin credentials'], 401);
    json(['token' => 'admin-token-' . $a['username'], 'name' => $a['name']]);
}

// GET /admin/recces
if ($method === 'GET' && $path === '/admin/recces') {
    require_admin();
    $w = []; $p = [];
    if (!empty($_GET['q'])) { $w[] = "(LOWER(store_name) LIKE ? OR LOWER(store_code) LIKE ?)"; $q = '%' . strtolower($_GET['q']) . '%'; $p[] = $q; $p[] = $q; }
    if (!empty($_GET['user'])) { $w[] = "user_emp_code=?"; $p[] = $_GET['user']; }
    if (!empty($_GET['city'])) { $w[] = "city=?"; $p[] = $_GET['city']; }
    if (!empty($_GET['category'])) { $w[] = "category=?"; $p[] = $_GET['category']; }
    if (!empty($_GET['from'])) { $w[] = "submitted_at>=?"; $p[] = $_GET['from'] . ' 00:00:00'; }
    if (!empty($_GET['to'])) { $w[] = "submitted_at<=?"; $p[] = $_GET['to'] . ' 23:59:59'; }
    $sql = "SELECT * FROM submissions" . (count($w) ? " WHERE " . implode(' AND ', $w) : "") . " ORDER BY submitted_at DESC";
    $st = $pdo->prepare($sql); $st->execute($p);
    json(array_map('oams_sub_out', $st->fetchAll()));
}

// GET /admin/filters
if ($method === 'GET' && $path === '/admin/filters') {
    require_admin();
    $cities = array_column($pdo->query("SELECT DISTINCT city FROM submissions WHERE city<>'' ORDER BY city")->fetchAll(), 'city');
    $cats = array_column($pdo->query("SELECT DISTINCT category FROM submissions WHERE category<>'' ORDER BY category")->fetchAll(), 'category');
    $users = $pdo->query("SELECT DISTINCT user_emp_code, user_name FROM submissions WHERE user_emp_code<>'' ORDER BY user_emp_code")->fetchAll();
    json(['cities' => $cities, 'categories' => $cats, 'users' => array_map(function ($u) { return ['empCode' => $u['user_emp_code'], 'name' => $u['user_name']]; }, $users)]);
}

// GET /admin/recces/{id}/ppt
if ($method === 'GET' && count($seg) === 4 && $seg[0] === 'admin' && $seg[1] === 'recces' && $seg[3] === 'ppt') {
    if (strpos((string) admin_token(), 'admin-token-') !== 0) { http_response_code(401); echo 'Admin auth required'; exit; }
    $st = $pdo->prepare("SELECT * FROM submissions WHERE id=?"); $st->execute([$seg[2]]);
    $rec = $st->fetch();
    if (!$rec) { http_response_code(404); echo 'Not found'; exit; }
    $file = $REPORTS . '/' . $rec['ppt_file'];
    if (!file_exists($file)) { http_response_code(404); echo 'Report file missing'; exit; }
    header('Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation');
    header('Content-Disposition: attachment; filename="' . ($rec['store_code'] ?: $rec['id']) . '.pptx"');
    header('Content-Length: ' . filesize($file));
    readfile($file); exit;
}

// users
if ($method === 'GET' && $path === '/admin/users') {
    require_admin();
    $rows = $pdo->query("SELECT emp_code,name,mode FROM users ORDER BY emp_code")->fetchAll();
    json(array_map(function ($u) { return ['empCode' => $u['emp_code'], 'name' => $u['name'], 'mode' => $u['mode']]; }, $rows));
}
if ($method === 'POST' && $path === '/admin/users') {
    require_admin();
    $b = body();
    if (empty($b['empCode']) || empty($b['name']) || empty($b['password'])) json(['error' => 'empCode, name and password are required'], 400);
    $ex = $pdo->prepare("SELECT emp_code FROM users WHERE LOWER(emp_code)=LOWER(?)"); $ex->execute([$b['empCode']]);
    if ($ex->fetch()) json(['error' => 'Employee Code already exists'], 409);
    $pdo->prepare("INSERT INTO users (emp_code,password,name,mode) VALUES (?,?,?,?)")->execute([$b['empCode'], $b['password'], $b['name'], $b['mode'] ?? 'Recce']);
    json(['ok' => true]);
}
if ($method === 'DELETE' && count($seg) === 3 && $seg[0] === 'admin' && $seg[1] === 'users') {
    require_admin();
    $pdo->prepare("DELETE FROM users WHERE LOWER(emp_code)=LOWER(?)")->execute([$seg[2]]);
    json(['ok' => true]);
}

json(['error' => 'Not found', 'path' => $path], 404);

/* ------------------------ helpers ------------------------ */
function oams_store_out($r) {
    return ['storeCode' => $r['store_code'], 'storeName' => $r['store_name'], 'city' => $r['city'], 'category' => $r['category'],
        'coordinatorName' => $r['coordinator_name'], 'coordinatorNumber' => $r['coordinator_number']];
}
function oams_sub_out($r) {
    return ['id' => $r['id'], 'storeCode' => $r['store_code'], 'storeName' => $r['store_name'], 'city' => $r['city'], 'category' => $r['category'],
        'userEmpCode' => $r['user_emp_code'], 'userName' => $r['user_name'], 'storePhotoCount' => (int) $r['store_photo_count'],
        'storeRemark' => $r['store_remark'], 'finalRemark' => $r['final_remark'], 'elementsCount' => (int) $r['elements_count'],
        'elements' => json_decode($r['elements_json'] ?: '[]', true), 'pptFile' => $r['ppt_file'], 'submittedAt' => $r['submitted_at']];
}
