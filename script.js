/* Vanessa Sweet 15 — Ultimate Edition */

const TARGET_DATE = new Date("2026-09-01T00:00:00Z");
const $ = id => document.getElementById(id);

const daysEl = $("days"), hoursEl = $("hours"), minutesEl = $("minutes"), secondsEl = $("seconds");
const vault = $("vault"), website = $("website"), unlockBtn = $("unlockBtn");
const celebrateBtn = $("celebrateBtn"), cakeBtn = $("cakeBtn"), giftBtn = $("giftBtn"), fireworksBtn = $("fireworksBtn");
const settingsBtn = $("settingsBtn"), settingsDialog = $("settingsDialog"), toast = $("toast");
const reducedEffects = $("reducedEffects"), autoFireworks = $("autoFireworks");

let birthdayUnlocked = false;
let reduced = localStorage.getItem("vanessa-reduced") === "true";
let auto = localStorage.getItem("vanessa-auto-fireworks") !== "false";
if (reducedEffects) reducedEffects.checked = reduced;
if (autoFireworks) autoFireworks.checked = auto;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function format(n){return String(Math.max(0,n)).padStart(2,"0")}

function updateCountdown(){
  if(birthdayUnlocked) return;
  const diff = TARGET_DATE.getTime() - Date.now();
  if(diff <= 0){ unlockBirthday(); return; }
  const total = Math.floor(diff/1000);
  if(daysEl) daysEl.textContent = format(Math.floor(total/86400));
  if(hoursEl) hoursEl.textContent = format(Math.floor(total%86400/3600));
  if(minutesEl) minutesEl.textContent = format(Math.floor(total%3600/60));
  if(secondsEl) secondsEl.textContent = format(total%60);
}

function unlockBirthday(){
  if(birthdayUnlocked) return;
  birthdayUnlocked = true;
  vault?.classList.add("unlocked");
  setTimeout(()=>{
    if(vault) vault.style.display="none";
    if(website) website.hidden=false;
    launchConfetti(reduced ? 45 : 160);
    launchFireworks(reduced ? 2 : 5);
    if("speechSynthesis" in window){
      speechSynthesis.cancel();
      const voice=new SpeechSynthesisUtterance("Happy fifteenth birthday Vanessa!");
      voice.rate=.95; voice.pitch=1.15; speechSynthesis.speak(voice);
    }
  },700);
}

updateCountdown();
setInterval(updateCountdown,1000);

const starCanvas=$("stars"), starCtx=starCanvas?.getContext("2d");
let stars=[];
function resizeStars(){if(!starCanvas)return;starCanvas.width=innerWidth;starCanvas.height=innerHeight}
function createStars(){if(!starCanvas)return;stars=Array.from({length:reduced?90:180},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.7+.3,v:Math.random()*.25+.04,a:Math.random()*.7+.2,t:Math.random()*.018+.004}))}
function drawStars(){if(!starCtx)return;starCtx.clearRect(0,0,innerWidth,innerHeight);for(const s of stars){s.a+=s.t;if(s.a>=1||s.a<=.15)s.t*=-1;s.y+=s.v;if(s.y>innerHeight){s.y=-4;s.x=Math.random()*innerWidth}starCtx.beginPath();starCtx.arc(s.x,s.y,s.r,0,Math.PI*2);starCtx.fillStyle=`rgba(255,255,255,${s.a})`;starCtx.fill()}requestAnimationFrame(drawStars)}
resizeStars();createStars();drawStars();addEventListener("resize",()=>{resizeStars();createStars()});

function launchConfetti(count=120){
  const canvas=$("confetti"),ctx=canvas?.getContext("2d");if(!ctx)return;
  canvas.width=innerWidth;canvas.height=innerHeight;
  const colors=["#ff4fc8","#8b5cf6","#67e8f9","#ffd166","#ffffff"];
  const pieces=Array.from({length:count},()=>({x:Math.random()*canvas.width,y:-20-Math.random()*200,w:4+Math.random()*6,h:6+Math.random()*11,v:2+Math.random()*4,d:Math.random()*2-1,r:Math.random()*6,vr:Math.random()*.25-.12,c:colors[Math.floor(Math.random()*colors.length)],life:130+Math.random()*90}));
  function frame(){ctx.clearRect(0,0,canvas.width,canvas.height);let alive=false;for(const p of pieces){if(p.life<=0)continue;alive=true;p.life--;p.y+=p.v;p.x+=p.d;p.r+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore()}if(alive)requestAnimationFrame(frame)}frame();
}

function launchFireworks(bursts=4){
  if(reduced) bursts=Math.min(2,bursts);
  const canvas=$("fireworks"),ctx=canvas?.getContext("2d");if(!ctx)return;
  canvas.width=innerWidth;canvas.height=innerHeight;
  for(let b=0;b<bursts;b++) setTimeout(()=>fireworkBurst(ctx,canvas),b*420);
}
function fireworkBurst(ctx,canvas){
  const x=canvas.width*(.18+Math.random()*.64), y=canvas.height*(.16+Math.random()*.35), hue=Math.floor(Math.random()*360);
  const count=reduced?28:55;const particles=Array.from({length:count},(_,i)=>{const a=Math.PI*2*i/count+Math.random()*.1,s=2+Math.random()*3;return{x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:45+Math.random()*20}});
  function frame(){ctx.clearRect(0,0,canvas.width,canvas.height);let alive=false;for(const p of particles){if(p.life<=0)continue;alive=true;p.life--;p.x+=p.vx;p.y+=p.vy;p.vy+=.035;ctx.beginPath();ctx.arc(p.x,p.y,1.7,0,Math.PI*2);ctx.fillStyle=`hsl(${hue+Math.random()*50},100%,70%)`;ctx.fill()}if(alive)requestAnimationFrame(frame)}frame();
}

celebrateBtn?.addEventListener("click",()=>{launchConfetti(reduced?60:180);launchFireworks(reduced?2:5);showToast("✨ Celebration mode activated!")});
fireworksBtn?.addEventListener("click",()=>{launchFireworks(reduced?2:7);showToast("🎆 Fireworks launched!")});

giftBtn?.addEventListener("click",()=>{
  launchConfetti(reduced?40:90);
  showToast("🎁 Secret unlocked: Vanessa, you deserve a ridiculously good year.");
  giftBtn.innerHTML='<span class="feature-icon">💜</span><small>GIFT UNLOCKED</small><strong>For you, Vanessa.</strong><em>Keep shining →</em>';
});

cakeBtn?.addEventListener("click",()=>{
  cakeBtn.innerHTML='<span class="feature-icon">🕯️</span><small>WISH COMPLETE</small><strong>15 candles are lit!</strong><em>Make your wish ✨</em>';
  launchConfetti(reduced?45:110);launchFireworks(reduced?2:4);showToast("🎂 Candles lit. Make a wish!");
});

settingsBtn?.addEventListener("click",()=>settingsDialog?.showModal());
reducedEffects?.addEventListener("change",e=>{reduced=e.target.checked;localStorage.setItem("vanessa-reduced",reduced);createStars();showToast(reduced?"🌙 Reduced effects enabled":"✨ Full effects restored")});
autoFireworks?.addEventListener("change",e=>{auto=e.target.checked;localStorage.setItem("vanessa-auto-fireworks",auto);showToast(auto?"🎆 Auto fireworks enabled":"🛑 Auto fireworks disabled")});

if(auto) setInterval(()=>{if(!reduced && !document.hidden && website && !website.hidden) launchFireworks(1)},18000);

addEventListener("resize",()=>["fireworks","confetti"].forEach(id=>{const c=$(id);if(c){c.width=innerWidth;c.height=innerHeight}}));
