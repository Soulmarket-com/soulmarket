<?php
declare(strict_types=1);

// Credenciales en directorio private de HestiaCP (no accesible por web)
$private = str_replace('/public_html', '/private', dirname(__DIR__));
$config = require $private . '/odoo.config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://soulmarket.es');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid_json']);
    exit;
}

$name    = trim((string)($body['name']    ?? ''));
$email   = trim((string)($body['email']   ?? ''));
$message = trim((string)($body['message'] ?? ''));
$source  = trim((string)($body['source']  ?? ''));
$lang    = in_array($body['lang'] ?? '', ['es', 'en']) ? $body['lang'] : 'es';

if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$message) {
    http_response_code(422);
    echo json_encode(['error' => 'missing_fields']);
    exit;
}

function odoo_rpc(string $base_url, string $service, string $method, array $args): mixed
{
    $payload = json_encode([
        'jsonrpc' => '2.0',
        'method'  => 'call',
        'id'      => 1,
        'params'  => compact('service', 'method', 'args'),
    ]);
    $ch = curl_init($base_url . '/jsonrpc');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
    ]);
    $res  = curl_exec($ch);
    $err  = curl_error($ch);
    curl_close($ch);
    if ($err || !$res) return null;
    $data = json_decode($res, true);
    return $data['result'] ?? null;
}

$uid = odoo_rpc(
    $config['url'], 'common', 'authenticate',
    [$config['db'], $config['user'], $config['password'], []]
);

if (!$uid) {
    http_response_code(502);
    echo json_encode(['error' => 'crm_unavailable']);
    exit;
}

$lead_name = 'Web soulmarket.es — ' . $name;
if ($source) $lead_name .= ' [' . $source . ']';

$lead_id = odoo_rpc(
    $config['url'], 'object', 'execute_kw',
    [$config['db'], $uid, $config['password'], 'crm.lead', 'create', [[
        'name'         => $lead_name,
        'partner_name' => $name,
        'email_from'   => $email,
        'description'  => $message,
    ]]]
);

if (!$lead_id) {
    http_response_code(502);
    echo json_encode(['error' => 'lead_failed']);
    exit;
}

http_response_code(200);
echo json_encode(['ok' => true]);
