
let whiteTime, blackTime, increment, currentTurn = null, Tester = false, interval;
        
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
    document.getElementById("whiteTime").innerHTML = formatTime(whiteTime);
    document.getElementById("blackTime").innerHTML = formatTime(blackTime);
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return "<b>" + `${minutes}:${secs < 10 ? '0' : ''}${secs}` + "</b>";
}

if (/Mobi|Android/i.test(navigator.userAgent) || Tester) {
    console.log("Mobil cihaz kullanılıyor.");

    // 180 derece döndürme işlemi
    document.getElementById("Timess").innerHTML = `
                <div class="row my-1">
                    <div class="col OrtalamaXY">
                        <div class="timer" id="whiteTime">5:00</div>
                    </div>
                </div>
                <div class="row my-1">
                    <div class="col OrtalamaXY">
                        <div class="timer" id="blackTime">5:00</div>
                    </div>
                </div>`
                
    document.getElementById("whiteTime").style.transform = "rotate(180deg)";

} else {
    console.log("Masaüstü cihaz kullanılıyor.");
}
