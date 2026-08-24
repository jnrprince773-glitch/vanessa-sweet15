/* ==========================================
   Vanessa Sweet 15 — Stable Edition
========================================== */

// Use the birthday date in UTC so the vault behaves consistently on every device.
const TARGET_DATE = new Date("2026-09-01T00:00:00Z");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const vault = document.getElementById("vault");
const website = document.getElementById("website");
const unlockBtn = document.getElementById("unlockBtn");
const celebrateBtn = document.getElementById("celebrateBtn");
const giftBtn = document.getElementById("giftBtn");
const cakeBtn = document.getElementById("cakeBtn");

function format(number) {
    return String(Math.max(0, number)).padStart(2, "0");
}

// Countdown uses the device clock directly. This avoids the old dependency on
// external time APIs, which could fail and leave the UI stuck at 00:00:00.
function updateCountdown() {
    const now = new Date();
    const diff = TARGET_DATE.getTime() - now.getTime();

    if (diff <= 0) {
        unlockBirthday();
        return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = format(days);
    hoursEl.textContent = format(hours);
    minutesEl.textContent = format(minutes);
    secondsEl.textContent = format(seconds);

    if (unlockBtn) {
        unlockBtn.disabled = true;
        unlockBtn.textContent = "Waiting...";
    }
}

let birthdayUnlocked = false;

function unlockBirthday() {
    if (birthdayUnlocked) return;
    birthdayUnlocked = true;

    if (vault) vault.style.display = "none";
    if (website) website.hidden = false;

    launchConfetti(150);
    launchFireworks();

    if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance("Happy fifteenth Birthday Vanessa!");
        speech.rate = 0.95;
        speech.pitch = 1.2;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
    }
}

// Run immediately, then once per second.
updateCountdown();
setInterval(updateCountdown, 1000);

/* ==========================================
   Starfield
========================================== */

const starCanvas = document.getElementById("stars");
const starCtx = starCanvas ? starCanvas.getContext("2d") : null;
let stars = [];

function resizeStarCanvas() {
    if (!starCanvas) return;
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}

function createStars(count = 160) {
    if (!starCanvas) return;
    stars = Array.from({ length: count }, () => ({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        radius: Math.random() * 1.8 + 0.4,
        speed: Math.random() * 0.25 + 0.05,
        alpha: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * 0.02 + 0.005
    }));
}

function drawStars() {
    if (!starCanvas || !starCtx) return;

    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    stars.forEach(star => {
        star.alpha += star.twinkle;
        if (star.alpha >= 1 || star.alpha <= 0.2) star.twinkle *= -1;
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

function shootingStar() {
    if (!starCanvas || !starCtx) return;

    const x = Math.random() * starCanvas.width;
    const y = Math.random() * (starCanvas.height / 2);
    starCtx.beginPath();
    starCtx.moveTo(x, y);
    starCtx.lineTo(x + 150, y + 60);
    starCtx.strokeStyle = "rgba(255,255,255,.8)";
    starCtx.lineWidth = 2;
    starCtx.stroke();
}

resizeStarCanvas();
createStars();
drawStars();
window.addEventListener("resize", () => {
    resizeStarCanvas();
    createStars();
});
setInterval(shootingStar, 8000);

/* ==========================================
   Effects — safe fallbacks so buttons never
   throw ReferenceError if the canvas effects
   are unavailable.
========================================== */

function launchConfetti(count = 100) {
    const canvas = document.getElementById("confetti");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.3,
        size: Math.random() * 7 + 4,
        speed: Math.random() * 4 + 2,
        drift: Math.random() * 2 - 1,
        rotation: Math.random() * Math.PI,
        rotationSpeed: Math.random() * 0.2 - 0.1,
        life: 120 + Math.random() * 100
    }));

    function frame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        pieces.forEach(p => {
            if (p.life <= 0) return;
            alive = true;
            p.life--;
            p.y += p.speed;
            p.x += p.drift;
            p.rotation += p.rotationSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = `hsl(${Math.random() * 360}, 90%, 65%)`;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
            ctx.restore();
        });

        if (alive) requestAnimationFrame(frame);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    frame();
}

function launchFireworks() {
    const canvas = document.getElementById("fireworks");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bursts = 3;
    for (let b = 0; b < bursts; b++) {
        setTimeout(() => {
            const x = canvas.width * (0.2 + Math.random() * 0.6);
            const y = canvas.height * (0.2 + Math.random() * 0.35);
            const particles = Array.from({ length: 45 }, (_, i) => {
                const angle = (Math.PI * 2 * i) / 45;
                return {
                    x, y,
                    vx: Math.cos(angle) * (2 + Math.random() * 3),
                    vy: Math.sin(angle) * (2 + Math.random() * 3),
                    life: 55
                };
            });

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let alive = false;
                particles.forEach(p => {
                    if (p.life <= 0) return;
                    alive = true;
                    p.life--;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.035;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 70%)`;
                    ctx.fill();
                });
                if (alive) requestAnimationFrame(animate);
            }
            animate();
        }, b * 450);
    }
}

/* ==========================================
   Buttons
========================================== */

celebrateBtn?.addEventListener("click", () => {
    launchConfetti(180);
    launchFireworks();
});

giftBtn?.addEventListener("click", () => {
    alert("🎁 A special birthday surprise is waiting for you, Vanessa! 💜");
});

cakeBtn?.addEventListener("click", () => {
    cakeBtn.textContent = "✨ Candles Lit! Make a Wish! 🎂";
    cakeBtn.disabled = true;
    launchConfetti(80);
});

window.addEventListener("resize", () => {
    ["confetti", "fireworks"].forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
});
