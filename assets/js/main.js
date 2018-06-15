    var rndm = "";

    // create answer array
    var answerArray = [];

    // guess counter
    var guessCounter = 20;

    // guessed letters
    var guessedLetters = [];

    //guess display 
    var guessDisplay = [];

    // empty guess var
    var userGuess = "";

    var gameOver;

    var winTimeout;

    // function that changes answerarray to underscores & prints
    function answerBlank(a) {
        for (var i = 0; i < data.movies[rndm].length; i++) {
            if (data.movies[rndm][i] === " ") {
                a[i] = " ";
            } else {
                a[i] = "_";
            }
        }
    }
// win message function
function winMsg() {
    var queryURL = "https://www.omdbapi.com/?t=" + data.movies[rndm] + "&y=&plot=short&apikey=" + APIKEY;
    $("#guess-left").text("YOU WIN!!");
    $("#note").hide();
    $("#game").empty();
    $("#hint").empty();
    $("#show-hint").hide();
    $("#guessed").empty();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
            console.log(response);
            var title = $("<h2>").text(response.Title);
            var rating = $("<p>").text(response.Rated);
            var relDate = $("<p>").text("Rel: " + response.Released);
            var dir = $("<p>").text(response.Director);
            var poster = $("<img src=" + response.Poster + ">");
            $("#guessed").append(title, rating, relDate, dir);
            $("#gameover").append(poster); 
          });
    }


// function to start game
function startGame() {  

    // empty the gameover msg
    $("#gameover").empty();

    // reprint the header
    $("#note").show();

    // pick a random title               
    rndm = Math.floor(Math.random()*data.movies.length);

    gameOver = false;

    // show hint button
    $("#show-hint").show();

    // clears the hint
    $("#hint").empty();

    //clears win timeout
    clearTimeout(winTimeout);

    //reset answerArray to empty
    answerArray = [];
    
    // fills answer array with underscores 
    answerBlank(answerArray);

    // print answer array to html
    $("#game").text(answerArray.join(""));

    // reset guesses
    guessCounter = 20;

    guessedLetters = [];

     // Prints the blanks at the beginning of each round in the HTML.
    $("#guessed").text("ALREADY GUESSED: " + (guessedLetters.join(" ")));

    // reset the guess counter
    $("#guess-left").text("GUESSES LEFT:" + guessCounter);
}

// starts game
startGame();

// function run when user starts guessing
$(document).on("keyup", function(e) {

    if (!gameOver) {
    // determines guess
    userGuess = e.key;
     
    // change answer array to reflect guess if it's correct
    for (var g = 0; g < answerArray.length; g++) {
        if (userGuess.toUpperCase() === data.movies[rndm][g].toUpperCase()) {
            answerArray[g] = userGuess.toUpperCase();
        }
    } 
    // re-print answer array with answerto html
    $("#game").text(answerArray.join(""));

    // save guesses to guessLetters
    guessedLetters.push(userGuess.toUpperCase());
    // display guessed letters
    $("#guessed").text("ALREADY GUESSED: " + (guessedLetters.join("")));
    // guessDisplay = $("guessed").text() += userGuess.toUpperCase();

    // guess counter display
   $("#guess-left").text("GUESSES LEFT:" + (guessCounter--));
}

    // restart function conditions
    if (guessedLetters.length === 20) {
        gameOver = true;
        $("#game").text("OUT OF GUESSES, TRY AGAIN!");
        setTimeout(function() {
            startGame();  
        }, 2500);
    } else if (answerArray.join("") === data.movies[rndm].toUpperCase()) {
        gameOver = true;
        winMsg();
        setTimeout(function() {
            startGame();  
        }, 10000);
    }
});

   // connect button with relevant hint
   $("#show-hint").on("click", function() {
    $("#hint").empty();
    var queryURL = "https://www.omdbapi.com/?t=" + data.movies[rndm] + "&y=&plot=short&apikey=" + APIKEY;

    // Creates AJAX call for the specific movie button being clicked
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        console.log(response);
    if (data.movies[rndm] === response.Title) {
        $("#hint").text(response.Plot);
    }
    });
});




