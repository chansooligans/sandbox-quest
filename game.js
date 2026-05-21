// ─────────────────────────────────────────────
// Sandbox Quest — Beach RPG demo for sandbox-answers
// ─────────────────────────────────────────────

const TILE  = 64;          // px per tile
const COLS  = 14;
const ROWS  = 9;
const W     = COLS * TILE; // 896
const H     = ROWS * TILE; // 576
const SPEED = 3;           // px per frame
const WALK_FPS = 8;        // game frames per animation frame

// ── Tile types ──────────────────────────────
const SAND  = 0;
const WATER = 1;
const PALM  = 2;

const WALKABLE = new Set([SAND]);

// ── Tile map (14 cols × 9 rows) ─────────────
const MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// ── NPC content ─────────────────────────────
const CONTENT = {
  1: {
    title: 'Intro to Sandbox Answers',
    subtitle: 'The monorepo that powers data science at Turquoise.',
    sprite: 'chansoo_down',
    sections: [
      {
        heading: 'What is sandbox-answers?',
        body: `<strong>sandbox-answers</strong> is a <strong>monorepo</strong> — a single Git repository that houses multiple related projects:
        <ul>
          <li><code>airflow_dags/</code> — Airflow DAG code for Clear Rates and other pipelines</li>
          <li><code>sandbox-apps/</code> — Heroku-hosted interactive data apps (Flask + JS)</li>
          <li><code>references/</code> — Documentation, QA standards, conventions</li>
        </ul>`,
      },
      {
        heading: 'Git Submodules',
        body: `Each project lives in its own repo. sandbox-answers links to them via <strong>git submodules</strong> — pointers defined in a <code>.gitmodules</code> file.
        <br><br>
        Think of it as a parent repo that knows the exact commit of each child repo. The parent and children can evolve independently, but the parent always tracks a specific snapshot.`,
      },
      {
        heading: 'Why does the monorepo help Claude?',
        body: `When you ask Claude a question, it needs context — code, docs, and conventions. The monorepo structure lets Claude find all of this from <strong>one context window</strong>. It can search DAG code, app code, and reference docs simultaneously without switching between repos.
        <br><br>
        <a href="https://github.com/turquoisehealth/sandbox-answers" target="_blank">→ View sandbox-answers on GitHub</a>`,
      },
    ],
  },

  2: {
    title: 'Clear Rates Automation',
    subtitle: 'From Slack message to validated feature in production.',
    sprite: 'chansoo_right',
    sections: [
      {
        heading: 'The workflow',
        body: `<ol>
          <li>Feature request or bug is flagged in <strong>Slack</strong></li>
          <li>A <strong>Jira ticket</strong> is created from Slack</li>
          <li>The <code>/jira</code> skill investigates the ticket and drafts a PR with the relevant code changes</li>
          <li>The <code>/test-pr</code> skill runs a <strong>mini Clear Rates pipeline</strong> — a handful of billing codes, providers, and networks — to validate the changes end-to-end</li>
        </ol>`,
      },
      {
        heading: 'QA Tracking',
        body: `Each feature gets logged and tracked in the CLD QA App, which shows test results, validation status, and notes across releases.
        <br><br>
        <a href="https://data-sandbox-apps.turquoise.health/apps/cld-qa/" target="_blank">→ Open the CLD QA App</a>`,
      },
    ],
  },

  3: {
    title: 'Creating Interactive Apps',
    subtitle: 'Turning Trino queries into shareable tools for PMs and SEs.',
    sprite: 'chansoo_left',
    sections: [
      {
        heading: 'Why build apps?',
        body: `Exploratory tools help PMs and SEs dig into data analysis results on their own — no SQL needed. Claude can spin one up end-to-end: run Trino queries, analyze findings, build the app, and deploy it.`,
      },
      {
        heading: 'Recent examples',
        body: `<ul>
          <li>
            <a href="https://data-sandbox-apps.turquoise.health/apps/network-provider-check-at-scale/" target="_blank">Network Provider Check</a>
            — CLD data by provider, network, setting, and rate type at scale
          </li>
          <li>
            <a href="https://data-sandbox-apps.turquoise.health/apps/pet-qa/" target="_blank">PET QA</a>
            — built by Monika + Corey to QA provider enrollment tables
          </li>
        </ul>
        <br>
        There are dozens of these. Browse them all:
        <br>
        <a href="https://data-sandbox-apps.turquoise.health/" target="_blank">→ Full app gallery</a>`,
      },
    ],
  },

  4: {
    title: 'Data Sandbox Whiteboard',
    subtitle: 'Ad-hoc research without the overhead of a full app.',
    sprite: 'chansoo_up',
    sections: [
      {
        heading: 'What is it?',
        body: `Sometimes you want to explore an idea or answer a quick question — but you don't need a full app and you don't want to commit anything to sandbox-answers.
        <br><br>
        The <strong>whiteboard</strong> is a lightweight GitHub repo for exactly this: markdown notes + smol-hosted mini apps, published quickly and informally.
        <br><br>
        <a href="https://github.com/turquoisehealth/data-sandbox-whiteboard" target="_blank">→ View the whiteboard repo</a>`,
      },
      {
        heading: 'Example: MS-DRG Rate Inversions',
        body: `DRGs come in severity families. For "CHRONIC OBSTRUCTIVE PULMONARY DISEASE":
        <ul>
          <li>190 = MCC (Major Complication / Comorbidity)</li>
          <li>191 = CC</li>
          <li>192 = No CC</li>
        </ul>
        We expect MCC to always have the highest rate. Claude was asked to evaluate how often that's actually true across all payers.
        <br><br>
        <a href="https://github.com/turquoisehealth/data-sandbox-whiteboard/blob/main/cld/accuracy/2026-05-13-msdrg-cc-mcc-rate-inversions.md" target="_blank">→ Read the analysis</a>`,
      },
      {
        heading: 'Pro tip',
        body: `<div class="overlay-tip">
          <strong>Don't treat Claude like a chatbot.</strong><br>
          Write a <code>.md</code> file with: background (what prompted this), goal (what you want to find), and data sources (which tables to use). This gives Claude the context it needs for much better results.
        </div>`,
      },
    ],
  },
};

// ── NPC definitions (tile positions + which content) ─
const NPCS = [
  { id: 1, tx: 3,  ty: 4, facing: 'down',  label: 'Intro' },
  { id: 2, tx: 3,  ty: 7, facing: 'right', label: 'Clear Rates' },
  { id: 3, tx: 10, ty: 4, facing: 'left',  label: 'Apps' },
  { id: 4, tx: 10, ty: 7, facing: 'up',    label: 'Whiteboard' },
];

// ── Image loader ─────────────────────────────
function loadImg(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const playerImgs = {
  idle_down:  loadImg('assets/player/idle_down.png'),
  idle_up:    loadImg('assets/player/idle_up.png'),
  idle_left:  loadImg('assets/player/idle_left.png'),
  idle_right: loadImg('assets/player/idle_right.png'),
};
for (const dir of ['down', 'up', 'left', 'right']) {
  for (let f = 0; f < 4; f++) {
    playerImgs[`${dir}_walk_${f}`] = loadImg(`assets/player/${dir}_walk_${f}.png`);
  }
}

const npcImgs = {};
for (const dir of ['down', 'left', 'right', 'up']) {
  npcImgs[`chansoo_${dir}`] = loadImg(`assets/npcs/chansoo_${dir}.png`);
}

// ── Game state ───────────────────────────────
const player = {
  x: 6 * TILE,  // pixel x of sprite top-left (aligned to tile grid)
  y: 6 * TILE,
  dir: 'down',
  moving: false,
  frame: 0,
  frameTick: 0,
};

const keys = {};
let paused = false;
let tick = 0;

// ── Input ────────────────────────────────────
document.addEventListener('keydown', e => {
  keys[e.code] = true;

  if (e.code === 'Space' && !paused) {
    e.preventDefault();
    tryInteract();
  }
  if (e.code === 'Escape' && paused) {
    e.preventDefault();
    closeOverlay();
  }
});
document.addEventListener('keyup', e => { keys[e.code] = false; });

// ── Collision helpers ────────────────────────
function tileAt(px, py) {
  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);
  if (tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS) return WATER;
  return MAP[ty][tx];
}

function npcAt(tx, ty) {
  return NPCS.some(n => n.tx === tx && n.ty === ty);
}

function canWalkTo(nx, ny) {
  // Use a narrow hitbox at the bottom of the sprite (feet area)
  const margin = 10;
  const footY  = ny + TILE - 6;
  const corners = [
    [nx + margin,        footY - 20],
    [nx + TILE - margin, footY - 20],
    [nx + margin,        footY],
    [nx + TILE - margin, footY],
  ];
  for (const [cx, cy] of corners) {
    if (!WALKABLE.has(tileAt(cx, cy))) return false;
    const ntx = Math.floor(cx / TILE);
    const nty = Math.floor(cy / TILE);
    if (npcAt(ntx, nty)) return false;
  }
  return true;
}

// ── Interaction ──────────────────────────────
function nearbyNPC() {
  const pcx = player.x + TILE / 2;
  const pcy = player.y + TILE / 2;
  let closest = null;
  let bestDist = TILE * 1.6;
  for (const npc of NPCS) {
    const ncx = npc.tx * TILE + TILE / 2;
    const ncy = npc.ty * TILE + TILE / 2;
    const dist = Math.hypot(pcx - ncx, pcy - ncy);
    if (dist < bestDist) {
      bestDist = dist;
      closest = npc;
    }
  }
  return closest;
}

function tryInteract() {
  const npc = nearbyNPC();
  if (npc) openOverlay(npc.id);
}

function openOverlay(topicId) {
  paused = true;
  const data   = CONTENT[topicId];
  const sprite = npcImgs[data.sprite];
  const el     = document.getElementById('card-content');

  el.innerHTML = `
    <div class="overlay-header">
      <div class="overlay-npc">
        <img src="${sprite.src}" alt="Chansoo" />
        <div>
          <div class="overlay-npc-label">Chansoo · Data Science</div>
          <div class="overlay-title">${data.title}</div>
          <div class="overlay-subtitle">${data.subtitle}</div>
        </div>
      </div>
    </div>
    ${data.sections.map(s => `
      <div class="overlay-section">
        <h3>${s.heading}</h3>
        <div class="overlay-body">${s.body}</div>
      </div>
    `).join('')}
    <div class="overlay-nav">
      ${NPCS.map(n => `
        <button class="overlay-nav-btn" onclick="openOverlay(${n.id})">
          <span class="npc-number">${n.id}</span>${CONTENT[n.id].title.split(' ').slice(0, 3).join(' ')}
        </button>
      `).join('')}
    </div>
  `;

  document.getElementById('overlay').classList.remove('hidden');
}

function closeOverlay() {
  document.getElementById('overlay').classList.add('hidden');
  paused = false;
}

// Expose globally for onclick handlers
window.openOverlay  = openOverlay;
window.closeOverlay = closeOverlay;

// ── Canvas setup ─────────────────────────────
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

// ── Drawing helpers ──────────────────────────
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ── Tile renderers ───────────────────────────
function drawWater(col, row) {
  const wave = Math.sin(tick * 0.04 + col * 0.5 + row * 0.3) * 10;
  const r    = Math.round(24 + wave * 0.5);
  const g    = Math.round(100 + wave * 0.6);
  const b    = Math.round(185 + wave * 0.4);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(col * TILE, row * TILE, TILE, TILE);

  // Foam lines
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth   = 2;
  const fo = ((tick * 0.8 + col * 9) % TILE);
  ctx.beginPath();
  ctx.moveTo(col * TILE,        row * TILE + fo % 24 + 8);
  ctx.lineTo((col + 1) * TILE,  row * TILE + (fo + 4) % 24 + 8);
  ctx.stroke();
}

// Pseudo-random grain per tile (stable across frames)
const GRAIN = Array.from({ length: COLS * ROWS }, (_, i) => {
  const rng = (n) => { let x = Math.sin(n) * 43758; return x - Math.floor(x); };
  return [rng(i), rng(i + 1000), rng(i + 2000)];
});

function drawSand(col, row) {
  ctx.fillStyle = '#f5deb3';
  ctx.fillRect(col * TILE, row * TILE, TILE, TILE);

  const [r1, r2, r3] = GRAIN[row * COLS + col];
  ctx.fillStyle = 'rgba(180,150,80,0.25)';
  ctx.fillRect(col * TILE + r1 * 52, row * TILE + r1 * 48 + 4, 2, 2);
  ctx.fillRect(col * TILE + r2 * 44 + 8, row * TILE + r2 * 40 + 12, 2, 2);
  ctx.fillRect(col * TILE + r3 * 36 + 16, row * TILE + r3 * 52 + 6, 2, 2);
}

function drawPalm(col, row) {
  drawSand(col, row);
  const cx = col * TILE + TILE / 2;
  const base = row * TILE + TILE;

  // Trunk
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(cx - 4, base - TILE * 1.6, 8, TILE * 1.6);

  // Fronds
  const sway = Math.sin(tick * 0.025) * 4;
  const fronds = [
    { dx: -28 + sway, dy: -TILE * 1.7 },
    { dx: 28  + sway, dy: -TILE * 1.7 },
    { dx: -42 + sway, dy: -TILE * 1.4 },
    { dx: 42  + sway, dy: -TILE * 1.4 },
    { dx: 0   + sway, dy: -TILE * 1.9 },
  ];
  ctx.lineWidth = 3;
  const tipX = cx + sway;
  const tipY = base - TILE * 1.6;
  fronds.forEach(f => {
    ctx.strokeStyle = '#1a7a1a';
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(cx + f.dx, base + f.dy);
    ctx.stroke();
    ctx.fillStyle = '#2e8b57';
    ctx.beginPath();
    ctx.ellipse(
      cx + f.dx * 0.75, base + f.dy * 0.9,
      11, 5,
      Math.atan2(f.dy, f.dx),
      0, Math.PI * 2
    );
    ctx.fill();
  });

  // Coconut
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.arc(tipX - 4, tipY + 2, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawMap() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const t = MAP[row][col];
      if      (t === WATER) drawWater(col, row);
      else if (t === SAND)  drawSand(col, row);
      else if (t === PALM)  drawPalm(col, row);
    }
  }

  // Shoreline foam strip
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  const foamW = (Math.sin(tick * 0.03) * 0.5 + 0.5) * 6 + 2;
  ctx.fillRect(0, 3 * TILE, W, foamW);
}

// ── Beach umbrella decoration ────────────────
function drawUmbrella(col, row) {
  const cx = col * TILE + TILE / 2;
  const cy = row * TILE + TILE * 0.65;

  // Pole
  ctx.strokeStyle = '#888';
  ctx.lineWidth   = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - TILE * 0.9);
  ctx.stroke();

  // Canopy segments
  const colors  = ['#e74c3c', '#fff', '#3498db', '#fff', '#e74c3c'];
  const topX    = cx;
  const topY    = cy - TILE * 0.9;
  const radius  = TILE * 0.55;
  for (let i = 0; i < 5; i++) {
    const a1 = (Math.PI / 5) * i + Math.PI;
    const a2 = (Math.PI / 5) * (i + 1) + Math.PI;
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.arc(topX, topY, radius, a1, a2);
    ctx.closePath();
    ctx.fill();
  }
}

// ── NPC renderer ─────────────────────────────
function drawNPC(npc) {
  const img = npcImgs[`chansoo_${npc.facing}`];
  const px  = npc.tx * TILE;
  const py  = npc.ty * TILE;

  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, px, py, TILE, TILE);
  } else {
    // Fallback: colored silhouette
    ctx.fillStyle = '#02363d';
    ctx.fillRect(px + 18, py + 28, 28, 36);
    ctx.beginPath();
    ctx.arc(px + 32, py + 22, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  // Topic number badge
  ctx.fillStyle = '#02363d';
  ctx.beginPath();
  ctx.arc(px + TILE - 12, py + 10, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#a8e6e1';
  ctx.font      = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(npc.id, px + TILE - 12, py + 10);
}

function drawSPACEPrompt(npc) {
  const cx     = npc.tx * TILE + TILE / 2;
  const cy     = npc.ty * TILE - 8;
  const bounce = Math.sin(tick * 0.12) * 4;

  const text = '  SPACE  ';
  ctx.font = 'bold 11px monospace';
  const tw = ctx.measureText(text).width;
  const pw = tw + 4;
  const ph = 20;
  const rx = cx - pw / 2;
  const ry = cy - ph - bounce;

  roundRect(rx, ry, pw, ph, 10);
  ctx.fillStyle   = 'rgba(2, 54, 61, 0.88)';
  ctx.fill();

  ctx.fillStyle    = '#a8e6e1';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, ry + ph / 2);
}

// ── Player renderer ──────────────────────────
function drawPlayer() {
  let key;
  if (player.moving) {
    key = `${player.dir}_walk_${player.frame}`;
  } else {
    key = `idle_${player.dir}`;
  }

  const img = playerImgs[key];
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, player.x, player.y, TILE, TILE);
  } else {
    ctx.fillStyle   = '#218c88';
    ctx.fillRect(player.x + 14, player.y + 16, 36, 48);
    ctx.fillStyle   = '#a8e6e1';
    ctx.beginPath();
    ctx.arc(player.x + 32, player.y + 12, 12, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Update ───────────────────────────────────
function update() {
  if (paused) return;

  let dx = 0, dy = 0;
  if (keys['ArrowLeft']  || keys['KeyA']) { dx = -SPEED; player.dir = 'left'; }
  if (keys['ArrowRight'] || keys['KeyD']) { dx =  SPEED; player.dir = 'right'; }
  if (keys['ArrowUp']    || keys['KeyW']) { dy = -SPEED; player.dir = 'up'; }
  if (keys['ArrowDown']  || keys['KeyS']) { dy =  SPEED; player.dir = 'down'; }

  // Normalize diagonal
  if (dx && dy) { dx *= 0.707; dy *= 0.707; }

  player.moving = dx !== 0 || dy !== 0;

  if (player.moving) {
    if (canWalkTo(player.x + dx, player.y))  player.x += dx;
    if (canWalkTo(player.x, player.y + dy))  player.y += dy;

    player.frameTick++;
    if (player.frameTick >= WALK_FPS) {
      player.frameTick = 0;
      player.frame = (player.frame + 1) % 4;
    }
  } else {
    player.frame     = 0;
    player.frameTick = 0;
  }

  tick++;
}

// ── Render ───────────────────────────────────
function render() {
  ctx.clearRect(0, 0, W, H);

  drawMap();

  // Decorations (drawn on sand before characters)
  drawUmbrella(6, 3);

  const nearby = nearbyNPC();

  // Draw NPCs (those in front rows rendered after player for z-depth)
  NPCS.forEach(npc => { if (npc.ty <= player.ty) drawNPC(npc); });
  drawPlayer();
  NPCS.forEach(npc => { if (npc.ty > player.ty)  drawNPC(npc); });

  // SPACE prompt above the nearest NPC
  if (nearby && !paused) drawSPACEPrompt(nearby);
}

// ── Main loop ────────────────────────────────
function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

// Store ty on player for z-sort
Object.defineProperty(player, 'ty', {
  get() { return Math.floor((this.y + TILE * 0.75) / TILE); },
});

loop();
