
var userID = "???" //"???"; //so that it works offline:  10203265649994971
var wordID;
var word;
var definitionID;
var groupID;
var amountOfTweets;
var amountGame4;

//settings saved
var whenToPost;
var whenToNotify;
var menuLanguage;

//var to remember the current language
var gameLanguage;
//remember which game is currently played
var game = 0;


var translationID;

var last20Tweets = {}
var lastSwahiliSentences = {}


function get_random() {
	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("getting the data : " + xmlhttp.responseText)
    		obj = JSON.parse(xmlhttp.responseText);
    		document.getElementById("word").innerHTML = obj.Word;
    		document.getElementById("definition").innerHTML = obj.Definition;
    	}
    }
    xmlhttp.open("GET","php/get_random.php", true);
    xmlhttp.send();
}

function get_randomForTweets() {
	console.log("In random for tweets function with userId: " + userID)
    //remove previous tweet entries
    document.getElementById("twitterWords").innerHTML = '';

    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("JSON DATA LOOKS LIKE : " +xmlhttp.responseText)
    		obj = JSON.parse(xmlhttp.responseText);
    		console.log("response was : " + xmlhttp.responseText);
    		console.log("getting the data in random for tweets : " + obj[0].Word);
    		groupID = obj[0].GroupID;
    		wordID = obj[0].WordID;
    		word = obj[0].Word;

    		console.log("All the details : " + groupID + word + wordID + obj[0].Definition + obj[0].PartOfSpeech )

    		if(groupID == '' || wordID == '' || word == '' || obj[0].Definition == '' || obj[0].PartOfSpeech == '') {
    			console.log("Fields are undefined when fetching a word, fetching the next word.")
    			get_randomForTweets();
    		}
    		else {
    			console.log("word id BeCaAAAME : " + wordID)
    			document.getElementById("word3").innerHTML = obj[0].Word;

    			document.getElementById("def3").innerHTML = obj[0].Definition;
    			document.getElementById("pos3").innerHTML = obj[0].PartOfSpeech;


    			console.log("getting the data in EXECUTEDSFWEC : " + obj[0].Word);
    			fetchTweetsFromDB(20);
    		}
    	}
    }

    xmlhttp.open("GET","php/get_ranked.php?userID=" + userID + "&language=" + gameLanguage + "&mode=" +'3', true);
 //xmlhttp.open("GET","php/get_ranked_debug.php?userID=" + userID, true);

 xmlhttp.send();
}

function getRankedForSwahili() {

	document.getElementById("twitterWords").innerHTML = '';
	wordID= 12345;

	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("JSON DATA LOOKS LIKE : " +xmlhttp.responseText)
    		obj = JSON.parse(xmlhttp.responseText);
    		console.log("response was : " + xmlhttp.responseText);


    		console.log("All the details : " + groupID + word + wordID + obj[0].Definition + obj[0].PartOfSpeech )

    		console.log("word id BeCaAAAME : " + wordID)
    		document.getElementById("word4").innerHTML = "simama";
    		document.getElementById("pos4").innerHTML = "Verb";
    		document.getElementById("transEnglish4").innerHTML = "Have or maintain an upright position, supported by one's feet.";
    		document.getElementById("defSwahili4").innerHTML = "Kuwa wima juu ya miguu";

    		queryHelsinkiDBForSentences("simama", 3)

    	}
    }

    xmlhttp.open("GET","php/get_ranked_debug.php?userID=" + userID, true);

    xmlhttp.send();
}

function queryHelsinkiDBForSentences(keyword, amount){
	console.log("Querying the helsinki DB...")
	amountGame4=amount
	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("Returned from helsinki query: ")
    		console.log(xmlhttp.responseText);
    		var results_array = JSON.parse(xmlhttp.responseText);
    		for( i = 0; i<amount ;i++) {
    			last20Tweets[i] = results_array[i];
    			lastSwahiliSentences[i] = results_array[i];
    			displayTextWithCheckboxes(lastSwahiliSentences[i],i,"swahiliSentences")               

    		}
    	}
    }
    xmlhttp.open("GET","php/get_swahiliSentences.php?keyword=" + keyword + "&amount=" + amount, true);
    xmlhttp.send();  
}

function get_tweets(alreadyDisplayed) {
	console.log("inside the tweets function: ")

	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("RESPONSE TEXT : " + xmlhttp.responseText + " END RESPONSE TEXT")
    		var results_array = JSON.parse(xmlhttp.responseText);

    		var listOfAll = results_array.filter(function(elem, pos) {
    			return results_array.indexOf(elem) == pos;
    		});
    		realIndex = 0
    		listOfAll.forEach( function(elem,pos) {
    			realIndex = alreadyDisplayed + pos;
    			last20Tweets[realIndex] = elem;
    			displayTextWithCheckboxes(elem.Text,realIndex,"twitterWords")
    		}
    		);


    		if(realIndex == 0){
    			get_randomForTweets();
    			console.log("Nothing found for this keyword")
    		}

    	}
    }
    xmlhttp.open("GET","php/get_tweets.php?keyword=" + encodeURIComponent(word) + "&amount=" + (amountOfTweets - alreadyDisplayed));

    xmlhttp.send();
}

function displayTextWithCheckboxes(elemText, index, whereToInsert){


	var tweetDisplay = document.createElement("P");
	tweetDisplay.id = "tweetDisplay" + index;
	tweetDisplay.name = "elem" ;
	tweetDisplay.type = "text";

	var newInput = document.createElement("INPUT");
	newInput.id = "checkbox" + index;
	newInput.name = "checkbox" ;
	newInput.type = "checkbox";
	newInput.onchange=function(){
		changeColorOnClick(tweetDisplay,newInput);
	}

	var t = document.createTextNode(elemText);
	console.log("STYLEEEEE " + tweetDisplay.style.color)
	tweetDisplay.appendChild(newInput);
	tweetDisplay.appendChild(t);
	document.getElementById(whereToInsert).appendChild(tweetDisplay);
}

function fetchTweetsFromDB(amount) {
	amountOfTweets = amount;
	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {


    		console.log("REsPONSE : " + xmlhttp.responseText + "End response");

    		var results_array = JSON.parse(xmlhttp.responseText);
    		var i = 0
    		for( i = 0; i<amount && typeof results_array[i] !== 'undefined'; i++) {
    			last20Tweets[i] = results_array[i];
    			displayTextWithCheckboxes(last20Tweets[i].Text,i,"twitterWords")
    		}
    		console.log("this was i " + i + ", this is amount : " + amount);
    		if(i < amountOfTweets) {
    			get_tweets( i);
    		}
    	}
    }
    console.log("WORD ID IS : "+ wordID)

    xmlhttp.open("GET","php/fetch_tweet_db.php?wordID=" + wordID + "&amount=" + amount);

    xmlhttp.send();


}

function submitCheckBoxData(whatToSubmit) {
	if(whatToSubmit == "tweet"){

		for(var i= 0; i < amountOfTweets; i++) {
			if(document.getElementById("checkbox"+i).checked) {
				sendTweetToDB(last20Tweets[i],1)
			}
			else {
				sendTweetToDB(last20Tweets[i],-1);
			}
		}
	}
	else if (whatToSubmit == "game4")  {

		for(var i= 0; i < amountGame4; i++) {
			if(document.getElementById("checkbox"+i).checked) {
				sendGame4SentenceToDB(lastSwahiliSentences[i],1)
			}
			else {
				sendGame4SentenceToDB(lastSwahiliSentences[i],-1);
			}
		}
	}
	if(whenToNotify == "0"){
		trigger_notification()
	}

	post_timeline();
}

function displayNextNCheckboxes(game, amount) {

    //TODO try out the behavior of thw game with multiple users simultaneously
    //First, fetch the necessary text from the DB

    switch(game) {
    	case '3':
        //Do stuff for tweets
        break;

        case '4':
        //For the swahili helsinki corpus game
        
        //fetch amount from DB



        break;
        default: 
        break;
    }
}

function fetchNFromDB(amount, game){
 switch(game) {
    case '3':
        //Do stuff for tweets
        displayCheckBoxType="twitterWords"
        beginningOfUrl= "php/fetch_tweet_db.php?wordID=";


        break;

        case '4':
        //For the swahili helsinki corpus game
        displayCheckBoxType="swahiliSentences"
        beginningOfUrl= "php/fetch_game4_db.php?wordID=";

        break;
        default: 
        break;
    }


    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {


            console.log("REsPONSE : " + xmlhttp.responseText + "End response");

            var results_array = JSON.parse(xmlhttp.responseText);
            var i = 0
            for( i = 0; i<amount && typeof results_array[i] !== 'undefined'; i++) {
                last20Tweets[i] = results_array[i];
                displayTextWithCheckboxes(last20Tweets[i].Text,i,displayCheckBoxType)
            }
            console.log("this was i " + i + ", this is amount : " + amount);
            if(i < amount) {
                fetchMore(game, i);
            }
        }
    }
    console.log("WORD ID IS : "+ wordID)

    xmlhttp.open("GET",beginningOfUrl + wordID + "&amount=" + amount);

    xmlhttp.send();


}   


function fetchMore(game, amount){

}



function sendGame4SentenceToDB(sentence, good){
	console.log("Sending swahili results to DB:...")
	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("DB esponse was:  : " + xmlhttp.responseText)
    	}
    }
    /* TODO: Continue
    var json_data= {"wordID":wordID, "sentence":tweet.TweetID, "tweetText":tweet.Text, "userID":userID, "mode":game, "language":gameLanguage, "tweetAuthor":tweet.Author, "good" : good    }

    $.ajax({
        type: 'POST',
        url: 'php/submit_tweet.php',
        data: {json: JSON.stringify(json_data)},
        dataType: 'json'
    })
    .done( function( data ) {
        console.log('done');
    })
    .fail( function( data ) {
        console.log('fail');
        console.log(data);
    });*/

}

function sendTweetToDB(tweet, good){
	var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        	xmlhttp=new XMLHttpRequest();
        }
        else {// code for IE6, IE5
        	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function() {
        	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        		console.log("DB esponse was:  : " + xmlhttp.responseText)
        	}
        }

        var json_data= {"wordID":wordID, "tweetID":tweet.TweetID, "tweetText":tweet.Text, "userID":userID, "mode":game, "language":gameLanguage, "tweetAuthor":tweet.Author, "good" : good    }

        $.ajax({
        	type: 'POST',
        	url: 'php/submit_tweet.php',
        	data: {json: JSON.stringify(json_data)},
        	dataType: 'json'
        })
        .done( function( data ) {
        	console.log('done');
        })
        .fail( function( data ) {
        	console.log('fail');
        	console.log(data);
        });

    }

    function get_ranked() {

    	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("LALALAL : " + xmlhttp.responseText)
    		var results_array = JSON.parse(xmlhttp.responseText);

    		clear_definitions();
    		wordID = results_array[0].WordID;
    		groupID = results_array[0].GroupID;
            // if(results_array[0].Consensus == 1) {
            //     set_consensus_word(results_array[0].Word, results_array[0].PartOfSpeech, results_array[0].Definition);
            //     add_definition(results_array[0].DefinitionID, '✓ That is a good definition');
            //     for(var i = 1; i < results_array.length; i++) {
            //         if(results_array[i].Definition != undefined) {
            //             add_definition(results_array[i].DefinitionID, results_array[i].Definition);
            //         }
            //     }
            // }
            // else {
            	set_word(results_array[0].Word, results_array[0].PartOfSpeech);
            	add_definition(-1, "? I can't say - skip this one...", false);

            	document.getElementById("consensus").innerHTML = "General Sense:";

            	for(var i = 0; i < results_array.length ; i++) {
            		if(results_array[i].Author == 'wordnet') {
            			set_consensus(results_array[i].Definition);
            			add_definition(results_array[i].DefinitionID, "▶ Keep the General Sense. It's a good definition as is!", false);
            		}
            	}
            	for(var i = 0; i < results_array.length; i++) {

            		if(results_array[i].Definition != undefined && results_array[i].Author != 'wordnet') {
            			add_definition(results_array[i].DefinitionID, "▶ " + results_array[i].Definition, true);
            		}
            	}
            // }
            definitionID = -1;
        }
    }
    xmlhttp.open("GET","php/get_ranked.php?userID=" + userID + "&language=" + gameLanguage + "&mode=" +'1', true);
//xmlhttp.open("GET","php/get_ranked_debug.php?userID=" + userID, true);

xmlhttp.send();
}

function submit_definition(definition) {
	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("submit definition returns : " + xmlhttp.responseText)
    	}

    }
    console.log("When submitting definition, wordID is : " + wordID)
    xmlhttp.open("GET","php/submit_definition.php?wordID=" + wordID + "&groupID=" + groupID  + "&definition=" + definition + "&userID=" + userID + "&mode=" + game + "&language=" + gameLanguage, true);
    xmlhttp.send();
}

function isNewUser() {

	console.log("Checking if New USER")

	if(userID == "???"){
		console.log("Waiting until becoming defined!" + userID)
	}
	else {
		console.log("Defined!" + userID)

		var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("RETURNED : " + xmlhttp.responseText)
    		obj = JSON.parse(xmlhttp.responseText);
    		console.log("REPONSE NEW USER : " + xmlhttp.responseText);
    		initialise(userID);
    		if(xmlhttp.responseText == "1") {
    			animate_logo();

    		}
    		else {
    			animate_logo_firstTime(); 
    		}
    	}
    }
    xmlhttp.open("GET","php/check_user.php?userID=" + userID + "&userName=" + userName);
    xmlhttp.send();
}
}

function get_user_stats() {
	console.log(  "GET USER STATS")
	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            //alert(xmlhttp.responseText);
            var obj = JSON.parse(xmlhttp.responseText);
            whenToNotify = obj.NotificationTimeUnit
            whenToPost = obj.PostTimeUnit
            menuLanguage= obj.Language -1;
            gameLanguage = obj.Language;
            console.log("The game language is now : " + gameLanguage);

            document.getElementById('notifications').selectedIndex = whenToNotify 
            document.getElementById('posts').selectedIndex= whenToPost
            document.getElementById('language').selectedIndex= menuLanguage

        }
    }
    xmlhttp.open("GET","php/get_profile.php?userID=" + userID + "&token=" + token, true);
    xmlhttp.send();
}

function getGameScore(){
	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("getGameScore returned this : " + xmlhttp.responseText)
    		var obj = JSON.parse(xmlhttp.responseText);

    		set_profile_data(obj.points, obj.pendingpoints, obj.points / ( parseInt(obj.submissions) + 1));

    	}
    }
    console.log("language is : " + menuLanguage)
    xmlhttp.open("GET","php/get_game_score.php?userID=" + userID + "&mode=" + game + "&language=" + gameLanguage, true);
    xmlhttp.send();    
}

function get_user_trophies() {
    /*var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var results_array = JSON.parse(xmlhttp.responseText);
            if(results_array != undefined) {
                for(var i = 0; i < results_array.length; i++) {
                    if(results_array[i].Definition != undefined) {
                        add_trophy(results_array[i].Word, results_array[i].Definition);
                    }
                }
            }
        }
    }
    xmlhttp.open("GET","php/get_trophies.php?userID=" + userID, true);
    xmlhttp.send();*/
}

function submit_vote(definition_id, vote) {
	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");

    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("Submit_Vote returned : " + xmlhttp.responseText)
    	}
    }
    console.log("WordID when submitting Vote : " + wordID)

    xmlhttp.open("GET","php/submit_vote.php?wordID=" + wordID + "&definitionID=" + definition_id + "&vote=" + vote + "&groupID=" + groupID + "&mode=" + game + "&language=" + gameLanguage, true);
    xmlhttp.send();
}

function report_spam() {
	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");


    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {

    		alert("A spam report has been sent! Thanks!" + xmlhttp.responseText)
    	}
    }
    xmlhttp.open("GET","php/report_spam.php?wordID=" + wordID + "&definitionID=" + definitionID + "&userID=" + userID, true);
    xmlhttp.send();
}

function complete_notification() {
	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open("GET","php/complete_notification.php?userID=" + userID, true);
    xmlhttp.send();
}

function get_ranked_mode_2() {
	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("GEt ranked2 : " + xmlhttp.responseText)
    		obj = JSON.parse(xmlhttp.responseText);
    		document.getElementById("translation_word").innerHTML = obj[0].Word;
    		document.getElementById("translation_pos").innerHTML = obj[0].PartOfSpeech;
    		document.getElementById("translation_definition").innerHTML = "General Sense: " + obj[0].Definition;

    		var underscored_word = obj[0].Word.replace(" /g", "_");

    		document.getElementById("wiktionary").href = "https://en.wiktionary.org/wiki/" + underscored_word;
    		document.getElementById("dictionary").href = "http://dictionary.reference.com/browse/" + underscored_word;
    		document.getElementById("wordnik").href = "https://www.wordnik.com/words/" + underscored_word;
    		translationID = obj[0].ID;

            // var newBottom = document.getElementById("translation_entry").getBoundingClientRect().bottom;
            // var intString = (newBottom + 100).toString() + "px";
            // document.getElementById("translation_input_tool_box").style.top="100px";
        }
    }
    xmlhttp.open("GET","php/get_ranked.php?userID=" + userID + "&language=" + gameLanguage + "&mode=" +'2', true);
    xmlhttp.send();
}

function submit_translation(translation) {
	var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    var noCache = new Date().getTime();
    xmlhttp.open("GET","php/submit_translation.php?translation=" + translation + "&wordID=" + translationID + "&userID=" + userID + "&noCache=" + noCache + "&language=" + gameLanguage + "&mode=" +'2', true);
    xmlhttp.send();
}

function saveSettings() {
	console.log("Begin save settings")
	whenToNotify = document.getElementById("notifications").selectedIndex;
	whenToPost = document.getElementById("posts").selectedIndex;
	menuLanguage = document.getElementById("language").selectedIndex
	gameLanguage = menuLanguage +1;
	var xmlhttp;

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("END save settings : " + xmlhttp.responseText)
    	}
    }
    console.log("Sending LANG : " + language)
    xmlhttp.open("GET","php/save_settings.php?userID=" + userID + "&notify=" + whenToNotify + "&post=" + whenToPost + "&language=" + gameLanguage);
    xmlhttp.send();
}

function post_timeline() {
	var xmlhttp;

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		obj = JSON.parse(xmlhttp.responseText);
    		console.log("# of new definitions from user : " + obj)
    		if(obj == 0){
    			console.log("No activity to post")
    		}
    		else {

    			publishStory(obj)
    		}
    	}
    }

    xmlhttp.open("GET","php/post_timeline.php?userID=" + userID); 
    xmlhttp.send();   
}

function trigger_notification() {
	var xmlhttp;
	console.log("In trigger notification")

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("NOTIFICATION RESPONSE" + xmlhttp.responseText)

    	}
    }

    xmlhttp.open("GET","php/notification_tweet.php?userID=" + userID); 
    xmlhttp.send();   
}

function updateLeaderboard(){

	languageSelect = document.getElementById("scoreLanguage");
	scoreLanguage = languageSelect.selectedIndex;
	gameSelect = document.getElementById("scoreGame");
    scoreGame= gameSelect.selectedIndex;
	timePeriodSelect = document.getElementById("scoretimePeriod");
	scoretimePeriod = timePeriodSelect.selectedIndex;
	metricSelect = document.getElementById("scoreMetric")
	scoreMetric = metricSelect.selectedIndex;

	var whichSliderToChange = 0;

	var first = true;

	if(Boolean(first)) {
		setInterval(function () {
			var whatTochange = languageSelect;

			switch(whichSliderToChange) {
				case '0':
				whatTochange = languageSelect;
				break;
				case '1':
				whatTochange = gameSelect;
				break;
				case '2':
				whatTochange = timePeriodSelect;
				break;
				case '3':
				whatTochange = metricSelect;
				break;
				default:
				break;        
			}
        whatTochange.selectedIndex = (whatTochange.selectedIndex + 1)  % (whatTochange.length -1) ;
        whichSliderToChange= whichSliderToChange+=1 % 4;
        console.log("INTERBVAAAAAAAAAAL" + whichSliderToChange)
         console.log("INTERBVAAAAAAAAAALWhatTOCHANGE" + whatTochange)
        console.log("INTERBVAAAAAAAAAALWhatTOCHANGESIZE" + whatTochange.size)


    }, 3000);
		first= false;
	}

    //All languages, All Games

    var xmlhttp;
    console.log("In update leaderboard")

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
    else {// code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
    	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		console.log("Leaderboard response : " + xmlhttp.responseText)

    		table = document.getElementById("score_table");

    		obj = JSON.parse(xmlhttp.responseText);
    		console.log("This will be the obj")
    		console.log(obj);


    		max = table.rows.length;
    		for(var i = 0; i < max; i++){
    			console.log("DELETED : "+ i + "LENGHTH : " + table.rows.length)
    			table.deleteRow(0);
    		}

    		for(var i = 0; i <  obj[0].length; i++) {
    			var rowCount = table.rows.length;
                var row = table.insertRow(rowCount);
                rowUserID=  obj[1][i].toString();
    			console.log("This is the rowCount: " + rowCount)
                if(rowUserID == userID){
                    row.className = "highlightCurrentUser"; 
                }
                else {
                  row.className = "otherUsersInTable"; 

              }
              

              row.insertCell(0).innerHTML=  '<img id="leaderPic1" src="http://graph.facebook.com/' + rowUserID + '/picture" >'        ;
              row.insertCell(1).innerHTML= obj[2][rowUserID];

              row.insertCell(2).innerHTML= obj[0][i];
             //   row.insertCell(3).innerHTML= obj[1][i];
                row.insertCell(3).innerHTML= "Rank: " + (parseInt(i) + 1); //since index 0 is first rank
            }
            //add the user from before s score if use ris not in top3

            if( obj[3].rank > 4) {
                var rowCount = table.rows.length;
                var row = table.insertRow(rowCount);
                row.className = "spaceUnder"; 
                row.insertCell(0).innerHTML="  "

            	addScoreEntry(4,table) 
            }

            //add this user s score if he is not in the top3
            if(obj[3].rank > 3) {
            	addScoreEntry(3,table)  
            }


            if( obj[5].id != "NOPE" ) {
            	addScoreEntry(5,table) 
            }
            


        }
    }

    xmlhttp.open("GET","php/get_user_rank.php?userID=" + userID + "&language=" + scoreLanguage + "&mode=" +scoreGame + "&metric=" + scoreMetric + "&period=" + scoretimePeriod , true);
    xmlhttp.send();  

}

function addScoreEntry(indexOfArray, table){
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    if(obj[indexOfArray].id == userID){
        row.className = "highlightCurrentUser"; 
    }
    else {
      row.className = "otherUsersInTable"; 
      
  }

  row.insertCell(0).innerHTML=  '<img id="leaderPic1" src="http://graph.facebook.com/' + obj[indexOfArray].id + '/picture" >'        ;
  row.insertCell(1).innerHTML= obj[2][obj[indexOfArray].id];

  row.insertCell(2).innerHTML= obj[indexOfArray].score;
  row.insertCell(3).innerHTML= "Rank: " + obj[indexOfArray].rank;
}
