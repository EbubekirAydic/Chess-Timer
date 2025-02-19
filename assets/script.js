let whiteTime, blackTime, increment, currentTurn = null, Tester = false, interval, baseMinutes;

let whiteTimer = document.getElementById("whiteTime");
let blackTimer = document.getElementById("blackTime");

let StorageKey = {time : 1, Ekstra : 2};

if (localStorage.getItem("StorageKey")) {
    StorageKey = JSON.parse(localStorage.getItem("StorageKey"));
}

document.getElementById("baseTime").value = StorageKey.time;
document.getElementById("increment").value = StorageKey.Ekstra;

function startGame() {
    // Dakika ve ekstra süre değişkene ata
    baseMinutes = parseInt(document.getElementById("baseTime").value);
    increment = parseInt(document.getElementById("increment").value);

    // Local Storage işlemleri
    StorageKey.time = baseMinutes;
    StorageKey.Ekstra = increment;
    localStorage.setItem("StorageKey", JSON.stringify(StorageKey));

    // süreyi saniyeye çevir
    whiteTime = blackTime = baseMinutes * 60;

    // süreyi yazdır
    updateDisplay();

    // menü değişikliği
    document.getElementById("settings").style.display = "none";
    document.getElementById("game").style.display = "block";
}

whiteTimer.addEventListener("click", function() {
    if (!whiteTime == 0 || blackTime == 0) {
        currentTurn == null ? switchTurn('white', baseMinutes) : currentTurn == "white" ? switchTurn('white', baseMinutes) : "";
    }
});
blackTimer.addEventListener("click", function() {
    if (!whiteTime == 0 || blackTime == 0) {
        currentTurn == null ? switchTurn('black', baseMinutes) : currentTurn == "black" ? switchTurn('black', baseMinutes) : "";
    }
});

function getColor(time, baseTime) {
    let percentage = (time / (baseTime * 60)) * 100;

    if (percentage > 50) {
        // 🟩 Yeşilden turuncuya geçiş (Yeşil → Turuncu)
        let red = Math.floor(255 - ((percentage - 50) * (217 / 50)));  // 255 → 38 (azalıyor)
        let green = Math.floor(140 + ((percentage - 50) * (115 / 50))); // 140 → 255 (artıyor)
        return `rgb(${red}, ${green}, 0)`; 
    } else if (percentage > 0) {
        // Turuncudan kırmızıya geçiş (Turuncu: rgb(255, 140, 0) → Kırmızı: rgb(255, 0, 0))
        let orangeToRed = Math.floor((percentage / 50) * 140);
        return `rgb(255, ${orangeToRed}, 0)`;
    } else {
        return "#ff0000"; // Tamamen kırmızı
    }
}



function switchTurn(player, baseMinutes) {
    whiteTimer.style.backgroundColor = "#3c3c3c";
    blackTimer.style.backgroundColor = "#3c3c3c";

    //burada süreye göre örnek beyazın saniye 60 yani 100% ise = yeşil, saniye 30 yani 50% ise = turuncu, saniye 0 yani 0% ise = kırmızı olsun rengi
    let whiteColor = getColor(whiteTime, baseMinutes);
    let blackColor = getColor(blackTime, baseMinutes);

    whiteTimer.style.transition = "background-color 0.5s ease";
    blackTimer.style.transition = "background-color 0.5s ease";

    clearInterval(interval);

    if (currentTurn) {
        if (currentTurn === 'white') whiteTime += increment;
        else blackTime += increment;
    }

    if (currentTurn) {
        player == "white" ? blackTimer.style.backgroundColor = blackColor : whiteTimer.style.backgroundColor = whiteColor;
        if (currentTurn == "white") {
            currentTurn = 'black';
        } else {
            currentTurn = 'white';
        }
    } else {
        player == "white" ? whiteTimer.style.backgroundColor = whiteColor : blackTimer.style.backgroundColor = blackColor;
        currentTurn = player;
    }

    interval = setInterval(() => {
        if (currentTurn === 'white') {
            whiteTimer.style.backgroundColor = getColor(whiteTime, baseMinutes);
            whiteTime = Math.max(0, whiteTime - 1);
        } else {
            blackTimer.style.backgroundColor = getColor(blackTime, baseMinutes);
            blackTime = Math.max(0, blackTime - 1);
        }
        updateDisplay();
        if (whiteTime === 0 || blackTime === 0) clearInterval(interval);
    }, 1000);
}

function updateDisplay() {
    whiteTimer.innerHTML = formatTime(whiteTime);
    blackTimer.innerHTML = formatTime(blackTime);
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
    

    document.getElementById("gameDiv").innerHTML = `
            <div class="row">
                <div class="col position-absolute top-0 start-0 end-0">
                    <h1>Chess Timer</h1>
                </div>
            </div>` + document.getElementById("Timess").innerHTML + `
            <div class="row">
                <div class="col position-absolute bottom-0 start-0 end-0">
                    <h1 style="transform: rotate(180deg);">Chess Timer</h1>
                </div>
            </div>`;
                
    document.getElementById("whiteTime").style.transform = "rotate(180deg)";

} else {
    console.log("Masaüstü cihaz kullanılıyor.");
}
