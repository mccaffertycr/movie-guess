// variable declarations
var rndm = '';
var answerArray = [];
var guessCounter = 20;
var guessedLetters = [];
var guessDisplay = [];
var userGuess = '';
var gameOver;
var winTimeout;

// main game logic
function startGame() {  
  // reset game over
  gameOver = false;

  // empty the gameover msg
  $('#gameover').empty();

  // reprint the header
  $('#note').show();

  // show hint button
  $('#show-hint').show();

  // clears the hint
  $('#hint').empty();

  //clears win timeout
  clearTimeout(winTimeout);

  // pick a random title               
  rndm = Math.floor(Math.random()*data.movies.length);

  // empty answer array
  answerArray = [];
  
  // fills answer array with underscores 
  answerBlank(answerArray);

  // print answer array to html
  $('#game').text(answerArray.join(''));

  // reset guesses
  guessCounter = 20;

  guessedLetters = [];

   // Prints the blanks at the beginning of each round in the HTML.
  $('#guessed').text('ALREADY GUESSED: ' + (guessedLetters.join(' ')));

  // reset the guess counter
  $('#guess-left').text('GUESSES LEFT:' + guessCounter);
}

// converts the chosen title to an array of underscores
function answerBlank(a) {

  for (var i = 0; i < data.movies[rndm].length; i++) {
    if (data.movies[rndm][i] === ' ') {
        a[i] = ' ';
    } else {
        a[i] = '_';
    }
  }

}

// win message function
function winMsg() {

  var queryURL = 'https://www.omdbapi.com/?t=' + data.movies[rndm] + '&y=&plot=short&apikey=' + APIKEY;
  $('#guess-left').text('YOU WIN!!');
  $('#note').hide();
  $('#game').empty();
  $('#hint').empty();
  $('#show-hint').hide();
  $('#guessed').empty();

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {
    var title = $('<h2>').text(response.Title);
    var rating = $('<p>').text(response.Rated);
    var relDate = $('<p>').text('Rel: ' + response.Released);
    var dir = $('<p>').text(response.Director);
    var poster = $('<img src=' + response.Poster + '>');
    $('#guessed').append(title, rating, relDate, dir);
    $('#gameover').append(poster); 
  });

}


// start game
startGame();


// event listener for key presses
$(document).on('keyup', function(e) {

  e.preventDefault();

  if (!gameOver) {
    userGuess = e.key;  
    // change answer array to reflect guess if it's correct
    for (var g = 0; g < answerArray.length; g++) {
      if (userGuess.toUpperCase() === data.movies[rndm][g].toUpperCase()) {
        answerArray[g] = userGuess.toUpperCase();
      }
    } 
    // re-print answer array with answerto html
    $('#game').text(answerArray.join(''));
    // save guesses to guessLetters
    guessedLetters.push(userGuess.toUpperCase());
    // display guessed letters
    $('#guessed').text('ALREADY GUESSED: ' + (guessedLetters.join('')));
    // guess counter display
    $('#guess-left').text('GUESSES LEFT:' + (guessCounter--));
  }

  // game over conditions
  if (guessedLetters.length > 20) {
    gameOver = true;
    $('#game').text('OUT OF GUESSES, TRY AGAIN!');
    setTimeout(function() {
      startGame();  
    }, 2500);
  } else if (answerArray.join('') === data.movies[rndm].toUpperCase()) {
    gameOver = true;
    winMsg();
    setTimeout(function() {
      startGame();  
    }, 10000);
  }

});

// event listener for hint
$('#show-hint').on('click', function() {

  $('#hint').empty();
  var queryURL = 'https://www.omdbapi.com/?t=' + data.movies[rndm] + '&y=&plot=short&apikey=' + APIKEY;

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {
    if (data.movies[rndm] === response.Title) {
      $('#hint').text(response.Plot);
    }
  });

});




