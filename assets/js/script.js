//Read all elements required to manipulate at script level
var startButton = document.querySelector("#startquiz");
var quizSection = document.querySelector("#questionArea");
var submitAnswerButton = document.querySelector("#submitAnswerButton");
var questionElement = document.querySelector(".quizQuestion"); //Need to add a class and ID to Question
var orderedOptionsList = document.querySelector(".quizOptions");
var scoreDialog = document.getElementById('score-dialog');
var timerElement = document.querySelector('.timeCounter');
var resultArea = document.querySelector("#result");
var initialsConfirmButton = document.getElementById('confirmBtn');

//Questions and scores
var questionNumber = 1;
var numberOfTotalQuestions = Object.keys(questionBank).length;
var optionSelected = 0;
var currentScore = 0;
var highScore = 0;
var maxQuizTimer = 90; //Seconds
var quizTimer = maxQuizTimer;


var highScores = localStorage.getItem("highScores");
if (highScores) {
    highScores = JSON.parse(highScores);
}
else {
    highScores = [];
}

//Set current score
function setCurrentScore() {
    var currentScoreElement = document.querySelector("#currentScore");
    currentScoreElement.innerHTML = "<h4> Current Score : " + currentScore + "</h4>";
}

//Set High score
function setHighScore() {
    var highScoreElement = document.querySelector("#highscore");
    highScore = localStorage.getItem("highScore") ? localStorage.getItem("highScore") : 0;
    highScoreElement.innerHTML = "<h4>High Score : " + highScore + "</h4>";
}

//Display timer on top right
function displayTimer() {
    timerElement.innerHTML = "<h4>" + quizTimer + "</h4>";
}


// When we click on start quiz section
startButton.addEventListener("click", function (event) {
    event.preventDefault();
    currentScore = 0;
    quizTimer = maxQuizTimer;
    setCurrentScore();
    setHighScore();
    startTimer();
    populateQuestion(event, questionNumber);
    startButton.style.display = "none"; //Hiding start button
    submitAnswerButton.className = "submitAnswerButtonVisible"; //Displaying submit answer button
});


function populateQuestion() {
    var questionText = getQuestion(questionNumber); // Get question based on number
    var questionOptions = getOptions(questionNumber); // Get Option
    optionSelected = 0; // Defaulting to no options when displaying each question
    questionElement.textContent = questionText; // Updating Question
    // Need to craete a class and id to each list option to make it selectable
    // Displaying the question options
    for (i = 0; i < questionOptions.length; i++) {
        var optionElement = document.createElement('li'); // Need to create a data ID to identify the option and related to question
        optionElement.className = "answerOption";
        optionElement.setAttribute("data-option-id", i + 1);
        optionElement.textContent = questionOptions[i];
        orderedOptionsList.appendChild(optionElement);
    }
    quizSection.appendChild(orderedOptionsList);
}

//TO-DO: Convert JS formatted questions into JSON based on key and value pairs

function getQuestion(questionNumber) {
    return questionBank[questionNumber].question;
}

function getOptions(questionNumber) {
    return questionBank[questionNumber].options;
}


//When user click on submit answer
function checkAnswer() {
    //if no option seelcted send it back
    if (optionSelected === 0) {
        alert("Please selet answer");
        return;
    }
    var actualAnswer = questionBank[questionNumber].answer;
    //update current score if correct answer
    if (actualAnswer == optionSelected) {
        currentScore = currentScore + 1;
        displayResult(true);
        checkHighScore(currentScore);
    }
    else {
        //deduct timer for wrong answer
        console.log("wrong answer selected");
        quizTimer = quizTimer - 5;
        displayResult(false);
    }
    setCurrentScore();
    clearQuestionAndAnswers();
    //Goto next question if questions not completed, otherwise end the quiz
    if (questionNumber < numberOfTotalQuestions) {
        questionNumber++;
        populateQuestion(questionNumber);
    }
    else {
        quizTimer = 0;
    }
}

//Adding event listener to answer options to chanve background colors and set the current answer selected
orderedOptionsList.addEventListener("click", function (event) {
    //adding current question and selection to localStorage
    if (event.target.getAttribute("data-option-id")) {
        optionSelected = event.target.getAttribute("data-option-id");
        //Looping all options everytime to default the color
        for (var i = 0; i < orderedOptionsList.childNodes.length; i++) {
            var childNode = orderedOptionsList.childNodes[i];
            var childNodeOption = childNode.getAttribute("data-option-id");
            if (childNodeOption == optionSelected) {
                event.target.setAttribute("style", "background-color:blue;color:white");
            }
            else {
                childNode.removeAttribute("style");
            }
        }
    }
}
);

//setting current score, high score and timer when page Loads
window.onload = function () {
    setCurrentScore();
    setHighScore();
    displayTimer();
};

//Timer for quiz
function startTimer() {
    var msgInterval = setInterval(function () {
        if (quizTimer <= 0) {
            clearInterval(msgInterval);
            populateScoreReader();
        } else {
            if (questionNumber > numberOfTotalQuestions) {
                clearInterval(msgInterval);
                populateScoreReader();
            }
            displayTimer();
            quizTimer--;
        }
    }, 1000);
}

//Reading score initials and displaying curret high scores
function populateScoreReader() {
    setPreviousHighScores();
    clearQuestionAndAnswers();
    checkHighScore();
    var currentGameScoreElement = document.querySelector("#currentGameScore");
    currentGameScoreElement.textContent = currentScore;
    scoreDialog.showModal();
    resetEveryThing();
}

function setPreviousHighScores(){
    var previousHighScores = document.getElementById("prevHighScore");
    var innerHTML ="<br/>"
    for(var i=0; i<Object.keys(highScores).length;i++)
    {
        innerHTML = innerHTML + "<h4>"+highScores[i].initials+" : "+highScores[i].score+"</h4><br/>";
    }
    previousHighScores.innerHTML = innerHTML;
}

function clearQuestionAndAnswers() {
    document.querySelector(".quizQuestion").textContent = "";
    orderedOptionsList.innerHTML = "";
}

function resetEveryThing() {
    clearQuestionAndAnswers();
    startButton.style.display = "block";
    submitAnswerButton.className = "submitAnswerButtonHidden";
    questionNumber = 1;
    resultArea.innerHTML = "";
    initialsConfirmButton.setAttribute('value', 'unknown')
}

//To display whether previous selection is right or wrong
function displayResult(result) {
    if (result) {
        resultArea.className = "CorrectResult";
        resultArea.textContent = "Correct";
    } else {
        resultArea.className = "WrongResult";
        resultArea.textContent = "Wrong. 5 seconds reduced from timer";
    }

}
//Checking for high score
function checkHighScore() {
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem("highScore", highScore);
        setHighScore();
    }
}


//Capturing initials from popup
document.getElementById('initials').addEventListener("change", function (event) {
    initialsConfirmButton.setAttribute('value', event.target.value)
})


//Loading intials for high score
initialsConfirmButton.addEventListener("click", function (event) {
    var scoreObject = {
        initials: initialsConfirmButton.value,
        score: currentScore
    }
    var currentHighScoresLenght = Object.keys(highScores).length;
    if (currentHighScoresLenght < 5) {
        highScores.push(scoreObject);
    }
    else {
        for (var i = 0; i < currentHighScoresLenght; i++) {
            if (highScores[i].score <= scoreObject.score) {
                highScores.push(scoreObject);
            }
        }
    }
    updateLocalStorageHighScores();
});

//Updating local scores to store top 5 scores in desending order
function updateLocalStorageHighScores() {
    console.log("Before sorting high scores : "+JSON.stringify(highScores));
    for (var i = 0; i < Object.keys(highScores).length; i++) {
        for(var j=i+1; j<Object.keys(highScores).length; j++){
            if(highScores[i].score < highScores[j].score){
                var obj = {
                    initials : highScores[j].initials,
                    score : highScores[j].score
                } 
                highScores[j].score = highScores[i].score;
                highScores[j].initials = highScores[i].initials;
                highScores[i].score = obj.score;
                highScores[i].initials = obj.initials;
            }
        }        
    }
    highScores = highScores.slice(0,5);
    console.log("after sorting : "+JSON.stringify(highScores));
    localStorage.setItem("highScores", JSON.stringify(highScores));
}