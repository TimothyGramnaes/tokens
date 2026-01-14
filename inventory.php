<?php
// Inventory Management Helper Functions
// Handles reading, checking, and updating inventory quantities

$INVENTORY_FILE = __DIR__ . '/inventory.json';

// Load inventory from JSON file
function loadInventory() {
    global $INVENTORY_FILE;

    if (!file_exists($INVENTORY_FILE)) {
        return [];
    }

    $json = file_get_contents($INVENTORY_FILE);
    return json_decode($json, true) ?? [];
}

// Save inventory to JSON file
function saveInventory($inventory) {
    global $INVENTORY_FILE;

    $json = json_encode($inventory, JSON_PRETTY_PRINT);
    return file_put_contents($INVENTORY_FILE, $json) !== false;
}

// Get stock quantity for a specific item
function getStock($itemId) {
    $inventory = loadInventory();
    return $inventory[$itemId] ?? 0;
}

// Check if items are in stock
function checkStock($items) {
    $inventory = loadInventory();
    $outOfStock = [];

    foreach ($items as $item) {
        $itemId = $item['id'];
        $requestedQty = $item['quantity'];
        $availableQty = $inventory[$itemId] ?? 0;

        if ($availableQty < $requestedQty) {
            $outOfStock[] = [
                'id' => $itemId,
                'name' => $item['name'],
                'requested' => $requestedQty,
                'available' => $availableQty
            ];
        }
    }

    return $outOfStock;
}

// Reserve inventory (decrease quantities)
function reserveInventory($items) {
    $inventory = loadInventory();

    foreach ($items as $item) {
        $itemId = $item['id'];
        $quantity = $item['quantity'];

        if (isset($inventory[$itemId])) {
            $inventory[$itemId] -= $quantity;

            // Ensure it doesn't go negative
            if ($inventory[$itemId] < 0) {
                $inventory[$itemId] = 0;
            }
        }
    }

    return saveInventory($inventory);
}

// Update a single item's inventory
function updateItemInventory($itemId, $quantity) {
    $inventory = loadInventory();
    $inventory[$itemId] = max(0, $quantity); // Ensure non-negative
    return saveInventory($inventory);
}

// Get all inventory
function getAllInventory() {
    return loadInventory();
}
?>
