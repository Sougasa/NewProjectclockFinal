// ============================ CANVAS ============================
const spaceCanvas = document.getElementById('spaceCanvas');
const spaceCtx = spaceCanvas.getContext('2d');
const nebulaCanvas = document.getElementById('nebulaCanvas');
const nebulaCtx = nebulaCanvas.getContext('2d');

let width = spaceCanvas.width = window.innerWidth;
let height = spaceCanvas.height = window.innerHeight;
nebulaCanvas.width = width;
nebulaCanvas.height = height;

window.addEventListener('resize', () => {
  width = spaceCanvas.width = window.innerWidth;
  height = spaceCanvas.height = window.innerHeight;
  nebulaCanvas.width = width;
  nebulaCanvas.height = height;
  initUniverse();
});

// ============================ CLASSES ============================
class Star {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2;
    this.speed = Math.random() * 0.5 + 0.2;
    this.alpha = Math.random();
  }
  draw() {
    spaceCtx.beginPath();
    spaceCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    spaceCtx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    spaceCtx.fill();
  }
  update() {
    this.y -= this.speed;
    if(this.y < 0) this.y = height;
    this.alpha += (Math.random() - 0.5) * 0.05;
    this.alpha = Math.min(Math.max(this.alpha,0),1);
  }
}

// ============================ INIT ============================
let stars = [];
function initUniverse(){
  stars = [];
  for(let i=0;i<150;i++){ stars.push(new Star()); }
}
initUniverse();

// ============================ ANIMATE ============================
function animate(){
  spaceCtx.clearRect(0,0,width,height);
  stars.forEach(s => { s.update(); s.draw(); });
  requestAnimationFrame(animate);
}
animate();

// ============================ SCROLL ANIMATION ============================
const scrollElements = document.querySelectorAll('.scroll-animate');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add('show'); }
  });
},{ threshold: 0.15 });
scrollElements.forEach(el => observer.observe(el));
