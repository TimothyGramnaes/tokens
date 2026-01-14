<?php
// Stripe API Configuration - EXAMPLE FILE
// Copy this file to 'stripe-config.php' and add your actual keys

// Your Stripe Secret Key (Test Mode)
// Get this from: Stripe Dashboard → Developers → API keys
define('STRIPE_SECRET_KEY', 'sk_test_YOUR_SECRET_KEY_HERE');

// Your Stripe Publishable Key (Test Mode)
// Get this from: Stripe Dashboard → Developers → API keys
define('STRIPE_PUBLISHABLE_KEY', 'pk_test_YOUR_PUBLISHABLE_KEY_HERE');

// Your website URL
// For local testing: http://localhost
// For production: https://yourdomain.com
define('SITE_URL', 'http://localhost');

// Stripe API Version
define('STRIPE_API_VERSION', '2023-10-16');
?>
