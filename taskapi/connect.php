<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// db credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'Shineteam00');
define('DB_NAME', 'task_manager');

// Connect with the database.
function connect()
{
  $connect = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

  if (mysqli_connect_errno()) {
    die("Failed to connect: " . mysqli_connect_error());
  }

  mysqli_set_charset($connect, "utf8");
  return $connect;
}

$con = connect();
?>