<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'connect.php';

// Get posted data
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)) {
    // Extract the data
    $request = json_decode($postdata);
    
    if ($request === null) {
        error_log('JSON decode failed: ' . json_last_error_msg());
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        exit();
    }

    // Extract task data
    $title = mysqli_real_escape_string($con, trim($request->title));
    $description = mysqli_real_escape_string($con, trim($request->description));
    $due_date = mysqli_real_escape_string($con, trim($request->due_date));
    $priority = mysqli_real_escape_string($con, trim($request->priority));
    $status = mysqli_real_escape_string($con, trim($request->status));

    // Validate required fields
    if(empty($title)) {
        http_response_code(400);
        echo json_encode(['error' => 'Title is required']);
        exit();
    }

    $sql = "INSERT INTO tasks (title, description, due_date, priority, status) 
            VALUES ('$title', '$description', '$due_date', '$priority', '$status')";

    if(mysqli_query($con, $sql)) {
        $id = mysqli_insert_id($con);
        $task = [
            'id' => $id,
            'title' => $title,
            'description' => $description,
            'due_date' => $due_date,
            'priority' => $priority,
            'status' => $status
        ];
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Task created successfully',
            'data' => $task
        ]);
    } else {
        error_log('MySQL Error: ' . mysqli_error($con));
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'error' => 'Task creation failed: ' . mysqli_error($con)
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'No data provided'
    ]);
}
?>