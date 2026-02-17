<?php
// create-paypal-order.php

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

// 1. Get Access Token
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

// 2. Create Order
$input = file_get_contents('php://input');
$body = json_decode($input, true);

// Default to 15.00 EUR for the Pro Plan
$amount = '15.00';
$currency = 'EUR';

$orderData = [
    'intent' => 'CAPTURE',
    'purchase_units' => [
        [
            'amount' => [
                'currency_code' => $currency,
                'value' => $amount
            ],
            'description' => 'White Knight Analytics Pro Plan (14-Day Trial)'
        ]
    ],
    'application_context' => [
        'brand_name' => 'White Knight Analytics',
        'landing_page' => 'NO_PREFERENCE',
        'user_action' => 'PAY_NOW',
        'return_url' => 'https://analytics.whiteknight.academy/payment-success',
        'cancel_url' => 'https://analytics.whiteknight.academy/checkout'
    ]
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl . '/v2/checkout/orders');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $accessToken"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 201) {
    http_response_code(500);
    echo $result; // Return the error from PayPal
    exit;
}

echo $result;
?>