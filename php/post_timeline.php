<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');
$userID = $_GET['userID'];


// USING ROOT IS A SECURITY CONCERN

$user = 'root';
$pass = '';
$db = 'kamusi';

$WordTweetsSinceLastPost= 41;

$mysqli = new mysqli('localhost', $user, $pass, $db);
$stmt = $mysqli->prepare("SELECT DoPost, WordTweetsSinceLastPost  FROM users WHERE  UserID = ?;");
$stmt->bind_param("s", $userID);
$stmt->execute();
$stmt->bind_result($DoPost,$WordTweetsSinceLastPost );
$stmt->fetch();
$stmt->close(); 
$returnValue = array();
if($DoPost==1) {

	$stmt = $mysqli->prepare("UPDATE users SET WordTweetsSinceLastPost=0  WHERE  UserID = ?;");
	$stmt->bind_param("s", $userID);
	$stmt->execute();
	$stmt->close(); 

	$stmt = $mysqli->prepare("UPDATE users SET DoPost=0  WHERE  UserID = ?;");
	$stmt->bind_param("s", $userID);
	$stmt->execute();
	$stmt->close(); 
}
else {
	$WordTweetsSinceLastPost= 0;	
}
echo json_encode($WordTweetsSinceLastPost);

?>
