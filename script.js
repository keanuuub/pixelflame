const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Canvas size
canvas.width = 600;
canvas.height = 600;

// Pixelated effect
ctx.imageSmoothingEnabled = false;

// Flame grid
const GRID_WIDTH = 60;
const GRID_HEIGHT = 60; // covers majority of canvas height
const SCALE = canvas.width / GRID_WIDTH;

let flame = new Array(GRID_WIDTH * GRID_HEIGHT).fill(0);

// Mouse sway
let mouseX = GRID_WIDTH / 2;
window.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  mouseX = (x / canvas.width) * GRID_WIDTH;
});

// Pink palette
const palette = [
  [0,0,0],
  [30,0,30],
  [80,0,70],
  [150,20,120],
  [220,80,170],
  [255,150,220],
  [255,230,245]
];

// Seed bottom row
function seedFlame() {
  for (let x = 0; x < GRID_WIDTH; x++) {
    flame[(GRID_HEIGHT-1)*GRID_WIDTH + x] = Math.random() > 0.45 ? 6 : 0;
  }
}

// Update flame simulation
function updateFlame() {
  for (let y = 0; y < GRID_HEIGHT-1; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const i = y*GRID_WIDTH + x;
      const below = flame[(y+1)*GRID_WIDTH + x];

      const sway = Math.floor((mouseX - x) * 0.08);
      let decay = Math.floor(Math.random()*2);
      let newVal = below - decay;
      if(newVal<0)newVal=0;

      let newX = x + sway + (Math.random()<0.5?-1:1);
      if(newX<0)newX=0;
      if(newX>=GRID_WIDTH)newX=GRID_WIDTH-1;

      flame[y*GRID_WIDTH + newX] = newVal;
    }
  }
  seedFlame();
}

// Draw flame
function drawFlame() {
  // Clear background
  ctx.setTransform(1,0,0,1,0,0);
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // Scale to pixels
  ctx.setTransform(SCALE,0,0,SCALE,0,0);

  // Offset Y so flame starts at bottom
  const offsetY = canvas.height / SCALE - GRID_HEIGHT; // ensures bottom-aligned

  for(let y=0; y<GRID_HEIGHT; y++){
    for(let x=0; x<GRID_WIDTH; x++){
      const value = flame[y*GRID_WIDTH + x];
      const color = palette[value];
      ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
      ctx.fillRect(x, y + offsetY, 1,1);
    }
  }
}

// Center canvas using JS only
function centerCanvas() {
  canvas.style.position = 'absolute';
  canvas.style.left = (window.innerWidth - canvas.width) / 2 + 'px';
  canvas.style.top = (window.innerHeight - canvas.height) / 2 + 'px';
}
window.addEventListener('resize', centerCanvas);
centerCanvas();

// Animation loop
function animate() {
  updateFlame();
  drawFlame();
  requestAnimationFrame(animate);
}

animate();