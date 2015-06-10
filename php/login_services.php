<?php
//1) Connect, see if you have a session_id and session_name

function connect($session_name, $session_id, $csrf_token, $base_url) {
	$connectHeaders = array();
	if ($csrf_token !== '' || $csrf_token !== 'undefined') {
		$connectHeaders['X-CSRF-Token'] = $csrf_token;
	};

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $base_url . "/facebook_game_v1/system/connect.json");
	curl_setopt($ch, CURLOPT_POST, 1);
	//data type is json. HAve to set cache, tieout?

	curl_setopt($ch, CURLOPT_FRESH_CONNECT, TRUE); //equivalent to cache: false
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT ,30000); 

	curl_setopt($ch, CURLOPT_HTTPHEADER, $connectHeaders);

	$data = curl_exec($ch); 
	echo "HEEEEEEEEERe"

	if (curl_errno($ch)) { 
		print "Error: " . curl_error($ch); 
	}
	else { 
            // Show me the result 
		echo "Connect BEGIN";
		var_dump($data); 
		echo "Connect END";
		curl_close($ch); 
	}
}

//2) If Anonymous == uid<0, you need to login

function login($sess_user, $sess_pass, $base_url) {

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $base_url . "/facebook_game_v1/system/connect.json");
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_FRESH_CONNECT, TRUE); //equivalent to cache: false
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT ,30000); 

	$data = array();
	$data['name']=$sess_user;
	$data['username'] = $sess_user;
	$data['pass'] = $sess_pass;
	$data['password'] = $sess_pass;

 	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

 	if (curl_errno($ch)) { 
		print "Error: " . curl_error($ch); 
	}
	else { 
            // Show me the result 
		echo "Login BEGIN";

		var_dump($data); 
	//	storeUserData($base_url, $result.user.uid, $result.session_name, result.sessid, csrf_token);
		echo "Login END";


		curl_close($ch); 
	}
}

function storeUserData($base_url, $uid, $session_name, $session_id, $csrf_token) {
		global $kamusiUser;
		$kamusiUser['base_url'] = $base_url;
		$kamusiUser['uid'] = $uid;
		$kamusiUser['session_name'] = $session_name;
		$kamusiUser['session_id'] = $session_id;
		$kamusiUser['csrf_token'] = $csrf_token;
}