import "./styles.css";

var ballElement = document.getElementById("ball");
var rod1Element = document.getElementById("rod1");
var rod2Element = document.getElementById("rod2");

const playerNameStorageKey = "PPName";
const maxScoreStorageKey = "PPMaxScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";

let score,
  maxScore,
  movement,
  rodsSpeed = 5, // Adjust the rods speed as desired (slower value)
  ballSpeedX = 2,
  ballSpeedY = 2;

let isGameOn = false;
let isGameStarted = false; // Variable to track if the game has started

let windowWidth = window.innerWidth,
  windowHeight = window.innerHeight;

(function () {
  maxScore = localStorage.getItem(maxScoreStorageKey);

  if (!maxScore || maxScore === "null") {
    alert("This is your first time playing this game. Let's start!");
    maxScore = 0;
  } else {
    let playerName = localStorage.getItem(playerNameStorageKey);
    alert(
      playerName + " has the highest score of " + maxScore + ". Keep it up!"
    );
  }

  resetBoard();
})();

// Reset the board
function resetBoard() {
  rod1Element.style.left =
    (window.innerWidth - rod1Element.offsetWidth) / 2 + "px";
  rod2Element.style.left =
    (window.innerWidth - rod2Element.offsetWidth) / 2 + "px";
  ballElement.style.left = (windowWidth - ballElement.offsetWidth) / 2 + "px";
  ballElement.style.top =
    windowHeight / 2 - ballElement.offsetHeight / 2 + "px";

  score = 0;
  isGameOn = false;
  isGameStarted = false; // Reset the game started state
  ballElement.classList.remove("shine"); // Remove shine class
}

// Store the winner's score
function storeWin(winningRod, winningScore) {
  if (winningScore > maxScore) {
    maxScore = winningScore;
    let playerName = prompt(
      "Congratulations! You have set a new highest score. Please enter your name:"
    );
    localStorage.setItem(playerNameStorageKey, playerName);
    localStorage.setItem(maxScoreStorageKey, maxScore);
  }

  clearInterval(movement);
  resetBoard();

  alert(
    winningRod + " wins with a score of " + winningScore + ". Keep playing!"
  );
}

// Variables for rod movement
let isMovingLeft = false;
let isMovingRight = false;

// Event listener for keydown
window.addEventListener("keydown", function (event) {
  if (!isGameStarted && event.key === "Enter") {
    if (!isGameOn) {
      isGameStarted = true; // Update the game started state
      isGameOn = true;
      resetBoard();
      moveBall();
    }
  }

  if (event.key === "d" || event.key === "D") {
    isMovingRight = true;
  } else if (event.key === "a" || event.key === "A") {
    isMovingLeft = true;
  }
});

// Event listener for keyup
window.addEventListener("keyup", function (event) {
  if (event.key === "d" || event.key === "D") {
    isMovingRight = false;
  } else if (event.key === "a" || event.key === "A") {
    isMovingLeft = false;
  }
});

// Move the rods
function moveRods() {
  let rod1Rect = rod1Element.getBoundingClientRect();
  let rod2Rect = rod2Element.getBoundingClientRect();

  if (isMovingRight && rod1Rect.x + rod1Rect.width < window.innerWidth) {
    rod1Element.style.left = rod1Rect.x + rodsSpeed + "px";
    rod2Element.style.left = rod1Element.style.left;
  } else if (isMovingLeft && rod1Rect.x > 0) {
    rod1Element.style.left = rod1Rect.x - rodsSpeed + "px";
    rod2Element.style.left = rod1Element.style.left;
  }

  requestAnimationFrame(moveRods);
}

// Move the ball
function moveBall() {
  let ballRect = ballElement.getBoundingClientRect();
  let ballX = ballRect.x;
  let ballY = ballRect.y;
  let ballDia = ballRect.width;

  let rod1Height = rod1Element.offsetHeight;
  let rod2Height = rod2Element.offsetHeight;
  let rod1Width = rod1Element.offsetWidth;
  let rod2Width = rod2Element.offsetWidth;

  movement = setInterval(function () {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    ballElement.style.left = ballX + "px";
    ballElement.style.top = ballY + "px";

    if (ballX + ballDia >= windowWidth || ballX <= 0) {
      ballSpeedX = -ballSpeedX;
    }

    if (ballY <= rod1Height) {
      let rod1X = rod1Element.offsetLeft;
      if (ballX + ballDia >= rod1X && ballX <= rod1X + rod1Width) {
        ballSpeedY = -ballSpeedY;
        score++;
        ballElement.classList.add("shine"); // Add shine class to the ball
      } else if (ballY <= 0) {
        storeWin(rod2Name, score);
        return;
      }
    } else if (ballY + ballDia >= windowHeight - rod2Height) {
      let rod2X = rod2Element.offsetLeft;
      if (ballX + ballDia >= rod2X && ballX <= rod2X + rod2Width) {
        ballSpeedY = -ballSpeedY;
        score++;
        ballElement.classList.add("shine"); // Add shine class to the ball
      } else if (ballY + ballDia >= windowHeight) {
        storeWin(rod1Name, score);
        return;
      }
    }
  }, 10);

  moveRods();
}
