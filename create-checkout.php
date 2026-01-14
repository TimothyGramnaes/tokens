<?php
// Create Stripe Checkout Session
// This file receives cart data from JavaScript and creates a Stripe checkout session

// Disable display_errors to prevent HTML output in JSON responses
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set headers for CORS and JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load configuration
require_once('stripe-config.php');
require_once('inventory.php');

// Get the cart data from the request
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['items'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request data']);
    exit();
}

// Check inventory before creating checkout session
$outOfStock = checkStock($data['items']);

if (!empty($outOfStock)) {
    http_response_code(400);
    $errorMsg = 'Some items are out of stock: ';
    $itemNames = array_map(function($item) {
        return $item['name'] . ' (requested: ' . $item['requested'] . ', available: ' . $item['available'] . ')';
    }, $outOfStock);
    $errorMsg .= implode(', ', $itemNames);

    echo json_encode(['error' => $errorMsg, 'outOfStock' => $outOfStock]);
    exit();
}

// Prepare line items for Stripe
$line_items = [];

foreach ($data['items'] as $item) {
    // For each item, we need to find or create the Stripe Price ID
    // For now, we'll create prices on-the-fly (dynamic pricing)

    $line_items[] = [
        'price_data' => [
            'currency' => 'eur', // Change to 'usd' if you want USD
            'product_data' => [
                'name' => $item['name'],
                'images' => [SITE_URL . '/' . $item['image']], // Full URL to image
                'tax_code' => 'txcd_99999999', // General - Tangible Goods (physical items)
            ],
            'unit_amount' => intval($item['price'] * 100), // Amount in cents
        ],
        'quantity' => $item['quantity'],
    ];
}

// Store cart data as metadata so webhook can access it
// Stripe metadata values must be strings, so we JSON encode the cart
$cartMetadata = json_encode($data['items']);

// Calculate total quantity of tokens in cart
$totalQuantity = 0;
foreach ($data['items'] as $item) {
    $totalQuantity += $item['quantity'];
}

// Create Stripe Checkout Session using cURL
$checkout_session_data = [
    'payment_method_types' => ['card'],
    'line_items' => $line_items,
    'mode' => 'payment',
    'success_url' => SITE_URL . '/success.html?session_id={CHECKOUT_SESSION_ID}',
    'cancel_url' => SITE_URL . '/tokens.html',
    'shipping_address_collection' => [
        'allowed_countries' => ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'], // EU member countries only
    ],
    'shipping_options' => [
        [
            'shipping_rate_data' => [
                'type' => 'fixed_amount',
                'fixed_amount' => [
                    'amount' => ($totalQuantity <= 10) ? 200 : 500, // SE: €2 (1-10) or €5 (11-25)
                    'currency' => 'eur',
                ],
                'display_name' => ($totalQuantity <= 10)
                    ? 'Sweden - Standard Shipping €2 (1-10 tokens)'
                    : 'Sweden - Standard Shipping €5 (11-25 tokens)',
                'delivery_estimate' => [
                    'minimum' => [
                        'unit' => 'business_day',
                        'value' => 3,
                    ],
                    'maximum' => [
                        'unit' => 'business_day',
                        'value' => 7,
                    ],
                ],
            ],
        ],
        [
            'shipping_rate_data' => [
                'type' => 'fixed_amount',
                'fixed_amount' => [
                    'amount' => ($totalQuantity <= 10) ? 500 : 1000, // EU: €5 (1-10) or €10 (11-25)
                    'currency' => 'eur',
                ],
                'display_name' => ($totalQuantity <= 10)
                    ? 'Other EU Countries - Standard Shipping €5 (1-10 tokens)'
                    : 'Other EU Countries - Standard Shipping €10 (11-25 tokens)',
                'delivery_estimate' => [
                    'minimum' => [
                        'unit' => 'business_day',
                        'value' => 5,
                    ],
                    'maximum' => [
                        'unit' => 'business_day',
                        'value' => 10,
                    ],
                ],
            ],
        ],
    ],
    'metadata' => [
        'cart' => $cartMetadata
    ],
];

// Make API request to Stripe
$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_USERPWD, STRIPE_SECRET_KEY . ':');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Stripe-Version: ' . STRIPE_API_VERSION,
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($checkout_session_data));

// For local development: disable SSL verification
// IMPORTANT: Remove this in production or use a proper CA bundle
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
// curl_close is deprecated in PHP 8.5 - no longer needed

// Check for curl errors
if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL error: ' . $curl_error]);
    exit();
}

if ($http_code !== 200) {
    http_response_code($http_code);
    // Stripe errors are already in JSON format
    echo $response;
    exit();
}

$session = json_decode($response, true);

// Check if JSON decode was successful
if ($session === null) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid JSON response from Stripe']);
    exit();
}

// NOTE: Inventory is now reserved via webhook after payment confirmation
// This prevents inventory from being locked for abandoned carts
// See webhook.php for the inventory reservation logic

// Return the session ID to the frontend
echo json_encode([
    'sessionId' => $session['id'] ?? null,
    'url' => $session['url'] ?? null
]);
?>
