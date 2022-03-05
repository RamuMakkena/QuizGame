//Read start button
var startButton = document.querySelector("#startquiz");
var quizSection = document.querySelector("#questionArea");
var questionNumber = 1;
var numberOfTotalQuestions = Object.keys(questionBank).length;
var submitAnswerButton = document.querySelector(".submitAnswerButton");
var questionElement = document.querySelector(".quizQuestion"); //Need to add a class and ID to Question
var orderedOptionsList = document.querySelector(".quizOptions");
var optionSelected = 0;
var currentScore = 0;
var highScore = 0;
var totalQuizTimer = 60; //milliseconds

function setCurrentScore() {
    var currentScoreElement = document.querySelector("#currentScore");
    currentScoreElement.innerHTML = "<h4> Current Score : " + currentScore + "</h4>";
}

function setHighScore() {
    var highScoreElement = document.querySelector("#highscore");
    highScore=localStorage.getItem("highScore") ? localStorage.getItem("highScore") : 0;
    highScoreElement.innerHTML = "<h4>High Score : " + highScore + "</h4>";
}

// const jsonData = require('../questions/questions-bank.json');
startButton.addEventListener("click", function (event) {
    event.preventDefault();
    currentScore = 0;
    totalQuizTimer = 60;
    setCurrentScore();
    setHighScore();
    populateQuestion(event, questionNumber);
    startTimer();
    startButton.style.display = "none";
    submitAnswerButton.style.display = "block";
});


function populateQuestion() {

    var questionText = getQuestion(questionNumber);
    var questionOptions = getOptions(questionNumber);
    optionSelected = 0;
    questionElement.textContent = questionText;
    //    quizSection.appendChild(questionElement);
    // Need to craete a class and id to each list option to make it selectable

    for (i = 0; i < questionOptions.length; i++) {
        var optionElement = document.createElement('li'); // Need to create a data ID to identify the option and related to question
        optionElement.className = "answerOption";
        optionElement.setAttribute("data-option-id", i + 1);
        optionElement.textContent = questionOptions[i];
        orderedOptionsList.appendChild(optionElement);
    }
    quizSection.appendChild(orderedOptionsList);
}

// var submitButton = document.querySelector(".submitAnswerButton");

function getQuestion(questionNumber) {
    return questionBank[questionNumber].question;
}

function getOptions(questionNumber) {
    return questionBank[questionNumber].options;
}


function checkAnswer(event) {
    var actualAnswer = questionBank[questionNumber].answer;
    if (actualAnswer == optionSelected) {
        currentScore = currentScore + 1;
    }
    else {
        console.log("wrong answer selected");
        totalQuizTimer = totalQuizTimer - 5;
        // Need to write code for reducing timer
    }
    setCurrentScore();
    //removing quiz question
    document.querySelector(".quizQuestion").textContent = "";
    //removing quiz question options
    orderedOptionsList.innerHTML = "";
    if (questionNumber < numberOfTotalQuestions) {
        questionNumber++;
        populateQuestion(questionNumber);
    }
    else {

        totalQuizTimer = 0;
    }
}

function populateScoreReader() {
    //removing quiz question
    document.querySelector(".quizQuestion").textContent = "";
    //removing quiz question options
    orderedOptionsList.innerHTML = "";
    var initials = prompt("Enter Your Initials");
    if (highScore < currentScore) {
        localStorage.setItem("highScore", currentScore);
        setHighScore();
    }
    startButton.style.display = "block";
    submitAnswerButton.style.display = "none";
    questionNumber = 1;

}

orderedOptionsList.addEventListener("click", function (event) {
    //adding current question and selection to localStorage
    if (event.target.getAttribute("data-option-id")) {
        optionSelected = event.target.getAttribute("data-option-id");
        //Looping all options everytime to default the color
        for (var i = 0; i < orderedOptionsList.childNodes.length; i++) {
            var childNode = orderedOptionsList.childNodes[i];
            var childNodeOption = childNode.getAttribute("data-option-id");
            if (childNodeOption == optionSelected) {
                event.target.setAttribute("style", "background-color:blue");
            }
            else {
                childNode.removeAttribute("style");
            }
        }
    }
}
);

window.onload = function () {
    setCurrentScore();
    setHighScore();
};

function startTimer() {
    var msgInterval = setInterval(function () {
        if (totalQuizTimer <= 0) {
            clearInterval(msgInterval);
            populateScoreReader();
        } else {
            if (questionNumber > numberOfTotalQuestions) {
                clearInterval(msgInterval);
                populateScoreReader();
            }
            displayTimer();
            totalQuizTimer--;
        }
    }, 1000);
}

function displayTimer() {
    var timerElement = document.querySelector('.timeCounter');
    timerElement.textContent = totalQuizTimer;

}