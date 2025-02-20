if (/Mobi|Android/i.test(navigator.userAgent)) {
    console.log("Mobil cihaz kullanılıyor.");

    console.log(document.getElementById("gameDiv").innerHTML);

    // 180 derece döndürme işlemi
    document.getElementById("Timess").innerHTML = `
                <div class="row my-1">
                    <div class="col OrtalamaXY">
                        <div class="timer user-select-none" id="whiteTime">5:00</div>
                    </div>
                </div>
                <div class="row my-1">
                    <div class="col OrtalamaXY">
                        <div class="timer user-select-none" id="blackTime">5:00</div>
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

let whiteTime, blackTime, increment, currentTurn = null, interval, baseMinutes;

let whiteTimer = document.getElementById("whiteTime");
let blackTimer = document.getElementById("blackTime");

let greenColor;
let orangeColor;
let redColor;

let StorageKey = {time : 10, Ekstra : 2,Color : ["#206c0d", "#d95108", "#a91111"]};

if (localStorage.getItem("StorageKey")) {
    StorageKey = JSON.parse(localStorage.getItem("StorageKey"));
    document.getElementById("baseTime").value = StorageKey.time;
    document.getElementById("increment").value = StorageKey.Ekstra;
    document.getElementById("greenColor").value = detectColorFormat2(StorageKey.Color[0]);
    document.getElementById("orangeColor").value = detectColorFormat2(StorageKey.Color[1]);
    document.getElementById("redColor").value = detectColorFormat2(StorageKey.Color[2]);
}

function reset() {
    localStorage.removeItem("StorageKey");
    StorageKey = {time : 10, Ekstra : 0,Color : ["#206c0d", "#d95108", "#a91111"]};
    document.getElementById("baseTime").value = StorageKey.time;
    document.getElementById("increment").value = StorageKey.Ekstra;
    document.getElementById("greenColor").value = StorageKey.Color[0];
    document.getElementById("orangeColor").value = StorageKey.Color[1];
    document.getElementById("redColor").value = StorageKey.Color[2];
}

function startGame() {
    // Dakika ve ekstra süre değişkene ata
    baseMinutes = parseInt(document.getElementById("baseTime").value);
    increment = parseInt(document.getElementById("increment").value);
    greenColor = detectColorFormat(document.getElementById("greenColor").value);
    orangeColor = detectColorFormat(document.getElementById("orangeColor").value);
    redColor = detectColorFormat(document.getElementById("redColor").value);

    // Local Storage işlemleri
    StorageKey.time = baseMinutes;
    StorageKey.Ekstra = increment;
    StorageKey.Color[0] = greenColor;
    StorageKey.Color[1] = orangeColor;
    StorageKey.Color[2] = redColor;
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

function detectColorFormat(color) {
    // HEX formatı: #RRGGBB veya kısa HEX: #RGB
    const hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
    
    // RGB formatı: rgb(r, g, b)
    const rgbRegex = /^rgb(a?)\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(,\s*(0|1|0?\.\d+))?\)$/;
    
    // HSL formatı: hsl(h, s%, l%)
    const hslRegex = /^hsl(a?)\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/;
    
    // CMYK formatı: cmyk(c%, m%, y%, k%)
    const cmykRegex = /^cmyk\((\d{1,3})%,\s*(\d{1,3})%,\s*(\d{1,3})%,\s*(\d{1,3})%\)$/;
    
    // HSLA formatı: hsla(h, s%, l%, a)
    const hslaRegex = /^hsla\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%,\s*(0|1|0?\.\d+)\)$/;

    // HEX formatı
    if (hexRegex.test(color)) {
        return hexToRgb(color);
    } 
    // RGB formatı
    else if (rgbRegex.test(color)) {
        console.log(color + "Bu bir rgb")
        return color;
    } 
    // HSL formatı
    else if (hslRegex.test(color)) {
        return 'HSL';
    } 
    // CMYK formatı
    else if (cmykRegex.test(color)) {
        return 'CMYK';
    }
    // HSLA formatı
    else if (hslaRegex.test(color)) {
        return 'HSLA';
    } 
    else {
        return 'Unknown format'; // Tanınmayan format
    }
}

function detectColorFormat2(color) {
    // HEX formatı: #RRGGBB veya kısa HEX: #RGB
    const hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
    
    // RGB formatı: rgb(r, g, b)
    const rgbRegex = /^rgb(a?)\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(,\s*(0|1|0?\.\d+))?\)$/;
    
    // HSL formatı: hsl(h, s%, l%)
    const hslRegex = /^hsl(a?)\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/;
    
    // CMYK formatı: cmyk(c%, m%, y%, k%)
    const cmykRegex = /^cmyk\((\d{1,3})%,\s*(\d{1,3})%,\s*(\d{1,3})%,\s*(\d{1,3})%\)$/;
    
    // HSLA formatı: hsla(h, s%, l%, a)
    const hslaRegex = /^hsla\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%,\s*(0|1|0?\.\d+)\)$/;

    // HEX formatı
    if (hexRegex.test(color)) {
        return color;
    } 
    // RGB formatı
    else if (rgbRegex.test(color)) {
        return rgbToHex(color);
    } 
    // HSL formatı
    else if (hslRegex.test(color)) {
        return 'HSL';
    } 
    // CMYK formatı
    else if (cmykRegex.test(color)) {
        return 'CMYK';
    }
    // HSLA formatı
    else if (hslaRegex.test(color)) {
        return 'HSLA';
    } 
    else {
        return 'Unknown format'; // Tanınmayan format
    }
}

function rgbToHex(rgbString) {
    // rgb(255, 0, 0) gibi string'i düzenle
    const result = rgbString.match(/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/);

    if (!result) {
        throw new Error('Geçersiz RGB formatı');
    }

    // R, G, B bileşenlerini al
    const r = parseInt(result[1]);
    const g = parseInt(result[2]);
    const b = parseInt(result[3]);

    // HEX'e dönüştürme fonksiyonu
    const toHex = (x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    // HEX formatında döndür
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex) {
    // '#' işaretini kaldır
    hex = hex.replace(/^#/, '');

    // Eğer 3 karakterli HEX formatıysa (#FFF gibi), bunu tam formatına çevir
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // HEX kodunu sayıya çevir ve RGB değerlerini ayır
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // rgb(r, g, b) formatında döndür
    return `rgb(${r}, ${g}, ${b})`;
}

function renkGecisi(renk1, renk2, renk3, baslangicZamani, gecisSuresi, simdikiZaman) {
    baslangicZamani *=60;
    gecisSuresi *=60;
    
    let gecenSure = baslangicZamani - simdikiZaman;
    
    // Geçiş süresini aşarsa renk2'yi döndür
    if (gecenSure >= gecisSuresi) return renk2;

    // Geçiş oranını hesapla (0 ile 1 arasında)
    let oran = gecenSure / gecisSuresi;
    let oran2 = gecenSure / (gecisSuresi/2);

    if (oran < 0.5) {
        // RGB formatına çevirme
        let rgb1 = renk1.match(/\d+/g).map(Number);
        let rgb2 = renk2.match(/\d+/g).map(Number);
    
        // Yeni renk değerlerini hesapla
        let r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * oran2);
        let g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * oran2);
        let b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * oran2);
    
        return `rgb(${r}, ${g}, ${b})`;
    }else{
        // RGB formatına çevirme
        let rgb1 = renk2.match(/\d+/g).map(Number);
        let rgb2 = renk3.match(/\d+/g).map(Number);
    
        // Yeni renk değerlerini hesapla
        let r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * oran);
        let g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * oran);
        let b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * oran);
    
        return `rgb(${r}, ${g}, ${b})`;
    }

}

function switchTurn(player, baseMinutes) {

    if (currentTurn) {
        if (currentTurn === 'white'){
            whiteTime += increment;
            updateDisplay();
        } 
        else{
            blackTime += increment;
            updateDisplay();
        }
    }

    deActive();

    //burada süreye göre örnek beyazın saniye 60 yani 100% ise = yeşil, saniye 30 yani 50% ise = turuncu, saniye 0 yani 0% ise = kırmızı olsun rengi

    
    let whiteColor = renkGecisi(greenColor, orangeColor, redColor, baseMinutes, baseMinutes, whiteTime);
    let blackColor = renkGecisi(greenColor, orangeColor, redColor, baseMinutes, baseMinutes, blackTime);

    whiteTimer.style.transition = "background-color 0.1s ease";
    blackTimer.style.transition = "background-color 0.1s ease";

    clearInterval(interval);


    if (currentTurn) {
        if (player == "white") {
            blackTimer.style.backgroundColor = blackColor;
            blackTimer.style.color = "#ffffff"
        }else{
            whiteTimer.style.backgroundColor = whiteColor;
            whiteTimer.style.color = "#ffffff";
        }

        if (currentTurn == "white") {
            currentTurn = 'black';
        } else {
            currentTurn = 'white';
        }
    } else {
        if (player == "white") {
            whiteTimer.style.backgroundColor = whiteColor;
            whiteTimer.style.color = "#ffffff";
        }else{
            blackTimer.style.backgroundColor = blackColor;
            blackTimer.style.color = "#ffffff"
        }
        currentTurn = player;
    }

    interval = setInterval(() => {
        if (currentTurn === 'white') {
            whiteTimer.style.color = "#ffffff";
            whiteTime = Math.max(0, whiteTime - 0.01);
            whiteTimer.style.backgroundColor = renkGecisi(greenColor, orangeColor, redColor, baseMinutes, baseMinutes, whiteTime);
        } else {
            blackTimer.style.color = "#ffffff";
            blackTime = Math.max(0, blackTime - 0.01);
            blackTimer.style.backgroundColor = renkGecisi(greenColor, orangeColor, redColor, baseMinutes, baseMinutes, blackTime);
        }
        updateDisplay();
        if (whiteTime === 0 || blackTime === 0) clearInterval(interval);
    }, 10);
}

function deActive() {
    let Timers = [whiteTimer,blackTimer]
    for (let i = 0; i < Timers.length; i++) {
        if (currentTurn + "Time" == Timers[i].id) {
            
        }
        Timers[i].style.backgroundColor = "#3c3c3c";
        Timers[i].style.color = "#1c1c1c";
    }
}

function updateDisplay() {
    whiteTimer.innerHTML = formatTime(whiteTime);
    blackTimer.innerHTML = formatTime(blackTime);
}
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return "<b>" + `${minutes}:${secs < 10 ? '0' : ''}${secs}` + "</b>";
}
