<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Debug logging
error_log("Request received at: " . date('Y-m-d H:i:s'));
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
error_log("Request headers: " . print_r(getallheaders(), true));

header('Content-Type: application/json; charset=UTF-8');

require 'connect.php';
    
try {
    $tasks = [];
    $sql = "SELECT id, user_id, title, description, due_date, priority, status, image_name, created_at FROM tasks";

    $result = mysqli_query($con, $sql);
    
    if (!$result) {
        throw new Exception("Database query failed: " . mysqli_error($con));
    }

    while($row = mysqli_fetch_assoc($result)) {
        $tasks[] = $row;
    }
    
    error_log("Tasks found: " . count($tasks));
    echo json_encode(['data' => $tasks]);
    
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>