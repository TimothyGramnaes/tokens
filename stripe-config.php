<?php
// Stripe API Configuration
// IMPORTANT: Keep this file secure and never commit to public repositories!

// Your Stripe Secret Key (Test Mode)
// Replace 'sk_test_...' with your actual secret key from Stripe Dashboard
define('STRIPE_SECRET_KEY', 'sk_test_YOUR_SECRET_KEY_HERE');

// Your Stripe Publishable Key (Test Mode)
// Replace 'pk_test_...' with your actual publishable key from Stripe Dashboard
define('STRIPE_PUBLISHABLE_KEY', 'pk_test_51SmXlhHxhwmZv9fp4ctfqLNkrarJrewnMlCCDD2jQahXqhBIig2pN6ajkhaPSEFUj5kGnThY0u5zJw4vYZ3KJP3H00ylE5smbA');

// Your website URL (change this to your actual domain when you go live)
define('SITE_URL', 'http://localhost:8000'); // Change to https://yourdomain.com in production

// Stripe API Version
define('STRIPE_API_VERSION', '2023-10-16');
?>
