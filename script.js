// Subway Surfers Clone - Main Game Logic

const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");

let currentLane = 1; // 0=left, 1=center, 2=right
let score = 0;
let gameOver = false;

// Lane positions (3 lanes)
const lanes = [40, 155, 270]; // left, center, right

// Player ko move karna
function movePlayer(direction) {
  if (gameOver) return;

  if (direction === "left" && currentLane > 0) {
    currentLane--;
  }
  if (direction === "right" && currentLane < 2) {
    currentLane++;
  }
  if (direction === "up") {
    // Jump effect
    player.style.bottom = "120px";
    setTimeout(() => {
      player.style.bottom = "30px";
    }, 400);
  }

  player.style.left = lanes[currentLane] + "px";
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") movePlayer("left");
  if (e.key === "ArrowRight") movePlayer("right");
  if (e.key === "ArrowUp") movePlayer("up");
});

// Touch / Swipe for mobile
let startX = 0;
game.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});
game.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) movePlayer("left"); // swipe left
  if (endX - startX > 50) movePlayer("right"); // swipe right
});

// Obstacle (Train) banana
function createObstacle() {
  if (gameOver) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.innerHTML = "🚂"; // Train emoji

  let lane = Math.floor(Math.random() * 3); // Random lane
  obstacle.style.left = lanes[lane] + "px";
  obstacle.style.top = "-80px";
  game.appendChild(obstacle);

  let topPos = -80;
  let interval = setInterval(() => {
    if (gameOver) {
      clearInterval(interval);
      return;
    }

    topPos += 5; // Speed
    obstacle.style.top = topPos + "px";

    // Collision check
    if (topPos > 450 && topPos < 560 && lane === currentLane && player.style.bottom === "30px") {
      gameOver = true;
      alert("Game Over! Score: " + score);
      location.reload(); // Restart game
    }

    // Score badhao jab obstacle neeche chala jaye
    if (topPos > 600) {
      clearInterval(interval);
      obstacle.remove();
      score += 10;
      scoreText.innerText = "Score: " + score;
    }
  }, 20);
}

// Har 1.5 second me naya obstacle
setInterval(createObstacle, 1500);

// Initial score
scoreText.innerText = "Score: 0";
