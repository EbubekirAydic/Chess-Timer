
let whiteTime, blackTime, increment, currentTurn = null, interval;
        
function startGame() {
    let baseMinutes = parseInt(document.getElementById("baseTime").value);
    increment = parseInt(document.getElementById("increment").value);
    whiteTime = blackTime = baseMinutes * 60;
    updateDisplay();
    document.getElementById("settings").style.display = "none";
    document.getElementById("game").style.display = "block";
}

function switchTurn(player) {
    clearInterval(interval);
    if (currentTurn) {
        if (currentTurn === 'white') whiteTime += increment;
        else blackTime += increment;
    }
    currentTurn = player;
    interval = setInterval(() => {
        if (currentTurn === 'white') {
            whiteTime = Math.max(0, whiteTime - 1);
        } else {
            blackTime = Math.max(0, blackTime - 1);
        }
        updateDisplay();
        if (whiteTime === 0 || blackTime === 0) clearInterval(interval);
    }, 1000);
}

function updateDisplay() {
    document.getElementById("whiteTime").innerText = formatTime(whiteTime);
    document.getElementById("blackTime").innerText = formatTime(blackTime);
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}