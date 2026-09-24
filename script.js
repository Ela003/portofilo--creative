/* ================= PARTICLES ================= */

const canvas=document.getElementById("space");
const ctx=canvas.getContext("2d");
let W,H;

function resize(){
W=canvas.width=innerWidth;
H=canvas.height=innerHeight;
}
resize();
addEventListener("resize",resize);

const particles=[];

for(let i=0;i<140;i++){
particles.push({
x:Math.random()*innerWidth,
y:Math.random()*innerHeight,
vx:(Math.random()-.5)*.35,
vy:(Math.random()-.5)*.35,
r:Math.random()*1.5+.3
});
}

function particlesLoop(){

ctx.clearRect(0,0,W,H);

for(const p of particles){

p.x+=p.vx;
p.y+=p.vy;

if(p.x<0)p.x=W;
if(p.x>W)p.x=0;
if(p.y<0)p.y=H;
if(p.y>H)p.y=0;

ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fillStyle="rgba(216,255,50,.7)";
ctx.fill();
}

for(let i=0;i<particles.length;i++){

for(let j=i+1;j<particles.length;j++){

const a=particles[i],b=particles[j];
const dx=a.x-b.x,dy=a.y-b.y;
const d=Math.sqrt(dx*dx+dy*dy);

if(d<130){

ctx.beginPath();
ctx.moveTo(a.x,a.y);
ctx.lineTo(b.x,b.y);
ctx.strokeStyle=`rgba(216,255,50,${.12*(1-d/130)})`;
ctx.stroke();

}

}
}

requestAnimationFrame(particlesLoop);
}

particlesLoop();


/* ================= CURSOR ================= */

const cursor=document.querySelector(".cursor");
const cursorRing=document.querySelector(".cursor-ring");

document.addEventListener("mousemove",e=>{

cursor.style.left=e.clientX+"px";
cursor.style.top=e.clientY+"px";

cursorRing.style.left=e.clientX+"px";
cursorRing.style.top=e.clientY+"px";

});


/* ================= 3D PORTAL ================= */

const portal=document.getElementById("portal");

if(portal){
document.addEventListener("mousemove",e=>{

const x=e.clientX/innerWidth-.5;
const y=e.clientY/innerHeight-.5;

portal.style.transform=
`rotateY(${x*15}deg) rotateX(${-y*15}deg)`;

});

portal.addEventListener("mouseleave",()=>{
portal.style.transform="";
});
}


/* ================= CARD TILT ================= */

document.querySelectorAll(".card").forEach(card=>{

card.addEventListener("mousemove",e=>{

const r=card.getBoundingClientRect();

const x=(e.clientX-r.left)/r.width-.5;
const y=(e.clientY-r.top)/r.height-.5;

card.style.transform=
`perspective(900px)
 rotateX(${y*-12}deg)
 rotateY(${x*12}deg)
 translateZ(10px)`;

});

card.addEventListener("mouseleave",()=>{
card.style.transform="";
});

});


/* ================= MULTI SCROLL ENTRANCE ================= */

const effects=[
"entrance-left",
"entrance-right",
"entrance-up",
"entrance-down",
"entrance-zoom",
"entrance-rotate",
"entrance-flip",
"entrance-skew",
"entrance-blur",
"entrance-cinematic"
];

let effectIndex=0;

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(!entry.isIntersecting)return;

const el=entry.target;

effects.forEach(x=>el.classList.remove(x));

const effect=effects[effectIndex%effects.length];

effectIndex++;

el.classList.add("visible",effect);

});

},{threshold:.15});

document.querySelectorAll(".reveal").forEach(el=>{
observer.observe(el);
});


/* ================= SCROLL PERCENT ================= */

addEventListener("scroll",()=>{

const max=document.documentElement.scrollHeight-innerHeight;

const value=Math.round(scrollY/max*100);

document.getElementById("scrollPercent").textContent=
Math.max(0,Math.min(100,value))+"%";

});


/* ================= SOUND ================= */

let audioCtx;

function sound(){

try{

audioCtx ||= new AudioContext();

const osc=audioCtx.createOscillator();
const gain=audioCtx.createGain();

osc.frequency.value=420;
gain.gain.setValueAtTime(.035,audioCtx.currentTime);
gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.18);

osc.connect(gain);
gain.connect(audioCtx.destination);

osc.start();
osc.stop(audioCtx.currentTime+.18);

}catch(e){}

}


/* ================= MODAL ================= */

const modal=document.getElementById("modal");
const modalTitle=modal ? document.getElementById("modalTitle") : null;
const modalText=modal ? document.getElementById("modalText") : null;
const modalAction=modal ? document.getElementById("modalAction") : null;

function openAction(action){

if(!modal || !modalTitle || !modalText || !modalAction) return;

sound();

modalTitle.textContent=action;

modalText.textContent=
action+" has been activated. This interface module is ready for your real project functionality.";

modalAction.textContent="EXECUTE";

modalAction.onclick=()=>{

sound();

modalText.textContent=
action+" executed successfully.";

};

modal.classList.add("active");

}

document.querySelectorAll("[data-action]").forEach(btn=>{

btn.addEventListener("click",e=>{

e.stopPropagation();

openAction(btn.dataset.action);

});

});

const modalClose=document.getElementById("modalClose");
if(modalClose && modal){
modalClose.onclick=()=>{
modal.classList.remove("active");
};

modal.addEventListener("click",e=>{
if(e.target===modal)modal.classList.remove("active");
});
}


/* ================= ABOUT NAVIGATION ================= */

function goToAbout(){

sound();

document.getElementById("about").scrollIntoView({
behavior:"smooth",
block:"start"
});

}


/* ================= NAV LINKS ================= */

document.querySelectorAll(".orbit-item").forEach(link=>{

link.addEventListener("click",e=>{

e.preventDefault();

const target=document.querySelector(link.getAttribute("href"));

target.scrollIntoView({
behavior:"smooth"
});

sound();

});

});


/* ================= DRAGGABLE ORBIT NAV ================= */

const orbitNav=document.querySelector(".orbit-nav");
let orbitDragging=false;
let orbitDragStartX=0;
let orbitDragStartY=0;
let orbitDragStartLeft=0;
let orbitDragStartTop=0;

if(orbitNav){

orbitNav.addEventListener("pointerdown",e=>{

if(e.target.closest("a, button")) return;

orbitDragging=true;
orbitNav.classList.add("dragging");
orbitDragStartX=e.clientX;
orbitDragStartY=e.clientY;

const rect=orbitNav.getBoundingClientRect();
orbitDragStartLeft=rect.left;
orbitDragStartTop=rect.top;

orbitNav.style.right="auto";
orbitNav.style.top="auto";
orbitNav.style.left=rect.left+"px";
orbitNav.style.top=rect.top+"px";
orbitNav.style.transform="none";
orbitNav.setPointerCapture?.(e.pointerId);
});

orbitNav.addEventListener("pointermove",e=>{
if(!orbitDragging) return;

const dx=e.clientX-orbitDragStartX;
const dy=e.clientY-orbitDragStartY;

orbitNav.style.left=(orbitDragStartLeft+dx)+"px";
orbitNav.style.top=(orbitDragStartTop+dy)+"px";

});

const stopOrbitDrag=(e)=>{
if(!orbitDragging) return;
orbitDragging=false;
orbitNav.classList.remove("dragging");
if(e && orbitNav.hasPointerCapture?.(e.pointerId)){
orbitNav.releasePointerCapture(e.pointerId);
}
};

orbitNav.addEventListener("pointerup",stopOrbitDrag);
orbitNav.addEventListener("pointerleave",stopOrbitDrag);
orbitNav.addEventListener("pointercancel",stopOrbitDrag);

}


/* ================= CENTER NAV ================= */

const orbitCenter=document.getElementById("orbitCenter");
if(orbitCenter){
orbitCenter.onclick=()=>{

document.getElementById("home").scrollIntoView({
behavior:"smooth"
});

sound();

};
}


/* ================= ELAVARASAN PROFILE ================= */
const profileButton=document.getElementById("profileButton");
if(profileButton && modal && modalTitle && modalText && modalAction){
profileButton.onclick=()=>{

sound();

modalTitle.textContent="ELAVARASAN.";

modalText.innerHTML=`

<div class="profile-popup">

<img src="profile.jpg" alt="Elavarasan Profile">

<div>

<div class="card-number">
PROFILE / ACTIVE
</div>

<h3>
DEVELOPER · CREATOR · TRAINER
</h3>

<p>
Welcome to my digital space. Explore my technology,
projects, training and creative work.
</p>

</div>

</div>

`;

modalAction.textContent="GO TO ABOUT ME";

modalAction.onclick=()=>{

modal.classList.remove("active");

goToAbout();

};

modal.classList.add("active");

};
}


/* ================= PORTAL ACTION ================= */
if(portal){
portal.onclick=()=>{

sound();

portal.animate(
[
{transform:"scale(1)"},
{transform:"scale(1.08)"},
{transform:"scale(.96)"},
{transform:"scale(1)"}
],
{
duration:700,
easing:"cubic-bezier(.16,1,.3,1)"
}
);

openAction("PORTAL ACTIVATED");

};
}


/* ================= CLICK RIPPLE ================= */

document.addEventListener("click",e=>{

const ripple=document.createElement("div");

ripple.className="ripple";

ripple.style.left=e.clientX+"px";
ripple.style.top=e.clientY+"px";

document.body.appendChild(ripple);

setTimeout(()=>ripple.remove(),800);

});


/* ================= RANDOM ENERGY ================= */

setInterval(()=>{

const beam=document.createElement("div");

beam.className="beam";

beam.style.top=Math.random()*100+"%";
beam.style.left="-40%";
beam.style.transform=
`rotate(${Math.random()*40-20}deg)`;

document.body.appendChild(beam);

setTimeout(()=>beam.remove(),9000);

},4500);


/* ================= DOUBLE CLICK SEARCH ================= */

document.addEventListener("dblclick",e=>{

if(["H1","H2","H3","P"].includes(e.target.tagName)){

const text=e.target.innerText.trim();

if(text){

window.open(
"https://www.google.com/search?q="+encodeURIComponent(text),
"_blank"
);

}

}

});


/* ================= KEYBOARD ================= */

document.addEventListener("keydown",e=>{

if(e.key==="Escape"){
modal.classList.remove("active");
}

});
