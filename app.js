const content = document.querySelector('.content'); //debug feature
const confidence = document.querySelector('.confidence'); //debug feature
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();



//on page refresh or startup
function startup() {
    document.getElementById("dictateQueryButton").style.visibility = "hidden";
    document.getElementById("correctQueryButton").style.visibility = "hidden";
    document.getElementById("incorrectQueryButton").style.visibility = "hidden";
    document.getElementById("debug").style.visibility = "hidden";   //debug featuree
}

function launchChatbot() {
    speakText("Hello, I am the BOM data handling chatbot. What query would you like me to handle for you?");
    setTimeout(() => {  
        document.getElementById("dictateQueryButton").style.visibility = "visible";
    }, 6000);
}

function queryCheck() {
    speakText("Is this query correct?");
    document.getElementById("correctQueryButton").style.visibility = "visible";
    document.getElementById("incorrectQueryButton").style.visibility = "visible";
}

function correctQuery() {
    speakText("Wonderful. I will find this out for you.");
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






/*
const Http = new XMLHttpRequest();
    const url='https://jsonplaceholder.typicode.com/users';
    //const url='https://mockend.com/Addi285/repo';
    Http.open("GET", url);
    Http.send();
     
    console.log(Http.responseText);
    var obj = JSON.parse(Http.responseText);
    document.write(obj[0].title);
    speakText(obj[0].title);
    
*/