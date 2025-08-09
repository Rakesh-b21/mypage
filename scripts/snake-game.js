document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const difficultySelect = document.getElementById("difficulty");
    const homeScreen = document.getElementById("homeScreen");
    const gameScreen = document.getElementById("gameScreen");
    const startGameButton = document.getElementById("startGameButton");
    const pauseOverlay = document.getElementById("pauseOverlay");
    const resumeButton = document.getElementById("resumeButton");
    const exitButton = document.getElementById("exitButton");

    const upBtn = document.getElementById("upBtn");
    const downBtn = document.getElementById("downBtn");
    const leftBtn = document.getElementById("leftBtn");
    const rightBtn = document.getElementById("rightBtn");

    const box = 20;
    let snake = [{ x: Math.floor((canvas.width / box) / 2) * box, y: Math.floor((canvas.height / box) / 2) * box }];
    let food = getRandomPosition();
    let randomSnakes = [];
    let obstacles = [];
    let direction = null; // Initialize direction as null
    let score = 0;
    let gameOver = false;
    const speed = 150; // ms per step
    let rafId = null; // requestAnimationFrame id
    let lastTime = 0;
    let accumulator = 0;

    let isPaused = false;

    // Responsive canvas setup
    function resizeCanvas() {
        const size = Math.min(window.innerWidth, window.innerHeight) - 40;
        const gridSize = Math.floor(size / box) * box;
        canvas.width = gridSize;
        canvas.height = gridSize;
    }
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);
    resizeCanvas(); // Initial call

    function setDirection(event) {
        if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
        else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
        else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
        else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    }
    document.addEventListener("keydown", setDirection);

    // Prevent arrow keys from scrolling the page while playing the game
    document.addEventListener('keydown', function(e) {
        // Only prevent default if game screen is visible
        const gameScreen = document.getElementById('gameScreen');
        if (
            gameScreen && !gameScreen.classList.contains('hidden') &&
            ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)
        ) {
            e.preventDefault();
        }
    }, { passive: false });

    // Touch controls for mobile
    if (upBtn && downBtn && leftBtn && rightBtn) {
        upBtn.addEventListener("touchstart", function(e) {
            e.preventDefault();
            if (direction !== "DOWN") direction = "UP";
        });
        downBtn.addEventListener("touchstart", function(e) {
            e.preventDefault();
            if (direction !== "UP") direction = "DOWN";
        });
        leftBtn.addEventListener("touchstart", function(e) {
            e.preventDefault();
            if (direction !== "RIGHT") direction = "LEFT";
        });
        rightBtn.addEventListener("touchstart", function(e) {
            e.preventDefault();
            if (direction !== "LEFT") direction = "RIGHT";
        });
    }

    // Start game
    startGameButton.addEventListener("click", () => {
        setDifficulty();
        homeScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        restartGame();
        canvas.focus();
    });

    // Canvas click: pause or restart
    canvas.addEventListener("click", function () {
        if (gameOver) {
            setTimeout(restartGame, 200); // Prevent accidental double-clicks
            return;
        }
        if (!pauseOverlay.classList.contains("hidden")) return;
        isPaused = true;
        pauseOverlay.classList.remove("hidden");
    });

    // Resume button
    resumeButton.addEventListener("click", function (e) {
        e.stopPropagation();
        if (isPaused) {
            isPaused = false;
            pauseOverlay.classList.add("hidden");
        }
    });

    // Exit button
    exitButton.addEventListener("click", function (e) {
        e.stopPropagation();
        isPaused = false;
        pauseOverlay.classList.add("hidden");
        gameScreen.classList.add("hidden");
        homeScreen.classList.remove("hidden");
        if (rafId) cancelAnimationFrame(rafId);
    });

    // Pause/resume with spacebar
    document.addEventListener("keydown", function (e) {
        if (gameScreen.classList.contains("hidden")) return;
        if (e.code === "Space") {
            if (!isPaused && !gameOver && pauseOverlay.classList.contains("hidden")) {
                isPaused = true;
                pauseOverlay.classList.remove("hidden");
            } else if (isPaused && !pauseOverlay.classList.contains("hidden")) {
                isPaused = false;
                pauseOverlay.classList.add("hidden");
            }
            e.preventDefault();
        }
    });

    function setDifficulty() {
        const difficulty = difficultySelect.value;
        if (difficulty === "easy") {
            randomSnakes = [];
            obstacles = [];
        } else if (difficulty === "medium") {
            randomSnakes = [];
            generateObstacles(3);
        } else if (difficulty === "hard") {
            obstacles = [];
            generateRandomSnakes(3);
        }
    }

    function getRandomPosition() {
        return {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
        };
    }

    function generateObstacles(count) {
        obstacles = [];
        let attempts = 0;
        const maxAttempts = 100;

        while (obstacles.length < count && attempts < maxAttempts) {
            const newObstacle = getRandomPosition();

            if (
                obstacles.every(
                    (obstacle) =>
                        Math.abs(obstacle.x - newObstacle.x) >= 5 * box &&
                        Math.abs(obstacle.y - newObstacle.y) >= 5 * box
                )
            ) {
                obstacles.push(newObstacle);
            }

            attempts++;
        }

        if (obstacles.length < count) {
            console.warn(`Only ${obstacles.length} obstacles were generated after ${maxAttempts} attempts.`);
        }
    }

    function generateRandomSnakes(count) {
        randomSnakes = [];
        for (let i = 0; i < count; i++) {
            randomSnakes.push({
                body: [getRandomPosition()],
                direction: getRandomDirection(),
            });
        }
    }

    function getRandomDirection() {
        const directions = ["UP", "DOWN", "LEFT", "RIGHT"];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    function moveRandomSnakes() {
        randomSnakes.forEach((randomSnake) => {
            let head = randomSnake.body[0];
            let newHead;
            if (randomSnake.direction === "UP") newHead = { x: head.x, y: head.y - box };
            if (randomSnake.direction === "DOWN") newHead = { x: head.x, y: head.y + box };
            if (randomSnake.direction === "LEFT") newHead = { x: head.x - box, y: head.y };
            if (randomSnake.direction === "RIGHT") newHead = { x: head.x + box, y: head.y };

            // Wrap around
            if (newHead.x < 0) newHead.x = canvas.width - box;
            if (newHead.y < 0) newHead.y = canvas.height - box;
            if (newHead.x >= canvas.width) newHead.x = 0;
            if (newHead.y >= canvas.height) newHead.y = 0;

            randomSnake.body.unshift(newHead);
            randomSnake.body.pop();

            // Occasionally change direction
            if (Math.random() < 0.1) {
                randomSnake.direction = getRandomDirection();
            }
        });
    }

    function stepGame() {
        if (gameOver) {
            drawGameOverAnimation();
            return;
        }

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the snake
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i === 0 ? "#00C6A7" : "#0078D7"; // Head: accent, Body: primary
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        // Draw the food
        ctx.fillStyle = "#ff5252"; // A vibrant red for food
        ctx.fillRect(food.x, food.y, box, box);

        // Draw obstacles
        ctx.fillStyle = "#555";
        obstacles.forEach((obstacle) => {
            ctx.fillRect(obstacle.x, obstacle.y, box, box);
        });

        // Draw and move random snakes (hard mode)
        if (randomSnakes.length > 0) {
            ctx.fillStyle = "#888";
            randomSnakes.forEach((randomSnake) => {
                randomSnake.body.forEach((segment) => {
                    ctx.fillRect(segment.x, segment.y, box, box);
                    ctx.strokeStyle = "#fff";
                    ctx.strokeRect(segment.x, segment.y, box, box);
                });
            });
            moveRandomSnakes();
        }

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        // Update snake position based on direction
        if (direction === "UP") snakeY -= box;
        if (direction === "DOWN") snakeY += box;
        if (direction === "LEFT") snakeX -= box;
        if (direction === "RIGHT") snakeX += box;

        // Allow the snake to pass through walls
        if (snakeX < 0) snakeX = canvas.width - box;
        if (snakeY < 0) snakeY = canvas.height - box;
        if (snakeX >= canvas.width) snakeX = 0;
        if (snakeY >= canvas.height) snakeY = 0;

        // Check if the snake eats the food
        if (snakeX === food.x && snakeY === food.y) {
            score++;
            food = getRandomPosition();
        } else {
            snake.pop();
        }

        const newHead = { x: snakeX, y: snakeY };

        // Check for collision with the snake's body, obstacles, or random snakes
        if (
            collision(newHead, snake) ||
            collision(newHead, obstacles) ||
            randomSnakes.some((randomSnake) => collision(newHead, randomSnake.body))
        ) {
            gameOver = true;
            return;
        }

        snake.unshift(newHead);

        // Update the score display
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x === array[i].x && head.y === array[i].y) {
                return true;
            }
        }
        return false;
    }

    function drawGameOverAnimation() {
        ctx.fillStyle = "rgba(0, 120, 215, 0.85)"; // Use primary color with opacity
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = "#ff5252";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.fillStyle = "#fff";
        ctx.font = "bold 40px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40);
        ctx.font = "20px 'Segoe UI', Arial, sans-serif";
        ctx.fillText("Click to Restart", canvas.width / 2, canvas.height / 2 + 40);
    }

    function gameLoop(timestamp) {
        if (gameScreen.classList.contains("hidden")) return; // stop when not visible
        if (!lastTime) lastTime = timestamp;
        const delta = timestamp - lastTime;
        lastTime = timestamp;
        if (!isPaused) {
            accumulator += delta;
            while (accumulator >= speed && !gameOver) {
                stepGame();
                accumulator -= speed;
            }
            if (gameOver) {
                // keep rendering game over overlay each frame for responsiveness
                drawGameOverAnimation();
            }
        }
        rafId = requestAnimationFrame(gameLoop);
    }

    function restartGame() {
        snake = [{ x: Math.floor((canvas.width / box) / 2) * box, y: Math.floor((canvas.height / box) / 2) * box }];
        food = getRandomPosition();
        direction = null; // Do not set default direction
        score = 0;
        gameOver = false;

        // Reset obstacles or randomSnakes based on difficulty
        const difficulty = difficultySelect.value;
        if (difficulty === "medium") {
            randomSnakes = [];
            generateObstacles(3);
        } else if (difficulty === "hard") {
            obstacles = [];
            generateRandomSnakes(3);
        } else {
            randomSnakes = [];
            obstacles = [];
        }

        // reset timing and start loop
        lastTime = 0;
        accumulator = 0;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(gameLoop);
    }
});