<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');
$wordID = $_GET['wordID'];
$amount = $_GET['amount'];


    $sql =  "SELECT ID As ID, DefinitionID As DefinitionID, Rank As Rank FROM (";
    $sql.=  "SELECT w.ID, w.DefinitionID, r.Rank FROM rankedwords As r LEFT JOIN words As w ON r.Word = w.Word";
    $sql.=  ") As sq WHERE sq.ID IS NOT NULL AND sq.DefinitionID IS NOT NULL AND sq.ID NOT IN (SELECT WordID FROM seengame".$mode." WHERE (userid=? OR userid=?) AND language = ?) AND sq.Rank = ? LIMIT 1;";

77coNTineub Llqetgj4SKtrgjevS
$sql = "SELECT DISTINCT sentenceid, sentence AS Text FROM TweetContext WHERE WordID= ?;";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s", $wordID );
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

$results_array = array();

while ($row = $result->fetch_assoc()) {
    $results_array[] = $row;
}



$jsonData = json_encode($results_array);

switch (json_last_error()) {
    case JSON_ERROR_NONE:            
    break;
    case JSON_ERROR_DEPTH:
    echo ' - Maximum stack depth exceeded';
    break;
    case JSON_ERROR_STATE_MISMATCH:
    echo ' - Underflow or the modes mismatch';
    break;
    case JSON_ERROR_CTRL_CHAR:
    echo ' - Unexpected control character found';
    break;
    case JSON_ERROR_SYNTAX:
    echo ' - Syntax error, malformed JSON';
    break;
    case JSON_ERROR_UTF8:
    echo ' - Malformed UTF-8 characters, possibly incorrectly encoded';
    break;
    default:
    echo ' - Unknown error';
    break;
}

echo $jsonData;

?>