/* sweetCone Cone Lab: draws cones in the collection's style from a list of traits. */
(() => {
  const INK = '#1d1b2e';
  const C = {
    blue: '#80B1FF', peri: '#C5C5FF', lav: '#A4A4F4', blush: '#FFD2EA', pink: '#FFC2DF', rose: '#FFA4D4',
    peach: '#FFCC99', yellow: '#FFE98A', mint: '#79E8B3', seafoam: '#B3FFC7', sky: '#BBEFFF', aqua: '#99E2FF',
    cream: '#FFF5EB', night: '#3E3B78', cherry: '#FF5C8A',
  };
  const HOLO = [C.yellow, C.mint, C.aqua, C.lav, C.pink];

  // w = how often a random roll picks it, pts = how much it adds to rarity.
  const TRAITS = [
    { key: 'background', label: 'Background', options: [
      { id: 'hearts', name: 'Lavender Hearts', w: 20, pts: 0, sw: C.lav },
      { id: 'mint', name: 'Mint Fizz', w: 20, pts: 0, sw: C.seafoam },
      { id: 'lemon', name: 'Lemonade', w: 18, pts: 0, sw: C.yellow },
      { id: 'sprinkles', name: 'Cream Sprinkles', w: 16, pts: 1, sw: C.cream },
      { id: 'sunburst', name: 'Sunburst', w: 10, pts: 2, sw: `repeating-conic-gradient(${C.yellow} 0 20deg, ${C.cream} 0 40deg, ${C.mint} 0 60deg, ${C.cream} 0 80deg)` },
      { id: 'rainbow', name: 'Rainbow Melt', w: 8, pts: 2, sw: `linear-gradient(90deg, ${HOLO.join(',')})` },
      { id: 'night', name: 'Starry Night', w: 4, pts: 3, sw: C.night },
    ] },
    { key: 'flavor', label: 'Scoop', options: [
      { id: 'strawberry', name: 'Strawberry', w: 18, pts: 0, fill: C.rose },
      { id: 'banana', name: 'Banana', w: 18, pts: 0, fill: C.yellow },
      { id: 'blueberry', name: 'Blueberry', w: 16, pts: 0, fill: C.blue },
      { id: 'mint', name: 'Mint', w: 16, pts: 0, fill: C.mint },
      { id: 'lavender', name: 'Lavender', w: 12, pts: 1, fill: C.peri },
      { id: 'peach', name: 'Peach Melba', short: 'Peach', w: 10, pts: 1, grad: [C.peach, C.blush], dir: [0, 0, 0, 1] },
      { id: 'cotton', name: 'Cotton Candy', w: 6, pts: 2, grad: [C.pink, C.sky], dir: [0, 0, 1, 1] },
      { id: 'holo', name: 'Holographic', short: 'Holo', w: 3, pts: 4, grad: HOLO, dir: [0, .1, 1, .9] },
    ] },
    { key: 'cone', label: 'Cone', options: [
      { id: 'waffle', name: 'Waffle', w: 22, pts: 0 },
      { id: 'dots', name: 'Polka Dot', w: 18, pts: 0 },
      { id: 'beans', name: 'Jelly Bean', w: 14, pts: 1 },
      { id: 'sprinkle', name: 'Sprinkled', w: 14, pts: 1 },
      { id: 'swirl', name: 'Rainbow Swirl', w: 7, pts: 2 },
      { id: 'holo', name: 'Holo Waffle', w: 3, pts: 3 },
    ] },
    { key: 'eyes', label: 'Eyes', options: [
      { id: 'dots', name: 'Bright', w: 20, pts: 0 },
      { id: 'happy', name: 'Giggly', w: 18, pts: 0 },
      { id: 'sleepy', name: 'Sleepy', w: 16, pts: 0 },
      { id: 'wink', name: 'Wink', w: 12, pts: 1 },
      { id: 'googly', name: 'Googly', w: 10, pts: 1 },
      { id: 'shiny', name: 'Sparkly', w: 8, pts: 1 },
      { id: 'hearts', name: 'Heart Eyes', w: 5, pts: 2 },
      { id: 'stars', name: 'Star Eyes', w: 3, pts: 3 },
    ] },
    { key: 'mouth', label: 'Mouth', options: [
      { id: 'smile', name: 'Smile', w: 26, pts: 0 },
      { id: 'cat', name: 'Kitty', w: 16, pts: 1 },
      { id: 'tongue', name: 'Tongue', w: 12, pts: 1 },
      { id: 'oh', name: 'Ooh', w: 10, pts: 1 },
      { id: 'smirk', name: 'Smirk', w: 8, pts: 2 },
    ] },
    { key: 'cheeks', label: 'Cheeks', options: [
      { id: 'none', name: 'Plain', w: 60, pts: 0 },
      { id: 'blush', name: 'Blush', w: 40, pts: 0 },
    ] },
    { key: 'eyewear', label: 'Eyewear', options: [
      { id: 'none', name: 'None', w: 50, pts: 0 },
      { id: 'round', name: 'Reading Glasses', w: 20, pts: 1 },
      { id: 'holo', name: 'Holo Specs', w: 8, pts: 2 },
      { id: 'hearts', name: 'Heart Shades', w: 8, pts: 2 },
      { id: 'verified', name: 'Verified Shades', w: 4, pts: 4 },
    ] },
    { key: 'topper', label: 'Topper', options: [
      { id: 'none', name: 'None', w: 30, pts: 0 },
      { id: 'cherry', name: 'Cherry', w: 16, pts: 0 },
      { id: 'bow', name: 'Bow', w: 14, pts: 1 },
      { id: 'flower', name: 'Flower', w: 14, pts: 1 },
      { id: 'web', name: 'Spider Web', w: 8, pts: 2 },
      { id: 'horn', name: 'Unicorn Horn', w: 4, pts: 4 },
    ] },
    { key: 'halo', label: 'Halo', options: [
      { id: 'none', name: 'None', w: 55, pts: 0 },
      { id: 'halo', name: 'Halo', w: 35, pts: 1 },
      { id: 'holo', name: 'Holo Halo', w: 10, pts: 3 },
    ] },
  ];

  const TIERS = [[0, 'Common'], [3, 'Uncommon'], [6, 'Rare'], [10, 'Epic'], [15, 'Legendary']];
  const MOOD = { dots: 'Bright', happy: 'Giggly', sleepy: 'Sleepy', wink: 'Cheeky', googly: 'Curious', shiny: 'Sparkly', hearts: 'Lovestruck', stars: 'Starstruck' };
  const TITLE = { cherry: 'the Classic', bow: 'the Darling', flower: 'the Blooming', web: 'the Spooky', horn: 'the Mythical' };
  const LINES = [
    'brain freeze!', 'lick responsibly.', 'scoop there it is!', 'do I look melty?', 'cone-gratulations!',
    'sundae funday?', '100% sprinkles, 0% regrets', 'chill, I’m cool.', 'one in 5,555, baby', 'boop received ✦',
    'that tickles!', 'keep me in the freezer pls',
  ];

  /* ---------- small helpers ---------- */
  const f = n => Math.round(n * 10) / 10;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rng = seed => () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const lin = (id, stops, [x1, y1, x2, y2] = [0, 0, 1, 1]) =>
    `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map((c, i) => `<stop offset="${f(i / (stops.length - 1))}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  const heart = (x, y, s, rot, fill, extra = '') =>
    `<path d="M0 8C-14-2-12-14-5-14C-2-14 0-12 0-9C0-12 2-14 5-14C12-14 14-2 0 8Z" transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" fill="${fill}" ${extra}/>`;
  const sparkle = (x, y, s, fill) => {
    const k = s * .16;
    return `<path d="M${x} ${y - s}Q${f(x + k)} ${f(y - k)} ${x + s} ${y}Q${f(x + k)} ${f(y + k)} ${x} ${y + s}Q${f(x - k)} ${f(y + k)} ${x - s} ${y}Q${f(x - k)} ${f(y - k)} ${x} ${y - s}Z" fill="${fill}"/>`;
  };
  const star = (x, y, r, fill) => {
    const pts = Array.from({ length: 10 }, (_, i) => {
      const a = (-90 + i * 36) * Math.PI / 180, rr = i % 2 ? r * .48 : r;
      return `${f(x + Math.cos(a) * rr)},${f(y + Math.sin(a) * rr)}`;
    }).join(' ');
    return `<polygon points="${pts}" fill="${fill}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  };

  /* ---------- trait renderers ---------- */
  function background(id, p, defs) {
    const R = rng(7);
    const rect = fill => `<rect width="400" height="400" fill="${fill}"/>`;
    switch (id) {
      case 'hearts':
        return rect(C.lav) + [[52, 58, 1.3, -12], [346, 46, 1, 14], [34, 236, 1.1, 8], [362, 200, 1.4, -10], [330, 338, 1, 18], [72, 346, 1.2, -16], [306, 112, .7, 6], [96, 150, .7, -6]]
          .map(([x, y, s, r]) => heart(x, y, s, r, C.yellow)).join('');
      case 'mint':
        return rect(C.seafoam) + Array.from({ length: 13 }, () => {
          const x = f(R() * 400), y = f(R() * 400), r = f(6 + R() * 16);
          return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".45"/><circle cx="${f(x - r * .35)}" cy="${f(y - r * .35)}" r="${f(r * .25)}" fill="#fff" opacity=".8"/>`;
        }).join('');
      case 'lemon':
        return rect(C.yellow) + [[60, 70, 16], [340, 80, 12], [40, 300, 12], [352, 280, 18], [300, 362, 9], [110, 360, 10], [326, 172, 8], [74, 172, 8]]
          .map(([x, y, s]) => sparkle(x, y, s, '#fff')).join('');
      case 'sprinkles': {
        const cols = [C.rose, C.blue, C.mint, C.lav, C.peach, C.aqua];
        return rect(C.cream) + Array.from({ length: 46 }, () => {
          const x = R() * 400, y = R() * 400, a = R() * Math.PI, l = 6, dx = Math.cos(a) * l, dy = Math.sin(a) * l;
          return `<path d="M${f(x - dx)} ${f(y - dy)}L${f(x + dx)} ${f(y + dy)}" stroke="${cols[Math.floor(R() * cols.length)]}" stroke-width="5" stroke-linecap="round"/>`;
        }).join('');
      }
      case 'sunburst': {
        const cx = 200, cy = 230, n = 28, cols = [C.yellow, C.cream, C.mint, C.cream];
        let s = rect(C.cream);
        for (let i = 0; i < n; i++) {
          const a1 = i / n * Math.PI * 2, a2 = (i + 1) / n * Math.PI * 2;
          s += `<path d="M${cx} ${cy}L${f(cx + Math.cos(a1) * 600)} ${f(cy + Math.sin(a1) * 600)}L${f(cx + Math.cos(a2) * 600)} ${f(cy + Math.sin(a2) * 600)}Z" fill="${cols[i % 4]}"/>`;
        }
        return s;
      }
      case 'rainbow':
        defs.push(lin(p('rb'), [C.yellow, C.seafoam, C.aqua, C.peri, C.pink], [0, 0, 1, 0]));
        return rect(`url(#${p('rb')})`);
      case 'night': {
        let s = rect(C.night);
        for (let i = 0; i < 40; i++) s += `<circle cx="${f(R() * 400)}" cy="${f(R() * 400)}" r="${f(.8 + R() * 1.6)}" fill="#fff" opacity="${f(.35 + R() * .6)}"/>`;
        return s + [[54, 64, 14], [340, 56, 10], [30, 214, 8], [368, 236, 15], [322, 346, 9], [70, 340, 12], [306, 150, 6]].map(([x, y, z]) => sparkle(x, y, z, '#fff')).join('');
      }
    }
    return '';
  }

  function conePattern(id, pid) {
    const P = (w, h, body, tr = '') => `<pattern id="${pid}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"${tr ? ` patternTransform="${tr}"` : ''}>${body}</pattern>`;
    switch (id) {
      case 'waffle': return P(28, 28, `<rect width="28" height="28" fill="#FBD9A6"/><path d="M14 0V28M0 14H28" stroke="#E7A867" stroke-width="5"/>`, 'rotate(45)');
      case 'holo': return P(28, 28, `<rect width="28" height="28" fill="${C.cream}"/><path d="M14 0V28" stroke="${C.mint}" stroke-width="5"/><path d="M0 14H28" stroke="${C.peach}" stroke-width="5"/>`, 'rotate(45)');
      case 'dots': return P(46, 46, `<rect width="46" height="46" fill="${C.cream}"/><circle cx="12" cy="12" r="7.5" fill="${C.rose}"/><circle cx="34" cy="31" r="9.5" fill="${C.rose}"/><circle cx="35" cy="6" r="3.5" fill="${C.rose}"/><circle cx="8" cy="36" r="4.5" fill="${C.rose}"/>`);
      case 'beans': return P(52, 52, `<rect width="52" height="52" fill="${C.cream}"/><ellipse cx="13" cy="12" rx="9" ry="5.5" transform="rotate(30 13 12)" fill="${C.lav}"/><ellipse cx="38" cy="20" rx="8" ry="5" transform="rotate(-40 38 20)" fill="${C.yellow}"/><ellipse cx="18" cy="38" rx="8" ry="5" transform="rotate(70 18 38)" fill="${C.yellow}"/><ellipse cx="42" cy="44" rx="7" ry="4.5" transform="rotate(10 42 44)" fill="${C.lav}"/>`);
      case 'sprinkle': {
        const cols = [C.rose, C.blue, C.mint, C.lav, C.peach, C.aqua];
        const seg = [[9, 9, 30], [30, 10, -40], [20, 26, 80], [7, 35, -10], [34, 35, 50], [40, 22, 0]];
        return P(46, 46, `<rect width="46" height="46" fill="${C.cream}"/>` + seg.map(([x, y, a], i) => `<path d="M${x - 4} ${y}H${x + 4}" transform="rotate(${a} ${x} ${y})" stroke="${cols[i]}" stroke-width="4.5" stroke-linecap="round"/>`).join(''));
      }
      case 'swirl': return P(160, 160, [C.rose, C.blue, C.mint, C.peach].map((c, i) => `<rect x="${i * 40}" width="40" height="160" fill="${c}"/>`).join(''), 'rotate(-32)');
    }
    return '';
  }

  const EYE_L = [166, 138], EYE_R = [234, 138];
  function eye(type, [x, y], side) {
    const line = `fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"`;
    switch (type) {
      case 'dots': return `<g class="look" data-max="4"><circle cx="${x}" cy="${y}" r="11" fill="${INK}"/><circle cx="${f(x - 3.5)}" cy="${y - 4}" r="3.6" fill="#fff"/></g>`;
      case 'shiny': return `<g class="look" data-max="3"><circle cx="${x}" cy="${y}" r="14.5" fill="${INK}"/><circle cx="${f(x - 4.5)}" cy="${y - 5}" r="5" fill="#fff"/><circle cx="${f(x + 4.5)}" cy="${y + 5}" r="2.4" fill="#fff"/></g>`;
      case 'googly': return `<circle cx="${x}" cy="${y}" r="15" fill="#fff" stroke="${INK}" stroke-width="4.5"/><g class="look" data-max="6"><circle cx="${x + 3}" cy="${y + 2}" r="7" fill="${INK}"/></g>`;
      case 'happy': return `<path d="M${x - 12} ${y + 5}Q${x} ${y - 13} ${x + 12} ${y + 5}" ${line}/>`;
      case 'sleepy': return `<path d="M${x - 12} ${y - 3}Q${x} ${y + 11} ${x + 12} ${y - 3}" ${line}/>`;
      case 'wink': return side === 'L' ? eye('dots', [x, y]) : eye('happy', [x, y]);
      case 'hearts': return heart(x, y + 3, 1.2, 0, C.cherry, `stroke="${INK}" stroke-width="3" vector-effect="non-scaling-stroke"`);
      case 'stars': return star(x, y, 15, C.yellow);
    }
    return '';
  }

  function mouth(type) {
    const s = `fill="none" stroke="${INK}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"`;
    switch (type) {
      case 'smile': return `<path d="M188 166Q200 180 212 166" ${s}/>`;
      case 'cat': return `<path d="M185 166Q192.5 176 200 167Q207.5 176 215 166" ${s}/>`;
      case 'tongue': return `<path d="M194 172Q194 188 200 188Q206 188 206 172Z" fill="#FF6F9F" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M186 166Q200 180 214 166" ${s}/>`;
      case 'oh': return `<ellipse cx="200" cy="172" rx="6.5" ry="8" fill="${INK}"/>`;
      case 'smirk': return `<path d="M189 172Q203 176 213 164" ${s}/>`;
    }
    return '';
  }

  function eyewear(type, p) {
    const [L, R] = [EYE_L, EYE_R];
    switch (type) {
      case 'round':
      case 'holo': {
        const st = type === 'round' ? '#C98B6B' : `url(#${p('holoS')})`;
        return `<g fill="none" stroke="${st}" stroke-width="${type === 'round' ? 5 : 6.5}" stroke-linecap="round">` +
          `<circle cx="${L[0]}" cy="${L[1]}" r="24" fill="#fff" fill-opacity=".18"/><circle cx="${R[0]}" cy="${R[1]}" r="24" fill="#fff" fill-opacity=".18"/>` +
          `<path d="M190 135Q200 127 210 135M142 132L114 124M258 132L286 124"/></g>`;
      }
      case 'hearts': {
        const lens = `opacity=".93" stroke="${INK}" stroke-width="3.5" vector-effect="non-scaling-stroke"`;
        const glint = (x, y) => `<path d="M${x - 13} ${y - 6}l6-6" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85"/>`;
        return heart(L[0], L[1] + 4, 1.95, -6, C.cherry, lens) + heart(R[0], R[1] + 4, 1.95, 6, C.cherry, lens) +
          glint(...L) + glint(...R) + `<path d="M192 133Q200 127 208 133" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
      }
      case 'verified':
        return [L, R].map(([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="22" fill="${C.aqua}" stroke="${C.blue}" stroke-width="5"/><path d="M${x - 9} ${y + 1}L${x - 3} ${y + 8}L${x + 10} ${y - 7}" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>`
        ).join('') + `<path d="M190 134Q200 126 210 134" fill="none" stroke="${C.blue}" stroke-width="5" stroke-linecap="round"/>`;
    }
    return '';
  }

  function spiderWeb() {
    const cx = 262, cy = 92, n = 8;
    const pt = (a, r) => `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`;
    let d = '';
    for (let i = 0; i < n; i++) d += `M${cx} ${cy}L${pt(i / n * Math.PI * 2, 32)}`;
    for (const r of [10, 19, 28]) {
      d += `M${pt(0, r)}`;
      for (let i = 0; i < n; i++) {
        const a1 = i / n * Math.PI * 2, a2 = (i + 1) / n * Math.PI * 2;
        d += `Q${pt((a1 + a2) / 2, r * .8)} ${pt(a2, r)}`;
      }
    }
    const sx = 306, sy = 154;
    let legs = '';
    for (const side of [-1, 1]) for (let k = 0; k < 4; k++) legs += `M${sx + side * 4} ${sy - 5 + k * 3}q${side * 8}-7 ${side * 14} ${-3 + k * 4}`;
    return `<path d="${d}" fill="none" stroke="#7A6AD8" stroke-width="2.2" stroke-linecap="round" opacity=".9"/>` +
      `<path d="M289 104L${sx} 142" stroke="${INK}" stroke-width="1.8"/>` +
      `<g class="spider"><path d="${legs}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="${sx}" cy="${sy}" rx="7" ry="8.5" fill="${INK}"/><circle cx="${sx}" cy="${sy - 10}" r="5" fill="${INK}"/><circle cx="${sx - 2}" cy="${sy - 11}" r="1.3" fill="#fff"/><circle cx="${sx + 2}" cy="${sy - 11}" r="1.3" fill="#fff"/></g>`;
  }

  function topper(type, p) {
    switch (type) {
      case 'cherry':
        return `<path d="M201 32Q205 14 222 7" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>` +
          `<path d="M212 16q11-13 23-5q-10 13-23 5z" fill="${C.mint}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>` +
          `<circle cx="200" cy="47" r="17" fill="${C.cherry}" stroke="${INK}" stroke-width="6"/><ellipse cx="193" cy="40" rx="4.5" ry="3.2" fill="#fff" opacity=".85"/>`;
      case 'bow':
        return `<g transform="translate(254 84) rotate(18)" stroke="${INK}" stroke-width="4" stroke-linejoin="round"><path d="M0 0C-10-18-28-16-26 0C-28 16-10 18 0 0Z" fill="${C.yellow}"/><path d="M0 0C10-18 28-16 26 0C28 16 10 18 0 0Z" fill="${C.yellow}"/><circle r="6.5" fill="${C.blue}"/></g>`;
      case 'flower':
        return `<g transform="translate(254 84)" stroke="${INK}" stroke-width="3.5">` +
          [0, 72, 144, 216, 288].map(a => { const r = (a - 90) * Math.PI / 180; return `<circle cx="${f(Math.cos(r) * 12)}" cy="${f(Math.sin(r) * 12)}" r="10" fill="${C.rose}"/>`; }).join('') +
          `<circle r="7.5" fill="${C.yellow}"/></g>`;
      case 'web': return spiderWeb();
      case 'horn':
        return `<g transform="translate(228 72) rotate(20)"><path d="M-15 3Q0 9 15 3L2.5-54Q0-59-2.5-54Z" fill="url(#${p('holo')})" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
          `<path d="M-11-9Q1-4 12-13M-7-25Q1-21 8-29M-4-40Q1-37 5-44" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".55"/></g>`;
    }
    return '';
  }

  function halo(type, p, raised) {
    if (type === 'none') return '';
    const cy = raised ? 14 : 34;
    const ring = type === 'holo' ? `url(#${p('holoS')})` : C.cream;
    return `<g class="halo"><ellipse cx="200" cy="${cy}" rx="52" ry="12" fill="none" stroke="${type === 'holo' ? C.aqua : C.pink}" stroke-width="13" opacity=".8" filter="url(#${p('glow')})"/>` +
      `<ellipse cx="200" cy="${cy}" rx="52" ry="12" fill="none" stroke="${ring}" stroke-width="6.5"/></g>`;
  }

  const SCOOP = 'M108 192C108 112 148 62 200 62C252 62 292 112 292 192' + 'a18.4 15 0 0 1-36.8 0'.repeat(5) + 'Z';
  const CONE = 'M136 200L264 200L207 364Q200 380 193 364Z';

  /* ---------- state + derived info ---------- */
  const pick = s => Object.fromEntries(TRAITS.map((t, i) => [t.key, t.options[s[i]]]));

  function describe(s) {
    const t = pick(s);
    const pts = TRAITS.reduce((sum, tr, i) => sum + tr.options[s[i]].pts, 0);
    const tier = TIERS.filter(([min]) => pts >= min).pop()[1];
    const odds = TRAITS.reduce((acc, tr, i) => acc * tr.options[s[i]].w / tr.options.reduce((a, o) => a + o.w, 0), 1);
    const mood = t.eyewear.id === 'verified' ? 'Verified' : MOOD[t.eyes.id];
    let title = TITLE[t.topper.id] || (t.halo.id !== 'none' ? 'the Angelic' : '');
    const name = `${mood} ${t.flavor.short || t.flavor.name}${title ? ' ' + title : ''}`;
    const code = encode(s);
    let h = 2166136261;
    for (const ch of code) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    const no = ((h >>> 0) % 5555) + 1;
    return { name, tier, pts, oneIn: Math.round(1 / odds), no, code };
  }

  const encode = s => s.map(i => i.toString(36)).join('');
  function decode(str) {
    if (!str || str.length !== TRAITS.length) return null;
    const s = [...str].map(ch => parseInt(ch, 36));
    return s.every((v, i) => Number.isInteger(v) && v >= 0 && v < TRAITS[i].options.length) ? s : null;
  }

  function render(s, uid) {
    const t = pick(s);
    const p = k => `${uid}-${k}`;
    const defs = [
      lin(p('holo'), HOLO, [0, 0, 1, 1]),
      lin(p('holoS'), HOLO, [0, 0, 1, 0]),
      conePattern(t.cone.id, p('cone')),
      `<filter id="${p('glow')}" x="-50%" y="-80%" width="200%" height="260%"><feGaussianBlur stdDeviation="4"/></filter>`,
    ];
    let scoopFill = t.flavor.fill;
    if (t.flavor.grad) { defs.push(lin(p('scoop'), t.flavor.grad, t.flavor.dir)); scoopFill = `url(#${p('scoop')})`; }

    const bg = background(t.background.id, p, defs);
    const blink = ['dots', 'shiny', 'googly', 'wink'].includes(t.eyes.id) && !['verified', 'hearts'].includes(t.eyewear.id);
    const raised = ['cherry', 'horn'].includes(t.topper.id);
    const info = describe(s);

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img" aria-label="${esc(info.name)}"><defs>${defs.join('')}</defs>${bg}` +
      `<g class="char">` +
        `<path d="${CONE}" fill="url(#${p('cone')})"/><path d="M232 200L264 200L207 364Z" fill="${INK}" opacity=".07"/>` +
        `<path d="${CONE}" fill="none" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
        `<path d="${SCOOP}" fill="${scoopFill}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
        `<path d="M134 132C136 106 152 86 176 78" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".6"/><circle cx="130" cy="152" r="5" fill="#fff" opacity=".6"/>` +
        (t.cheeks.id === 'blush' ? `<ellipse cx="144" cy="164" rx="13" ry="7.5" fill="#FF7FB6" opacity=".55"/><ellipse cx="256" cy="164" rx="13" ry="7.5" fill="#FF7FB6" opacity=".55"/>` : '') +
        `<g class="eyes${blink ? ' blink' : ''}">${eye(t.eyes.id, EYE_L, 'L')}${eye(t.eyes.id, EYE_R, 'R')}</g>` +
        mouth(t.mouth.id) + eyewear(t.eyewear.id, p) + topper(t.topper.id, p) + halo(t.halo.id, p, raised) +
      `</g></svg>`;
  }

  function weightedPick(options) {
    let r = Math.random() * options.reduce((a, o) => a + o.w, 0);
    for (let i = 0; i < options.length; i++) if ((r -= options[i].w) < 0) return i;
    return options.length - 1;
  }
  const randomState = () => TRAITS.map(t => weightedPick(t.options));
  const fromIds = ids => TRAITS.map((t, i) => Math.max(0, t.options.findIndex(o => o.id === ids[i])));

  /* ---------- UI ---------- */
  const $ = id => document.getElementById(id);
  const svgBox = $('labSvg');
  if (!svgBox) return;

  const toast = msg => (window.toast ? window.toast(msg) : null);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
  };

  let state = fromIds(['hearts', 'strawberry', 'waffle', 'dots', 'smile', 'blush', 'none', 'cherry', 'none']);
  const fromHash = location.hash.startsWith('#cone-') && decode(location.hash.slice(6));
  const saved = decode(store.get('sc-lab'));
  if (fromHash) state = fromHash; else if (saved) state = saved;

  const combos = TRAITS.reduce((a, t) => a * t.options.length, 1);
  $('comboCount').textContent = combos.toLocaleString('en-US');

  // build the trait pickers
  const CHIP_COLORS = ['var(--pink)', 'var(--yellow)', 'var(--seafoam)', 'var(--sky)', 'var(--peri)', 'var(--peach)', 'var(--blush)', 'var(--mint)', 'var(--aqua)'];
  $('labTraits').innerHTML = TRAITS.map((t, ti) => `
    <fieldset class="trait reveal" style="--on:${CHIP_COLORS[ti % CHIP_COLORS.length]}">
      <legend><span>${t.label}</span><span class="trait-now" data-now="${ti}"></span></legend>
      <div class="chips">${t.options.map((o, oi) => {
        const sw = o.sw || o.fill || (o.grad ? `linear-gradient(135deg, ${o.grad.join(',')})` : '');
        const rare = o.pts >= 4 ? '✦✦' : o.pts >= 2 ? '✦' : '';
        return `<button type="button" class="chip" data-t="${ti}" data-o="${oi}" aria-pressed="false">${sw ? `<span class="sw" style="--sw:${sw}"></span>` : ''}${esc(o.name)}${rare ? `<span class="rare" title="Rare trait">${rare}</span>` : ''}</button>`;
      }).join('')}</div>
    </fieldset>`).join('');

  function update({ pop = false, persist = true } = {}) {
    svgBox.innerHTML = render(state, 'lab');
    const info = describe(state);
    $('labName').textContent = info.name;
    $('labNo').textContent = `Lab #${String(info.no).padStart(4, '0')}`;
    const tier = $('labTier');
    tier.textContent = info.tier;
    tier.className = `tier tier-${info.tier.toLowerCase()}`;
    $('labOdds').innerHTML = `Rarity score <b>${info.pts}</b> · about <b>1 in ${info.oneIn.toLocaleString('en-US')}</b> random scoops look like this`;
    document.querySelectorAll('.chip').forEach(ch => ch.setAttribute('aria-pressed', String(state[ch.dataset.t] === +ch.dataset.o)));
    document.querySelectorAll('[data-now]').forEach(el => { el.textContent = TRAITS[el.dataset.now].options[state[el.dataset.now]].name; });
    if (pop) { svgBox.classList.remove('pop'); void svgBox.offsetWidth; svgBox.classList.add('pop'); }
    if (persist) store.set('sc-lab', info.code);
    look();
  }

  $('labTraits').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    state[chip.dataset.t] = +chip.dataset.o;
    update({ pop: true });
  });

  // pupils follow the pointer
  let mouse = null;
  function look() {
    if (!mouse) return;
    const r = svgBox.getBoundingClientRect();
    if (!r.width) return;
    svgBox.querySelectorAll('.look').forEach((g, i) => {
      const [ex, ey] = i === 0 ? EYE_L : EYE_R; // left eye is always first (a wink only tracks with the left)
      const cx = r.left + ex / 400 * r.width, cy = r.top + ey / 400 * r.height;
      const dx = mouse[0] - cx, dy = mouse[1] - cy, dist = Math.hypot(dx, dy) || 1;
      const m = +g.dataset.max * Math.min(1, dist / 160);
      g.setAttribute('transform', `translate(${f(dx / dist * m)} ${f(dy / dist * m)})`);
    });
  }
  let lookQueued = false;
  window.addEventListener('pointermove', e => {
    mouse = [e.clientX, e.clientY];
    if (!lookQueued) { lookQueued = true; requestAnimationFrame(() => { lookQueued = false; look(); }); }
  }, { passive: true });

  // boop
  const say = $('labSay');
  let sayTimer;
  $('labStage').addEventListener('click', e => {
    const stage = $('labStage');
    stage.classList.remove('boing'); void stage.offsetWidth; stage.classList.add('boing');
    say.textContent = LINES[Math.floor(Math.random() * LINES.length)];
    say.classList.add('show');
    clearTimeout(sayTimer);
    sayTimer = setTimeout(() => say.classList.remove('show'), 1800);
    if (window.sprinkleBurst) window.sprinkleBurst(e.clientX, e.clientY, 26);
  });

  // surprise me: quick slot-machine spin, then land
  const roll = $('labRoll');
  roll.addEventListener('click', () => {
    if (roll.disabled) return;
    roll.disabled = true;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let n = reduce ? 0 : 9;
    const spin = () => {
      state = randomState();
      if (n-- > 0) { svgBox.innerHTML = render(state, 'lab'); setTimeout(spin, 55 + (9 - n) * 9); return; }
      update({ pop: true });
      roll.disabled = false;
      const info = describe(state);
      if (info.tier === 'Legendary' || info.tier === 'Epic') {
        toast(`✦ ${info.tier} pull! ${info.name}`);
        const r = svgBox.getBoundingClientRect();
        if (window.sprinkleBurst) window.sprinkleBurst(r.left + r.width / 2, r.top + r.height / 3, 60);
      }
    };
    spin();
  });

  // save PNG
  $('labSave').addEventListener('click', () => {
    const info = describe(state);
    const url = URL.createObjectURL(new Blob([render(state, 'png')], { type: 'image/svg+xml' }));
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 1200;
      cv.getContext('2d').drawImage(img, 0, 0, 1200, 1200);
      URL.revokeObjectURL(url);
      cv.toBlob(b => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.download = `sweetcone-lab-${String(info.no).padStart(4, '0')}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        toast('Saved! Fresh out of the freezer 🍦');
      }, 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast('Could not render the PNG, sorry!'); };
    img.src = url;
  });

  // copy share link
  $('labLink').addEventListener('click', async () => {
    const link = `${location.origin}${location.pathname}#cone-${encode(state)}`;
    history.replaceState(null, '', `#cone-${encode(state)}`);
    try { await navigator.clipboard.writeText(link); toast('Link copied! Share your scoop ✦'); }
    catch (e) { toast('Link is in the address bar, copy away!'); }
  });

  // freezer
  const MAX_FREEZER = 12;
  let freezer = (store.get('sc-freezer') || '').split(',').map(decode).filter(Boolean);
  function drawFreezer() {
    const box = $('freezer');
    box.hidden = freezer.length === 0;
    $('freezerCount').textContent = freezer.length ? `(${freezer.length}/${MAX_FREEZER})` : '';
    $('freezerShelf').innerHTML = freezer.map((s, i) => {
      const info = describe(s);
      return `<div class="frozen"><button type="button" class="frozen-cone" data-load="${i}" aria-label="Load ${esc(info.name)}">${render(s, 'fz' + i)}</button><span>${esc(info.name)}</span><button type="button" class="frozen-x" data-del="${i}" aria-label="Remove ${esc(info.name)}">✕</button></div>`;
    }).join('');
    store.set('sc-freezer', freezer.map(encode).join(','));
  }
  $('labFreeze').addEventListener('click', () => {
    const code = encode(state);
    if (freezer.some(s => encode(s) === code)) { toast('That one’s already chilling in your freezer'); return; }
    freezer.unshift([...state]);
    if (freezer.length > MAX_FREEZER) freezer.length = MAX_FREEZER;
    drawFreezer();
    $('freezer').classList.add('in');
    toast(`${describe(state).name} is now chilling ❄️`);
  });
  $('freezerShelf').addEventListener('click', e => {
    const load = e.target.closest('[data-load]'), del = e.target.closest('[data-del]');
    if (del) { freezer.splice(+del.dataset.del, 1); drawFreezer(); return; }
    if (load) { state = [...freezer[+load.dataset.load]]; update({ pop: true }); $('labStage').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });

  window.ConeLab = {
    load(ids) { state = fromIds(ids); update({ pop: true }); return describe(state).name; },
    render, describe, randomState,
  };

  update({ persist: false });
  drawFreezer();
  if (fromHash) requestAnimationFrame(() => document.getElementById('lab').scrollIntoView());
})();
