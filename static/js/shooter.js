const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");

const menuScreen = document.getElementById("menu-screen");
const gameoverScreen = document.getElementById("gameover-screen");
const btnStart = document.getElementById("btn-start");
const btnRestart = document.getElementById("btn-restart");

let direction = "right";
let animationId = null;
let isRunning = false;

let player = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    speed: 4,
    score: 0
};

let enemy = {
    x: 0,
    y: 0,
    width: 24,
    height: 24
};

let startX = 0;
let startY = 0;

// Resize canvas to displayed size (important for iOS)
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}
resizeCanvas();
window.addEventListener("resize", () => {
    resizeCanvas();
    if (!isRunning) {
        // Recentrer le joueur et l'ennemi si on est dans un menu
        centerPlayerAndEnemy();
        drawStaticScene();
    }
});

// Position initiale
function centerPlayerAndEnemy() {
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height / 2 - player.height / 2;

    enemy.x = Math.random() * (canvas.width - enemy.width);
    enemy.y = Math.random() * (canvas.height - enemy.height);
}

function resetGame() {
    player.score = 0;
    scoreSpan.textContent = player.score;
    direction = "right";
    centerPlayerAndEnemy();
}

// Dessins
function drawPlayer() {
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemy() {
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

function drawStaticScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawEnemy();
    drawPlayer();
}

// Collision + bords + game over
function handleCollisionAndBounds() {
    // Collision avec l'ennemi
    if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
    ) {
        player.score++;
        scoreSpan.textContent = player.score;

        enemy.x = Math.random() * (canvas.width - enemy.width);
        enemy.y = Math.random() * (canvas.height - enemy.height);
    }

    // Game over si on touche un bord
    if (
        player.x < 0 ||
        player.x + player.width > canvas.width ||
        player.y < 0 ||
        player.y + player.height > canvas.height
    ) {
        triggerGameOver();
    }
}

// Boucle principale
function mainloop() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Mouvement
    switch (direction) {
        case "left":
            player.x -= player.speed;
            break;
        case "right":
            player.x += player.speed;
            break;
        case "up":
            player.y -= player.speed;
            break;
        case "down":
            player.y += player.speed;
            break;
    }

    handleCollisionAndBounds();
    drawEnemy();
    drawPlayer();

    animationId = requestAnimationFrame(mainloop);
}

// Game over
function triggerGameOver() {
    isRunning = false;
    cancelAnimationFrame(animationId);

    finalScoreSpan.textContent = player.score;
    gameoverScreen.classList.add("visible");
}

// Clavier (desktop)
document.addEventListener("keydown", (e) => {
    if (!isRunning) return;

    if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (e.key === "ArrowRight" && direction !== "left") direction = "right";
    if (e.key === "ArrowUp" && direction !== "down") direction = "up";
    if (e.key === "ArrowDown" && direction !== "up") direction = "down";
});

// Swipe (mobile)
canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
});

canvas.addEventListener("touchend", (e) => {
    if (!isRunning) return;

    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;

    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction !== "left") direction = "right";
        else if (diffX < 0 && direction !== "right") direction = "left";
    } else {
        if (diffY > 0 && direction !== "up") direction = "down";
        else if (diffY < 0 && direction !== "down") direction = "up";
    }
});

// Empêche le scroll pendant le jeu (iOS/Android)
document.body.addEventListener(
    "touchmove",
    (e) => {
        e.preventDefault();
    },
    { passive: false }
);

// Bouton start (menu)
btnStart.addEventListener("click", () => {
    menuScreen.classList.remove("visible");
    gameoverScreen.classList.remove("visible");
    resizeCanvas();
    resetGame();
    isRunning = true;
    mainloop();
});

// Bouton restart (game over)
btnRestart.addEventListener("click", () => {
    gameoverScreen.classList.remove("visible");
    resizeCanvas();
    resetGame();
    isRunning = true;
    mainloop();
});

// Affichage initial (menu + scène statique)
resetGame();
drawStaticScene();
menuScreen.classList.add("visible");
