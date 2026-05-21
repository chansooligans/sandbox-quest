// ─────────────────────────────────────────────
// Sandbox Quest — Beach RPG demo for sandbox-answers
// ─────────────────────────────────────────────

const TILE     = 64;
const COLS     = 16;
const ROWS     = 11;
const W        = COLS * TILE;   // 1024
const H        = ROWS * TILE;   // 704
const SPEED    = 3;
const WALK_FPS = 8;

// ── Tile types ──────────────────────────────
const SAND  = 0;
const WATER = 1;
const PALM  = 2;

const WALKABLE = new Set([SAND]);

// ── Tile map (16 cols × 11 rows) ────────────
const MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Non-walkable decorations (tile col,row → obstacle)
const OBSTACLES = new Set([
  '5,6', '6,6',   // tiki bar
]);

// ── NPC content ─────────────────────────────
const CONTENT = {
  1: {
    title: 'Intro to Sandbox Answers',
    subtitle: 'The monorepo that powers data science at Turquoise.',
    sprite: 'chansoo_down',
    sections: [
      {
        heading: 'What is sandbox-answers?',
        body: `<strong>sandbox-answers</strong> is a <strong>monorepo</strong> — a single Git repository that houses multiple related projects under one roof:
        <ul>
          <li><code>airflow_dags/</code> — Airflow DAG code for Clear Rates and other pipelines</li>
          <li><code>sandbox-apps/</code> — Heroku-hosted interactive data apps (Flask + JS)</li>
          <li><code>cld-utils/</code> — Utility tables (benchmarks, codesets, crosswalks)</li>
          <li><code>references/</code> — Documentation, QA standards, conventions</li>
        </ul>`,
      },
      {
        heading: 'Git Submodules + .gitmodules',
        body: `Each of those projects lives in its own Git repo. sandbox-answers links to them as <strong>git submodules</strong> — tracked via a <code>.gitmodules</code> file at the repo root.
        <br><br>
        The file looks like this:
        <br><br>
        <code>[submodule "airflow_dags"]<br>
        &nbsp;&nbsp;&nbsp;&nbsp;path = airflow_dags<br>
        &nbsp;&nbsp;&nbsp;&nbsp;url = git@github.com:turquoisehealth/airflow_dags.git<br>
        &nbsp;&nbsp;&nbsp;&nbsp;branch = develop</code>
        <br><br>
        Each entry tells Git: <em>at this path, check out this repo at this branch.</em> The parent repo stores a pointer to a specific commit — not the full code.
        <br><br>
        When you clone sandbox-answers fresh, run <code>git submodule update --init --recursive</code> to pull all submodule code down. Run <code>git submodule update --remote</code> to sync to the latest commit on each submodule's tracked branch.`,
      },
      {
        heading: 'Why does the monorepo help Claude?',
        body: `When Claude answers a question or writes code, it needs context — the relevant source code, the docs, and the conventions. The monorepo structure lets Claude find all of this from <strong>one context window</strong>: it can search DAG logic, app code, and reference docs simultaneously without jumping between repos.
        <br><br>
        <a href="https://github.com/turquoisehealth/sandbox-answers" target="_blank">→ View sandbox-answers on GitHub</a>`,
      },
    ],
  },

  2: {
    title: 'Clear Rates Automation',
    subtitle: 'From Slack message to validated feature in production.',
    sprite: 'monika_down',
    sections: [
      {
        heading: 'The workflow',
        body: `<ol>
          <li>Feature request or bug is flagged in <strong>Slack</strong></li>
          <li>A <strong>Jira ticket</strong> is created from Slack</li>
          <li>The <code>/jira</code> skill investigates the ticket and drafts a PR with the relevant code changes in <code>airflow_dags/</code></li>
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
    sprite: 'nicole_down',
    sections: [
      {
        heading: 'sandbox-apps is a Heroku submodule',
        body: `<code>sandbox-apps/</code> is one of the submodules inside sandbox-answers. It's a Flask + JavaScript app deployed on <strong>Heroku</strong>.
        <br><br>
        Because it's a submodule, Claude can write code directly into it from sandbox-answers — creating new app pages, adding data scripts, and triggering a deploy — all in one conversation. The workflow is:
        <ol>
          <li>Run <strong>Trino queries</strong> to pull and analyze the data</li>
          <li>Build a Flask route + HTML/JS frontend for exploring it</li>
          <li>Push to the <code>sandbox-apps</code> submodule and deploy to Heroku</li>
        </ol>`,
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
        There are dozens of these. Browse the full gallery:
        <br>
        <a href="https://data-sandbox-apps.turquoise.health/" target="_blank">→ Full app gallery</a>`,
      },
    ],
  },

  4: {
    title: 'Data Sandbox Whiteboard',
    subtitle: 'Ad-hoc research without the overhead of a full app.',
    sprite: 'nick_down',
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

// ── NPC definitions ──────────────────────────
const NPCS = [
  { id: 1, tx: 3,  ty: 5, sprite: 'chansoo_down', label: 'Intro' },
  { id: 2, tx: 3,  ty: 8, sprite: 'monika_down',  label: 'Clear Rates' },
  { id: 3, tx: 11, ty: 5, sprite: 'nicole_down',  label: 'Apps' },
  { id: 4, tx: 12, ty: 8, sprite: 'nick_down',    label: 'Whiteboard' },
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

const npcImgs = {
  chansoo_down:  loadImg('assets/npcs/chansoo_down.png'),
  monika_down:   loadImg('assets/npcs/monika_down.png'),
  nicole_down:   loadImg('assets/npcs/nicole_down.png'),
  nick_down:     loadImg('assets/npcs/nick_down.png'),
};

// ── Game state ───────────────────────────────
const player = {
  x: 7 * TILE,
  y: 7 * TILE,
  dir: 'down',
  moving: false,
  frame: 0,
  frameTick: 0,
};

const keys = {};
let paused = false;
let tick   = 0;

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

function isObstacle(tx, ty) {
  return OBSTACLES.has(`${tx},${ty}`);
}

function npcAt(tx, ty) {
  return NPCS.some(n => n.tx === tx && n.ty === ty);
}

function canWalkTo(nx, ny) {
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
    if (npcAt(ntx, nty) || isObstacle(ntx, nty)) return false;
  }
  return true;
}

// ── Interaction ──────────────────────────────
function nearbyNPC() {
  const pcx = player.x + TILE / 2;
  const pcy = player.y + TILE / 2;
  let closest = null;
  let bestDist = TILE * 1.7;
  for (const npc of NPCS) {
    const ncx = npc.tx * TILE + TILE / 2;
    const ncy = npc.ty * TILE + TILE / 2;
    const dist = Math.hypot(pcx - ncx, pcy - ncy);
    if (dist < bestDist) { bestDist = dist; closest = npc; }
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

  const npcNames = { 1: 'Chansoo', 2: 'Monika', 3: 'Nicole', 4: 'Nick' };
  el.innerHTML = `
    <div class="overlay-header">
      <div class="overlay-npc">
        <img src="${sprite.src}" alt="${npcNames[topicId]}" />
        <div>
          <div class="overlay-npc-label">${npcNames[topicId]} · Data Science</div>
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
  const r = Math.round(24 + wave * 0.5);
  const g = Math.round(100 + wave * 0.6);
  const b = Math.round(185 + wave * 0.4);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(col * TILE, row * TILE, TILE, TILE);

  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth   = 2;
  const fo = (tick * 0.8 + col * 9) % TILE;
  ctx.beginPath();
  ctx.moveTo(col * TILE,       row * TILE + fo % 24 + 8);
  ctx.lineTo((col+1) * TILE,   row * TILE + (fo+4) % 24 + 8);
  ctx.stroke();
}

// Stable grain per tile
const GRAIN = Array.from({ length: COLS * ROWS }, (_, i) => {
  const rng = n => { const x = Math.sin(n) * 43758; return x - Math.floor(x); };
  return [rng(i), rng(i+1000), rng(i+2000)];
});

function drawSand(col, row) {
  ctx.fillStyle = '#f5deb3';
  ctx.fillRect(col * TILE, row * TILE, TILE, TILE);
  const [r1, r2, r3] = GRAIN[row * COLS + col] || [0.3, 0.5, 0.7];
  ctx.fillStyle = 'rgba(180,150,80,0.25)';
  ctx.fillRect(col*TILE + r1*52,      row*TILE + r1*48 + 4, 2, 2);
  ctx.fillRect(col*TILE + r2*44 + 8,  row*TILE + r2*40 + 12, 2, 2);
  ctx.fillRect(col*TILE + r3*36 + 16, row*TILE + r3*52 + 6, 2, 2);
}

function drawPalm(col, row) {
  drawSand(col, row);
  const cx   = col * TILE + TILE / 2;
  const base = row * TILE + TILE;
  const sway = Math.sin(tick * 0.025) * 4;

  ctx.fillStyle = '#8B6914';
  ctx.fillRect(cx - 4, base - TILE * 1.6, 8, TILE * 1.6);

  const tipX = cx + sway;
  const tipY = base - TILE * 1.6;
  const fronds = [
    { dx: -28+sway, dy: -TILE*1.7 },
    { dx:  28+sway, dy: -TILE*1.7 },
    { dx: -42+sway, dy: -TILE*1.4 },
    { dx:  42+sway, dy: -TILE*1.4 },
    { dx:   0+sway, dy: -TILE*1.9 },
  ];
  ctx.lineWidth = 3;
  fronds.forEach(f => {
    ctx.strokeStyle = '#1a7a1a';
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(cx + f.dx, base + f.dy);
    ctx.stroke();
    ctx.fillStyle = '#2e8b57';
    ctx.beginPath();
    ctx.ellipse(cx + f.dx*0.75, base + f.dy*0.9, 11, 5, Math.atan2(f.dy, f.dx), 0, Math.PI*2);
    ctx.fill();
  });

  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.arc(tipX - 4, tipY + 2, 5, 0, Math.PI*2);
  ctx.fill();
}

// ── Decoration renderers ──────────────────────

function drawUmbrella(col, row) {
  const cx = col * TILE + TILE / 2;
  const cy = row * TILE + TILE * 0.65;

  ctx.strokeStyle = '#888';
  ctx.lineWidth   = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - TILE * 0.9);
  ctx.stroke();

  const colors = ['#e74c3c','#fff','#3498db','#fff','#e74c3c'];
  const topX = cx, topY = cy - TILE * 0.9, radius = TILE * 0.55;
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.arc(topX, topY, radius, Math.PI/5*i + Math.PI, Math.PI/5*(i+1) + Math.PI);
    ctx.closePath();
    ctx.fill();
  }
}

// Tiki bar spanning 2 tiles at pixel (px, py)
function drawTikiBar(px, py) {
  const bw = TILE * 2;    // bar width
  const bh = TILE * 0.9;  // bar height area

  // Sand underneath
  for (let c = 0; c < 2; c++) drawSand(Math.floor(px / TILE) + c, Math.floor(py / TILE));

  // Counter top
  ctx.fillStyle = '#a0522d';
  ctx.fillRect(px + 4, py + TILE * 0.45, bw - 8, TILE * 0.22);
  ctx.fillStyle = '#cd853f';
  ctx.fillRect(px + 4, py + TILE * 0.42, bw - 8, TILE * 0.06);

  // Bamboo poles (4 corners)
  ctx.fillStyle = '#c8a85a';
  const poles = [px+10, px + bw - 18];
  poles.forEach(x => {
    ctx.fillRect(x, py + TILE * 0.1, 8, TILE * 0.9);
    // knuckles
    for (let k = 0; k < 3; k++) {
      ctx.fillStyle = '#a08040';
      ctx.fillRect(x - 1, py + TILE*(0.2 + k*0.22), 10, 4);
      ctx.fillStyle = '#c8a85a';
    }
  });

  // Thatched roof
  const roofY = py + TILE * 0.08;
  ctx.fillStyle = '#b8860b';
  ctx.beginPath();
  ctx.moveTo(px - 8, roofY + TILE * 0.22);
  ctx.lineTo(px + bw/2, roofY);
  ctx.lineTo(px + bw + 8, roofY + TILE * 0.22);
  ctx.closePath();
  ctx.fill();

  // Thatch strokes
  ctx.strokeStyle = '#8b6914';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const tx = px + (bw+16) * i/7 - 8;
    ctx.beginPath();
    ctx.moveTo(tx, roofY + TILE*0.22);
    ctx.lineTo(px + bw/2, roofY);
    ctx.stroke();
  }

  // Drinks on counter
  const drinkColors = ['#e74c3c','#f39c12','#1abc9c'];
  drinkColors.forEach((col, i) => {
    const dx = px + bw*0.25 + i*20;
    const dy = py + TILE * 0.35;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(dx - 5, dy + 14);
    ctx.lineTo(dx + 5, dy + 14);
    ctx.lineTo(dx + 4, dy);
    ctx.lineTo(dx - 4, dy);
    ctx.closePath();
    ctx.fill();
    // straw
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(dx + 2, dy);
    ctx.lineTo(dx + 6, dy - 10);
    ctx.stroke();
  });

  // Sign
  ctx.fillStyle = '#4a2c00';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('TIKI BAR', px + bw/2, py + TILE * 0.55);
}

// Beach chair at pixel (px, py), color = towel stripe color
function drawBeachChair(px, py, towelColor) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.ellipse(px + 18, py + 44, 20, 7, 0, 0, Math.PI*2);
  ctx.fill();

  // Legs
  ctx.strokeStyle = '#a0784a';
  ctx.lineWidth   = 3;
  ctx.beginPath(); ctx.moveTo(px + 6,  py + 42); ctx.lineTo(px + 12, py + 20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(px + 30, py + 42); ctx.lineTo(px + 26, py + 20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(px + 4,  py + 35); ctx.lineTo(px + 34, py + 35); ctx.stroke();

  // Seat / back canvas (reclined)
  ctx.fillStyle = towelColor;
  ctx.beginPath();
  ctx.moveTo(px + 8,  py + 42);
  ctx.lineTo(px + 30, py + 42);
  ctx.lineTo(px + 28, py + 18);
  ctx.lineTo(px + 10, py + 18);
  ctx.closePath();
  ctx.fill();

  // Stripe
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth   = 2;
  ctx.beginPath(); ctx.moveTo(px + 15, py + 19); ctx.lineTo(px + 13, py + 41); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(px + 22, py + 19); ctx.lineTo(px + 20, py + 41); ctx.stroke();

  // Pillow
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(px + 18, py + 18, 9, 5, -0.2, 0, Math.PI*2);
  ctx.fill();
}

// Beach ball at pixel center (cx, cy), radius r
function drawBeachBall(cx, cy, r) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + r - 3, r * 0.8, r * 0.3, 0, 0, Math.PI*2);
  ctx.fill();

  // Ball segments (6 colors)
  const ballColors = ['#e74c3c','#f39c12','#2ecc71','#3498db','#9b59b6','#e74c3c'];
  for (let i = 0; i < 6; i++) {
    const a1 = (Math.PI / 3) * i;
    const a2 = (Math.PI / 3) * (i + 1);
    ctx.fillStyle = ballColors[i];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a1, a2);
    ctx.closePath();
    ctx.fill();
  }

  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath();
  ctx.ellipse(cx - r*0.25, cy - r*0.25, r*0.3, r*0.2, -0.5, 0, Math.PI*2);
  ctx.fill();

  // Outline
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.stroke();
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

  // Shoreline foam
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  const foamW = (Math.sin(tick * 0.03) * 0.5 + 0.5) * 6 + 2;
  ctx.fillRect(0, 3 * TILE, W, foamW);
}

// ── NPC renderer ─────────────────────────────
function drawNPC(npc) {
  const img = npcImgs[npc.sprite];
  const px  = npc.tx * TILE;
  const py  = npc.ty * TILE;

  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, px, py, TILE, TILE);
  } else {
    ctx.fillStyle = '#02363d';
    ctx.fillRect(px + 18, py + 28, 28, 36);
    ctx.beginPath();
    ctx.arc(px + 32, py + 22, 14, 0, Math.PI*2);
    ctx.fill();
  }

  // Topic number badge
  ctx.fillStyle = '#02363d';
  ctx.beginPath();
  ctx.arc(px + TILE - 12, py + 10, 10, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle    = '#a8e6e1';
  ctx.font         = 'bold 11px monospace';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(npc.id, px + TILE - 12, py + 10);
}

function drawSPACEPrompt(npc) {
  const cx     = npc.tx * TILE + TILE / 2;
  const cy     = npc.ty * TILE - 8;
  const bounce = Math.sin(tick * 0.12) * 4;
  const text   = '  SPACE  ';
  ctx.font = 'bold 11px monospace';
  const tw = ctx.measureText(text).width;
  const pw = tw + 4, ph = 20;
  const rx = cx - pw/2, ry = cy - ph - bounce;

  roundRect(rx, ry, pw, ph, 10);
  ctx.fillStyle = 'rgba(2,54,61,0.88)';
  ctx.fill();

  ctx.fillStyle    = '#a8e6e1';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, ry + ph/2);
}

// ── Player renderer ──────────────────────────
function drawPlayer() {
  const key = player.moving
    ? `${player.dir}_walk_${player.frame}`
    : `idle_${player.dir}`;

  const img = playerImgs[key];
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, player.x, player.y, TILE, TILE);
  } else {
    ctx.fillStyle = '#218c88';
    ctx.fillRect(player.x + 14, player.y + 16, 36, 48);
    ctx.fillStyle = '#a8e6e1';
    ctx.beginPath();
    ctx.arc(player.x + 32, player.y + 12, 12, 0, Math.PI*2);
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

  if (dx && dy) { dx *= 0.707; dy *= 0.707; }

  player.moving = dx !== 0 || dy !== 0;

  if (player.moving) {
    if (canWalkTo(player.x + dx, player.y)) player.x += dx;
    if (canWalkTo(player.x, player.y + dy)) player.y += dy;
    player.frameTick++;
    if (player.frameTick >= WALK_FPS) {
      player.frameTick = 0;
      player.frame = (player.frame + 1) % 4;
    }
  } else {
    player.frame = player.frameTick = 0;
  }

  tick++;
}

// ── Render ───────────────────────────────────
function render() {
  if (paused) return;   // freeze canvas while overlay is open → no flash

  ctx.clearRect(0, 0, W, H);
  drawMap();

  // Decorations drawn on top of sand, before characters
  drawUmbrella(7, 3);
  drawTikiBar(5 * TILE, 6 * TILE);

  // Beach chairs (pixel x, y, towel color)
  drawBeachChair(8  * TILE + 8,  7 * TILE + 16, '#e74c3c');
  drawBeachChair(9  * TILE + 12, 7 * TILE + 22, '#3498db');
  drawBeachChair(10 * TILE + 4,  8 * TILE + 8,  '#f39c12');
  drawBeachChair(11 * TILE + 6,  8 * TILE + 18, '#9b59b6');

  // Beach balls scattered around
  drawBeachBall(8  * TILE + 50, 8  * TILE + 30, 12);
  drawBeachBall(10 * TILE + 10, 9  * TILE + 20, 10);
  drawBeachBall(13 * TILE + 20, 7  * TILE + 40, 11);
  drawBeachBall(5  * TILE + 30, 9  * TILE + 10, 9);

  const nearby = nearbyNPC();

  // Z-sort: NPCs above player row drawn first (behind player)
  NPCS.forEach(npc => { if (npc.ty <= player.ty) drawNPC(npc); });
  drawPlayer();
  NPCS.forEach(npc => { if (npc.ty > player.ty)  drawNPC(npc); });

  if (nearby) drawSPACEPrompt(nearby);
}

// ── Main loop ────────────────────────────────
function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

Object.defineProperty(player, 'ty', {
  get() { return Math.floor((this.y + TILE * 0.75) / TILE); },
});

loop();
