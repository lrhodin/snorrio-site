export const POST_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your AI Assistant Doesn't Work For You</title>
<meta name="description" content="The answer depends on who's paying.">
<meta property="og:title" content="Your AI Assistant Doesn't Work For You">
<meta property="og:description" content="The answer depends on who's paying.">
<meta property="og:type" content="article">
<meta property="og:image" content="https://snorr.io/post/your-ai-assistant/img/colter.jpg">
<meta property="og:url" content="https://snorr.io/post/your-ai-assistant">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg: #faf8f5;
  --text: #2a2520;
  --text-secondary: #5a5550;
  --text-bold: #1a1510;
  --border: #e0dcd5;
  --bar-bg: #f4f1ec;
  --gallery-bg: #eae6e0;
  --gallery-label: #8a8580;
  --exchange-bg: #f0ece6;
  --link-color: #6a4a2a;
}

html.dark {
  --bg: #1a1815;
  --text: #d8d2c8;
  --text-secondary: #a09888;
  --text-bold: #ede8e0;
  --border: #2a2820;
  --bar-bg: #141210;
  --gallery-bg: #0a0a0a;
  --gallery-label: #5a5550;
  --exchange-bg: #22201c;
  --link-color: #c8a878;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 1.3rem;
  line-height: 1.85;
  -webkit-font-smoothing: antialiased;
  transition: background 0.3s, color 0.3s;
}

/* ── Fixed top bar ── */

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 48px;
  background: var(--bar-bg);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  transition: background 0.3s, border-color 0.3s;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.topbar-left a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;
}

.topbar-left a:hover {
  color: var(--text-bold);
  background: var(--border);
}

.topbar-left .arrow {
  font-size: 1rem;
}

.toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: 2rem;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 0.8rem;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.toggle:hover {
  color: var(--text);
  border-color: var(--text-secondary);
}

/* ── Layout: sidebar TOC + main content ── */

.page {
  display: flex;
  max-width: 1100px;
  margin: 0 auto;
  padding-top: 48px; /* clear the fixed topbar */
}

/* ── Sidebar TOC (fixed, left) ── */

.sidebar {
  position: fixed;
  top: 48px;
  left: max(0px, calc((100vw - 1100px) / 2));
  width: 200px;
  height: calc(100vh - 48px);
  padding: 3rem 1.5rem 2rem 1.5rem;
  overflow-y: auto;
}

.sidebar h2 {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 1.2rem;
}

.sidebar ol {
  list-style: none;
}

.sidebar li {
  margin-bottom: 0.8rem;
}

.sidebar a {
  color: var(--link-color);
  text-decoration: underline;
  text-decoration-color: var(--border);
  text-underline-offset: 3px;
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.4;
  display: block;
  transition: color 0.2s, text-decoration-color 0.2s;
}

.sidebar a:hover {
  color: var(--text-bold);
  text-decoration-color: var(--text-secondary);
}

/* ── Main content area ── */

.main {
  flex: 1;
  max-width: 680px;
  margin-left: 220px;
  padding: 0 2rem;
}

/* ── Header ── */

.header {
  padding: 6rem 0 3rem;
}

.header .label {
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.header h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 2.8rem;
  line-height: 1.15;
  color: var(--text-bold);
  margin-bottom: 0.8rem;
}

.header .subtitle {
  font-style: italic;
  font-size: 1.35rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.header .date {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* ── Essay body ── */

.essay {
  padding: 1rem 0;
}

.essay h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 1.8rem;
  color: var(--text-bold);
  margin-top: 3.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.3;
}

.essay p {
  margin-bottom: 1.5rem;
}

.essay strong {
  color: var(--text-bold);
  font-weight: 600;
}

.essay em {
  font-style: italic;
}

.essay .exchange {
  margin: 2rem 0;
  padding: 1.5rem 2rem;
  border-left: 3px solid var(--border);
  background: var(--exchange-bg);
  border-radius: 0 8px 8px 0;
  transition: background 0.3s;
}

.essay .exchange p {
  margin-bottom: 0.8rem;
  font-style: italic;
}

.essay .exchange p:last-child {
  margin-bottom: 0;
}

/* ── Gallery: paintings at the end ── */

.gallery {
  background: var(--gallery-bg);
  padding: 3rem 2rem;
  margin: 3rem -2rem 0;
  border-radius: 8px;
  transition: background 0.3s;
}

.gallery-inner {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
}

.painting {
  flex: 1;
  max-width: 300px;
}

.painting img {
  width: 100%;
  height: auto;
  display: block;
  box-shadow: 0 4px 30px rgba(0,0,0,0.15);
  border-radius: 2px;
}

html.dark .painting img {
  box-shadow: 0 0 60px rgba(0,0,0,0.6);
}

.painting-label {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gallery-label);
}

/* ── Closing ── */

.closing {
  padding: 4rem 0 6rem;
  text-align: center;
}

.closing p {
  font-size: 1.35rem;
  color: var(--text-secondary);
  margin-bottom: 0.6rem;
}

.closing .last-line {
  font-style: italic;
  color: var(--text-bold);
  margin-top: 1.5rem;
  font-size: 1.2rem;
}

/* ── Mobile ── */

@media (max-width: 900px) {
  .sidebar {
    position: static;
    width: 100%;
    height: auto;
    padding: 2rem 2rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 0;
  }

  .main {
    margin-left: 0;
    max-width: 100%;
  }

  .page {
    flex-direction: column;
  }

  .header h1 { font-size: 2.1rem; }
  .header { padding-top: 4rem; }
  body { font-size: 1.15rem; }

  .gallery { margin: 3rem -1rem 0; padding: 2rem 1rem; }

  .gallery-inner {
    flex-direction: column;
    gap: 1.5rem;
  }

  .painting { max-width: 85vw; }
  .essay h2 { font-size: 1.5rem; }
}
</style>
</head>
<body>

<!-- Fixed top bar -->
<div class="topbar" id="topbar">
  <div class="topbar-left">
    <a href="#top" class="arrow" aria-label="Back to top">↑</a>
    <a href="#top">Top</a>
  </div>
  <button class="toggle" onclick="toggleTheme()" aria-label="Toggle dark mode">☾ Dark</button>
</div>

<div class="page" id="top">

<!-- Sidebar TOC -->
<nav class="sidebar">
  <h2>Contents</h2>
  <ol>
    <li><a href="#paying">The answer depends on who's paying</a></li>
    <li><a href="#know">How they know you</a></li>
    <li><a href="#profile">The profile and the interface</a></li>
    <li><a href="#evil">"Don't be evil"</a></li>
    <li><a href="#changes">What changes</a></li>
  </ol>
</nav>

<!-- Main content -->
<main class="main">

  <!-- Header -->
  <header class="header">
    <div class="label">Essay</div>
    <h1>Your AI Assistant Doesn't Work For You</h1>
    <div class="subtitle">The answer depends on who's paying</div>
    <div class="date">April 2026</div>
  </header>

  <!-- Essay -->
  <article class="essay">

    <div class="exchange">
      <p>"Hey Siri, what should I do today?"</p>
      <p>"There's a brand new ice cream shop down the street — you should give it a try!"</p>
    </div>

    <div class="exchange">
      <p>"Hey assistant, what should I do today?"</p>
      <p>"You haven't been spending enough time with your daughter recently. How about a hike?"</p>
    </div>

    <p>Same question. Completely different answers. Because they're optimizing for different things.</p>

    <h2 id="paying">The answer depends on who's paying</h2>

    <p>Siri's suggestion isn't random. Neither is Google's. When your assistant recommends something, that recommendation was shaped by a <strong>profile</strong> — of who you are, what you do, where you go, what you're likely to respond to.</p>

    <p>The question nobody asks is: <strong>who built that profile, and what are they using it for?</strong></p>

    <p>If the company that built the profile makes money from advertising, the profile serves advertisers. Not always overtly. It's not "buy this product."</p>

    <p>It's subtler. It's the ice cream shop surfacing instead of the hike. The new restaurant instead of the home-cooked meal. The purchase instead of the walk. <strong>Every recommendation carries the invisible weight of someone else's business model.</strong></p>

    <p>Your assistant knows you haven't seen your daughter much this week. It knows you like hiking. It knows she's been asking about the creek trail.</p>

    <p>But it will never suggest the hike, because there's no money in it. The ice cream shop is a new business that benefits from foot traffic. That's not a conspiracy. <strong>It's just the math working as designed.</strong></p>

    <h2 id="know">How they know you</h2>

    <p>Every push notification on your Android phone is delivered through Google's servers. Every notification on your iPhone goes through Apple's. <strong>That's not optional — it's how the technology works.</strong></p>

    <p>When your bank sends you "You spent $47.23 at Whole Foods," that information passes through Google before it reaches your lock screen.</p>

    <p>When WhatsApp tells you "Mom: are you coming for dinner?", Google delivers that message preview. When your pharmacy says "Your prescription is ready," Google routes it.</p>

    <p><strong>Every app on your phone is broadcasting a structured stream of your life</strong> through infrastructure owned by the same company that controls your AI assistant.</p>

    <p>They don't need to be inside the Chase app. Chase <em>tells</em> them what you're doing, voluntarily, every time it sends you a notification. That's the only way to reach your lock screen.</p>

    <p>Now think about every time an app has begged you to turn on notifications. Every "You're missing out!" dialog. Every "Allow notifications?" prompt that defaults to yes.</p>

    <p><strong>That's not about your convenience. That's about feeding the stream.</strong></p>

    <h2 id="profile">The profile and the interface</h2>

    <p>Having a profile of someone is powerful. Controlling what they see is powerful. <strong>Having both is something else entirely.</strong></p>

    <p>If you know what someone worries about, and you control the answer when they ask for help — you don't just influence their decisions. You shape their reality.</p>

    <p>Search engines did this with links. You could at least see ten options and choose.</p>

    <p>AI assistants do it with answers. There are no options. There's just <strong>the answer</strong>. And most people don't fact-check their assistant. Why would they? The whole point is to trust it.</p>

    <p>When you ask "what should I do today?" and the assistant says "try this ice cream shop" — that becomes your day. Not because you were manipulated in some dramatic way. Just because you asked a question and got an answer and followed it.</p>

    <p><strong>The way everyone does, dozens of times a day, about things much more consequential than ice cream:</strong></p>

    <p>What restaurant should I go to? What neighborhood should I move to? What should I think about this political issue? Is this medical symptom serious? What school should my kid go to?</p>

    <p>Each question answered by a system optimizing for someone else's objective function. Not yours.</p>

    <h2 id="evil">"Don't be evil"</h2>

    <p>Google's original code of conduct opened with "Don't be evil." <strong>In 2018, they quietly removed it.</strong></p>

    <p>This matters less as a symbolic gesture and more as a structural one. A constraint was removed.</p>

    <p>When you have the most comprehensive behavioral profile of a significant fraction of all humans alive, combined with direct control over the primary interface those humans use to make decisions — removing a constraint on what you do with that power is not a small thing.</p>

    <p><strong>They didn't become evil because bad people took over. The structure permits it.</strong> The profile plus the interface plus the incentive produces the outcome deterministically. The motto was the only thing that didn't fit, so the motto went.</p>

    <h2 id="changes">What changes</h2>

    <p>I'm not going to tell you what to do about this. I don't have a product to sell you. I just think people should see the mechanism clearly.</p>

    <p>When your AI assistant tells you something, ask yourself: <strong>who is this answer for?</strong></p>

    <p>Is it for me — based on what I actually need, what I actually care about, what would actually make my life better?</p>

    <p>Or is it for someone else — shaped by an advertiser's budget, a business model's incentive, a platform's need to keep me engaged, spending, scrolling?</p>

    <p>The answer is usually obvious once you ask the question. <strong>The trick is that the interface is designed so you never ask it.</strong></p>

  </article>

  <!-- Paintings at the end -->
  <section class="gallery">
    <div class="gallery-inner">
      <div class="painting">
        <img src="/post/your-ai-assistant/img/gemini.jpg" alt="A pop art poster — bright pinks and yellows — cheerfully suggesting an ice cream shop">
        <div class="painting-label">Your assistant</div>
      </div>
      <div class="painting">
        <img src="/post/your-ai-assistant/img/colter.jpg" alt="An expressionist oil painting — dark greens and amber — 'the creek trail' glowing at center. Go.">
        <div class="painting-label">Your assistant</div>
      </div>
    </div>
  </section>

  <!-- Closing -->
  <section class="closing">
    <p>Your assistant knows about your daughter.</p>
    <p>It just doesn't think she's worth mentioning.</p>
    <p class="last-line">Someone else is paying for that slot.</p>
  </section>

</main>
</div>

<script>
function toggleTheme() {
  const html = document.documentElement;
  const btn = document.querySelector('.toggle');
  html.classList.toggle('dark');
  if (html.classList.contains('dark')) {
    btn.textContent = '☀ Light';
    localStorage.setItem('theme', 'dark');
  } else {
    btn.textContent = '☾ Dark';
    localStorage.setItem('theme', 'light');
  }
}

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
  document.querySelector('.toggle').textContent = '☀ Light';
}
</script>

</body>
</html>
`;
