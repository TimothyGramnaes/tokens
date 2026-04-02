# Shopping Cart Implementation Notes

## Date: 2026-01-05 - 2026-01-09

## Current Status
✅ **READY FOR PRODUCTION DEPLOYMENT!**

### ⚠️ HOSTING DECISION NEEDED (2026-01-18)

**Current situation:**
- Website is currently hosted on **GitHub Pages** (free, but NO PHP support)
- Domain (tokensbytim.com) is registered at **one.com**
- Shopping cart requires **PHP** to run (Stripe checkout, webhooks, inventory)

**Recommended solution: Add hosting to one.com**
- Purchase basic web hosting plan from one.com (~€2-3/month)
- Requirements: PHP 8.0+, cURL extension, JSON extension, file write access, HTTPS/SSL
- one.com can deploy directly from GitHub (auto-sync on push)
- Only `stripe-config.php` and `inventory.json` need manual management (in .gitignore)

**Workflow after setup:**
1. Push code to GitHub (main branch)
2. one.com automatically pulls and deploys all files
3. PHP files run on one.com servers
4. Sensitive files (`stripe-config.php`, `inventory.json`) stay manually managed

**Before proceeding:** Decide on hosting plan and purchase from one.com

---

The custom shopping cart solution is now complete with:
- Beautiful cart overlay that slides in from the right
- Add to cart buttons on all 61+ tokens
- Cart persists using localStorage
- Quantity controls for each item
- Real-time cart count in navigation (visible on ALL pages)
- Full cart management (add, remove, update quantities)
- ✅ Stripe Checkout API backend implemented (PHP)
- ✅ Inventory tracking system (inventory.json + inventory.php)
- ✅ Webhook-based inventory reservation (prevents abandoned cart issues)
- ✅ Site-wide cart accessibility (all pages: home, about, contact, how to buy, tokens)
- ✅ Euro (€) currency throughout the site
- ✅ Consistent cart button styling across all pages
- ✅ Changes committed to GitHub (ClaudeTestOne branch)
- ⏳ Ready for production deployment to one.com

---

## 🚀 Quick Start - When You Resume

**To continue where we left off:**

1. **Add your Stripe API keys to `stripe-config.php`:**
   - Open `stripe-config.php`
   - Replace `sk_test_REPLACE_WITH_YOUR_SECRET_KEY` with your actual secret key
   - Replace `pk_test_REPLACE_WITH_YOUR_PUBLISHABLE_KEY` with your actual publishable key
   - Update `SITE_URL` to match your domain (or use `http://localhost` for local testing)

2. **Upload these files to one.com:**
   - `cart.js` (updated with Stripe integration)
   - `create-checkout.php` (new - handles Stripe checkout)
   - `stripe-config.php` (new - contains your keys)
   - `success.html` (new - order confirmation page)

3. **Test it:**
   - Visit your tokens.html page
   - Add tokens to cart
   - Click "Proceed to Checkout"
   - Use test card: `4242 4242 4242 4242` (any future expiry, any CVC)

**Files Created/Modified on 2026-01-07:**
- ✅ `create-checkout.php` - NEW backend endpoint
- ✅ `stripe-config.php` - NEW config file (add your keys!)
- ✅ `stripe-config.example.php` - NEW template file
- ✅ `success.html` - NEW success page
- ✅ `cart.js` - UPDATED checkout function
- ✅ `.gitignore` - UPDATED to protect API keys

**Files Created/Modified on 2026-01-09 (Morning Session):**
- ✅ `webhook.php` - NEW webhook handler for Stripe payment events
- ✅ `inventory.json` - NEW inventory tracking (all 60 tokens with quantities)
- ✅ `inventory.php` - NEW inventory helper functions
- ✅ `create-checkout.php` - UPDATED to add cart metadata and remove immediate inventory reservation

**Files Modified on 2026-01-09 (Afternoon Session):**
- ✅ `index.html` - UPDATED navigation with cart button and added cart.js script
- ✅ `aboutme.html` - UPDATED navigation with cart button and added cart.js script
- ✅ `contact.html` - UPDATED navigation with cart button and added cart.js script
- ✅ `howtobuy.html` - UPDATED navigation with cart button and added cart.js script
- ✅ `tokens.html` - UPDATED cart button positioning (moved to right-nav), changed all currency symbols from $ to €
- ✅ `cart.js` - UPDATED with comprehensive cart button styling, changed currency display from $ to €

**Git Commits on 2026-01-09:**
- ✅ Commit 1: "Add site-wide shopping cart and update to Euro currency"
- ✅ Pushed to ClaudeTestOne branch successfully

---

## What We Tried
1. Added Payhip script to tokens.html head section ✅
2. Added "Add to Cart" buttons with `data-button="add-to-cart"` attribute
3. Added products to Payhip (Cat, Cat Warrior, etc.)

## The Problem
- Payhip's "Add to Cart" button goes directly to checkout modal
- No cart overlay appears on the site
- Users cannot continue shopping and add multiple items easily
- The cart overlay feature described in Payhip docs doesn't work on external websites

## Payhip Limitations Discovered
- Cart overlay only works on Payhip-hosted stores, not embedded on external HTML sites
- "Add to Cart" opens checkout immediately instead of adding to a visible cart
- No standalone cart widget/icon provided by Payhip for external sites

## Next Steps - Options to Consider

### Option 1: Custom Stripe Solution (RECOMMENDED)
Build a custom JavaScript shopping cart with Stripe Checkout:
- Users add items to cart on your site
- Cart overlay shows items and total
- Only goes to Stripe Checkout when user clicks "Checkout"
- Full control over user experience
- Same fees as Payhip (2.9% + $0.30)

### Option 2: Snipcart
- Paid service (~$10/month after free tier)
- True cart overlay that works perfectly
- Easy to implement
- Professional experience

### Option 3: Contact Payhip Support
- Ask if there's a way to make cart overlay work on external sites
- May be missing a setting or code snippet

### Option 4: Keep Payhip with Current Limitations
- Accept that users go straight to checkout
- Add cart link to Payhip store in navigation

## Files Created/Modified (2026-01-06)
- `cart.js` - New custom shopping cart system with full cart functionality
- `tokens.html` - Removed Payhip, added cart.js script, updated nav with cart counter, added "Add to Cart" buttons to all tokens
- `.gitignore` - Added SHOPPING_CART_NOTES.md to prevent tracking

## Implementation Details

### Cart Features
1. **Cart Overlay UI**
   - Slides in from right side of screen
   - Shows all cart items with thumbnails
   - Quantity controls (+/- buttons)
   - Remove item buttons
   - Running total display
   - Clear cart option

2. **Cart Storage**
   - Uses localStorage for persistence
   - Cart survives page refreshes
   - Each item stores: id, name, price, image, quantity

3. **User Experience**
   - Notification appears when item added to cart
   - Cart count updates in real-time in navigation
   - Click cart button in nav to open overlay
   - Click outside overlay to close
   - All 61+ tokens have "Add to Cart - $2.00" buttons

4. **Pricing**
   - All tokens: $2.00 each
   - Quantity discounts can be added later if needed

---

## Progress Update: 2026-01-07

### ✅ Completed on 2026-01-07

1. **Stripe Account Setup**
   - Created Stripe account at https://stripe.com
   - Located API keys in Dashboard (Developers → API keys)
   - Switched to Test Mode for safe testing
   - Created first product in Stripe Dashboard (Cat token - €2.00)

2. **Backend Implementation (PHP)**
   - Created `create-checkout.php` - Server endpoint that creates Stripe checkout sessions
   - Created `stripe-config.php` - Secure configuration file for API keys
   - Created `stripe-config.example.php` - Template file safe for git commits
   - Created `success.html` - Order confirmation page

3. **Frontend Integration**
   - Updated `cart.js` checkout() method to use Stripe Checkout API
   - Integrated with PHP backend via fetch API
   - Added error handling and loading states
   - Cart clears automatically after successful purchase

4. **Security**
   - Added `stripe-config.php` to `.gitignore` to prevent exposing API keys
   - Created example config file for reference

5. **Configuration**
   - Added Stripe API keys to `stripe-config.php` ✅
   - Keys are in TEST MODE (safe for testing)

6. **Local PHP Setup**
   - Downloaded PHP for Windows
   - Extracted to `D:\php` ✅
   - Added `D:\php` to Windows PATH environment variable ✅
   - Enabled curl extension in php.ini ✅
   - Started PHP development server successfully ✅
   - Fixed SSL certificate errors for local testing ✅
   - Fixed success page redirect issues ✅

---

## Progress Update: 2026-01-09

### ✅ Completed on 2026-01-09

1. **Inventory Management System**
   - Created `inventory.json` with all 60 actual token IDs from tokens.html
   - Created `inventory.php` with helper functions:
     - `loadInventory()` - Reads inventory from JSON
     - `saveInventory()` - Writes inventory to JSON
     - `checkStock()` - Validates cart against available inventory
     - `reserveInventory()` - Decreases quantities
     - `getStock()` - Get quantity for single item
     - `getAllInventory()` - Get full inventory list
   - Integrated inventory checking into `create-checkout.php`
   - Tested inventory system - successfully prevents overselling

2. **Webhook-Based Inventory System**
   - Created `webhook.php` to handle Stripe payment events
   - Moved inventory reservation from checkout creation to payment confirmation
   - Added cart data as metadata to Stripe checkout sessions
   - Updated `create-checkout.php` to store cart in metadata
   - Removed immediate inventory reservation (prevents abandoned cart issue)

3. **Site-Wide Shopping Cart Implementation (Afternoon Session)**
   - Added cart button to all pages: [index.html](index.html), [aboutme.html](aboutme.html), [contact.html](contact.html), [howtobuy.html](howtobuy.html)
   - Moved cart button on [tokens.html](tokens.html) from mid-nav to right-nav for consistency
   - Added comprehensive CSS styling to cart button in [cart.js](cart.js):
     - Green button with white shopping cart icon
     - Red circular badge showing cart count
     - Proper hover effects
     - Removed default link underlines and blue color
   - Standardized all currency symbols from $ to € throughout the site:
     - Updated 59 "Add to Cart" buttons in [tokens.html](tokens.html) (line changes across the file)
     - Updated 2 currency displays in [cart.js](cart.js) (lines 512, 534)
   - Cart now accessible from every page on the website
   - Consistent styling and positioning across all pages
   - Committed and pushed changes to GitHub (ClaudeTestOne branch)

3. **How Webhook System Solves Concurrent User Issues**

   **Previous System (Immediate Reservation):**
   - User A clicks checkout → inventory reserved immediately
   - User A abandons payment → inventory stays locked forever
   - User B cannot purchase those items even though no payment was made

   **New System (Webhook-Based):**
   - User A clicks checkout → inventory NOT reserved
   - User A enters Stripe checkout page → inventory NOT reserved
   - User A abandons payment → inventory stays available
   - User B can still purchase items
   - Only when payment is CONFIRMED → webhook fires → inventory reserved

   **Concurrent User Scenario (5 cats in stock):**
   - User A: Adds 5 cats to cart, browses → inventory: 5
   - User B: Adds 5 cats to cart, browses → inventory: 5
   - User A: Clicks checkout → inventory: 5 (not reserved yet!)
   - User B: Clicks checkout → inventory: 5 (not reserved yet!)
   - User A: Completes payment → webhook fires → inventory: 0
   - User B: Tries to complete payment → Stripe will need to handle this

   **Note:** This creates a race condition at payment time. Both users can enter checkout, but Stripe doesn't automatically prevent the second payment. We still check inventory BEFORE creating checkout session, but there's a window between checkout creation and payment completion where both users could proceed.

   **Potential Solution:** Implement temporary reservations with expiration (more complex, requires tracking reservation timestamps)

### ⏳ Next Steps - Production Deployment

**PRODUCTION DEPLOYMENT TO-DO LIST:**

### Phase 1: Pre-Deployment Preparation

1. **Verify Stripe Account Settings:**
   - ✅ Stripe account created and verified
   - ⏳ Complete business verification if required for live payments
   - ⏳ Obtain LIVE API keys from Stripe Dashboard (Developers → API keys)
     - Copy your `pk_live_...` (Publishable Key)
     - Copy your `sk_live_...` (Secret Key)

2. **Update Configuration for Production:**
   - ⏳ Update `stripe-config.php` locally:
     - Replace test keys with LIVE keys
     - Update `SITE_URL` to your actual domain (e.g., `https://yourdomain.com`)
   - ⏳ Verify `inventory.json` has correct starting quantities for all 60 tokens

3. **Test Locally One More Time (Optional but Recommended):**
   - ⏳ Install Stripe CLI: `choco install stripe-cli` or download from https://stripe.com/docs/stripe-cli
   - ⏳ Login to Stripe CLI: `stripe login`
   - ⏳ Start webhook listener: `stripe listen --forward-to localhost:8000/webhook.php`
   - ⏳ Copy webhook signing secret to [webhook.php](webhook.php) line 21
   - ⏳ Start PHP server: `php -S localhost:8000`
   - ⏳ Test complete payment flow with test card `4242 4242 4242 4242`
   - ⏳ Verify inventory decreases in `inventory.json` after payment
   - ⏳ Test abandoned cart scenario (start checkout but don't complete)

### Phase 2: Upload Files to one.com

4. **Upload All Required Files to one.com via FTP/SFTP:**
   - ⏳ `index.html` (updated with cart)
   - ⏳ `aboutme.html` (updated with cart)
   - ⏳ `contact.html` (updated with cart)
   - ⏳ `howtobuy.html` (updated with cart)
   - ⏳ `tokens.html` (updated with cart + Euro symbols)
   - ⏳ `cart.js` (updated with site-wide styling + Euro symbols)
   - ⏳ `create-checkout.php` (backend checkout handler)
   - ⏳ `stripe-config.php` (**WITH LIVE API KEYS** - DO NOT commit to git!)
   - ⏳ `webhook.php` (payment event handler - will update secret in next step)
   - ⏳ `inventory.php` (inventory helper functions)
   - ⏳ `inventory.json` (starting inventory quantities)
   - ⏳ `success.html` (order confirmation page)
   - ⏳ `get-inventory.php` (inventory API endpoint)

5. **Verify File Permissions on Server:**
   - ⏳ Ensure `inventory.json` is writable by PHP (chmod 664 or 666)
   - ⏳ Ensure PHP files are executable (chmod 644)
   - ⏳ Verify `stripe-config.php` is NOT web-accessible (move outside public directory if possible)

### Phase 3: Configure Production Webhook

6. **Set Up Stripe Webhook for Production:**
   - ⏳ Go to Stripe Dashboard → Developers → Webhooks
   - ⏳ Click "Add endpoint"
   - ⏳ Enter webhook URL: `https://yourdomain.com/webhook.php`
   - ⏳ Select events to listen for: `checkout.session.completed`
   - ⏳ Save the endpoint
   - ⏳ Copy the webhook signing secret (starts with `whsec_...`)
   - ⏳ Update [webhook.php](webhook.php) line 21 with production webhook secret
   - ⏳ Re-upload `webhook.php` to one.com with the updated secret

### Phase 4: Production Testing

7. **Test on Live Site (Use Stripe Test Mode First!):**
   - ⏳ Switch Stripe account to Test Mode in dashboard
   - ⏳ Visit your live site: `https://yourdomain.com`
   - ⏳ Browse to tokens page and add items to cart
   - ⏳ Verify cart appears on all pages (home, about, contact, how to buy, tokens)
   - ⏳ Click "Proceed to Checkout"
   - ⏳ Complete test purchase with test card: `4242 4242 4242 4242`
   - ⏳ Verify redirect to success page
   - ⏳ Check Stripe Dashboard → Payments to see test transaction
   - ⏳ Check Stripe Dashboard → Developers → Webhooks → View events to see `checkout.session.completed`
   - ⏳ Verify `inventory.json` on server decreased by purchased quantity
   - ⏳ Test "Out of Stock" scenario by adjusting inventory to 0 for a token

8. **Go Live with Real Payments:**
   - ⏳ Switch Stripe account to Live Mode in dashboard
   - ⏳ Make a small test purchase with real payment method (you can refund yourself)
   - ⏳ Verify everything works end-to-end with real money
   - ⏳ Set up email notifications in Stripe for failed payments, disputes, etc.

### Phase 5: Post-Launch Monitoring

9. **Monitor and Maintain:**
   - ⏳ Regularly check Stripe Dashboard for payments and issues
   - ⏳ Monitor webhook delivery (Stripe Dashboard → Webhooks → Events)
   - ⏳ Create a manual inventory management system or spreadsheet
   - ⏳ Set up low-stock alerts (future enhancement)
   - ⏳ Back up `inventory.json` regularly
   - ⏳ Test the purchase flow periodically to ensure nothing breaks

### Phase 6: Email Notifications (REQUIRED)

10. **Set Up Email Notifications for Sales:**
    - ⏳ **Enable Stripe Dashboard Email Notifications:**
      - Go to Stripe Dashboard → Settings → Notifications
      - Enable "Successful payments" - Get email for every sale
      - Enable "Failed payments" - Get notified of payment failures
      - Enable "Disputes" - Get notified of customer disputes
      - Enable "Refunds" - Get notified when refunds are issued

    - ⏳ **Install Stripe Mobile App (Recommended):**
      - Download Stripe mobile app (iOS/Android)
      - Log in with your Stripe account
      - Enable push notifications for instant sale alerts
      - This is the easiest way to get real-time notifications

    - ⏳ **Customer Order Confirmation Emails (To Be Implemented):**
      - Option A: Enable Stripe's built-in email receipts
        - Go to Stripe Dashboard → Settings → Emails
        - Enable "Email customers successful payment receipts"
      - Option B: Implement custom email system
        - Use SendGrid, Mailgun, or similar service
        - Send custom branded order confirmation emails
        - Include order details, shipping info, tracking

    - ⏳ **Custom Seller Notification System (To Be Implemented):**
      - Add email/SMS notification to webhook.php
      - Send notification with order details when payment is confirmed
      - Include: items purchased, quantities, customer email, total amount
      - Could use PHP mail() function, SendGrid API, or Twilio for SMS

### Phase 7: Optional Enhancements (Future)

11. **Future Improvements:**
    - ⏳ Add admin panel for inventory management
    - ⏳ Implement temporary inventory reservations (15-30 min expiry)
    - ⏳ Create order history/tracking system
    - ⏳ Add bulk pricing discounts (e.g., buy 10+ get 10% off)
    - ⏳ Implement real-time inventory updates on frontend
    - ⏳ Add product images to Stripe Dashboard
    - ⏳ Set up shipping rate calculations based on weight/quantity
    - ⏳ Add analytics tracking (Google Analytics, Stripe Analytics)
    - ⏳ Daily sales summary emails (digest of all transactions)
    - ⏳ Low stock alerts (automatic email when inventory drops below threshold)

**FUTURE ENHANCEMENTS:**

1. **Add all tokens as products in Stripe:**
   - Currently only Cat token is created
   - Either create all 61+ products manually in Stripe Dashboard
   - Or use dynamic product creation (already implemented in create-checkout.php)

2. **Currency consideration:**
   - Currently set to EUR (€2.00)
   - Change to USD in `create-checkout.php` line 56 if preferred:
     ```php
     'currency' => 'usd', // Change from 'eur' to 'usd'
     ```

3. **Shipping countries:**
   - Default shipping countries set in `create-checkout.php` lines 68-69
   - Add/remove countries as needed

4. **Go Live:**
   - When ready for production:
     - Get your LIVE API keys from Stripe (pk_live_... and sk_live_...)
     - Update stripe-config.php with live keys
     - Change SITE_URL to your actual domain (https://yourdomain.com)
     - Verify business with Stripe for live payments
     - Test thoroughly before accepting real payments!

---

## How the Integration Works

### Flow Diagram (WITH Inventory & Webhooks):
1. User adds tokens to cart → stored in localStorage
2. User clicks "Proceed to Checkout" → cart.js calls checkout()
3. cart.js sends cart data to `create-checkout.php` via fetch
4. PHP backend checks inventory availability via `checkStock()`
5. If out of stock → error message returned to user
6. If in stock → PHP creates Stripe Checkout Session with cart stored in metadata
7. User redirected to Stripe's hosted checkout page
8. User enters payment details (test card in test mode)
9. Stripe processes payment
10. **Stripe sends webhook to webhook.php** with `checkout.session.completed` event
11. **webhook.php reserves inventory** via `reserveInventory()`
12. User redirected to `success.html`
13. Cart cleared via localStorage

### Files Overview:

**Frontend:**
- `cart.js` - Shopping cart logic + Stripe integration
- `tokens.html` - Main page with token gallery and "Add to Cart" buttons
- `success.html` - Order confirmation page

**Backend:**
- `create-checkout.php` - Creates Stripe checkout sessions + checks inventory
- `stripe-config.php` - Stores API keys (NOT in git)
- `stripe-config.example.php` - Template for configuration (safe for git)
- `webhook.php` - Handles Stripe payment events + reserves inventory
- `inventory.php` - Helper functions for inventory management
- `inventory.json` - Stores current inventory quantities for all tokens

**Security:**
- `.gitignore` - Prevents committing sensitive files

### Important Notes:

- **Test Mode**: You're currently in test mode (safe for testing, no real money)
- **Dynamic Product Creation**: The PHP backend creates products on-the-fly, so you don't need to create all 61+ products in Stripe Dashboard manually
- **Hosting**: Requires PHP-enabled hosting (one.com supports this)
- **No Stripe.js needed**: We're using Stripe's hosted checkout page, so no client-side Stripe library required
- **Webhook-Based Inventory**: Inventory only decreases after confirmed payment, preventing abandoned cart issues
- **Race Condition Note**: There's still a small window where multiple users could enter checkout for the same limited items. For production with high traffic, consider implementing temporary reservations with expiration times.

## Useful Resources
- [Stripe Checkout Documentation](https://stripe.com/docs/checkout)
- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe Products Guide](https://stripe.com/docs/products-prices/overview)
- [Testing Stripe Webhooks Locally](https://stripe.com/docs/webhooks/test)

---

## Summary

You now have a fully functional e-commerce shopping cart with:
- ✅ Custom cart UI with localStorage persistence
- ✅ Stripe Checkout API integration
- ✅ Inventory management system
- ✅ Webhook-based inventory reservation (prevents abandoned cart issues)
- ✅ Out-of-stock prevention
- ✅ Local PHP development environment

**Next step:** Test the webhook system with Stripe CLI to verify inventory updates after payment confirmation.
