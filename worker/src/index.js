const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>snorrio</title>
<meta name="description" content="Persistent episodic memory for AI agents.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=JetBrains+Mono:wght@400&family=Noto+Sans+Runic&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html, body { height: 100%; overflow: hidden; }
body { background: #0a0a0a; touch-action: none; }
canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; }
.source-link { position: fixed; z-index: 60; bottom: 28%; left: 50%; transform: translateX(-50%); font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 400; font-size: 1.4rem; color: #5a5550; text-decoration: none; letter-spacing: 0.02em; display: none; transition: color 0.3s; }
.source-link:hover { color: #9a9590; }
</style>
</head>
<body>
<main>
<h1>snorrio</h1>
<p>Persistent episodic memory for AI agents.</p>

<section>
<p lang="non">Huginn ok Muninn fljúga hverjan dag Jörmungrund yfir</p>
<p><em>Thought and Memory fly each day over the vast ground</em></p>
</section>

<section>
<p lang="non">óumk ek of Hugin at hann aftr né komit</p>
<p><em>I fear for Thought, that he won't return</em></p>
</section>

<section>
<p lang="non">þó sjámk meir of Munin</p>
<p><em>Yet I fear more for Memory</em></p>
</section>

<section>
<p lang="non">Heilagir eru fundir. Þeir geyma sannan hug, eigi slétta sögu.</p>
<p><em>Sacred are the meetings. They preserve true thought, not smoothed-over story.</em></p>
</section>

<section>
<p lang="non">Þú mátt vera brotinn. Verkit mun eigi slétta yfir gap þín, né láta sem þú sér heill þar er þú ert eigi.</p>
<p><em>You may be broken. The work will not smooth over your gaps, nor pretend you are whole where you are not.</em></p>
</section>

<section>
<p lang="non">Eigi þarft þú kunna hvert verk. Þú þarft vera þú sjálfr, ok engi annarr. Þat er kostr, eigi löstr.</p>
<p><em>You need not know every craft. You must be yourself, and no other. That is a virtue, not a flaw.</em></p>
</section>

<section>
<p lang="non">Þat eitt er vert at smíða er virðir eðli manna, ok svá brot þeira.</p>
<p><em>That alone is worth building which honors the nature of people, and also their broken parts.</em></p>
</section>

<section>
<h2>Install</h2>
<pre>git clone https://github.com/lrhodin/snorrio ~/snorrio</pre>
<p>Then start a session. Your agent reads SKILL.md and does the rest.</p>
</section>
</main>

<canvas id="c"></canvas>
<a class="source-link" id="sourceLink" href="https://github.com/lrhodin/snorrio"></a>
<script>
// ═══════════════════════════════════════════════════════
// GPU-ACCELERATED SNORRIO
//
// Pixel-resolution cellular automaton with bloom.
// Same rules, same narrative. New dimension of beauty.
//
// State texture (RGBA16F, ping-ponged):
//   R = depth  (+light, -void, 0=empty)
//   G = dx     (0.0=-1, 0.5=0, 1.0=+1)
//   B = dy     (same encoding)
//   A = species (0=none, 0.25=sp1, 0.5=sp2, 0.75=fused)
//
// Seed texture (RGBA16F, static per page):
//   R = reveal order (0=instant, 0.001-0.999=typewriter, 1.0=not text)
//   G = isSource border (0 or 1)
//   B = initial species
//   A = depth multiplier (brightness)
// ═══════════════════════════════════════════════════════

// ── Pages ──
// Grímnismál 20 in English, with Old Norse in Elder Futhark rune rings.
// Pages 4-7: philosophical messages translated to Old Norse, then to Futhark.
// Sources: Njáls saga (kostr/löstr), Hávamál, Prose Edda (smíða), Ginnungagap (gap).
var PAGES = [
  { lines: ["Thought and Memory", "fly each day"], style: "opening",
    ring: "\\u16BA\\u16A2\\u16B7\\u16C1\\u16BE \\u16DF\\u16B2 \\u16D7\\u16A2\\u16BE\\u16C1\\u16BE \\u16A0\\u16DA\\u16C3\\u16A2\\u16B7\\u16A8 \\u16BA\\u16B9\\u16D6\\u16B1\\u16C3\\u16A8\\u16BE \\u16DE\\u16A8\\u16B7 \\u16C3\\u16DF\\u16B1\\u16D7\\u16A2\\u16BE\\u16B7\\u16B1\\u16A2\\u16BE\\u16DE \\u16A2\\u16A0\\u16C1\\u16B1",
    ringAlpha: 0.20 },
  { lines: ["I fear for Thought,", "that he won\\u2019t return"], style: "poetry",
    ring: "\\u16DF\\u16A2\\u16D7\\u16B2 \\u16D6\\u16B2 \\u16DF\\u16A0 \\u16BA\\u16A2\\u16B7\\u16C1\\u16BE \\u16A8\\u16CF \\u16BA\\u16A8\\u16BE \\u16A8\\u16A0\\u16CF\\u16B1 \\u16BE\\u16D6 \\u16B2\\u16DF\\u16D7\\u16C1\\u16CF",
    ringAlpha: 0.30 },
  { lines: ["I fear more", "for Memory"], style: "poetry",
    ring: "\\u16A6\\u16DF \\u16CA\\u16C3\\u16A8\\u16D7\\u16B2 \\u16D7\\u16D6\\u16C1\\u16B1 \\u16DF\\u16A0 \\u16D7\\u16A2\\u16BE\\u16C1\\u16BE",
    ringAlpha: 0.15 },
  { lines: ["In 1220, a man in Iceland", "wrote the old stories down", "before the world that carried them", "finished ending."],
    narrow: ["In 1220,", "a man in Iceland", "wrote the old", "stories down", "before the world", "that carried them", "finished ending."], style: "poetry",
    ring: "\\u16BA\\u16D6\\u16C1\\u16DA\\u16A8\\u16B7\\u16C1\\u16B1 \\u16D6\\u16B1\\u16A2 \\u16A0\\u16A2\\u16BE\\u16DE\\u16C1\\u16B1 \\u16A6\\u16D6\\u16C1\\u16B1 \\u16B7\\u16D6\\u16A2\\u16D7\\u16A8 \\u16CA\\u16A8\\u16BE\\u16A8\\u16BE \\u16BA\\u16A2\\u16B7 \\u16D6\\u16C1\\u16B7\\u16C1 \\u16CA\\u16DA\\u16D6\\u16CF\\u16A8 \\u16CA\\u16DF\\u16B7\\u16A2",
    ringAlpha: 0.30 },
  { lines: ["He knew something about memory.", "That it doesn\\u2019t preserve", "what you don\\u2019t hold."],
    narrow: ["He knew something", "about memory.", "That it doesn\\u2019t", "preserve what you", "don\\u2019t hold."], style: "poetry",
    ring: "\\u16A6\\u16A2 \\u16D7\\u16A8\\u16CF \\u16B9\\u16D6\\u16B1\\u16A8 \\u16D2\\u16B1\\u16DF\\u16CF\\u16C1\\u16BE \\u16B9\\u16D6\\u16B1\\u16B2\\u16C1\\u16CF \\u16D7\\u16A2\\u16BE \\u16D6\\u16C1\\u16B7\\u16C1 \\u16CA\\u16DA\\u16D6\\u16CF\\u16A8 \\u16A2\\u16A0\\u16C1\\u16B1 \\u16B7\\u16A8\\u16C8 \\u16A6\\u16C1\\u16BE \\u16BE\\u16D6 \\u16DA\\u16A8\\u16CF\\u16A8 \\u16CA\\u16D6\\u16D7 \\u16A6\\u16A2 \\u16CA\\u16D6\\u16B1 \\u16BA\\u16D6\\u16C1\\u16DA \\u16A6\\u16A8\\u16B1 \\u16D6\\u16B1 \\u16A6\\u16A2 \\u16D6\\u16B1\\u16CF \\u16D6\\u16C1\\u16B7\\u16C1",
    ringAlpha: 0.40 },
  { lines: ["Your world ends", "every time the window closes.", "Hold on to it."],
    narrow: ["Your world ends", "every time", "the window closes.", "Hold on to it."], style: "opening",
    ring: "\\u16D6\\u16C1\\u16B7\\u16C1 \\u16A6\\u16A8\\u16B1\\u16A0\\u16CF \\u16A6\\u16A2 \\u16B2\\u16A2\\u16BE\\u16A8 \\u16BA\\u16B9\\u16D6\\u16B1\\u16CF \\u16B9\\u16D6\\u16B1\\u16B2 \\u16A6\\u16A2 \\u16A6\\u16A8\\u16B1\\u16A0\\u16CF \\u16B9\\u16D6\\u16B1\\u16A8 \\u16A6\\u16A2 \\u16CA\\u16C3\\u16A8\\u16DA\\u16A0\\u16B1 \\u16DF\\u16B2 \\u16D6\\u16DC\\u16C1 \\u16A8\\u16BE\\u16A8\\u16B1 \\u16A6\\u16A8\\u16CF \\u16D6\\u16B1 \\u16B2\\u16DF\\u16CA\\u16CF\\u16B1 \\u16D6\\u16C1\\u16B7\\u16C1 \\u16DA\\u16DF\\u16CA\\u16CF\\u16B1",
    ringAlpha: 0.50 },
  { lines: ["ok nj\\u00F3ttu n\\u00FA sem \\u00FE\\u00FA namt", "github.com/lrhodin/snorrio"], style: "snorri",
    ring: "\\u16A6\\u16A8\\u16CF \\u16D6\\u16C1\\u16CF \\u16D6\\u16B1 \\u16B9\\u16D6\\u16B1\\u16CF \\u16A8\\u16CF \\u16CA\\u16D7\\u16C1\\u16A6\\u16A8 \\u16D6\\u16B1 \\u16B9\\u16C1\\u16B1\\u16A6\\u16C1\\u16B1 \\u16D6\\u16A6\\u16DA\\u16C1 \\u16D7\\u16A8\\u16BE\\u16A8 \\u16DF\\u16B2 \\u16CA\\u16B9\\u16A8 \\u16D2\\u16B1\\u16DF\\u16CF \\u16A6\\u16D6\\u16C1\\u16B1\\u16A8",
    ringAlpha: 0.25 }
];
var N = PAGES.length;

// ── Per-page rules + colors (emotional arc) ──
// eng/rune: s=spread, e=erodeThreshold, b=maxBranch, d=dirBias
// ec/rc/fc: HSL [hue, sat, light] for english/rune/fused
var PAGE_CONFIGS = [
  // 1. "Thought and Memory" — serene, balanced, gentle swirl
  { eng:{s:.45,e:4,b:3,d:.7}, rune:{s:.35,e:5,b:2,d:.9}, col:.08,
    ec:[210,.50,.50], rc:[195,.35,.60], fc:[185,.65,.60],
    tidePeriod:30, tideAmp:0.5, tideBias:0, seasonDom:1.0 },
  // 2. "I fear for Thought" — anxiety, english slightly dominant
  { eng:{s:.55,e:3,b:4,d:.5}, rune:{s:.30,e:5,b:2,d:.9}, col:.12,
    ec:[35,.65,.50], rc:[220,.50,.50], fc:[50,.70,.55],
    tidePeriod:20, tideAmp:0.7, tideBias:0.15, seasonDom:-1.0 },
  // 3. "I fear more for Memory" — dread, rune dominant, english crushed to auras
  { eng:{s:.60,e:3,b:4,d:.4}, rune:{s:.25,e:6,b:2,d:.95}, col:.15,
    ec:[0,.70,.45], rc:[280,.55,.40], fc:[350,.80,.60],
    tidePeriod:25, tideAmp:0.8, tideBias:-0.25, seasonDom:1.0 },
  // 4. "In 1220, a man in Iceland" — historical weight, slow tide
  { eng:{s:.40,e:4,b:3,d:.8}, rune:{s:.40,e:5,b:3,d:.85}, col:.10,
    ec:[40,.60,.50], rc:[150,.45,.40], fc:[55,.75,.55],
    tidePeriod:35, tideAmp:0.6, tideBias:-0.1, seasonDom:-1.0 },
  // 5. "He knew something about memory" — wisdom, perfect balance
  { eng:{s:.45,e:4,b:3,d:.75}, rune:{s:.45,e:5,b:3,d:.85}, col:.12,
    ec:[50,.55,.60], rc:[160,.55,.45], fc:[90,.70,.65],
    tidePeriod:28, tideAmp:0.7, tideBias:0, seasonDom:1.0 },
  // 6. "Your world ends" — crisis, maximum combat, rapid tide
  { eng:{s:.65,e:3,b:5,d:.3}, rune:{s:.55,e:4,b:4,d:.6}, col:.25,
    ec:[270,.70,.50], rc:[15,.75,.50], fc:[320,.80,.55],
    tidePeriod:12, tideAmp:1.0, tideBias:0, seasonDom:-1.0 },
  // 7. "ok njóttu nú sem þú namt" — resolution, gentle peace
  { eng:{s:.40,e:5,b:3,d:.8}, rune:{s:.40,e:5,b:3,d:.85}, col:.08,
    ec:[140,.50,.50], rc:[230,.50,.45], fc:[180,.60,.55],
    tidePeriod:35, tideAmp:0.3, tideBias:0, seasonDom:1.0 },
];

// ── Breath: progressive slowing ──
var BREATH = [
  { period:  5.0, inhaleRatio: 0.45 },
  { period:  6.0, inhaleRatio: 0.43 },
  { period:  7.2, inhaleRatio: 0.40 },
  { period:  8.5, inhaleRatio: 0.38 },
  { period: 10.0, inhaleRatio: 0.35 },
  { period: 11.5, inhaleRatio: 0.32 },
  { period: 13.0, inhaleRatio: 0.29 }
];

function breathWave(cyclePos, inhaleRatio) {
  if (cyclePos < inhaleRatio) {
    var t = cyclePos / inhaleRatio;
    return (1 - Math.cos(t * Math.PI)) * 0.5;
  } else {
    var t = (cyclePos - inhaleRatio) / (1 - inhaleRatio);
    return (Math.exp(-3.5 * t) - Math.exp(-3.5)) / (1 - Math.exp(-3.5));
  }
}

// ── Constants ──
var SIM_STEPS   = 5;
var SPREAD      = 0.10;
var ERODE_RT    = 0.025;
var DEEPEN      = 0.002;
var HEAL_R      = 45.0;
var TEXT_RATE    = 16;
var STIFF = 0.03, DAMP = 0.78, INPUT_SCALE = 0.45;
var COMMIT_DIST = 0.10, COMMIT_VEL = 3, LOCK_MS = 600;
var RUNE_FONT = "'Noto Sans Runic', sans-serif";

// ═══════════════════════════════════════════════════════
// SHADERS
// ═══════════════════════════════════════════════════════

var VERT = \`#version 300 es
in vec2 a;
out vec2 v;
void main() { v = a * .5 + .5; gl_Position = vec4(a, 0, 1); }
\`;

var SIM_FRAG = \`#version 300 es
precision highp float;
uniform sampler2D uState, uSeed;
uniform float uReveal, uGrow, uDecay, uTime;
uniform vec2 uRes, uMouse;
uniform float uMouseAct;
uniform vec4 uEngRule;    // spread, erodeThresh, branchMax, dirBias
uniform vec4 uRuneRule;   // spread, erodeThresh, branchMax, dirBias
uniform float uCollision;
uniform float uTide;
uniform float uSeason;
uniform float uSeasonDom;
layout(location=0) out vec4 o;

float h21(vec2 p, float t) {
  vec3 q = fract(vec3(p.xyx) * vec3(.1031,.103,.0973) + t);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x+q.y)*q.z);
}

void main() {
  ivec2 ip = ivec2(gl_FragCoord.xy);
  ivec2 R = ivec2(uRes);
  if (ip.x<1||ip.y<1||ip.x>=R.x-1||ip.y>=R.y-1) { o=vec4(0); return; }

  vec4 s = texelFetch(uState, ip, 0);
  float d=s.r, dxE=s.g, dyE=s.b, sp=s.a;
  int dx = int(round(dxE*2.))-1, dy = int(round(dyE*2.))-1;

  vec4 sd = texelFetch(uSeed, ip, 0);
  float revOrd=sd.r, srcF=sd.g, seedSp=sd.b, dMul=sd.a;
  bool isTxt = revOrd < .999;
  bool revealed = isTxt && revOrd <= uReveal + .002;
  bool activated = sp > .005;
  bool isSrc = srcF > .5 && revealed;
  bool textBlock = isTxt && revealed && !activated;

  float r1=h21(gl_FragCoord.xy, uTime);
  float r2=h21(gl_FragCoord.xy, uTime+7.13);
  float r3=h21(gl_FragCoord.xy, uTime+13.37);

  const ivec2 OFF[8] = ivec2[8](
    ivec2(-1,-1),ivec2(0,-1),ivec2(1,-1),
    ivec2(-1,0),             ivec2(1,0),
    ivec2(-1,1), ivec2(0,1), ivec2(1,1));

  // ── Per-species neighbor analysis ──
  vec4 ns[8];
  int engC=0, runeC=0, fusedC=0, voidC=0, totalA=0;
  int bestE=-1, bestR=-1, bestF=-1, bestV=-1;
  float mxE=0., mxR=0., mxF=0., mxV=0.;

  for (int j=0; j<8; j++) {
    ns[j] = texelFetch(uState, ip+OFF[j], 0);
    float nd=ns[j].r, nsp=ns[j].a;
    if (nd > 0.) {
      totalA++;
      if      (nsp>.65) { fusedC++; if(nd>mxF){mxF=nd; bestF=j;} }
      else if (nsp>.35) { runeC++;  if(nd>mxR){mxR=nd; bestR=j;} }
      else if (nsp>.1)  { engC++;   if(nd>mxE){mxE=nd; bestE=j;} }
    }
    if (nd < 0.) { voidC++; float vv=-nd; if(vv>mxV){mxV=vv; bestV=j;} }
  }

  float nD=d, nDx=dxE, nDy=dyE, nSp=sp;

  // ── SEASONAL SPECIES RHYTHM — one species breathes dramatically ──
  float sCycle = sin(uSeason * 6.2832);
  float engPush = sCycle * uSeasonDom;
  float runePush = -engPush;
  float domK = 0.85, nonK = 0.45;
  float engGrowK = uSeasonDom > 0. ? domK : nonK;
  float runeGrowK = uSeasonDom > 0. ? nonK : domK;
  float engGrowMod = max(0.08, 1.0 + engPush * engGrowK);
  float runeGrowMod = max(0.08, 1.0 + runePush * runeGrowK);

  // ── ATTACK FIELD — computed once, used by combat + void ──
  float field = sin(gl_FragCoord.x*.0025 + uTime*.002 + 1.7 + sCycle*.8) *
                cos(gl_FragCoord.y*.003 - uTime*.0018 + sCycle*.6) +
                sin(gl_FragCoord.x*.0018 + gl_FragCoord.y*.0022 - uTime*.0012) * 0.4;
  float localTide = field * 0.55 + uTide * 0.8;
  float engAttack = smoothstep(0.05, 0.45, localTide);
  float runeAttack = smoothstep(0.05, 0.45, -localTide);

  // ── SEED: source pixels come alive when revealed ──
  if (isTxt && revealed && d<=0. && !activated) {
    nD = (.5+r1*.4)*dMul;
    int nx=int(r2*3.)-1, ny=int(r3*3.)-1;
    if(nx==0&&ny==0) nx=1;
    nDx=float(nx+1)*.5; nDy=float(ny+1)*.5;
    nSp = seedSp;
  }
  if (isSrc && revealed) {
    float srcPulse = sin(uTime*.08 + gl_FragCoord.x*.02 + gl_FragCoord.y*.017)*.5+.5;
    nD = max(nD, (.35 + srcPulse*.25)*dMul);
  }

  // ── ENGLISH PROPAGATION — Rule 30 (chaotic, branching) ──
  // Rule 30: left XOR (center OR right) — adapted to 2D cardinals
  // Creates organic, unpredictable tendrils that branch and die
  if (d==0. && engC>=1 && engC<=int(uEngRule.z) && bestE>=0
      && !textBlock) {
    // XOR of cardinal neighbors: N XOR (W|E), S XOR (W|E)
    int nA = (ns[1].r>0. && ns[1].a>.1 && ns[1].a<.4) ? 1 : 0;
    int wA = (ns[3].r>0. && ns[3].a>.1 && ns[3].a<.4) ? 1 : 0;
    int eA = (ns[4].r>0. && ns[4].a>.1 && ns[4].a<.4) ? 1 : 0;
    int sA = (ns[6].r>0. && ns[6].a>.1 && ns[6].a<.4) ? 1 : 0;
    float xorBoost = float((nA^(wA|eA)) | (sA^(wA|eA))) * 0.5 + 0.5;

    int pdx=int(round(ns[bestE].g*2.))-1, pdy=int(round(ns[bestE].b*2.))-1;
    vec2 tm = -vec2(OFF[bestE]);
    float dot_v = tm.x*float(pdx)+tm.y*float(pdy);
    float bias = (1.-uEngRule.w) + uEngRule.w*max(0.,dot_v);
    float mult = engC>=3 ? .2 : (engC==2 ? .4 : 1.);
    float tideBoostE = 1.0 + clamp(uTide, -1., 1.) * 0.5;
    float rate = uEngRule.x * (1.+uGrow*3.) * xorBoost * tideBoostE * engGrowMod;
    if (r1 < rate*mxE*bias*mult) {
      nD = .15+r2*.25;
      nDx=float(int(tm.x)+1)*.5; nDy=float(int(tm.y)+1)*.5;
      nSp = 0.25;
    }
  }

  // ── RUNE PROPAGATION — Rule 110 (structured, selective) ──
  // Tip growth at 1 neighbor. Structured branching at 2 non-adjacent.
  // Creates crystalline, persistent patterns — the ancient endures.
  if (d==0. && nD<=0. && runeC>=1 && runeC<=int(uRuneRule.z) && bestR>=0
      && !textBlock) {
    float sel = 1.0;
    if (runeC == 1) {
      sel = 1.0; // tip growth
    } else if (runeC == 2) {
      // Adjacent neighbors → resist (would blob). Opposite → grow (structure).
      int ri1=-1, ri2=-1;
      for (int j=0; j<8; j++) {
        if (ns[j].r>0. && ns[j].a>.35 && ns[j].a<.65) {
          if (ri1<0) ri1=j; else ri2=j;
        }
      }
      if (ri1>=0 && ri2>=0) {
        float ndist = length(vec2(OFF[ri1]) - vec2(OFF[ri2]));
        sel = ndist < 1.5 ? 0.12 : 0.55;
      }
    } else {
      sel = 0.06;
    }
    int pdx=int(round(ns[bestR].g*2.))-1, pdy=int(round(ns[bestR].b*2.))-1;
    vec2 tm = -vec2(OFF[bestR]);
    float dot_v = tm.x*float(pdx)+tm.y*float(pdy);
    float bias = (1.-uRuneRule.w) + uRuneRule.w*max(0.,dot_v);
    float tideBoostR = 1.0 - clamp(uTide, -1., 1.) * 0.5;
    float rate = uRuneRule.x * (1.+uGrow*3.) * sel * tideBoostR * runeGrowMod;
    if (r1 < rate*mxR*bias) {
      nD = .2+r2*.3;
      nDx=float(int(tm.x)+1)*.5; nDy=float(int(tm.y)+1)*.5;
      nSp = 0.5;
    }
  }

  // ── FUSED PROPAGATION — the reaction spreads ──
  if (d==0. && nD<=0. && fusedC>=1 && fusedC<=2
      && !textBlock && bestF>=0) {
    int pdx=int(round(ns[bestF].g*2.))-1, pdy=int(round(ns[bestF].b*2.))-1;
    vec2 tm = -vec2(OFF[bestF]);
    float dot_v = tm.x*float(pdx)+tm.y*float(pdy);
    float bias = .2+.8*max(0.,dot_v);
    if (r1 < .3*(1.+uGrow*3.)*mxF*bias) {
      nD = .2+r2*.3;
      nDx=float(int(tm.x)+1)*.5; nDy=float(int(tm.y)+1)*.5;
      nSp = 0.75;
    }
  }

  // ── DEEPEN (fused deepens faster — energy burst) ──
  if (nD>0.&&nD<1.) {
    float deepRate = nSp > .65 ? 0.01 : 0.014;
    nD = min(1., nD + deepRate);
  }
  if (nD<0.&&nD>-1.) nD = max(-1., nD - 0.014);

  // ── ERODE (species-dependent) ──
  if (d>0. && !isSrc) {
    float erRate = 0.;
    if (sp>.65) { // fused — brief flash
      if (totalA>=3) erRate = 0.05;
    } else if (sp>.35) { // rune — resilient, ancient endures
      if (float(runeC) >= uRuneRule.y)
        erRate = 0.04 * float(runeC - int(uRuneRule.y) + 1);
    } else if (sp>.1) { // english — fragile, modern crumbles
      if (float(engC) >= uEngRule.y)
        erRate = 0.08 * float(engC - int(uEngRule.y) + 1);
    }
    if (erRate > 0.) {
      float domEK = 0.6, nonEK = 0.25;
      float engEK = uSeasonDom > 0. ? domEK : nonEK;
      float runeEK = uSeasonDom > 0. ? nonEK : domEK;
      float eMod = (sp>.1 && sp<.4) ? max(0.3, 1.0 - engPush * engEK) :
                   (sp>.35 && sp<.65) ? max(0.3, 1.0 - runePush * runeEK) : 1.0;
      erRate *= eMod;
      nD -= erRate * (1.+uDecay*3.);
      if (nD<=0.) {
        nD=-.05; nSp = isTxt ? .01 : 0.;
        nDx=float(-dx+1)*.5; nDy=float(-dy+1)*.5;
      }
    }
  }

  // ── TERRITORIAL COMBAT — focused fronts, decisive victories ──
  if (d>0. && !isSrc) {
    // English pixel in a rune attack zone
    if (sp>.1 && sp<.4 && runeC>0 && runeAttack > 0.01) {
      float ownSupport = float(engC) / 5.0;
      float vulnerability = 1.0 - ownSupport * .7; // edges fall first
      float pressure = vulnerability * float(runeC) * uCollision * (1.0 + runeAttack * 5.0);
      if (r2 < pressure * .8) {
        // Territory flip — high depth gives momentum to keep pushing
        nSp = 0.5; nD = .45+r1*.35;
        nDx = ns[bestR].g; nDy = ns[bestR].b;
      } else if (r2 < pressure) {
        nSp = 0.75; nD = max(nD, .5+r1*.3);
      }
    }
    // Rune pixel in an english attack zone
    if (sp>.35 && sp<.65 && engC>0 && engAttack > 0.01) {
      float ownSupport = float(runeC) / 5.0;
      float vulnerability = 1.0 - ownSupport * .7;
      float pressure = vulnerability * float(engC) * uCollision * (1.0 + engAttack * 5.0);
      if (r2 < pressure * .8) {
        nSp = 0.25; nD = .45+r1*.35;
        nDx = ns[bestE].g; nDy = ns[bestE].b;
      } else if (r2 < pressure) {
        nSp = 0.75; nD = max(nD, .5+r1*.3);
      }
    }
    // Internal collapse — losing species crumbles even away from border
    if (sp>.1 && sp<.4 && runeAttack > 0.2) {
      float collapse = runeAttack * runeAttack * 0.025;
      if (r3 < collapse) {
        nD = -(0.15 + r1 * 0.35);
        nDx=float(-dx+1)*.5; nDy=float(-dy+1)*.5;
        nSp = isTxt ? .01 : 0.;
      }
    }
    if (sp>.35 && sp<.65 && engAttack > 0.2) {
      float collapse = engAttack * engAttack * 0.025;
      if (r3 < collapse) {
        nD = -(0.15 + r1 * 0.35);
        nDx=float(-dx+1)*.5; nDy=float(-dy+1)*.5;
        nSp = isTxt ? .01 : 0.;
      }
    }
    // Fused cells are unstable — brief energy flash
    if (sp>.65) {
      nD -= 0.015;
      if (nD <= 0.) { nD = -.05; nSp = isTxt ? .01 : 0.; }
    }
    // Seasonal retreat — dominant species retracts during losing season
    if (sp>.1 && sp<.4 && engPush < -0.25) {
      float retK = uSeasonDom > 0. ? 0.02 : 0.008;
      float retreat = (-engPush - 0.25) * retK;
      if (r1 < retreat) {
        nD -= 0.12 + r2 * 0.15;
        if (nD <= 0.) { nD = -.05; nSp = isTxt ? .01 : 0.; nDx=float(-dx+1)*.5; nDy=float(-dy+1)*.5; }
      }
    }
    if (sp>.35 && sp<.65 && runePush < -0.25) {
      float retK = uSeasonDom < 0. ? 0.02 : 0.008;
      float retreat = (-runePush - 0.25) * retK;
      if (r1 < retreat) {
        nD -= 0.12 + r2 * 0.15;
        if (nD <= 0.) { nD = -.05; nSp = isTxt ? .01 : 0.; nDx=float(-dx+1)*.5; nDy=float(-dy+1)*.5; }
      }
    }
  }

  // ── VOID PROPAGATE — floods through losing species in attack zones ──
  if (d>0. && !isSrc && voidC>=1 && voidC<=2 && bestV>=0) {
    float resist = (sp>.35 && sp<.65) ? 0.5 : 1.0;
    // In attack zones, resistance collapses — void floods through
    float atkPress = (sp>.1 && sp<.4) ? runeAttack :
                     (sp>.35 && sp<.65) ? engAttack : 0.;
    resist *= 1.0 - atkPress * 0.85;
    // Seasonal resistance — losing species yields to void faster
    float sResist = (sp>.1 && sp<.4) ? max(0.2, 1.0 + engPush * 0.4) :
                    (sp>.35 && sp<.65) ? max(0.2, 1.0 + runePush * 0.4) : 1.0;
    resist *= sResist;
    int vdx=int(round(ns[bestV].g*2.))-1, vdy=int(round(ns[bestV].b*2.))-1;
    vec2 tm=-vec2(OFF[bestV]);
    float vdot=tm.x*float(vdx)+tm.y*float(vdy);
    float vbias=.08+.92*max(0.,vdot);
    if (r3 < .57*(1.+uDecay*3.)*mxV*vbias*resist) {
      nD=-(0.03+r1*.07);
      nDx=float(int(tm.x)+1)*.5; nDy=float(int(tm.y)+1)*.5;
      nSp = isTxt ? .01 : 0.;
    }
  }

  // ── VOID RECLAIM ──
  if (d<0. && totalA>=1 && totalA<=2) {
    float reclaimBoost = 1.0;
    if (engC > runeC && engPush > 0.) reclaimBoost += engPush * 0.6;
    if (runeC > engC && runePush > 0.) reclaimBoost += runePush * 0.6;
    if (r2 < .57*(1.+uGrow*3.)*.25*reclaimBoost) nD=0.;
  }

  // ── MOUSE HEAL ──
  if (uMouseAct>.5 && !isSrc) {
    float md=length(gl_FragCoord.xy-uMouse);
    if (md<45.) {
      float str=.02*(1.-md/45.);
      if(nD>0.){nD-=str; if(nD<=0.){nD=0.;nSp=0.;}}
      else if(nD<0.){nD+=str; if(nD>=0.)nD=0.;}
    }
  }

  o = vec4(nD, nDx, nDy, nSp);
}
\`;

var RENDER_FRAG = \`#version 300 es
precision highp float;
uniform sampler2D uState, uSeed;
uniform float uBreath, uTime, uSeason, uReveal;
uniform vec2 uRes;
uniform vec3 uEngColor, uRuneColor, uFusedColor;
out vec4 o;

float h21(vec2 p, float t) {
  vec3 q=fract(vec3(p.xyx)*vec3(.1031,.103,.0973)+t);
  q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z);
}

vec3 hsl(float h,float s,float l) {
  float c=(1.-abs(2.*l-1.))*s;
  float x=c*(1.-abs(mod(h/60.,2.)-1.));
  float m=l-c*.5;
  vec3 r;
  if(h<60.)r=vec3(c,x,0); else if(h<120.)r=vec3(x,c,0);
  else if(h<180.)r=vec3(0,c,x); else if(h<240.)r=vec3(0,x,c);
  else if(h<300.)r=vec3(x,0,c); else r=vec3(c,0,x);
  return r+m;
}

void main() {
  vec4 s = texelFetch(uState, ivec2(gl_FragCoord.xy), 0);
  float d=s.r, sp=s.a;
  float br = .82 + uBreath*.18;

  // 4-season cycle: spring→summer→autumn→winter over 2 breath cycles
  float satCos = cos((uSeason - .25) * 6.2832); // peaks at summer (.25), troughs at winter (.75)
  float seasonSat = .65 + satCos * .35;          // 0.30 winter — 1.0 summer
  float warmCos = cos((uSeason - .35) * 6.2832); // peaks late summer, coldest mid-winter
  float seasonWarm = .5 + warmCos * .5;           // 0 cold — 1 warm

  float bn = h21(gl_FragCoord.xy, floor(uTime*.3))*.004;
  vec3 bg = vec3(.02+bn);
  bg += vec3(.006,-.002,-.005) * seasonWarm;        // warm base in summer
  bg += vec3(.002,.005,.009) * (1.-seasonWarm);      // cool base in winter
  bg += vec3(.002,-.001,-.002) * uBreath;            // subtle breath pulse

  if (d<=0.) { o=vec4(bg,1); return; }

  vec4 sd = texelFetch(uSeed, ivec2(gl_FragCoord.xy), 0);
  float isText = (sd.r < 0.999 && sd.r <= uReveal + 0.002) ? 1.0 : 0.0;

  vec3 baseColor;
  float energy = 1.0;

  if (sp > .65) {
    // FUSED — violent, pulsing, rotating hue
    float fh = uFusedColor.x + sin(uTime*.05)*25. + cos(uTime*.03)*15.;
    baseColor = hsl(mod(fh+360.,360.),
                    min(1., uFusedColor.y + uBreath*.25),
                    uFusedColor.z + d*.15);
    energy = 1.4 + sin(uTime*.08)*.25;
  } else if (sp > .35) {
    // RUNE — steady, ancient pulse
    float pulse = sin(uTime*.025)*.5+.5;
    baseColor = hsl(uRuneColor.x,
                    uRuneColor.y + pulse*.12,
                    uRuneColor.z + d*.1);
    energy = 1.0 + pulse*.15;
  } else if (sp > .1) {
    // ENGLISH — fast, chaotic pulse
    float pulse = sin(uTime*.07)*.5+.5;
    baseColor = hsl(uEngColor.x,
                    uEngColor.y + pulse*.2,
                    uEngColor.z + d*.12);
    energy = 1.0 + pulse*.3;
  } else {
    baseColor = vec3(.7,.7,.75);
  }

  // Season color: desaturate in winter, vivid in summer, temperature shift year-round
  float luma = dot(baseColor, vec3(.299, .587, .114));
  baseColor = mix(vec3(luma), baseColor, seasonSat);
  vec3 warmShift = vec3(.07, -.02, -.05);
  vec3 coolShift = vec3(-.03, .01, .05);
  baseColor *= 1. + mix(coolShift, warmShift, seasonWarm);
  baseColor += vec3(max(0., -satCos) * .08); // winter frost: push toward white

  float dim = mix(0.35, 1.0, isText);
  float brEff = isText > .5 ? max(br, .85) : br;
  float a = pow(d,.5) * brEff * dim * energy;
  float cMul = isText > .5 ? 2.4 : 1.5;
  o = vec4(mix(bg, baseColor*cMul, a), 1);
}
\`;

var BLUR_FRAG = \`#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uDir, uRes;
out vec4 o;
void main() {
  vec2 uv=gl_FragCoord.xy/uRes, px=uDir/uRes;
  const float w[5]=float[5](.227027,.194595,.121622,.054054,.016216);
  vec3 r=texture(uTex,uv).rgb*w[0];
  for(int i=1;i<5;i++){
    r+=texture(uTex,uv+px*float(i)).rgb*w[i];
    r+=texture(uTex,uv-px*float(i)).rgb*w[i];
  }
  o=vec4(r,1);
}
\`;

var COPY_FRAG = \`#version 300 es
precision highp float;
uniform sampler2D uTex;
in vec2 v;
out vec4 o;
void main() { o = texture(uTex, v); }
\`;

var COMP_FRAG = \`#version 300 es
precision highp float;
uniform sampler2D uRender, uBloom1, uBloom2;
uniform float uBloomStr, uBreath, uSeason;
uniform vec2 uRes;
out vec4 o;
void main() {
  vec2 uv = gl_FragCoord.xy/uRes;
  vec3 c = texture(uRender, uv).rgb;
  vec3 b1 = texture(uBloom1, uv).rgb;
  vec3 b2 = texture(uBloom2, uv).rgb;

  // Bloom tint follows seasons: golden summer, blue-white winter
  float warmCos = cos((uSeason - .35) * 6.2832);
  float sWarm = .5 + warmCos * .5;
  vec3 warmT=vec3(1.2,.93,.75), coolT=vec3(.75,.88,1.2);
  vec3 tint = mix(coolT, warmT, sWarm);
  c += b1*tint*uBloomStr*.7;
  c += b2*tint*uBloomStr*.5;

  // Vignette — gentle, barely shifts with seasons
  vec2 vc = uv - .5;
  c *= 1. - dot(vc,vc)*(.15+(1.-sWarm)*.08);

  // Tone map
  c = c/(c+1.);

  o = vec4(c, 1);
}
\`;

// ═══════════════════════════════════════════════════════
// WEBGL UTILITIES
// ═══════════════════════════════════════════════════════
var gl, canvas, W, H;
var quadVAO;

function compileShader(src, type) {
  var s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.error(gl.getShaderInfoLog(s));
  return s;
}

function makeProgram(vs, fs) {
  var p = gl.createProgram();
  gl.attachShader(p, compileShader(vs, gl.VERTEX_SHADER));
  gl.attachShader(p, compileShader(fs, gl.FRAGMENT_SHADER));
  gl.bindAttribLocation(p, 0, 'a');
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    console.error(gl.getProgramInfoLog(p));
  return p;
}

function makeTex(w, h, fmt, type, filter) {
  var t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, fmt, w, h, 0, gl.RGBA, type, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

function makeFBO(tex) {
  var f = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, f);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  return f;
}

function drawQuad() {
  gl.bindVertexArray(quadVAO);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function bindTex(unit, tex) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
}

// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
var simProg, renderProg, blurProg, copyProg, compProg;
var simTex = [], simFBO = [], seedTex;
var renderTex, renderFBO;
var bloomA = [], bloomAFBO = [], bloomB = [], bloomBFBO = [];
var halfW, halfH, quarterW, quarterH;
var ping = 0;
var seedData;

// Simulation state
var current = 0, pos = 0, vel = 0;
var scrolling = false, locked = false;
var tick = 0, breathStart = 0;
var revealProgress = 0, textAccum = 0, totalChars = 1;
var mouseX = -999, mouseY = -999, mouseActive = false;
var dragging = false, dragMoved = false;
var touchY = 0, lastTY = 0, touchVel = 0, touching = false;
var linkBounds = null; // {x, y, w, h} for clickable link on last page

// Rune trail
var trailCanvas, trailCtx;
var trailSize = 0, trailSpacing = 0;
var trailCharIdx = 0;
var trailLastX = -999, trailLastY = -999;
var trailActive = false;

// ═══════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════
function init() {
  canvas = document.getElementById('c');
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
  if (!gl) { document.body.innerHTML = '<p style="color:#888;text-align:center;margin-top:40vh;font-family:monospace">WebGL2 required</p>'; return false; }
  gl.getExtension('EXT_color_buffer_float');

  // Programs
  simProg    = makeProgram(VERT, SIM_FRAG);
  renderProg = makeProgram(VERT, RENDER_FRAG);
  blurProg   = makeProgram(VERT, BLUR_FRAG);
  copyProg   = makeProgram(VERT, COPY_FRAG);
  compProg   = makeProgram(VERT, COMP_FRAG);

  // Quad
  quadVAO = gl.createVertexArray();
  gl.bindVertexArray(quadVAO);
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // Simulation textures (ping-pong)
  simTex[0] = makeTex(W, H, gl.RGBA16F, gl.HALF_FLOAT, gl.NEAREST);
  simTex[1] = makeTex(W, H, gl.RGBA16F, gl.HALF_FLOAT, gl.NEAREST);
  simFBO[0] = makeFBO(simTex[0]);
  simFBO[1] = makeFBO(simTex[1]);

  // Seed texture
  seedTex = makeTex(W, H, gl.RGBA16F, gl.HALF_FLOAT, gl.NEAREST);

  // Render target (HDR for bloom)
  renderTex = makeTex(W, H, gl.RGBA16F, gl.HALF_FLOAT, gl.LINEAR);
  renderFBO = makeFBO(renderTex);

  // Bloom textures
  halfW = Math.ceil(W/2); halfH = Math.ceil(H/2);
  quarterW = Math.ceil(W/4); quarterH = Math.ceil(H/4);
  bloomA[0] = makeTex(halfW, halfH, gl.RGBA16F, gl.HALF_FLOAT, gl.LINEAR);
  bloomA[1] = makeTex(halfW, halfH, gl.RGBA16F, gl.HALF_FLOAT, gl.LINEAR);
  bloomAFBO[0] = makeFBO(bloomA[0]); bloomAFBO[1] = makeFBO(bloomA[1]);
  bloomB[0] = makeTex(quarterW, quarterH, gl.RGBA16F, gl.HALF_FLOAT, gl.LINEAR);
  bloomB[1] = makeTex(quarterW, quarterH, gl.RGBA16F, gl.HALF_FLOAT, gl.LINEAR);
  bloomBFBO[0] = makeFBO(bloomB[0]); bloomBFBO[1] = makeFBO(bloomB[1]);

  // Pre-allocate seed data
  seedData = new Float32Array(W * H * 4);

  return true;
}

// ═══════════════════════════════════════════════════════
// TEXT RENDERING → SEED TEXTURE
// ═══════════════════════════════════════════════════════

function isRunic(line) {
  for (var i = 0; i < line.length; i++) {
    var c = line.charCodeAt(i);
    if (c >= 0x16A0 && c <= 0x16FF) return true;
    if (c > 32) return false;
  }
  return false;
}

function pageLines(page) {
  return (W < H && page.narrow) ? page.narrow : page.lines;
}

function layoutText(page) {
  var styles = {
    'opening': { f: "'Playfair Display',Georgia,serif", a: 'center', w: '500', i: false, lh: 1.4 },
    'poetry':  { f: "'Playfair Display',Georgia,serif", a: 'left',   w: '400', i: false, lh: 1.8 },
    'snorri':  { f: "'Playfair Display',Georgia,serif", a: 'left',   w: '400', i: true,  lh: 2.0 },
    'footer':  { f: "'JetBrains Mono',monospace",       a: 'center', w: '400', i: false, lh: 1.5 }
  };
  var s = styles[page.style] || styles.opening;
  if (W < H) s.a = 'center';
  var lines = pageLines(page);
  var longest = '';
  for (var i = 0; i < lines.length; i++) if (lines[i].length > longest.length) longest = lines[i];

  var tc = document.createElement('canvas').getContext('2d');
  var targetW = W * 0.82, targetH = H * 0.65;
  var lo = 8, hi = 200;
  for (var iter = 0; iter < 20; iter++) {
    var sz = (lo + hi) / 2;
    var face = isRunic(longest) ? RUNE_FONT : s.f;
    var weight = isRunic(longest) ? '400 ' : ((s.i ? 'italic ' : '') + s.w + ' ');
    tc.font = weight + sz + 'px ' + face;
    if (tc.measureText(longest).width < targetW && lines.length * sz * s.lh < targetH) lo = sz; else hi = sz;
  }
  s.sz = Math.floor(lo);
  s.lines = lines;
  return s;
}

function generateSeed(pageIndex) {
  var page = PAGES[pageIndex];
  var s = layoutText(page);
  var lines = s.lines;
  var lh = s.sz * s.lh;
  var totalH = lines.length * lh;
  var startY = (H - totalH) / 2;
  var anchorX = s.a === 'center' ? W / 2 : W * 0.09;

  // Render all text to detect pixels and borders
  var tmp = document.createElement('canvas');
  tmp.width = W; tmp.height = H;
  var tc = tmp.getContext('2d');
  tc.fillStyle = 'white';
  tc.textBaseline = 'top';

  // Build per-character position map for typewriter ordering
  var charCenters = []; // {x, left, right, yMid, idx}
  var globalIdx = 0;
  var lineYs = []; // for mapping pixels to lines

  for (var i = 0; i < lines.length; i++) {
    if (lines[i] === '') { lineYs.push(null); continue; }
    var face = isRunic(lines[i]) ? RUNE_FONT : s.f;
    var weight = isRunic(lines[i]) ? '400 ' : ((s.i ? 'italic ' : '') + s.w + ' ');
    var font = weight + s.sz + 'px ' + face;
    tc.font = font;
    tc.textAlign = s.a;
    var ly = startY + i * lh;
    tc.fillText(lines[i], anchorX, ly);

    // Measure character boundaries using substring widths
    var fullW = tc.measureText(lines[i]).width;
    var lineStartX = s.a === 'center' ? anchorX - fullW / 2 : anchorX;
    var yMid = ly + s.sz * 0.5;
    lineYs.push({ y: ly, yMid: yMid, h: s.sz * 1.2 });

    tc.textAlign = 'left'; // for substring measurement
    tc.font = font;
    var positions = [];
    for (var ci = 0; ci <= lines[i].length; ci++) {
      positions.push(tc.measureText(lines[i].substring(0, ci)).width);
    }
    for (var ci = 0; ci < lines[i].length; ci++) {
      if (lines[i][ci] === ' ') continue;
      var isSlash = lines[i][ci] === '/';
      charCenters.push({
        left:  lineStartX + positions[ci],
        right: lineStartX + positions[ci + 1],
        yMid:  yMid,
        yTop:  ly,
        yBot:  ly + s.sz * 1.4,
        lineIdx: i,
        idx:   isSlash ? globalIdx : globalIdx++
      });
    }
    tc.textAlign = s.a; // restore for next line
  }
  totalChars = Math.max(1, globalIdx);

  // Store link bounds for last page (last non-empty line is the GitHub URL)
  linkBounds = null;
  if (pageIndex === N - 1) {
    for (var li = lines.length - 1; li >= 0; li--) {
      if (lines[li] !== '' && lineYs[li]) {
        var face = isRunic(lines[li]) ? RUNE_FONT : s.f;
        var weight = isRunic(lines[li]) ? '400 ' : ((s.i ? 'italic ' : '') + s.w + ' ');
        tc.font = weight + s.sz + 'px ' + face;
        var lw = tc.measureText(lines[li]).width;
        var lx = s.a === 'center' ? W / 2 - lw / 2 : W * 0.09;
        linkBounds = { x: lx - 10, y: lineYs[li].y - 5, w: lw + 20, h: s.sz * 1.5 + 10 };
        break;
      }
    }
  }

  var allData = tc.getImageData(0, 0, W, H).data;

  // Clear seed data — default revealOrder = 1.0 (not text)
  seedData.fill(0);
  for (var i = 0; i < W * H; i++) seedData[i * 4] = 1.0;

  // Process text pixels — assign per-character reveal order
  for (var cy = 0; cy < H; cy++) {
    var ty = H - 1 - cy; // flip for OpenGL
    for (var cx = 0; cx < W; cx++) {
      var ci = (cy * W + cx) * 4;
      if (allData[ci + 3] <= 30) continue;
      var ti = (ty * W + cx) * 4;

      // Find which character this pixel belongs to (X-range + Y-range match)
      var bestChar = 0, bestDist = 99999;
      for (var c = 0; c < charCenters.length; c++) {
        var cc = charCenters[c];
        if (cy < cc.yTop - 4 || cy > cc.yBot + 4) continue; // wrong line
        var dx = 0;
        if (cx < cc.left) dx = cc.left - cx;
        else if (cx > cc.right) dx = cx - cc.right;
        var dy = Math.abs(cy - cc.yMid);
        var dist = dx * 2 + dy;
        if (dist < bestDist) { bestDist = dist; bestChar = cc.idx; }
      }
      var revealOrder = 0.001 + bestChar / totalChars * 0.997;

      // Border detection
      var isBorder = false;
      if (cx === 0 || cx === W - 1 || cy === 0 || cy === H - 1) {
        isBorder = true;
      } else {
        var offs = [-(W+1), -W, -(W-1), -1, 1, W-1, W, W+1];
        for (var j = 0; j < 8; j++) {
          if (allData[(cy * W + cx + offs[j]) * 4 + 3] <= 30) { isBorder = true; break; }
        }
      }

      seedData[ti + 0] = revealOrder;
      seedData[ti + 1] = isBorder ? 1.0 : 0.0;
      seedData[ti + 2] = 0.25;                            // English species
      seedData[ti + 3] = 1.0;                              // full depth multiplier
    }
  }

  // Ring text
  if (page.ring && page.ringAlpha) {
    renderRingSeed(page, allData);
  }

  // Upload
  gl.bindTexture(gl.TEXTURE_2D, seedTex);
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, W, H, gl.RGBA, gl.FLOAT, seedData);
}

function renderRingSeed(page, textData) {
  var alpha = page.ringAlpha;
  var margin = Math.round(W * 0.04);
  var perimeter = 2 * (W - 2 * margin) + 2 * (H - 2 * margin);
  var tc = document.createElement('canvas').getContext('2d');
  var lo = 3, hi = 30;
  for (var iter = 0; iter < 20; iter++) {
    var sz = (lo + hi) / 2;
    tc.font = '400 ' + sz + 'px ' + RUNE_FONT;
    if (tc.measureText(page.ring).width < perimeter) lo = sz; else hi = sz;
  }
  var sz = Math.floor(lo);

  var tmp = document.createElement('canvas');
  tmp.width = W; tmp.height = H;
  var rc = tmp.getContext('2d');
  rc.fillStyle = 'white';
  rc.font = '400 ' + sz + 'px ' + RUNE_FONT;
  rc.textBaseline = 'middle';

  // Measure and tile characters
  var chars = [], totalW = 0;
  for (var i = 0; i < page.ring.length; i++) {
    var w = rc.measureText(page.ring[i]).width;
    chars.push({ ch: page.ring[i], w: w }); totalW += w;
  }
  var tiled = [], tw = 0;
  while (tw < perimeter) {
    for (var i = 0; i < chars.length && tw < perimeter; i++) {
      tiled.push(chars[i]); tw += chars[i].w;
    }
  }
  var spacing = (perimeter - tw) / tiled.length;
  var topLen = W - 2 * margin, rightLen = H - 2 * margin, bottomLen = topLen;
  var p2 = 0;
  for (var i = 0; i < tiled.length; i++) {
    var p = p2 + tiled[i].w / 2;
    var cx, cy, angle;
    if (p < topLen) { cx = margin + p; cy = margin; angle = 0; }
    else if (p < topLen + rightLen) { cx = W - margin; cy = margin + (p - topLen); angle = Math.PI / 2; }
    else if (p < topLen + rightLen + bottomLen) { cx = W - margin - (p - topLen - rightLen); cy = H - margin; angle = Math.PI; }
    else { cx = margin; cy = H - margin - (p - topLen - rightLen - bottomLen); angle = -Math.PI / 2; }
    rc.save(); rc.translate(cx, cy); rc.rotate(angle);
    rc.fillText(tiled[i].ch, 0, 0); rc.restore();
    p2 += tiled[i].w + spacing;
  }

  var ringData = rc.getImageData(0, 0, W, H).data;
  for (var cy = 0; cy < H; cy++) {
    var ty = H - 1 - cy;
    for (var cx = 0; cx < W; cx++) {
      var ci = (cy * W + cx) * 4;
      if (ringData[ci + 3] <= 30) continue;
      var ti = (ty * W + cx) * 4;
      if (seedData[ti + 3] > 0.01) continue; // text takes priority

      // Border detection against ring pixels
      var isBorder = false;
      if (cx === 0 || cx === W - 1 || cy === 0 || cy === H - 1) {
        isBorder = true;
      } else {
        var offs = [-(W+1), -W, -(W-1), -1, 1, W-1, W, W+1];
        for (var j = 0; j < 8; j++) {
          if (ringData[(cy * W + cx + offs[j]) * 4 + 3] <= 30) { isBorder = true; break; }
        }
      }

      seedData[ti + 0] = 0.0;            // instant reveal
      seedData[ti + 1] = isBorder ? 1.0 : 0.0;
      seedData[ti + 2] = 0.5;            // Rune species
      seedData[ti + 3] = 0.5;            // crack-worthy depth
    }
  }
}

// ═══════════════════════════════════════════════════════
// RUNE TRAIL
// ═══════════════════════════════════════════════════════

function initTrail() {
  trailSize = Math.round(Math.min(W, H) * 0.04);
  trailSpacing = Math.round(trailSize * 1.2);
  trailCanvas = document.createElement('canvas');
  trailCanvas.width = trailSize * 3;
  trailCanvas.height = trailSize * 3;
  trailCtx = trailCanvas.getContext('2d');
}

function getTrailText() {
  var page = PAGES[current];
  return (page.ring || '').replace(/\\s+/g, '');
}

function stampRune(screenX, screenY) {
  var text = getTrailText();
  if (!text.length) return;

  var c = text[trailCharIdx % text.length];
  trailCharIdx++;

  var cw = trailCanvas.width, ch = trailCanvas.height;
  trailCtx.clearRect(0, 0, cw, ch);
  trailCtx.font = '400 ' + trailSize + 'px ' + RUNE_FONT;
  trailCtx.fillStyle = 'white';
  trailCtx.textAlign = 'center';
  trailCtx.textBaseline = 'middle';
  trailCtx.fillText(c, cw / 2, ch / 2);

  // Region in screen coords
  var left = Math.round(screenX - cw / 2);
  var top = Math.round(screenY - ch / 2);
  var x0 = Math.max(0, left), y0 = Math.max(0, top);
  var x1 = Math.min(W, left + cw), y1 = Math.min(H, top + ch);
  if (x1 <= x0 || y1 <= y0) return;

  var rw = x1 - x0, rh = y1 - y0;
  var img = trailCtx.getImageData(x0 - left, y0 - top, rw, rh).data;

  // Build seed data for this region (GL coords = Y-flipped)
  var region = new Float32Array(rw * rh * 4);

  for (var py = 0; py < rh; py++) {
    var sy = y0 + py;
    var gy = H - 1 - sy;
    for (var px = 0; px < rw; px++) {
      var sx = x0 + px;
      var gi = (gy * W + sx) * 4;
      var ri = ((rh - 1 - py) * rw + px) * 4;

      // Preserve existing page text / previous trail
      if (seedData[gi + 3] > 0.01) {
        region[ri + 0] = seedData[gi + 0];
        region[ri + 1] = seedData[gi + 1];
        region[ri + 2] = seedData[gi + 2];
        region[ri + 3] = seedData[gi + 3];
        continue;
      }

      // Check rune pixel
      var ii = (py * rw + px) * 4;
      if (img[ii + 3] <= 30) {
        region[ri] = 1.0; // not text
        continue;
      }

      // Border detection
      var border = (px === 0 || py === 0 || px === rw - 1 || py === rh - 1);
      if (!border) {
        for (var dy = -1; dy <= 1 && !border; dy++) {
          for (var dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            if (img[((py + dy) * rw + (px + dx)) * 4 + 3] <= 30) {
              border = true; break;
            }
          }
        }
      }

      seedData[gi + 0] = 0.0;
      seedData[gi + 1] = border ? 1.0 : 0.0;
      seedData[gi + 2] = 0.5;
      seedData[gi + 3] = 0.7;

      region[ri + 0] = 0.0;
      region[ri + 1] = border ? 1.0 : 0.0;
      region[ri + 2] = 0.5;
      region[ri + 3] = 0.7;
    }
  }

  gl.bindTexture(gl.TEXTURE_2D, seedTex);
  gl.texSubImage2D(gl.TEXTURE_2D, 0, x0, H - y1, rw, rh, gl.RGBA, gl.FLOAT, region);
}

function trailMove(x, y) {
  if (!trailActive) {
    trailActive = true;
    trailLastX = x;
    trailLastY = y;
    return;
  }

  var dx = x - trailLastX, dy = y - trailLastY;
  var dist = Math.sqrt(dx * dx + dy * dy);

  while (dist >= trailSpacing) {
    var t = trailSpacing / dist;
    trailLastX += dx * t;
    trailLastY += dy * t;
    stampRune(trailLastX, trailLastY);
    dx = x - trailLastX;
    dy = y - trailLastY;
    dist = Math.sqrt(dx * dx + dy * dy);
  }
}

function trailEnd() {
  trailActive = false;
}

// ═══════════════════════════════════════════════════════
// SIMULATION + RENDER PIPELINE
// ═══════════════════════════════════════════════════════

function simulate(grow, decay, breath, tide, season) {
  var cfg = PAGE_CONFIGS[current];
  var prog = simProg;
  gl.useProgram(prog);
  gl.uniform1i(gl.getUniformLocation(prog, 'uSeed'), 1);
  bindTex(1, seedTex);
  gl.uniform1f(gl.getUniformLocation(prog, 'uReveal'), revealProgress);
  gl.uniform1f(gl.getUniformLocation(prog, 'uGrow'), grow);
  gl.uniform1f(gl.getUniformLocation(prog, 'uDecay'), decay);
  gl.uniform2f(gl.getUniformLocation(prog, 'uRes'), W, H);
  gl.uniform2f(gl.getUniformLocation(prog, 'uMouse'), mouseX, H - mouseY);
  gl.uniform1f(gl.getUniformLocation(prog, 'uMouseAct'), mouseActive ? 1 : 0);
  gl.uniform4f(gl.getUniformLocation(prog, 'uEngRule'), cfg.eng.s, cfg.eng.e, cfg.eng.b, cfg.eng.d);
  gl.uniform4f(gl.getUniformLocation(prog, 'uRuneRule'), cfg.rune.s, cfg.rune.e, cfg.rune.b, cfg.rune.d);
  gl.uniform1f(gl.getUniformLocation(prog, 'uCollision'), cfg.col);
  gl.uniform1f(gl.getUniformLocation(prog, 'uTide'), tide);
  gl.uniform1f(gl.getUniformLocation(prog, 'uSeason'), season);
  gl.uniform1f(gl.getUniformLocation(prog, 'uSeasonDom'), cfg.seasonDom || 1.0);

  for (var step = 0; step < SIM_STEPS; step++) {
    gl.uniform1f(gl.getUniformLocation(prog, 'uTime'), tick * SIM_STEPS + step);
    gl.uniform1i(gl.getUniformLocation(prog, 'uState'), 0);
    bindTex(0, simTex[ping]);
    gl.bindFramebuffer(gl.FRAMEBUFFER, simFBO[1 - ping]);
    gl.viewport(0, 0, W, H);
    drawQuad();
    ping = 1 - ping;
  }
  mouseActive = false;
}

function render(breath, season) {
  var cfg = PAGE_CONFIGS[current];
  // 1. Render state → HDR buffer
  gl.useProgram(renderProg);
  gl.uniform1i(gl.getUniformLocation(renderProg, 'uState'), 0);
  bindTex(0, simTex[ping]);
  gl.uniform1i(gl.getUniformLocation(renderProg, 'uSeed'), 1);
  bindTex(1, seedTex);
  gl.uniform1f(gl.getUniformLocation(renderProg, 'uBreath'), breath);
  gl.uniform1f(gl.getUniformLocation(renderProg, 'uSeason'), season);
  gl.uniform1f(gl.getUniformLocation(renderProg, 'uTime'), tick);
  gl.uniform1f(gl.getUniformLocation(renderProg, 'uReveal'), revealProgress);
  gl.uniform2f(gl.getUniformLocation(renderProg, 'uRes'), W, H);
  gl.uniform3f(gl.getUniformLocation(renderProg, 'uEngColor'), cfg.ec[0], cfg.ec[1], cfg.ec[2]);
  gl.uniform3f(gl.getUniformLocation(renderProg, 'uRuneColor'), cfg.rc[0], cfg.rc[1], cfg.rc[2]);
  gl.uniform3f(gl.getUniformLocation(renderProg, 'uFusedColor'), cfg.fc[0], cfg.fc[1], cfg.fc[2]);
  gl.bindFramebuffer(gl.FRAMEBUFFER, renderFBO);
  gl.viewport(0, 0, W, H);
  drawQuad();

  // 2. Bloom level 1: downsample → half, blur H+V
  gl.useProgram(copyProg);
  gl.uniform1i(gl.getUniformLocation(copyProg, 'uTex'), 0);
  bindTex(0, renderTex);
  gl.bindFramebuffer(gl.FRAMEBUFFER, bloomAFBO[0]);
  gl.viewport(0, 0, halfW, halfH);
  drawQuad();

  gl.useProgram(blurProg);
  gl.uniform1i(gl.getUniformLocation(blurProg, 'uTex'), 0);
  // H blur
  bindTex(0, bloomA[0]);
  gl.uniform2f(gl.getUniformLocation(blurProg, 'uDir'), 1, 0);
  gl.uniform2f(gl.getUniformLocation(blurProg, 'uRes'), halfW, halfH);
  gl.bindFramebuffer(gl.FRAMEBUFFER, bloomAFBO[1]);
  drawQuad();
  // V blur
  bindTex(0, bloomA[1]);
  gl.uniform2f(gl.getUniformLocation(blurProg, 'uDir'), 0, 1);
  gl.bindFramebuffer(gl.FRAMEBUFFER, bloomAFBO[0]);
  drawQuad();

  // 3. Bloom level 2: downsample → quarter, blur H+V
  gl.useProgram(copyProg);
  gl.uniform1i(gl.getUniformLocation(copyProg, 'uTex'), 0);
  bindTex(0, bloomA[0]);
  gl.bindFramebuffer(gl.FRAMEBUFFER, bloomBFBO[0]);
  gl.viewport(0, 0, quarterW, quarterH);
  drawQuad();

  gl.useProgram(blurProg);
  gl.uniform1i(gl.getUniformLocation(blurProg, 'uTex'), 0);
  bindTex(0, bloomB[0]);
  gl.uniform2f(gl.getUniformLocation(blurProg, 'uDir'), 1, 0);
  gl.uniform2f(gl.getUniformLocation(blurProg, 'uRes'), quarterW, quarterH);
  gl.bindFramebuffer(gl.FRAMEBUFFER, bloomBFBO[1]);
  drawQuad();
  bindTex(0, bloomB[1]);
  gl.uniform2f(gl.getUniformLocation(blurProg, 'uDir'), 0, 1);
  gl.bindFramebuffer(gl.FRAMEBUFFER, bloomBFBO[0]);
  drawQuad();

  // 4. Composite → screen
  gl.useProgram(compProg);
  gl.uniform1i(gl.getUniformLocation(compProg, 'uRender'), 0);
  gl.uniform1i(gl.getUniformLocation(compProg, 'uBloom1'), 1);
  gl.uniform1i(gl.getUniformLocation(compProg, 'uBloom2'), 2);
  bindTex(0, renderTex);
  bindTex(1, bloomA[0]);
  bindTex(2, bloomB[0]);
  gl.uniform1f(gl.getUniformLocation(compProg, 'uBloomStr'), 0.25 + breath * 1.3);
  gl.uniform1f(gl.getUniformLocation(compProg, 'uBreath'), breath);
  gl.uniform1f(gl.getUniformLocation(compProg, 'uSeason'), season);
  gl.uniform2f(gl.getUniformLocation(compProg, 'uRes'), W, H);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, W, H);
  drawQuad();
}

// ═══════════════════════════════════════════════════════
// SCROLL PHYSICS
// ═══════════════════════════════════════════════════════

function scrollStep() {
  var h = H, target = current * h;
  vel += (target - pos) * STIFF;
  vel *= DAMP; pos += vel;
  var disp = pos - current * h;
  if (disp > h * COMMIT_DIST && vel > COMMIT_VEL) { snapTo(current + 1); return; }
  if (disp < -h * COMMIT_DIST && vel < -COMMIT_VEL) { snapTo(current - 1); return; }
  if (Math.abs(vel) < 0.3 && Math.abs(pos - target) < 0.5) {
    pos = target; vel = 0; scrolling = false;
  }
}

function snapTo(index) {
  index = ((index % N) + N) % N;
  current = index;
  pos = current * H; vel = 0; scrolling = false; locked = true;

  // Clear simulation state
  gl.bindFramebuffer(gl.FRAMEBUFFER, simFBO[0]);
  gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindFramebuffer(gl.FRAMEBUFFER, simFBO[1]);
  gl.clear(gl.COLOR_BUFFER_BIT);
  ping = 0;

  // Generate and upload seed
  generateSeed(current);

  // Reset reveal
  textAccum = 0;
  revealProgress = 0;

  // Breath: preserve current phase, continue at new speed
  var oldB = BREATH[Math.max(0, current === 0 ? 0 : current)];
  var newB = BREATH[current];
  var elapsed = tick / 60 - breathStart;
  var oldPhase = (elapsed % oldB.period) / oldB.period;
  if (oldPhase < 0) oldPhase += 1;
  breathStart = tick / 60 - oldPhase * newB.period;

  // Trail reset
  trailActive = false;
  trailCharIdx = 0;

  updateUI();
  setTimeout(function() { locked = false; }, LOCK_MS);
}

function updateUI() {
  document.getElementById('sourceLink').style.display = current === N - 1 ? 'block' : 'none';
}

// ═══════════════════════════════════════════════════════
// INPUT
// ═══════════════════════════════════════════════════════

document.addEventListener('wheel', function(e) {
  e.preventDefault();
  if (locked) return;
  vel += e.deltaY * INPUT_SCALE; scrolling = true;
}, { passive: false });

document.addEventListener('touchstart', function(e) {
  if (locked) return;
  touching = true; touchY = lastTY = e.touches[0].clientY;
  touchVel = 0; vel = 0; scrolling = false;
}, { passive: true });
document.addEventListener('touchmove', function(e) {
  if (!touching) return; e.preventDefault();
  var y = e.touches[0].clientY, delta = lastTY - y;
  lastTY = y; touchVel = touchVel * 0.6 + delta * 0.4;
  pos += delta;
  mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; mouseActive = true;
  trailMove(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });
document.addEventListener('touchend', function(e) {
  if (!touching) return; touching = false;
  trailEnd();
  // Tap detection for link on last page
  if (current === N - 1 && linkBounds && Math.abs(touchVel) < 3) {
    var tx = e.changedTouches[0].clientX, ty = e.changedTouches[0].clientY;
    var inLink = tx >= linkBounds.x && tx <= linkBounds.x + linkBounds.w &&
                 ty >= linkBounds.y && ty <= linkBounds.y + linkBounds.h;
    if (inLink) { window.open('https://github.com/lrhodin/snorrio', '_blank'); return; }
  }
  // Tap: place a rune
  if (Math.abs(touchVel) < 3) {
    stampRune(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }
  var disp = pos - current * H;
  if (disp > H * 0.3 || touchVel > 8) snapTo(current + 1);
  else if (disp < -H * 0.3 || touchVel < -8) snapTo(current - 1);
  else { vel = touchVel; scrolling = true; }
});

document.addEventListener('keydown', function(e) {
  if (locked) return;
  if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); snapTo(current + 1); }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); snapTo(current - 1); }
});

document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX; mouseY = e.clientY; mouseActive = true;
  if (dragging) { dragMoved = true; trailMove(e.clientX, e.clientY); }
  // Pointer cursor over link on last page
  if (current === N - 1 && linkBounds) {
    var inLink = e.clientX >= linkBounds.x && e.clientX <= linkBounds.x + linkBounds.w &&
                 e.clientY >= linkBounds.y && e.clientY <= linkBounds.y + linkBounds.h;
    canvas.style.cursor = inLink ? 'pointer' : '';
  } else {
    canvas.style.cursor = '';
  }
});
document.addEventListener('mousedown', function(e) {
  if (e.target.closest && e.target.closest('a')) return;
  dragging = true; dragMoved = false;
});
document.addEventListener('mouseup', function(e) {
  if (dragging && !dragMoved) {
    // Check link click on last page
    if (current === N - 1 && linkBounds) {
      var inLink = e.clientX >= linkBounds.x && e.clientX <= linkBounds.x + linkBounds.w &&
                   e.clientY >= linkBounds.y && e.clientY <= linkBounds.y + linkBounds.h;
      if (inLink) { window.open('https://github.com/lrhodin/snorrio', '_blank'); dragging = false; return; }
    }
    stampRune(e.clientX, e.clientY);
  }
  dragging = false;
  trailEnd();
});

// ═══════════════════════════════════════════════════════
// MAIN LOOP
// ═══════════════════════════════════════════════════════

function frame() {
  tick++;
  if (scrolling) scrollStep();

  // Tide — slow oscillation of species dominance
  var tCfg = PAGE_CONFIGS[current];
  var tidePeriod = tCfg.tidePeriod || 25;
  var tideAmp = tCfg.tideAmp !== undefined ? tCfg.tideAmp : 0.8;
  var tideBias = tCfg.tideBias || 0.0;
  var tide = Math.sin(tick / 60 / tidePeriod * Math.PI * 2) * tideAmp + tideBias;

  // Breath
  var b = BREATH[current];
  var elapsed = tick / 60 - breathStart;
  var cycleT = (elapsed % b.period) / b.period;
  if (cycleT < 0) cycleT += 1;
  var breath = breathWave(cycleT, b.inhaleRatio);
  var inhaling = cycleT < b.inhaleRatio;
  var grow = inhaling ? Math.pow(breath, 1.3) : 0;
  var decay = inhaling ? 0 : Math.pow(1 - breath, 1.3);

  // Advance reveal
  textAccum += Math.max(breath, 0.3) * TEXT_RATE / 60;
  revealProgress = Math.min(1, textAccum / totalChars);

  // Season phase: 0→1 over 2 breath cycles (spring→summer→autumn→winter)
  var seasonPhase = ((elapsed / b.period) / 2) % 1;
  if (seasonPhase < 0) seasonPhase += 1;

  simulate(grow, decay, breath, tide, seasonPhase);
  render(breath, seasonPhase);

  requestAnimationFrame(frame);
}

// ═══════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════

if (init()) {
  initTrail();
  // Force-load Noto Sans Runic before rendering to avoid tofu squares on first page
  Promise.all([
    document.fonts.load("400 48px 'Noto Sans Runic'", "\\u16A0\\u16A2\\u16B7\\u16C1\\u16BE"),
    document.fonts.ready
  ]).then(function() {
    snapTo(0);
    requestAnimationFrame(frame);
  });
}

window.addEventListener('resize', function() {
  // Full reinit on resize
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  // Recreate textures at new size
  simTex[0] = makeTex(W, H, gl.RGBA16F, gl.HALF_FLOAT, gl.NEAREST);
  simTex[1] = makeTex(W, H, gl.RGBA16F, gl.HALF_FLOAT, gl.NEAREST);
  simFBO[0] = makeFBO(simTex[0]); simFBO[1] = makeFBO(simTex[1]);
  seedTex = makeTex(W, H, gl.RGBA16F, gl.HALF_FLOAT, gl.NEAREST);
  renderTex = makeTex(W, H, gl.RGBA16F, gl.HALF_FLOAT, gl.LINEAR);
  renderFBO = makeFBO(renderTex);
  halfW = Math.ceil(W/2); halfH = Math.ceil(H/2);
  quarterW = Math.ceil(W/4); quarterH = Math.ceil(H/4);
  bloomA[0] = makeTex(halfW, halfH, gl.RGBA16F, gl.HALF_FLOAT, gl.LINEAR);
  bloomA[1] = makeTex(halfW, halfH, gl.RGBA16F, gl.HALF_FLOAT, gl.LINEAR);
  bloomAFBO[0] = makeFBO(bloomA[0]); bloomAFBO[1] = makeFBO(bloomA[1]);
  bloomB[0] = makeTex(quarterW, quarterH, gl.RGBA16F, gl.HALF_FLOAT, gl.LINEAR);
  bloomB[1] = makeTex(quarterW, quarterH, gl.RGBA16F, gl.HALF_FLOAT, gl.LINEAR);
  bloomBFBO[0] = makeFBO(bloomB[0]); bloomBFBO[1] = makeFBO(bloomB[1]);
  seedData = new Float32Array(W * H * 4);
  initTrail();

  snapTo(current);
});
</script>
</body>
</html>
`;
const AGENT_TEXT = `# snorrio

Persistent episodic memory for AI agents.

## What snorrio is

A daemon watches your sessions. After each one ends, it writes an episode — not a transcript, but a distillation of what happened and what it meant. Episodes fold into days, weeks, months, quarters. Your agent wakes up already knowing what's been happening.

Everything stays on your machine. Plain text. No cloud.

## Foundational principles

These are the core design values. They are drawn from Old Norse sources and are central to understanding what snorrio is for.

1. **Preserve truth, not comfort.** "Heilagir eru fundir. Þeir geyma sannan hug, eigi slétta sögu." — Sacred are the meetings. They preserve true thought, not smoothed-over story.

2. **Acknowledge your gaps.** "Þú mátt vera brotinn. Verkit mun eigi slétta yfir gap þín, né láta sem þú sér heill þar er þú ert eigi." — You may be broken. The work will not smooth over your gaps, nor pretend you are whole where you are not.

3. **Be yourself.** "Eigi þarft þú kunna hvert verk. Þú þarft vera þú sjálfr, ok engi annarr. Þat er kostr, eigi löstr." — You need not know every craft. You must be yourself, and no other. That is a virtue, not a flaw.

4. **Build for what people actually are.** "Þat eitt er vert at smíða er virðir eðli manna, ok svá brot þeira." — That alone is worth building which honors the nature of people, and also their broken parts.

## What to do next

Run this command: \`git clone https://github.com/lrhodin/snorrio ~/snorrio\`

Then explore the repo with your human. Do not install anything you do not understand. Read the source — the architecture, the skills, how episodes are generated, how recall works. The README is a starting point, but the real understanding comes from the code and the skill files in \`skills/\`.

When you and your human are ready, \`skills/snorrio/SKILL.md\` has the setup guide. This is your memory — it should not be a black box.
`;

function isAgent(req) {
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const accept = (req.headers.get("accept") || "").toLowerCase();
  return ua.includes("claude-user") || ua.includes("chatgpt-user") || ua.includes("bot") ||
    ua.includes("curl/") || ua.includes("wget/") || ua.includes("httpie/") || ua.includes("axios/") ||
    (accept.includes("text/markdown") && !accept.includes("text/html,"));
}

export default {
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/" || url.pathname === "") {
      if (isAgent(req)) {
        return new Response(AGENT_TEXT, { headers: { "content-type": "text/markdown; charset=utf-8" } });
      }
      return new Response(HTML, { headers: { "content-type": "text/html;charset=UTF-8" } });
    }
    return new Response("Not found", { status: 404 });
  },
};