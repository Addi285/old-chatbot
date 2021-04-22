const content = document.querySelector('.content'); //debug feature
const confidence = document.querySelector('.confidence'); //debug feature
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
var result = "";
var query = {};
var nlpEntity = {};
var locations = [];
const serverClarif = "http://192.46.220.90:5000/clarif?query=";
//const serverClarif = "http://192.46.220.90:5000/clarif?query=%22Maximum%20precipitation%20in%20Brisbane%20June%202015%22";    //for testing 
const serverResponse = "http://192.46.220.90:5000/response?query=%E2%80%9DMaximum%20precipitation%20in%20Brisbane%20June%202015%E2%80%9D&NLPEntity={%22STAT%22:%20[%22maximum%22],%20%22ATTRIBUTE%22:%20[%22precipitation%22],%20%22GPE%22:%20[%22Brisbane%22],%20%22DATE%22:%20[%22June%202015%22]}&locIndex=4";
//const serverResponse = "http://192.46.220.90:5000/response?query=";


//on page refresh or startup
function startup() {
    document.getElementById("dictateQueryButton").style.visibility = "hidden";
    document.getElementById("correctQueryButton").style.visibility = "hidden";
    document.getElementById("incorrectQueryButton").style.visibility = "hidden";
    document.getElementById("debug").style.visibility = "hidden";   //debug featuree
    //response();
}

function launchChatbot() {
    speakText("Hello. What query would you like me to handle for you?");
    setTimeout(() => {  
        document.getElementById("dictateQueryButton").style.visibility = "visible";
    }, 3500);
}

function queryCheck() {
    speakText("Is this query correct?");
    document.getElementById("correctQueryButton").style.visibility = "visible";
    document.getElementById("incorrectQueryButton").style.visibility = "visible";
}

function correctQuery() {
    //speakText("Wonderful. I will find this out for you.");
    clarifyQuery();

}

function clarifyQuery() {
    //speakText("Checking my database now.");
    const theURL = serverClarif + content.textContent;
    var ajax = new XMLHttpRequest();

    ajax.open("GET", theURL, true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && (ajax.status == 200)) {
            console.log("ready")            
            var Data = JSON.parse(ajax.responseText);

            query = Data.query;
            console.log("query:", query);
            nlpEntity = Data.NLPEntity;
            console.log("NLPEntity:", nlpEntity);

            var i, j;
            for (i = 0; i < Data.Location.length; i++) {
                locations[i] = []
                for (j = 0; j < 1; j++) {
                    locations[i][j] = Data.Location[i][0];
                    locations[i][j+1] = Data.Location[i][2];
                }
            }
        } else {
            console.log("not ready yet")            
        }
    }
    varifyLocation();
    console.log("SPECIFIC LOCATIONS: ", locations);
}

function response(locIndex) {
    //speakText("Excellent. Checking my database again.");
    const theURL = serverResponse;// + NLPEntity + locIndex;
    var ajax = new XMLHttpRequest();

    ajax.open("GET", theURL, true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && (ajax.status == 200)) {
            console.log("ready")     
            const Data = JSON.parse(ajax.responseText);       
            result = Data.Result;
            console.log("RESULT: ", result);
            speakText("The answer is:");
            speakText(result);
            document.write(result);
            document.getElementById("debug").style.visibility = "visible";  //debug feature
        } else {
            console.log("not ready yet")            
        }
    }
}

function varifyLocation() {
    //speakText("Please varify the specific location.");
    
    response();
    
}

function incorrectQuery() {
    speakText("Sorry I got that wrong, please dictate the query again.");
} 

//start voice recording
function dictateQuery() {
    recognition.start();
}

//when voice recording stops, it reads the transcript of what was said
recognition.onresult = function(speechEvent) {
    console.log(speechEvent);   //debug feature
    document.getElementById("debug").style.visibility = "visible";  //debug feature

    const current = speechEvent.resultIndex;
    const transcript = speechEvent.results[current][0].transcript;
    content.textContent = transcript;

    speakText("The query I recieved was:");
    speakText(transcript);
    queryCheck();
    
    const accuracy = speechEvent.results[current][0].confidence;
    confidence.textContent = accuracy;
};


//voice response function and config
function speakText(message) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

function httpGet(theUrl) {
    const Http = new XMLHttpRequest();
    Http.open("GET", theUrl);
    Http.send();

    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
}

function testing() {
    
    var url = "http://192.46.220.90:5000/clarif?query=Maximum precipitation in Brisbane June 2015"

    var ajax = new XMLHttpRequest();
    ajax.open("GET", url, true);
    ajax.send(null);
    ajax.onreadystatechange = function () {

     if (ajax.readyState == 4 && (ajax.status == 200)) {

        console.log("ready")            
        var Data = JSON.parse(ajax.responseText);
        console.log(Data.Location[1]);
       // console.log(Data.first);

    } else {
        console.log("not ready yet")            
    }
}
}