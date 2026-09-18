const track = document.getElementById('track');
const scoreEl = document.getElementById('score');
let playerLane = 1; // 0=left, 1=center, 2=right
let score = 0;
let gameOver = false;

let player = { lane: 1, y: 85 };

// Player banao
function createPlayer() {
    const p = document.createElement('div');
    p.id = 'player';
    p.style.position = 'absolute';
    p.style.width = '18%';
    p.style.height = '10%';
    p.style.background = 'yellow';
    p.style.bottom = '10%';
    p.style.borderRadius = '5px';
    p.style.transition = '0.2s';
    p.style.left = '41%';
    p.innerText = '😎';
    p.style.textAlign = 'center';
    track.appendChild(p);
    return p;
}

let playerEl = createPlayer();

function movePlayer(dir) {
    if (gameOver) return;
    if (dir === 'left' && playerLane > 0) playerLane--;
    if (dir === 'right' && playerLane < 2) playerLane++;
    updatePlayerPos();
}

function updatePlayerPos() {
    const positions = ['10%', '41%', '72%'];
    playerEl.style.left = positions[playerLane];
    player.lane = playerLane;
}

// Controls
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') movePlayer('left');
    if (e.key === 'ArrowRight') movePlayer('right');
});

// Touch / Swipe for Mobile
let startX = 0;
track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
track.addEventListener('touchend', e => {
    let endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) movePlayer('right');
    if (startX - endX > 50) movePlayer('left');
});

// Tap left/right side
track.addEventListener('click', e => {
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) movePlayer('left');
    else movePlayer('right');
});

// Obstacles
function spawnObstacle() {
    if (gameOver) return;
    const lane = Math.floor(Math.random() * 3);
    const obs = document.createElement('div');
    obs.className = 'obstacle';
    obs.style.position = 'absolute';
    obs.style.width = '18%';
    obs.style.height = '10%';
    obs.style.background = 'red';
    obs.style.top = '-15%';
    const positions = ['10%', '41%', '72%'];
    obs.style.left = positions[lane];
    obs.dataset.lane = lane;
    obs.innerText = '🚂';
    obs.style.textAlign = 'center';
    track.appendChild(obs);

    let y = -15;
    let fall = setInterval(() => {
        if (gameOver) { clearInterval(fall); obs.remove(); return; }
        y += 2;
        obs.style.top = y + '%';

        // COLLISION FIX - Yehi asal fix hai Hero!
        if (y > 75 && y < 90 && parseInt(obs.dataset.lane) === playerLane) {
            gameOver = true;
            alert('GAME OVER! Hero Score: ' + score);
            location.reload();
        }

        if (y > 100) {
            clearInterval(fall);
            obs.remove();
            if (!gameOver) {
                score += 10;
                scoreEl.innerText = 'Score: ' + score;
            }
        }
    }, 30);
}

setInterval(spawnObstacle, 1200);
