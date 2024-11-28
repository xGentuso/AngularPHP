<?php

require 'connect.php';

// Get the task ID from the request
$task_id = isset($_GET['id']) ? $_GET['id'] : '';

if(!empty($task_id)) {
    // Sanitize
    $task_id = mysqli_real_escape_string($con, (int)$task_id);
    
    // Delete the task
    $sql = "DELETE FROM `tasks` WHERE `id` = {$task_id} LIMIT 1";

    if(mysqli_query($con, $sql)) {
        http_response_code(200); // Changed from 204 to 200
        echo json_encode(['success' => true]);
    } else {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => mysqli_error($con)]);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No ID provided']);
}
?>