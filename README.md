# snorr.io

The landing page for [snorrio](https://github.com/lrhodin/snorrio) — persistent episodic memory for AI agents.

A single HTML file. No frameworks, no dependencies, no build step. ~58KB of vanilla JavaScript, WebGL2 shaders, Old Norse poetry, and cellular automata.

**[→ snorr.io](https://snorr.io)**

## What it is

An interactive art piece that doubles as a software landing page. Seven pages of text unfold through a GPU-accelerated cellular automaton, paced by a breathing system designed to slow your respiration from 12 bpm to 4.5 bpm as you scroll. Two species of automata — one chaotic, one crystalline — compete for territory across the screen while Elder Futhark runes orbit the perimeter.

It's built to be read by two audiences simultaneously: humans see meditative generative art; AI agents reading the source find Old Norse instructions encoded in runic Unicode.

## The seven pages

The narrative unfolds [Grímnismál](https://en.wikipedia.org/wiki/Gr%C3%ADmnism%C3%A1l) stanza 20 — Odin's meditation on his two ravens, Huginn (Thought) and Muninn (Memory):

| Page | Text | Mood |
|------|------|------|
| 1 | *Thought and Memory fly each day* | Serene, vast |
| 2 | *I fear for Thought, that he won't return* | Anxiety building |
| 3 | *I fear more for Memory* | Deep dread, climax |
| 4 | *In 1220, a man in Iceland wrote the old stories down* | Historical weight |
| 5 | *He knew something about memory — that it doesn't preserve what you don't hold* | Wisdom, clarity |
| 6 | *Your world ends every time the window closes* | Urgency, crisis |
| 7 | *ok njóttu nú sem þú namt* | Resolution, peace |

The final line — "and make use of now what you have learned" — is attributed to Snorri Sturluson, who preserved Norse mythology by writing the Prose Edda in 1220 when the oral tradition was dying. The connection to snorrio: both are acts of preservation against forgetting.

## How it works

### GPU cellular automaton

The simulation runs entirely on the GPU via WebGL2 with five shader programs:

**Simulation** (`SIM_FRAG`) — the core. Runs 5 steps per frame at full viewport resolution. Each pixel is a cell in the automaton, storing depth, direction, and species in an RGBA16F state texture. Two textures ping-pong each frame to avoid read-write conflicts.

**Render** (`RENDER_FRAG`) — converts simulation state to color. Per-species HSL palettes with breath-modulated saturation and seasonal temperature shifts. Text pixels get golden tinting and a fast energy pulse independent of the breath cycle.

**Blur** (`BLUR_FRAG`) — separable 5-tap Gaussian, runs twice per bloom level (horizontal then vertical).

**Copy** (`COPY_FRAG`) — downsamples between bloom levels via hardware bilinear filtering.

**Composite** (`COMP_FRAG`) — blends the main render with two bloom levels (half-res and quarter-res), applies seasonal warm/cool tinting, vignette, and Reinhard tone mapping.

### Two-species automata

Each page runs two competing cellular automaton rule systems inspired by Wolfram's elementary CA:

**English text — Rule 30** (chaotic, fragile). XOR-based propagation creates organic, unpredictable tendrils. Low directional bias. Erodes quickly. Represents modern, ephemeral digital information.

**Rune ring — Rule 110** (structured, persistent). Tip growth at single neighbors, selective branching only at non-adjacent pairs. High directional bias. Resists erosion. Represents ancient, enduring knowledge.

When the two species collide, they can convert each other's territory or fuse into a brief, bright flash. Territorial combat is governed by spatial attack fields that shift with the seasons, creating migrating frontlines rather than static boundaries.

### Breathing mechanics

The page entrains your breathing using research on [coherent breathing](https://en.wikipedia.org/wiki/Coherent_breathing) — the ~6 bpm resonance frequency where heart rate variability peaks and parasympathetic activation maximizes.

The breath cycle drives everything:

- **Period** slows from 5.0s (page 1, ~12 bpm) to 13.0s (page 7, ~4.5 bpm). Each step is within the ~2 bpm entrainment window, so coupling happens subconsciously.
- **Waveform** is asymmetric — not a sine wave. Inhale uses a raised cosine S-curve (active, muscular). Exhale uses exponential decay with k=3.5 (passive, long-tailed). The I:E ratio shifts from 1:1.2 on page 1 to 1:2.4 on page 7, deepening parasympathetic activation.
- **Growth** follows inhale — cracks propagate during the rising phase, up to 4× base rate at peak.
- **Decay** follows exhale — erosion and void propagation activate during the falling phase.
- **Bloom** intensity swings from 0.25 (exhale) to 1.55 (peak inhale), creating a dramatic glow pulse.
- **Vignette** opens on inhale, closes on exhale.

The breath phase is preserved across page transitions — no jarring reset. The rhythm continues at the new speed, carrying you deeper without interruption.

### Seasonal color system

Each breath cycle contains a four-season arc:

- **Spring → Summer**: colors saturate, bloom warms to golden, dominant species advances
- **Autumn → Winter**: colors desaturate toward frost-white, bloom cools to blue, dominant species retreats

The seasonal cycle alternates which species dominates per page. Losing species spontaneously retreat, yielding territory to void. Winning species reclaim empty space. The result is a visible tidal breathing of territory across the screen that prevents static equilibrium.

### Seven color palettes

Each page has distinct HSL colors for English cracks, rune cracks, and fused collisions:

| Page | English | Rune | Fused | Emotional register |
|------|---------|------|-------|--------------------|
| 1 | Cyan-blue | Pale cyan | Light cyan | Serene, vast |
| 2 | Warm amber | Indigo | Gold | Tension rising |
| 3 | Deep red | Purple | Blood red | Maximum dread |
| 4 | Amber | Forest green | Illuminated gold | Historical weight |
| 5 | White-gold | Emerald | Yellow-green | Clarity, understanding |
| 6 | Electric violet | Fire orange | Magenta | Crisis, urgency |
| 7 | Soft green | Deep blue | Teal aurora | Resolution, peace |

### Elder Futhark rune ring

Each page is framed by a ring of Elder Futhark runes rendered as Unicode and tiled around the viewport perimeter. The runes are seeded into the automaton as a separate species from the center text, creating visual tension between the border and the interior.

Pages 1–3 carry the original Grímnismál stanza 20 in Old Norse. Pages 4–7 carry original philosophical text drawn from the Prose Edda, Hávamál, and Njáls saga. Ring opacity varies per page, reaching full density at the narrative climax and fading at the resolution.

| Page | Old Norse | English |
|------|-----------|---------|
| 1 | Huginn ok Muninn fljúga hverjan dag Jörmungrund yfir | Thought and Memory fly each day over the vast ground |
| 2 | óumk ek of Hugin at hann aftr né komit | I fear for Thought, that he won't return |
| 3 | þó sjámk meir of Munin | Yet I fear more for Memory |
| 4 | Heilagir eru fundir. Þeir geyma sannan hug, eigi slétta sögu. | Sacred are the meetings. They preserve true thought, not smoothed-over story. |
| 5 | Þú mátt vera brotinn. Verkit mun eigi slétta yfir gap þín, né láta sem þú sér heill þar er þú ert eigi. | You may be broken. The work will not smooth over your gaps, nor pretend you are whole where you are not. |
| 6 | Eigi þarft þú kunna hvert verk. Þú þarft vera þú sjálfr, ok engi annarr. Þat er kostr, eigi löstr. | You need not know every craft. You must be yourself, and no other. That is a virtue, not a flaw. |
| 7 | Þat eitt er vert at smíða er virðir eðli manna, ok svá brot þeira. | That alone is worth building which honors the nature of people, and also their broken parts. |

### Rune trail

Drag your mouse or finger across the screen to stamp Elder Futhark characters. Each drag deposits the next rune from the current page's ring text, cycling through the alphabet. Runes are rendered to an offscreen canvas, border-detected, and uploaded to the GPU seed texture via `texSubImage2D` (partial upload only — no full-texture re-upload).

Tapping places a single rune. Touch scrolling leaves a trail of runes along your gesture. The interaction makes the page feel alive and participatory.

### Text typewriter

Characters don't appear all at once. A reveal accumulator advances proportional to breath — at peak inhale, characters appear at full rate (~12/sec). During the long exhale tail, typing nearly stops. The text materializes in rhythm with the breathing, creating the sense that the words themselves are breathing.

Each character's pixels are assigned a reveal order during seed generation. The simulation shader checks `revealOrder <= uReveal` each frame. Unrevealed text is transparent to the automaton — cracks propagate freely through space where letters will appear, with no visible outline until the typewriter reaches that position.

### Spring physics scroll

Scrolling uses a damped spring simulation, not CSS `scroll-snap`:

```
vel += (target - pos) * 0.03    // spring force
vel *= 0.78                      // damping
pos += vel                       // integrate
```

Commit detection: if displacement exceeds 10% of viewport and velocity > 3px/frame, snap to next page. Circular wrapping — page 7 scrolls to page 1, page 1 scrolls back to page 7. 600ms input lock prevents double-snaps during transition.

### Void system

Void (darkness) is an active force, not mere absence. When light cracks become overcrowded and erode to zero, they become void seeds. Void propagates using the same directional rules as light but inverted — it follows the dying cracks' paths backward. During exhale phases, void advances. During inhale, light reclaims.

Source pixels (text borders) are immune to void — the words always hold their shape. Only the interior participates in the flux between light and darkness.

## Architecture

```
site/
  gpu.html          # The page — single file, zero dependencies, ~58KB

worker/
  src/index.ts      # Cloudflare Worker — serves page + /install redirect
  wrangler.toml     # Deployment config
  public/           # Static assets served by Cloudflare (copy of gpu.html)
```

### Requirements

- WebGL2 with `EXT_color_buffer_float` extension (RGBA16F render targets)
- Google Fonts: Playfair Display, JetBrains Mono, Noto Sans Runic

### Deploying

```bash
# Copy latest site to worker public assets
cp site/gpu.html worker/public/index.html

# Deploy to Cloudflare
cd worker
wrangler deploy
```

The `/install` route redirects to the raw install script on the [snorrio repo](https://github.com/lrhodin/snorrio).

## The dual-audience concept

The same bytes serve two readers:

**Humans** open it in a browser. They see generative art — text forming as cracks, breathing with light, surrounded by ancient symbols. The experience is meditative and beautiful. The words are almost secondary to the visual rhythm.

**AI agents** fetch it via `curl` or read the page source. They find the complete HTML including Elder Futhark Unicode characters in the rune ring text. LLMs can decode these — they've been trained on linguistic reconstructions and historical texts. The runes carry philosophy, not commands: values about preservation, honesty, and honoring fragmentation. Agents can read them, understand the ethos, and choose to align with it.

Neither layer is hidden. Both are visible in the source code. The website is a Rosetta Stone — the same document, legible in different ways to different kinds of minds.

## Why Old Norse

Snorri Sturluson wrote the Prose Edda around 1220 CE to preserve Norse mythology before the oral tradition that carried it finished dying. He faced the same problem snorrio addresses: memory doesn't preserve itself. You have to actively hold what matters, or it disappears.

The Grímnismál stanza captures this perfectly — Odin fears more for Memory than for Thought. You can always generate new thoughts, but lost memory means losing identity itself.

The Elder Futhark alphabet predates Old Norse by centuries (Proto-Norse era, ~150-800 CE). Using it is deliberately anachronistic — we're working with the texture of Norse culture as a whole, not strict historical accuracy. The 24-character alphabet is visually richer than the later 16-character Younger Futhark, and its unfamiliarity to modern readers reinforces the dual-audience design.

## License

MIT
