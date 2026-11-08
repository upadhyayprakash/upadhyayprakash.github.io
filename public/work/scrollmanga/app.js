// ScrollManga reader prototype: the reader's scroll is the play button.
// Layered scenes fill the screen: background layers (sky, trees, hut, ground, a foreground palm)
// move at their own depth, characters are key poses that crossfade as the story moves, close-ups
// come forward as framed stills over the blurred empty set. Story text lies on the scene.
// Sound: the music and ambience bed follows the scroll both ways (a reversed copy when rewinding);
// voices only ever play forward: a line starts when you scroll into it, finishes if you stop,
// stays silent while you rewind, and replays when you tap its bubble.

import { STORY } from './story.js';

const $ = (s) => document.querySelector(s);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (x) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
const SW = STORY.source.w, SH = STORY.source.h, D = STORY.duration;
const HUD = 52;
const shots = STORY.shots.map((s, i) => ({ ...s, i }));

const ICON = {
  on: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19.5 5.5a9 9 0 0 1 0 13"/></svg>',
  off: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
  replay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
};

// ---------------------------------------------------------------- scroll timeline
// Scroll units map to story seconds. Spoken lines get 1.6x the scroll of silent stretches,
// and narration holds add scroll where the story stands still so the text can be read.
const STEP = 0.05;
const inLine = (t) => STORY.lines.some((l) => t >= l.start && t <= l.end);
const holds = STORY.narration.filter((n) => n.hold > 0);
const pts = (() => {
  const marks = new Set();
  for (let k = 0; k <= Math.round(D / STEP); k++) marks.add(+(k * STEP).toFixed(4));
  holds.forEach((h) => marks.add(h.at));
  const sorted = [...marks].filter((m) => m <= D).sort((a, b) => a - b);
  const out = [[0, 0]]; let u = 0, t = 0;
  const holdAt = (m) => holds.filter((h) => Math.abs(h.at - m) < 1e-6).forEach((h) => { h.u0 = u; u += h.hold; h.u1 = u; out.push([u, m]); });
  holdAt(0);
  for (const m of sorted) {
    if (m <= t) continue;
    u += (m - t) * (inLine((t + m) / 2) ? 1.6 : 1); t = m; out.push([u, t]);
    holdAt(m);
  }
  return out;
})();
const U_TOTAL = pts[pts.length - 1][0];
function timeFromU(u) {
  if (u <= 0) return 0;
  let lo = 0, hi = pts.length - 1;
  if (u >= pts[hi][0]) return D;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pts[m][0] <= u) lo = m; else hi = m; }
  const [u0, t0] = pts[lo], [u1, t1] = pts[hi];
  return t0 + ((u - u0) / Math.max(1e-9, u1 - u0)) * (t1 - t0);
}
function unitsPerSecondAt(u) {
  let lo = 0, hi = pts.length - 1;
  if (u <= 0) { lo = 0; hi = 1; } else if (u >= pts[hi][0]) return 1;
  else while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pts[m][0] <= u) lo = m; else hi = m; }
  const [u0, t0] = pts[lo], [u1, t1] = pts[hi];
  return t1 === t0 ? 1 : (u1 - u0) / (t1 - t0);
}
function uFromTime(t) {
  let lo = 0, hi = pts.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pts[m][1] < t) lo = m; else hi = m; }
  const [u0, t0] = pts[lo], [u1, t1] = pts[hi];
  // a time with a story-box pause maps to the START of the pause, so the box is read, not skipped
  return t1 === t0 ? u0 : u0 + ((t - t0) / (t1 - t0)) * (u1 - u0);
}

// ---------------------------------------------------------------- state
let layoutPref = 'auto', mode = 'wide', W = innerWidth, H = innerHeight, pxPerUnit = 150;
let Tscroll = 0, Tdisp = 0, vel = 0, lastMoveAt = 0, lastDir = 1, tMoveAt = 0, tDir = 1;
let soundOn = false, started = false, replaying = null;
const cam = { fx: 0.5, fy: 0.5, shot: -1 };
// lazy mode: the page scrolls itself at 1x story speed, so voices land at their natural pace
const auto = { on: false, u: 0 };
const audio = { ctx: null };
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

// ---------------------------------------------------------------- scenes (built after panel.json loads)
const scenes = {};
let narrWords = {};
async function buildScenes() {
  const host = $('#scenes');
  for (const id of STORY.scenes) {
    const base = `media/layers/${id}/`;
    const P = await (await fetch(base + 'panel.json')).json();
    const root = el('div', 'scn'); host.append(root);
    const sc = { id, P, root, layers: [], poses: {}, anchorDepth: 0.62 };
    const addLayer = (depth, front) => { const d = el('div', 'lyr'); d.style.width = `${SW}px`; d.style.height = `${SH}px`; root.append(d); const L = { depth, el: d, front }; sc.layers.push(L); return L; };
    for (const l of P.layers.filter((x) => !x.front)) {
      const L = addLayer(l.depth); const i = new Image(); i.src = base + l.src; i.className = 'full'; i.width = SW; i.height = SH; L.el.append(i);
    }
    // each character pose on its own layer at its depth
    for (const [name, c] of Object.entries(P.characters)) {
      const depth = c.depth ?? 0.78;
      const L = addLayer(depth); const i = new Image(); i.src = base + `char-${name}.${P.charExt || 'png'}`; i.className = 'pose'; // charExt: webp in the published copy
      Object.assign(i.style, { left: `${c.x}px`, top: `${c.y}px`, width: `${c.w}px`, height: `${c.h}px` });
      L.el.append(i); sc.poses[name] = { img: i, depth, c };
      sc.anchorDepth = depth;
    }
    for (const l of P.layers.filter((x) => x.front)) {
      const L = addLayer(l.depth, true); const i = new Image(); i.src = base + l.src; i.className = 'full'; i.width = SW; i.height = SH; L.el.append(i);
    }
    scenes[id] = sc;
  }
}
// who stands on which layer, for bubble tails that follow the parallax
const speakerDepth = (sc, who) => (sc.id === 'door' && who === 'sage' ? 1.1 : sc.anchorDepth);

// inset stills
const insetFrames = {};
for (const s of shots) for (const f of s.frames || []) {
  if (insetFrames[f.img]) continue;
  const i = new Image(); i.src = `media/layers/insets/${f.img}.jpg`; $('#insetFrames').append(i); insetFrames[f.img] = i;
}

// ---------------------------------------------------------------- bubbles, sfx, rail
const layer = $('#layer'), tails = $('#tails'), narr = $('#narr'), inset = $('#inset');
const bubbles = STORY.lines.map((line, li) => {
  const b = el('div', `bubble ${line.who}`, `${line.text}<span class="replay">${ICON.replay}</span>`);
  b.addEventListener('click', () => replay(li));
  layer.append(b);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  tails.append(path);
  return { line, li, el: b, path };
});
const sfxEls = STORY.sfx.map((f) => { const e = el('div', 'sfx', f.text); layer.append(e); return { f, el: e }; });
const track = $('#railTrack');
STORY.lines.forEach((l) => { const t = el('i', 'tick'); t.style.top = `${(l.start / D) * 100}%`; track.append(t); });
shots.slice(1).forEach((s) => { const t = el('i', 'cut'); t.style.top = `${(s.start / D) * 100}%`; track.append(t); });
track.addEventListener('click', (e) => { const r = track.getBoundingClientRect(); scrollToTime(clamp((e.clientY - r.top) / r.height, 0, 1) * D, 'smooth'); });
$('#toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------------------------------------------------------------- layout
function layout() {
  const keepU = scrollY / pxPerUnit; // keep the exact place, pauses included
  W = innerWidth; H = innerHeight;
  mode = layoutPref === 'auto' ? (W / H < 0.85 || W < 640 ? 'tall' : 'wide') : layoutPref;
  document.body.classList.toggle('tall', mode === 'tall');
  const sw = mode === 'tall' ? Math.min(W, 430) : W;
  const stage = $('#stage');
  stage.style.width = `${sw}px`; stage.style.left = `${(W - sw) / 2}px`;
  W = sw;
  tails.setAttribute('viewBox', `0 0 ${W} ${H}`);
  pxPerUnit = mode === 'tall' ? 120 : 150;
  $('#spacer').style.height = `${Math.round(U_TOTAL * pxPerUnit + H)}px`;
  cam.shot = -1;
  if (started) window.scrollTo({ top: keepU * pxPerUnit, behavior: 'instant' });
}
function insetRect(s) {
  const top = HUD + 16, room = H - top - 24;
  if (mode === 'tall') {
    const w = W - 32, h = Math.min(w * (s.kind === 'insert' ? 0.7 : 1.15), room * 0.8);
    return { x: 16, y: top + (room - h) * 0.55, w, h };
  }
  if (s.kind === 'insert') {
    const w = Math.min(W * 0.46, room * 0.8 * (SW / SH)), h = w / (SW / SH);
    return { x: (W - w) / 2, y: top + (room - h) * 0.62, w, h };
  }
  const h = Math.min(room * 0.86, W * 0.42 * 0.75), w = h * (4 / 3);
  const right = s.side === 'right';
  return { x: right ? W - w - W * 0.08 : W * 0.08, y: top + (room - h) / 2, w, h };
}
function scrollToTime(t, behavior) { window.scrollTo({ top: uFromTime(t) * pxPerUnit + 1, behavior }); }

// cover-fit a SW x SH picture into a w x h box at zoom z, centred on (fx, fy): scale and offset
function fit(w, h, fx, fy, z = 1) {
  const k = Math.max(w / SW, h / SH) * z;
  return { k, x: clamp(w / 2 - fx * SW * k, w - SW * k, 0), y: clamp(h / 2 - fy * SH * k, h - SH * k, 0) };
}

// ---------------------------------------------------------------- render
const shotAt = (t) => shots.find((s) => t < s.end) || shots[shots.length - 1];
const lineIn = (s, t) => STORY.lines.find((l) => t >= l.start && t <= l.end && l.at[s.id]);
const win = (t, from, to, fade, sStart, sEnd) => {
  const a = from <= sStart + 1e-3 ? 1 : clamp((t - from) / fade + 0.5, 0, 1);
  const b = to >= sEnd - 1e-3 ? 1 : clamp((to - t) / fade + 0.5, 0, 1);
  return Math.min(a, b);
};

function render() {
  const s = shotAt(Tdisp);
  const p = (Tdisp - s.start) / (s.end - s.start);
  const isWide = s.kind === 'wide';
  if (cam.shot !== s.i) { cam.shot = s.i; cam.fx = s.fx; cam.fy = s.fy; }
  const speaking = lineIn(s, Tdisp);
  const target = speaking && speaking.at[s.id] ? speaking.at[s.id][0] : s.fx;
  cam.fx = lerp(cam.fx, target, 0.05);

  // which scene is on: the shot's own, or the hut's empty set (blurred) behind a close-up
  const sceneId = isWide ? s.scene : 'hut';
  let view = null;
  for (const sc of Object.values(scenes)) {
    const on = sc.id === sceneId;
    sc.root.classList.toggle('on', on);
    sc.root.classList.toggle('dim', on && !isWide);
    if (!on) continue;
    const zoom = isWide ? 1.06 + 0.05 * p : 1.12;
    const f = fit(W, H, isWide ? cam.fx : 0.5, isWide ? cam.fy : 0.5, zoom);
    // parallax: layers drift against each other as the story moves, more for nearer layers
    const drift = (p - 0.5) * W * 0.05 + (cam.fx - s.fx) * W * 0.06;
    sc.layerFit = { f, drift };
    for (const L of sc.layers) {
      const push = 1 + (L.depth - 0.5) * 0.03 * p;
      const dx = -(L.depth - 0.5) * drift;
      const ox = W / 2 - (W / 2 - f.x) * push, oy = H / 2 - (H / 2 - f.y) * push;
      L.el.style.transform = `translate3d(${ox + dx}px, ${oy}px, 0) scale(${f.k * push})`;
      L.x = ox + dx; L.y = oy; L.k = f.k * push;
    }
    for (const [name, pz] of Object.entries(sc.poses)) {
      const pose = isWide ? (s.poses || []).find((q) => q.c === name) : null;
      pz.img.style.opacity = pose ? win(Tdisp, pose.from, pose.to, 0.25, s.start, s.end) : 0;
    }
    if (isWide) view = { kind: 'scene', sc };
  }

  // inset close-up: comes forward from depth over its first 0.4 s (rewinds too)
  if (!isWide) {
    const r = insetRect(s);
    const inP = ease((Tdisp - s.start) / 0.4);
    inset.style.display = 'block';
    inset.style.width = `${r.w}px`; inset.style.height = `${r.h}px`;
    inset.style.transform = `translate(${r.x}px, ${r.y + (1 - inP) * 24}px) scale(${0.88 + 0.12 * inP})`;
    inset.style.opacity = inP;
    const f = fit(r.w, r.h, s.fx, s.fy, 1.03 + 0.05 * p);
    for (const [name, img] of Object.entries(insetFrames)) {
      const fr = (s.frames || []).find((q) => q.img === name);
      img.style.opacity = fr ? win(Tdisp, fr.from, fr.to, 0.25, s.start, s.end) : 0;
      if (fr) img.style.transform = `translate(${f.x}px, ${f.y}px) scale(${f.k})`;
    }
    const g = s.glow;
    const glow = $('#glow');
    if (g && Tdisp >= g.from) {
      const pulse = 0.65 + 0.35 * Math.sin((Tdisp - g.from) * 18);
      glow.style.opacity = clamp((Tdisp - g.from) / 0.15, 0, 1) * pulse;
      glow.style.background = `radial-gradient(40% 45% at ${(f.x + g.x * SW * f.k) / r.w * 100}% ${(f.y + g.y * SH * f.k) / r.h * 100}%, rgba(255,120,200,.95), rgba(184,50,42,.55) 45%, transparent 75%)`;
    } else glow.style.opacity = 0;
    view = { kind: 'inset', r, f };
  } else inset.style.display = 'none';

  // effects: smoke when Ravan shows his true form, the film's white flashes
  const sm = s.smoke, smoke = $('#smoke');
  if (sm && Tdisp >= sm.from && Tdisp <= sm.to && view && view.kind === 'scene') {
    const L = view.sc.layers[0];
    const k = (Tdisp - sm.from) / (sm.to - sm.from);
    smoke.style.opacity = Math.sin(Math.PI * k) * 0.9;
    const cx = L.x + sm.x * SW * L.k, cy = L.y + sm.y * SH * L.k;
    smoke.style.background = `radial-gradient(${18 + 30 * k}vmax ${16 + 26 * k}vmax at ${cx}px ${cy}px, rgba(190,60,170,.75), rgba(120,30,90,.45) 40%, transparent 70%)`;
  } else smoke.style.opacity = 0;
  const fl = STORY.flashes.reduce((m, t) => Math.max(m, 1 - Math.abs(Tdisp - t) / 0.18), 0);
  $('#flash').style.opacity = clamp(fl, 0, 1) * 0.9;

  placeBubbles(s, view);
  for (const { f, el: e } of sfxEls) {
    const on = f.shot === s.id && Tdisp >= f.start && Tdisp <= f.end;
    e.classList.toggle('on', on);
    if (!on || !view) continue;
    const r = view.kind === 'inset' ? view.r : { x: 0, y: 0, w: W, h: H };
    const pop = 1 + 0.18 * Math.max(0, 1 - (Tdisp - f.start) / 0.35);
    e.style.transform = `translate(${r.x + f.x * r.w}px, ${r.y + f.y * r.h}px) translate(-50%, -50%) rotate(${f.rot}deg) scale(${pop})`;
  }

  const n = STORY.narration.find((x) => x.text && Tdisp >= x.at - 0.05 && Tdisp <= x.until);
  narr.classList.toggle('on', !!n);
  if (n && narr.dataset.k !== String(n.at)) {
    narr.dataset.k = String(n.at);
    narr.replaceChildren(...n.text.split(' ').flatMap((w, i) => [i ? ' ' : '', Object.assign(el('span', 'w'), { textContent: w })]).filter((x) => x !== ''));
  }
  // live caption: the word the narrator is saying (word timings from tools/narration_words.py)
  if (n && STORY.captionSync && narrWords[n.clip]) {
    const ch = audio.narr && audio.narr[n.clip];
    const playing = ch && !ch.a.paused && audio.story && audio.story.clip === n.clip;
    const t = playing ? ch.a.currentTime : -1;
    const spans = narr.querySelectorAll('.w');
    narrWords[n.clip].forEach(([s, e], i) => {
      if (!spans[i]) return;
      spans[i].classList.toggle('now', t >= s && t < (narrWords[n.clip][i + 1] ? narrWords[n.clip][i + 1][0] : e + 0.3));
      spans[i].classList.toggle('said', playing && t >= e);
    });
    narr.classList.toggle('speaking', !!playing);
  }

  $('#railFill').style.height = `${(Tdisp / D) * 100}%`;
  $('#railHead').style.top = `${(Tdisp / D) * 100}%`;
  const sec = Math.floor(Tdisp);
  $('#railTime').textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')} / 1:20`;
}

function placeBubbles(s, view) {
  const top = HUD + 12;
  for (const b of bubbles) {
    const l = b.line;
    const on = !!view && l.at[s.id] !== undefined && Tdisp >= l.start - 0.05 && Tdisp <= l.end + 0.25;
    b.el.classList.toggle('on', on);
    b.el.classList.toggle('playing', !!replaying && replaying.li === b.li);
    if (!on) { b.path.setAttribute('d', ''); continue; }
    const bw = b.el.offsetWidth, bh = b.el.offsetHeight;
    const anchor = l.at[s.id];
    let r, ax, ay;
    if (view.kind === 'scene') {
      r = { x: 0, y: 0, w: W, h: H };
      if (anchor) {
        const d = speakerDepth(view.sc, l.who);
        const L = view.sc.layers.find((x) => Math.abs(x.depth - d) < 1e-6) || view.sc.layers[0];
        ax = L.x + anchor[0] * SW * L.k; ay = L.y + anchor[1] * SH * L.k;
      }
    } else {
      r = view.r;
      if (anchor) { ax = r.x + view.f.x + anchor[0] * SW * view.f.k; ay = r.y + view.f.y + anchor[1] * SH * view.f.k; }
    }
    let bx, by, tx, ty, short = 22;
    if (anchor && view.kind === 'inset') {
      // a close-up: keep the face clear, the bubble sits beside the frame and the tail reaches in
      const roomRight = W - (r.x + r.w), roomLeft = r.x, right = roomRight >= roomLeft;
      if ((right ? roomRight : roomLeft) > bw + 40) { bx = right ? r.x + r.w + 26 : r.x - bw - 26; by = ay - bh - 10; }
      else { bx = ax - bw / 2; by = r.y - bh - 18; if (by < top) by = r.y + r.h + 18; }
      tx = ax; ty = ay; short = 18;
    } else if (anchor && ax > r.x && ax < r.x + r.w) {
      bx = ax - bw / 2; by = ay - bh - 46;
      if (by < Math.max(top, r.y + 8)) { by = Math.max(top, ay - bh * 0.5 - 30); bx = ax > r.x + r.w / 2 ? ax - bw - 40 : ax + 40; }
      tx = ax; ty = ay;
    } else {
      // spoken off panel: the bubble sits at the panel's open side, the tail points off screen
      const roomRight = W - (r.x + r.w), roomLeft = r.x, right = roomRight >= roomLeft;
      if (r.w === W) { bx = W - bw - 56; by = top + H * 0.06; tx = W - 2; ty = by + bh + 40; }
      else if ((right ? roomRight : roomLeft) > bw + 40) { bx = right ? r.x + r.w + 24 : r.x - bw - 24; by = r.y + r.h * 0.12; tx = right ? W - 2 : 2; ty = by + bh + 50; }
      else { bx = r.x + r.w - bw - 8; by = Math.max(top, r.y - bh - 22); tx = W - 2; ty = by + bh / 2 + 30; }
      short = 0;
    }
    bx = clamp(bx, 12, W - bw - 12); by = clamp(by, top, H - bh - 12);
    b.el.style.transform = `translate(${bx}px, ${by}px)`;
    const cx = bx + bw / 2, cy = by + bh / 2, dx = tx - cx, dy = ty - cy, len = Math.hypot(dx, dy) || 1;
    tx = cx + dx * (1 - short / len); ty = cy + dy * (1 - short / len);
    const nx = -dy / len, ny = dx / len, base = Math.min(14, bw / 4);
    b.path.setAttribute('d', `M${cx + nx * base},${cy + ny * base} L${tx},${ty} L${cx - nx * base},${cy - ny * base} Z`);
  }
}

// ---------------------------------------------------------------- sound
function setupAudio(urls) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const mk = (url, keepPitch, vol) => {
    const a = new Audio(url);
    a.preload = 'auto';
    a.preservesPitch = keepPitch; a.webkitPreservesPitch = keepPitch;
    const g = ctx.createGain(); g.gain.value = 0;
    ctx.createMediaElementSource(a).connect(g).connect(ctx.destination);
    return { a, g, vol };
  };
  const amb = mk(urls.amb, true, 0.55); amb.a.loop = true;
  const narr = Object.fromEntries(Object.entries(urls.narr).map(([k, u]) => [k, mk(u, true, 1)]));
  Object.assign(audio, { ctx, bed: mk(urls.bed, true, 0.9), rev: mk(urls.rev, false, 0.75), voice: mk(urls.voice, true, 1), amb, narr, line: null, holdUntil: 0, resync: false, hold: null, story: null });
}
function fade(ch, on) {
  const to = on ? ch.vol : 0;
  if (!audio.ctx || ch._to === to) return;
  ch._to = to;
  ch.g.gain.cancelScheduledValues(audio.ctx.currentTime);
  ch.g.gain.setTargetAtTime(to, audio.ctx.currentTime, on ? 0.03 : 0.07);
  clearTimeout(ch._t);
  if (!on) ch._t = setTimeout(() => { if (ch.g.gain.value < 0.05) ch.a.pause(); }, 300);
}
function setRate(a, r) { if (Math.abs(a.playbackRate - r) > 0.04) a.playbackRate = r; }
function playAt(a, t) { if (Math.abs(a.currentTime - t) > 0.3) a.currentTime = t; if (a.paused) a.play().catch(() => {}); }

// everything the voice track says: the lines (with bubbles) and the wordless cues
const SPANS = [...STORY.lines, ...(STORY.voiceCues || [])].sort((a, b) => a.start - b.start);
function startLine(li, from) {
  const l = SPANS[li], v = audio.voice;
  audio.line = { li, end: l.end + 0.15 };
  stopNarr();
  v.a.currentTime = from; setRate(v.a, 1);
  v.a.play().catch(() => {}); fade(v, true);
}
// the narrator: one clip per story box, forward only, at its own pace
function stopNarr() { if (audio.story) { fade(audio.narr[audio.story.clip], false); audio.story = null; } }
function narrTick(now) {
  const u = scrollY / pxPerUnit;
  const h = holds.find((x) => u >= x.u0 - 0.05 && u < x.u1);
  const forward = auto.on || lastDir > 0;
  // entering a story box going forward: the narrator reads it from the top
  if (h && h !== audio.hold && forward && h.clip) {
    stopNarr();
    const ch = audio.narr[h.clip];
    ch.a.currentTime = 0; setRate(ch.a, 1); ch.a.play().catch(() => {}); ch._to = -1; fade(ch, true);
    audio.story = { clip: h.clip };
  }
  audio.hold = h || null;
  if (now - lastMoveAt < 140 && lastDir < 0 && !auto.on) stopNarr(); // rewinding: silent
  if (audio.story && audio.narr[audio.story.clip].a.ended) audio.story = null;
  // under a story box the scene is still: a soft ambience instead of silence
  fade(audio.amb, !!h);
  if (h && audio.amb.a.paused) audio.amb.a.play().catch(() => {});
}
function soundTick(now) {
  const { bed, rev, voice } = audio;
  if (!bed) return;
  if (!soundOn) { fade(bed, false); fade(rev, false); fade(voice, false); fade(audio.amb, false); stopNarr(); audio.hold = null; audio.line = null; return; }
  narrTick(now);
  if (replaying) {
    fade(bed, false); fade(rev, false);
    if (voice.a.currentTime >= replaying.line.end + 0.15 || voice.a.ended) endReplay();
    return;
  }
  const moving = now - tMoveAt < 140;

  // music and ambience: follows the scroll forward and backward
  if (moving && tDir > 0) {
    fade(rev, false);
    const pos = bed.a.currentTime, err = Tscroll - pos;
    if (bed.a.paused) {
      if (audio.resync || err > -0.05) { playAt(bed.a, audio.resync || err > 0.6 ? Tscroll : pos); audio.resync = false; setRate(bed.a, 1); fade(bed, true); }
    } else if (err > 1.0) bed.a.currentTime = Tscroll;
    else if (err < -0.5) fade(bed, false);
    else { setRate(bed.a, clamp(1 + err * 1.2, 0.6, 2.0)); fade(bed, true); }
  } else if (moving) {
    fade(bed, false); audio.resync = true;
    const rt = D - Tscroll, pos = rev.a.currentTime, err = rt - pos;
    if (rev.a.paused || Math.abs(err) > 1.0) playAt(rev.a, rt);
    setRate(rev.a, clamp(Math.abs(vel) * 0.9 + err * 1.5, 0.6, 3.0));
    fade(rev, true);
  } else {
    fade(rev, false);
    // stopped: the bed lets the moment ring briefly, then rests
    if (!bed.a.paused && bed._to > 0) {
      if (!audio.holdUntil) audio.holdUntil = now + 450;
      if (now > audio.holdUntil) { fade(bed, false); audio.holdUntil = 0; }
    }
  }
  if (moving) audio.holdUntil = 0;

  // voices: forward only, at their own pace
  if (moving && tDir < 0) {
    if (audio.line) { fade(voice, false); audio.line = null; }
  } else if (moving) {
    const li = SPANS.findIndex((l) => Tscroll >= l.start && Tscroll < l.end);
    if (li >= 0 && (!audio.line || audio.line.li !== li)) {
      const l = SPANS[li], into = Tscroll - l.start;
      // start a line from the top unless the reader is already well into it
      if (into < (l.end - l.start) * 0.6) startLine(li, into < 0.8 ? l.start : Tscroll);
    }
  }
  if (audio.line && voice.a.currentTime >= audio.line.end) { fade(voice, false); audio.line = null; }
}

// tap a bubble: hear the line again; the scene holds still while it plays
function replay(li) {
  if (!audio.voice) return;
  if (audio.ctx.state === 'suspended') audio.ctx.resume();
  replaying = { li, line: STORY.lines[li], scrollAt: scrollY };
  const v = audio.voice; v.a.currentTime = STORY.lines[li].start; setRate(v.a, 1);
  v.a.play().catch(() => {}); v._to = -1; fade(v, true);
  audio.line = null;
}
function endReplay() { if (!replaying) return; replaying = null; fade(audio.voice, false); }

// ---------------------------------------------------------------- pill
// "Scroll to play": shown once the opening narration is over and the reader hasn't scrolled yet,
// and again after 6 s idle mid-story while nothing is speaking. Gone on any scroll, Auto or the end.
const hintEl = $('#scrollHint');
const hint = { scrolled: false, startedAt: 0, on: false };
if (matchMedia('(pointer: coarse)').matches) { hintEl.classList.add('touch'); $('#hintVerb').textContent = 'Swipe up to play'; }
function updateHint(now) {
  const speaking = !!(soundOn && (audio.story || audio.line));
  const quiet = !auto.on && !replaying && !speaking && Tscroll < D - 0.1 && scrollY < U_TOTAL * pxPerUnit;
  const since = now - hint.startedAt;
  const show = quiet && (hint.scrolled ? now - lastMoveAt > 6000 : since > (soundOn ? 1200 : 1500) || since > 17000);
  if (show !== hint.on) { hint.on = show; hintEl.classList.toggle('show', show); }
}
$('#autoBtn').addEventListener('click', () => { hint.scrolled = true; });

const pill = $('#modePill');
let pillState = '';
function updatePill(now) {
  let s = '', txt = '';
  if (replaying) { s = 'rest'; txt = 'Replaying the line'; }
  else if (audio.story && soundOn) { s = 'rest'; txt = 'Narrator'; }
  else if (auto.on) { s = 'fwd'; txt = 'Lazy mode, 1x'; }
  else if (now - lastMoveAt < 160 && Tscroll < D - 0.05) {
    if (lastDir < 0) { s = 'rev'; txt = 'Rewinding'; }
    else { s = 'fwd'; txt = Math.abs(vel) < 0.05 ? 'Reading' : `Playing ${Math.min(9.9, Math.abs(vel)).toFixed(1)}x`; }
  } else if (audio.line && soundOn) { s = 'rest'; txt = 'Finishing the line'; }
  const key = s + txt;
  if (key === pillState) return;
  pillState = key;
  pill.className = `mode-pill ${s ? 'show ' + s : ''}`;
  if (txt) pill.textContent = txt;
}

// ---------------------------------------------------------------- loop
let lastNow = performance.now(), lastY = 0;
function frame(now) {
  const dt = Math.max(1, now - lastNow) / 1000; lastNow = now;
  if (started) {
    if (auto.on) {
      if (Math.abs(scrollY / pxPerUnit - auto.u) > 0.5) auto.u = scrollY / pxPerUnit; // jumped (rail click, resize)
      auto.u += Math.min(dt, 0.1) * unitsPerSecondAt(auto.u);
      if (auto.u >= U_TOTAL) { auto.u = U_TOTAL; setAuto(false); }
      window.scrollTo(0, auto.u * pxPerUnit);
    }
    const t = clamp(timeFromU(scrollY / pxPerUnit), 0, D - 0.04);
    if (Math.abs(scrollY - lastY) > 0.5) {
      if (replaying && Math.abs(scrollY - replaying.scrollAt) > 4) endReplay();
      lastDir = scrollY > lastY ? 1 : -1; lastMoveAt = now;
      if (!auto.on) hint.scrolled = true;
    }
    lastY = scrollY;
    if (Math.abs(t - Tscroll) > 1e-4) { tDir = t > Tscroll ? 1 : -1; tMoveAt = now; }
    vel = lerp(vel, (t - Tscroll) / dt, 0.2);
    Tscroll = t;
    Tdisp = Math.abs(Tscroll - Tdisp) > 3 ? Tscroll : lerp(Tdisp, Tscroll, 0.3);
    soundTick(now);
    updatePill(now);
    updateHint(now);
    render();
  }
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------- loading and start
async function fetchBlob(url, onBytes) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  const reader = res.body.getReader(); const parts = [];
  onBytes(0, +res.headers.get('content-length') || 0);
  for (;;) { const { done, value } = await reader.read(); if (done) break; parts.push(value); onBytes(value.length, 0); }
  return URL.createObjectURL(new Blob(parts, { type: res.headers.get('content-type') || '' }));
}
async function load() {
  const fill = $('#loadFill'), txt = $('#loadText');
  let got = 0, all = 0;
  const prog = (n, total) => { got += n; all += total; fill.style.width = `${Math.min(100, (got / (all || 1)) * 100)}%`; txt.textContent = `Loading the story... ${(got / 1e6).toFixed(1)} MB`; };
  const clips = STORY.narration.filter((n) => n.clip).map((n) => n.clip);
  const files = ['media/voice.m4a', 'media/bed.m4a', 'media/bed-rev.m4a', 'media/amb-loop.m4a', ...clips.map((c) => `media/voices/${c}.m4a`)];
  const [voice, bed, rev, amb, ...narrUrls] = await Promise.all(files.map((f) => fetchBlob(f, prog)));
  const narr = Object.fromEntries(clips.map((c, i) => [c, narrUrls[i]]));
  if (STORY.captionSync) narrWords = await (await fetch('media/voices/narr-words.json')).json().catch(() => ({}));
  await buildScenes();
  const imgs = [...document.querySelectorAll('#scenes img, #insetFrames img')];
  let done = 0;
  await Promise.all(imgs.map((i) => (i.decode ? i.decode() : Promise.resolve()).catch(() => {}).then(() => { done++; txt.textContent = `Painting the layers... ${done}/${imgs.length}`; })));
  fill.style.width = '100%'; txt.textContent = 'Ready.';
  $('.load').classList.add('done');
  $('#startSound').disabled = $('#startSilent').disabled = $('#startAuto').disabled = false;
  return { voice, bed, rev, amb, narr };
}
function start(withSound, urls, lazy = false) {
  if (!audio.ctx) setupAudio(urls);
  audio.ctx.resume();
  // prime every track inside the tap so later play() calls are allowed; the pause lands a moment
  // later, so it must not stop a track the engine has started in the meantime (the first narrator box)
  for (const ch of [audio.bed, audio.rev, audio.voice, audio.amb, ...Object.values(audio.narr)]) ch.a.play().then(() => { if (!(ch._to > 0)) ch.a.pause(); }).catch(() => {});
  soundOn = withSound; setSoundIcon();
  started = true;
  hint.startedAt = performance.now();
  document.body.classList.remove('locked');
  $('#shelf').classList.add('gone');
  window.scrollTo(0, 0);
  if (lazy) setAuto(true);
}
function setAuto(on) {
  auto.on = on; auto.u = scrollY / pxPerUnit;
  if (on && auto.u >= U_TOTAL - 0.05) { window.scrollTo(0, 0); auto.u = 0; } // at the end: start over
  const b = $('#autoBtn'); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Pause' : 'Auto';
  if (on && audio.ctx) audio.ctx.resume();
}
// the reader takes over: any manual scroll input stops lazy mode
const takeOver = () => { if (auto.on) setAuto(false); };
addEventListener('wheel', takeOver, { passive: true });
addEventListener('touchstart', takeOver, { passive: true });
addEventListener('keydown', (e) => { if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) takeOver(); });
$('#railTrack').addEventListener('pointerdown', takeOver);
function setSoundIcon() {
  const b = $('#soundBtn'); b.innerHTML = soundOn ? ICON.on : ICON.off;
  b.setAttribute('aria-label', soundOn ? 'Sound on' : 'Sound off');
}

document.body.classList.add('locked');
layout();
setSoundIcon();
addEventListener('resize', () => layout());
document.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => {
  layoutPref = b.dataset.layout;
  document.querySelectorAll('.seg button').forEach((x) => x.classList.toggle('on', x === b));
  layout();
}));
$('#autoBtn').addEventListener('click', () => setAuto(!auto.on));
$('#soundBtn').addEventListener('click', () => { soundOn = !soundOn; if (audio.ctx) audio.ctx.resume(); setSoundIcon(); });
requestAnimationFrame(frame);
// for poking at it from the console: scrollManga.go(41.5) jumps to that story second
window.scrollManga = {
  go: (t) => scrollToTime(t, 'instant'),
  state: () => ({
    Tscroll, Tdisp, mode, soundOn,
    line: audio.line && audio.line.li,
    bed: audio.bed && { paused: audio.bed.a.paused, t: audio.bed.a.currentTime, gain: audio.bed.g.gain.value },
    rev: audio.rev && { paused: audio.rev.a.paused, gain: audio.rev.g.gain.value },
    narr: audio.story && audio.story.clip, hold: !!audio.hold, words: Object.keys(narrWords).length,
    narrPlaying: audio.narr ? Object.entries(audio.narr).filter(([, ch]) => !ch.a.paused).map(([k, ch]) => `${k}@${ch.a.currentTime.toFixed(1)} g${ch.g.gain.value.toFixed(2)}`) : [], amb: audio.amb && audio.amb.g.gain.value,
    voice: audio.voice && { paused: audio.voice.a.paused, t: audio.voice.a.currentTime, gain: audio.voice.g.gain.value },
  }),
};
load().then((urls) => {
  $('#startSound').addEventListener('click', () => start(true, urls));
  $('#startSilent').addEventListener('click', () => start(false, urls));
  $('#startAuto').addEventListener('click', () => start(true, urls, true));
}).catch((e) => { $('#loadText').textContent = `Could not load the story (${e.message}). Serve this folder over http.`; });
