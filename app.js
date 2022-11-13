const birdDiv = document.getElementById("bird");
const gameDiv = document.getElementById("playArea");
const obstaclesInstances = ["a", "b", "c", "d", "e", "f", "g"];
const scoreCount = document.getElementById("scoreCount");
const startBtn = document.getElementById("startBtn");
const startGameModal = document.getElementById("startGameModal");
const bestScoreText = document.getElementById("bestScore");
const newRecord = document.getElementById("newRecord");

startBtn.addEventListener("click", () => {
    runBird(birdDiv);
    addObstacle();
    gameStarted = true;
    startGameModal.classList.add("hide");
    startGame();
})

if (localStorage.getItem("bestScore") == undefined) {
    localStorage.setItem("bestScore", 0);
}

bestScore.textContent = localStorage.getItem("bestScore");

let score = 0;

let interval = 2100;

let gameStarted = false;

let start = new Date();

let gameSpeed = 3000;

let lastJump = 450;

let lives = 3;

function jump(obj) {
    if (new Date() - lastJump >= 700) {
      lastJump = new Date();
    obj.style.transition = "300ms";
      obj.animate([
        { bottom: '5px' },
        { bottom: '65px' },
        { bottom: '105px' },
        { bottom: '105px' },
        { bottom: '65px' },
        { bottom: '5px' },
    ], {
        duration: 650,
        iterations: 1
    });   
    } else {
        lastJump = new Date();
        doubleJump(obj);
    }
}

function doubleJump(obj) {
    if (parseInt((getComputedStyle(obj).bottom)) < 120) {
       obj.animate([
        { backgroundColor: "blue"},
        { backgroundColor: "orange" },
        { bottom: `${parseInt((getComputedStyle(obj).bottom))+40}px` },
        { bottom: '5px' },
    ], {
        duration: 950,
        iterations: 1
    }); 
    } else {
        obj.animate([
            { backgroundColor: "blue" },
            { backgroundColor: "orange" },
            { bottom: `${parseInt((getComputedStyle(obj).bottom))}px` },
            { bottom: '5px' },
        ], {
            duration: 1050,
            iterations: 1
        }); 
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key == "ArrowUp" ) {
        jump(birdDiv); 
    };
});

gameDiv.addEventListener("click", () => {
    jump(birdDiv);
})


function runBird(obj) {
    obj.animate([
        { transform: 'rotate(0)' },
        { transform: 'rotate(360deg)' }
    ], { duration: 1000,
    iterations: Infinity
    });
}


function addObstacle() {
    let obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.classList.add(obstaclesInstances[Math.floor(Math.random() * obstaclesInstances.length)]);
    gameDiv.appendChild(obstacle);
    runObstacle(obstacle);
}

function addLive() {
    let live = document.createElement("div");
    live.classList.add("live");
    gameDiv.appendChild(live);
    let options = ["5px", "25px", "45px", "65px", "85px", "105px", "125px"];
    live.style.bottom = options[Math.floor(Math.random() * options.length)]
    runObstacle(live);
    live.animate([
        { backgroundColor: "yellow" },
        { backgroundColor: "red" },
        { scale: 1 },
        { scale: 1.2 },
    ], {
        duration: 500,
        iterations: Infinity
    });
}

function runObstacle(obj) {
    obj.animate([
        { right: '0' },
        { right: '80vw' }
    ], {
        duration: gameSpeed,
        iterations: 1
    });
}

function startGame() {
    if (gameStarted == true) {
        addObstacle();
    }
    setInterval(() => {
        if (gameStarted == true) {
            addObstacle();
        } 
    }, 1200);
    setInterval(() => {
        if (gameStarted == true) {
            scoreCount.textContent++;  
        }
    }, 1200); 
    setInterval(() => {
        if (gameStarted == true) {
            addLive();
        }
    }, 5200)
}

function removeLive() {
    if (lives > 0) {
        lives--;
    }
    document.querySelector("[data-live-container]").removeChild(document.querySelector("[data-live]"));
}

function appendLive() {
    if (lives < 3) {
        lives++;
        let newLive = document.createElement("ion-icon");
        newLive.name = "heart-outline";
        newLive.dataset.live = "";
        document.querySelector("[data-live-container]").appendChild(newLive);
    }
}

setInterval(() => {
    if ((Math.abs(score - parseInt(scoreCount.textContent))) > 10) {
        score = parseInt(scoreCount.textContent);
        if (interval > 500) {
            interval = interval - 50;
        } 
        setInterval(() => {
            if (gameStarted == true) {
                addObstacle();
            }
        }, interval);
    }
}, 1);

setInterval(() => {
    if (gameStarted == true) {
        document.querySelectorAll(".obstacle").forEach((obstacle) => {
            let firstRule = Math.abs(parseInt(getComputedStyle(obstacle).left + 20) - parseInt(getComputedStyle(birdDiv).left)) < 20;
            let secondRule = Math.abs(parseInt(getComputedStyle(obstacle).bottom + 20) - parseInt(getComputedStyle(birdDiv).bottom)) < 20;
            if (firstRule && secondRule) {
                removeLive();
                if (lives == 0) {
                    gameOver();
                }
            };
        });
        document.querySelectorAll(".live").forEach((live) => {
            let firstRuleLive = Math.abs(parseInt(getComputedStyle(live).left + 15) - parseInt(getComputedStyle(birdDiv).left)) < 30;
            let secondRuleLive = Math.abs(parseInt(getComputedStyle(live).bottom + 15) - parseInt(getComputedStyle(birdDiv).bottom)) < 30;
            if (firstRuleLive && secondRuleLive) {
                appendLive();
            };
        });
    }
}, 150)

function gameOver() {
    if (parseInt(scoreCount.textContent) > localStorage.getItem("bestScore")) {
        localStorage.setItem("bestScore", parseInt(scoreCount.textContent));
        newRecord.style.display = "block";
    }
    location.reload();
}