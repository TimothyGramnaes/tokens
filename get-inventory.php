<?php
// Get Inventory API
// Returns current inventory levels for all tokens

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once('inventory.php');

// Get all inventory
$inventory = getAllInventory();

echo json_encode($inventory);
?>
