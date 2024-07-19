<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "robotcontrol";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $content = $conn->real_escape_string($_POST['content']);

    $sql = "INSERT INTO content (textContent) VALUES ('$content')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
