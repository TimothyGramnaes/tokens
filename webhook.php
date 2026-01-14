<?php
// Stripe Webhook Handler
// This file receives events from Stripe and updates inventory after confirmed payments

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json');

// Load configuration
require_once('stripe-config.php');
require_once('inventory.php');

// Get the webhook payload
$payload = file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

// Webhook signing secret (get this from Stripe Dashboard after creating webhook)
// For local testing, you'll get this from Stripe CLI
$endpoint_secret = 'whsec_...'; // TODO: Replace with your actual webhook secret

// Verify the webhook signature
try {
    // For production, you should verify the signature properly
    // For now, we'll parse the event directly
    $event = json_decode($payload, true);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid payload']);
    exit();
}

// Log the event for debugging
error_log('Webhook received: ' . $event['type']);

// Handle the event
switch ($event['type']) {
    case 'checkout.session.completed':
        $session = $event['data']['object'];

        // Check if payment was successful
        if ($session['payment_status'] === 'paid') {
            // Get the cart items from metadata
            $cartJson = $session['metadata']['cart'] ?? null;

            if ($cartJson) {
                $items = json_decode($cartJson, true);

                if ($items) {
                    // Reserve the inventory
                    $inventoryReserved = reserveInventory($items);

                    if ($inventoryReserved) {
                        error_log('Inventory reserved for session: ' . $session['id']);
                    } else {
                        error_log('Failed to reserve inventory for session: ' . $session['id']);
                    }
                } else {
                    error_log('Failed to decode cart metadata for session: ' . $session['id']);
                }
            } else {
                error_log('No cart metadata found for session: ' . $session['id']);
            }
        }
        break;

    case 'checkout.session.expired':
        // Optional: Handle expired sessions
        // You could implement a reservation system and release reserved items here
        error_log('Checkout session expired: ' . $event['data']['object']['id']);
        break;

    default:
        // Unexpected event type
        error_log('Unhandled event type: ' . $event['type']);
}

// Return a 200 response to acknowledge receipt of the event
http_response_code(200);
echo json_encode(['received' => true]);
?>
