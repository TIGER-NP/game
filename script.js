const gameArea = document.getElementById("gameArea");
const playerCar = document.getElementById("playerCar");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const messageText = document.getElementById("messageText");

const lanes = [0, 80, 160, 240, 320]; // 5 lanes (400px width / 5 = 80px)
let currentLane = 2; // Start in the middle lane (index 2)
let enemyCars = [];
let speed = 2;
let playerY = 520;
let isPlaying = true;
let distance = 0;

function createEnemyCar(laneIndex) {
  const car = document.createElement("img");
  car.src = "ene.png"; // Replace with your actual path
  car.classList.add("enemy-car");
  car.style.left = `${lanes[laneIndex]}px`;
  car.style.top = `-60px`;
  gameArea.appendChild(car);
  return car;
}

function generateEnemies() {
  for (let i = 0; i < 5; i++) {
    const laneIndex = Math.floor(Math.random() * lanes.length);
    const car = createEnemyCar(laneIndex);
    car.style.top = `${-i * 150}px`;
    enemyCars.push(car);
  }
}

function moveEnemies() {
  enemyCars.forEach(car => {
    const top = parseInt(car.style.top);
    car.style.top = `${top + speed}px`;

    if (checkCollision(car)) {
      messageText.innerText = "💥 Crash! You Failed.";
      message.style.display = "flex";
      isPlaying = false;
    }

    if (top > 600) {
      const laneIndex = Math.floor(Math.random() * lanes.length);
      car.style.top = `-60px`;
      car.style.left = `${lanes[laneIndex]}px`;
    }
  });
}

function checkCollision(enemy) {
  const px = playerCar.offsetLeft;
  const py = playerCar.offsetTop;
  const ex = enemy.offsetLeft;
  const ey = enemy.offsetTop;

  return (
    px < ex + 40 &&
    px + 40 > ex &&
    py < ey + 60 &&
    py + 60 > ey
  );
}

function createRoadLines() {
  for (let i = 0; i < 20; i++) {
    for (let j = 1; j < 5; j++) { // 4 dividers between 5 lanes
      const line = document.createElement("div");
      line.classList.add("road-line");
      line.style.left = `${j * 80 - 2}px`; // Center of divider (4px wide)
      line.style.top = `${i * 60}px`;
      gameArea.appendChild(line);
    }
  }
}

function moveRoadLines() {
  const lines = document.querySelectorAll(".road-line");
  lines.forEach(line => {
    let top = parseInt(line.style.top);
    top += speed;
    if (top > 600) top = -40;
    line.style.top = `${top}px`;
  });
}

function gameLoop() {
  if (!isPlaying) return;
  moveEnemies();
  moveRoadLines();
  playerCar.style.left = `${lanes[currentLane]}px`;
  playerCar.style.top = `${playerY}px`;
  distance += 1;
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => {
  if (!isPlaying) return;

  switch (e.key) {
    case "ArrowLeft":
      currentLane = Math.max(currentLane - 1, 0);
      break;
    case "ArrowRight":
      currentLane = Math.min(currentLane + 1, lanes.length - 1);
      break;
    case "ArrowUp":
      speed = 5;
      break;
    case "ArrowDown":
      speed = 3;
      break;
  }
});

restartBtn.addEventListener("click", () => {
  enemyCars.forEach(car => car.remove());
  document.querySelectorAll(".road-line").forEach(line => line.remove());
  enemyCars = [];
  currentLane = 2;
  playerY = 520;
  speed = 2;
  distance = 0;
  isPlaying = true;
  message.style.display = "none";
  createRoadLines();
  generateEnemies();
  gameLoop();
});

// Start the game
createRoadLines();
generateEnemies();
gameLoop();