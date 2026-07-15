<?php
declare(strict_types=1);

// Recibe el webhook de Strapi (entry.publish / entry.unpublish en blog o
// portfolio) y dispara el workflow de deploy en GitHub Actions.
$private = str_replace('/public_html', '/private', dirname(__DIR__));
$config = require $private . '/strapi-deploy-hook.config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$secret = $_SERVER['HTTP_X_WEBHOOK_SECRET'] ?? '';
if (!hash_equals($config['webhook_secret'], $secret)) {
    http_response_code(401);
    exit;
}

$ch = curl_init('https://api.github.com/repos/Soulmarket-com/soulmarket/actions/workflows/deploy.yml/dispatches');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode(['ref' => 'main']),
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $config['github_token'],
        'Accept: application/vnd.github+json',
        'X-GitHub-Api-Version: 2022-11-28',
        'User-Agent: soulmarket-strapi-webhook',
        'Content-Type: application/json',
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
]);
$res = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$ok = $status >= 200 && $status < 300;
http_response_code($ok ? 200 : 502);
echo json_encode(['ok' => $ok, 'github_status' => $status]);
