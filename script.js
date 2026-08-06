/* ==========================================
   Vanessa Sweet 15 Ultimate Edition
   script.js
   Part 1 - Foundation
========================================== */

const TARGET_DATE = new Date("2026-09-01T00:00:00Z");

// Elements
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const vault = document.getElementById("vault");
const website = document.getElementById("website");

const unlockBtn = document.getElementById("unlockBtn");
const celebrateBtn = document.getElementById("celebrateBtn");

// -------------------------------------
// Internet Time
// -------------------------------------

async function getCurrentTime() {

    // Try TimeAPI.io
    try {

        const res = await fetch(
            "https://timeapi.io/api/Time/current/zone?timeZone=UTC"
        );

        if (res.ok) {

            const data = await res.json();

            return new Date(data.dateTime);

        }

    } catch (e) {}

    // Try WorldTimeAPI

    try {

        const res = await fetch(
            "https://worldtimeapi.org/api/timezone/Etc/UTC"
        );

        if (res.ok) {

            const data = await res.json();

            return new Date(data.datetime);

        }

    } catch (e) {}

    // Fallback

    console.warn("Using local device time.");

    return new Date();

}

// -------------------------------------
// Countdown
// -------------------------------------

function format(number) {

    return String(number).padStart(2, "0");

}

async function updateCountdown() {

    const now = await getCurrentTime();

    const diff = TARGET_DATE - now;

    if (diff <= 0) {

        unlockBirthday();

        return;

    }

    const days = Math.floor(diff / 86400000);

    const hours = Math.floor(diff / 3600000) % 24;

    const mins = Math.floor(diff / 60000) % 60;

    const secs = Math.floor(diff / 1000) % 60;

    daysEl.textContent = format(days);

    hoursEl.textContent = format(hours);

    minutesEl.textContent = format(mins);

    secondsEl.textContent = format(secs);

}

// -------------------------------------
// Unlock
// -------------------------------------

function unlockBirthday() {

    vault.style.display = "none";

    website.hidden = false;

    launchConfetti(150);

    launchFireworks();

    if ("speechSynthesis" in window) {

        const speech = new SpeechSynthesisUtterance(
            "Happy fifteenth Birthday Vanessa!"
        );

        speech.rate = 0.95;

        speech.pitch = 1.2;

        speechSynthesis.speak(speech);

    }

}

// -------------------------------------
// Celebrate Button
// -------------------------------------

celebrateBtn?.addEventListener("click", () => {

    launchConfetti(150);

    launchFireworks();

});

// -------------------------------------
// Placeholder Effects
// -------------------------------------
/* ==========================================
   Starfield Engine
========================================== */

const starCanvas = document.getElementById("stars");
const starCtx = starCanvas.getContext("2d");

let stars = [];

function resizeStarCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeStarCanvas);
resizeStarCanvas();

function createStars(count = 200) {
    stars = [];

    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * starCanvas.width,
            y: Math.random() * starCanvas.height,
            radius: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.25 + 0.05,
            alpha: Math.random(),
            twinkle: Math.random() * 0.02 + 0.005
        });
    }
}

createStars();

function drawStars() {

    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    stars.forEach(star => {

        star.alpha += star.twinkle;

        if (star.alpha >= 1 || star.alpha <= 0.2) {
            star.twinkle *= -1;
        }

        star.y += star.speed;

        if (star.y > starCanvas.height) {
            star.y = -5;
            star.x = Math.random() * starCanvas.width;
        }

        starCtx.beginPath();
        starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        starCtx.fill();
    });

    requestAnimationFrame(drawStars);
}

drawStars();
function shootingStar() {

    const x = Math.random() * starCanvas.width;
    const y = Math.random() * (starCanvas.height / 2);

    starCtx.beginPath();
    starCtx.moveTo(x, y);
    starCtx.lineTo(x + 150, y + 60);

    starCtx.strokeStyle = "rgba(255,255,255,.8)";
    starCtx.lineWidth = 2;
    starCtx.stroke();

}

setInterval(shootingStar, 8000);