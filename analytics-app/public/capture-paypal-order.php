<?php
// capture-paypal-order.php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// PayPal Credentials (Sandbox)
$clientId = 'AbEX3KH6vNaoJNI79RJ4oYptrt0raV2VH9zMSAPLJGdC6NiTT58cABfgVUrJ2yYaq3j7VkoG7hg4jUIk';
$clientSecret = 'EJMtHUbTXob3yo5lVtAFhaMuXN_jaEy_KyasbKq2-wUWz2Ar_hvW4JtXqMgcpP_If1nrOrDgrBqHOvDa';
$apiUrl = 'https://api-m.sandbox.paypal.com'; // Use https://api-m.paypal.com for production

// 1. Get Access Token (Ideally cache this)
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl . '/v1/oauth2/token');
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, $clientId . ":" . $clientSecret);
curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials");

$result = curl_exec($ch);
$json = json_decode($result);
$accessToken = $json->access_token;
curl_close($ch);

if (!$accessToken) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to get PayPal access token']);
    exit;
}

// 2. Capture Order
$input = file_get_contents('php://input');
$data = json_decode($input, true);
$orderId = $data['orderID'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl . '/v2/checkout/orders/' . $orderId . '/capture');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $accessToken"
]);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 201) {
    http_response_code(500);
    echo $result;
    exit;
}

echo $result;
?>