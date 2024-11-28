<?php
require 'connect.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)) {
    // Extract the data.
    $request = json_decode($postdata);

    // Validate.
    if(!isset($request->id) || 
       trim($request->title) === '' || 
       trim($request->description) === '') {
        return http_response_code(400);
    }

    // Sanitize.
    $id = mysqli_real_escape_string($con, (int)$request->id);
    $title = mysqli_real_escape_string($con, trim($request->title));
    $description = mysqli_real_escape_string($con, trim($request->description));
    $due_date = mysqli_real_escape_string($con, trim($request->due_date));
    $priority = mysqli_real_escape_string($con, trim($request->priority));
    $status = mysqli_real_escape_string($con, trim($request->status));
    $image_name = isset($request->image_name) ? 
                 mysqli_real_escape_string($con, trim($request->image_name)) : null;

    // Update.
    $sql = "UPDATE `tasks` SET 
            `title`='$title',
            `description`='$description',
            `due_date`='$due_date',
            `priority`='$priority',
            `status`='$status'" .
            ($image_name ? ", `image_name`='$image_name'" : "") .
            " WHERE `id` = '{$id}' LIMIT 1";

    if(mysqli_query($con, $sql)) {
        $task = [
            'id' => $id,
            'title' => $title,
            'description' => $description,
            'due_date' => $due_date,
            'priority' => $priority,
            'status' => $status,
            'image_name' => $image_name
        ];
        
        echo json_encode([
            'success' => true,
            'data' => $task,
            'message' => 'Task updated successfully'
        ]);
    } else {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Task update failed: ' . mysqli_error($con)
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request data'
    ]);
}
?>