<?php

include_once 'global.php';
include 'notification.php';
//include 'honeypot.php';

$wordID = $_GET['wordID'];
$definitionID = $_GET['definitionID'];
$vote = $_GET['vote'];
$groupID = $_GET['groupID'];
$mode = $_GET['mode'];
$language = $_GET['language'];

$user = 'root';
$pass = '';
$db = 'kamusi';

if(!in_array($mode, $acceptedModes)) {
	die("Got a strange mode as input!". $mode);
}



//Increment number of votes for this definition
$sql = 	"UPDATE definitions " .
"SET Votes = Votes + ? " . 
"WHERE ID = ?;";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("ii", $vote, $definitionID);
$stmt->execute();
$stmt->close();



$sql = 	"SELECT UserID, Votes FROM definitions WHERE ID = ?;";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $definitionID);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

$results_array = $result->fetch_assoc();

$user_id = $results_array["UserID"];
$votes = $results_array["Votes"];

$earnedPoints = 1;

//If the definition got 3 votes, we reached consensus and the user gets 10 extra points
if($votes == 3 && $user_id != 'wordnet') {
	$earnedPoints = 11;
//Substract the pending points from the user
	$sql = 	"UPDATE game" . $mode .
	" SET pendingpoints = pendingpoints -10 ". 
	" WHERE userid = ? AND language = ?;";

	$stmt = $mysqli->prepare($sql);
	$stmt->bind_param("si", $user_id, $language);
	$stmt->execute();
	$stmt->close();

	send_notification($user_id, $wordID);
}

//Give the points to the user
/*
$sql = 	"UPDATE game" . $mode .
" SET points = points + " . $earnedPoints . 
", pointsmonth = pointsmonth + " . $earnedPoints ." , pointsweek = pointsweek + " . $earnedPoints .
" WHERE userid = ? AND language = ?;";
echo "sql is : " . $sql;
echo "ûserID " . $user_id;
echo "votes was " . $votes;

$stmt = $mysqli->prepare($sql);
$stmt->bind_param("si", $user_id, $language);
$stmt->execute();
$stmt->close();
*/
addXToPointsInGame($user_id, $language, $mode, $earnedPoints);








//update_user_rating($user_id, $wordID, $groupID);

echo 'Success' . $wordID;

?>
