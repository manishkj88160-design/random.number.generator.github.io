// ===== UTILITY =====
let currentDice = 6;
let currentRomanTab = 'to-roman';
let currentDateTab = 'random';
let currentTDTab = 'truth';

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { let a = [...arr]; for (let i = a.length - 1; i > 0; i--) { let j = rand(0, i);[a[i], a[j]] = [a[j], a[i]]; } return a; }
function randHex() { return Math.floor(Math.random() * 16).toString(16).toUpperCase(); }
function pad2(n) { return n.toString(16).padStart(2, '0').toUpperCase(); }

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => showToast('✅ Copied to clipboard!'));
}

function copyAll(resultId) {
    const el = document.getElementById(resultId);
    const items = el.querySelectorAll('.chip,.result-list li,.hash-result-block');
    let texts = [];
    items.forEach(i => texts.push(i.dataset.value || i.textContent.trim().split('\n')[0].trim()));
    copyText(texts.join('\n'));
}

function buildResultHeader(title, resultId) {
    return `<div class="result-header">
    <span class="result-title">${title}</span>
    <div class="result-actions">
      <button onclick="copyAll('result-${resultId}')">📋 Copy All</button>
    </div>
  </div>`;
}

function showSparkle() {
    const s = document.getElementById('sparkleIndicator');
    s.classList.add('show');
    setTimeout(() => s.classList.remove('show'), 2500);
}

// ===== NAVIGATION =====
function switchSection(id, btn) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('section-' + id).classList.add('active');
    btn.classList.add('active');
    const titles = {
        'random-int': '🎲 Random Integer Generator', 'sequence': '🔢 Number Sequence',
        'dice': '🎯 Dice Roller', 'roman': '🏛️ Roman Numeral Converter',
        'lorem': '📝 Lorem Ipsum Generator', 'words': '💬 Word Generator',
        'num-to-words': '🔤 Numbers to Words', 'password': '🔐 Password Generator',
        'hash': '🔒 Hash Generator', 'guid': '🆔 GUID Generator',
        'names': '👤 Name Generator', 'phone': '📱 Phone Number Generator',
        'email': '📧 Email Generator', 'address': '🏠 Address Generator',
        'creditcard': '💳 Credit Card Generator', 'iban': '🏦 IBAN Generator',
        'mac': '🌐 MAC Address Generator', 'color': '🎨 Color Generator',
        'date': '📅 Date & Time Generator', 'username': '🧑‍💻 Username Generator',
        'countries': '🌍 Countries Generator', 'animals': '🦁 Animal Generator',
        'truth-dare': '🎮 Truth or Dare'
    };
    document.getElementById('topbarTitle').textContent = titles[id] || id;
    if (window.innerWidth <= 900) closeSidebar();
}

function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    sb.classList.toggle('open');
    let ov = document.getElementById('overlay');
    if (!ov) { ov = document.createElement('div'); ov.className = 'overlay'; ov.id = 'overlay'; ov.onclick = closeSidebar; document.body.appendChild(ov); }
    ov.classList.toggle('show');
}
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    const ov = document.getElementById('overlay');
    if (ov) ov.classList.remove('show');
}

// ===== 1. RANDOM INTEGER =====
function generateIntegers() {
    const min = parseInt(document.getElementById('int-min').value);
    const max = parseInt(document.getElementById('int-max').value);
    const count = Math.min(parseInt(document.getElementById('int-count').value) || 5, 1000);
    const unique = document.getElementById('int-unique').value === 'true';
    if (min > max) { showToast('⚠️ Min must be ≤ Max'); return; }
    let nums = [];
    if (unique) {
        const pool = [];
        for (let i = min; i <= max; i++) pool.push(i);
        if (count > pool.length) { showToast('⚠️ Not enough unique numbers'); return; }
        nums = shuffle(pool).slice(0, count);
    } else {
        for (let i = 0; i < count; i++) nums.push(rand(min, max));
    }
    const chips = nums.map(n => `<span class="chip" data-value="${n}" onclick="copyText('${n}')" title="Click to copy">${n}</span>`).join('');
    document.getElementById('result-random-int').innerHTML = buildResultHeader(`${nums.length} numbers (${min}–${max})`, 'random-int') + `<div class="chips-grid">${chips}</div>`;
    showSparkle();
}

// ===== 2. SEQUENCE =====
function generateSequence() {
    const from = parseInt(document.getElementById('seq-from').value);
    const to = parseInt(document.getElementById('seq-to').value);
    const step = Math.max(1, parseInt(document.getElementById('seq-step').value) || 1);
    const doShuffle = document.getElementById('seq-shuffle').value === 'true';
    if (from > to) { showToast('⚠️ From must be ≤ To'); return; }
    let nums = [];
    for (let i = from; i <= to; i += step) nums.push(i);
    if (doShuffle) nums = shuffle(nums);
    const chips = nums.map(n => `<span class="chip" data-value="${n}" onclick="copyText('${n}')">${n}</span>`).join('');
    document.getElementById('result-sequence').innerHTML = buildResultHeader(`Sequence: ${from} to ${to}, step ${step} (${nums.length} values)`, 'sequence') + `<div class="chips-grid">${chips}</div>`;
    showSparkle();
}

// ===== 3. DICE =====
function selectDice(sides, btn) {
    currentDice = sides;
    document.querySelectorAll('.dice-btn').forEach(b => b.classList.remove('active-dice'));
    btn.classList.add('active-dice');
}
function rollDice() {
    const count = Math.min(parseInt(document.getElementById('dice-count').value) || 1, 20);
    const rolls = Array.from({ length: count }, () => rand(1, currentDice));
    const total = rolls.reduce((a, b) => a + b, 0);
    const faces = rolls.map(r => `<div class="die-face">${r}</div>`).join('');
    document.getElementById('result-dice').innerHTML = buildResultHeader(`${count}d${currentDice}`, 'dice') +
        `<div class="dice-result-grid">${faces}</div>
     <div class="dice-total">Total: <strong>${total}</strong> | Average: <strong>${(total / count).toFixed(1)}</strong></div>`;
    showSparkle();
}

// ===== 4. ROMAN NUMERALS =====
function switchRomanTab(tab) {
    currentRomanTab = tab;
    document.getElementById('roman-to-roman').style.display = tab === 'to-roman' ? 'block' : 'none';
    document.getElementById('roman-from-roman').style.display = tab === 'from-roman' ? 'block' : 'none';
    document.getElementById('roman-tab-to').classList.toggle('active-tab', tab === 'to-roman');
    document.getElementById('roman-tab-from').classList.toggle('active-tab', tab === 'from-roman');
}
const ROMAN_MAP = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
function toRoman(n) { let r = ''; for (const [v, s] of ROMAN_MAP) { while (n >= v) { r += s; n -= v; } } return r; }
function fromRoman(s) {
    const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let res = 0; s = s.toUpperCase();
    for (let i = 0; i < s.length; i++) {
        const cur = map[s[i]], nxt = map[s[i + 1]];
        if (nxt && cur < nxt) { res += nxt - cur; i++; } else res += cur;
    } return res;
}
function convertRoman() {
    let from, to;
    if (currentRomanTab === 'to-roman') {
        const n = parseInt(document.getElementById('roman-input-num').value);
        if (n < 1 || n > 3999) { showToast('⚠️ Enter 1–3999'); return; }
        from = n; to = toRoman(n);
    } else {
        const s = document.getElementById('roman-input-str').value.trim().toUpperCase();
        from = s; to = fromRoman(s);
    }
    document.getElementById('result-roman').innerHTML =
        `<div class="roman-result-big"><div class="r-from">${from}</div><div class="r-to">${to}</div></div>`;
    showSparkle();
}

// ===== 5. LOREM IPSUM =====
const LOREM_WORDS = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'est', 'clochard', 'vitae', 'suscipit', 'lobortis', 'nisl', 'condimentum', 'mattis', 'pellentesque', 'habitant', 'morbi', 'tristique', 'senectus', 'netus', 'malesuada', 'fames', 'turpis', 'egestas', 'integer', 'eget'];
function loremSentence() { const len = rand(8, 18); let words = [...LOREM_WORDS].sort(() => Math.random() - 0.5).slice(0, len); words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1); return words.join(' ') + '.'; }
function loremPara() { const n = rand(4, 7); return Array.from({ length: n }, () => loremSentence()).join(' '); }
function generateLorem() {
    const type = document.getElementById('lorem-type').value;
    const count = parseInt(document.getElementById('lorem-count').value) || 3;
    const start = document.getElementById('lorem-start').value === 'true';
    let results = [];
    if (type === 'paragraphs') results = Array.from({ length: count }, (_, i) => i === 0 && start ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + loremPara() : loremPara());
    else if (type === 'sentences') results = Array.from({ length: count }, (_, i) => i === 0 && start ? 'Lorem ipsum dolor sit amet.' : loremSentence());
    else results = shuffle(LOREM_WORDS).slice(0, count);
    const text = type === 'paragraphs' ? results.join('\n\n') : results.join(type === 'sentences' ? ' ' : ' ');
    document.getElementById('result-lorem').innerHTML = buildResultHeader(`${count} ${type}`, 'lorem') +
        `<div class="text-result" onclick="copyText(this.textContent)" style="cursor:pointer">${text}</div>`;
    showSparkle();
}

// ===== 6. WORDS =====
const NOUNS = ['apple', 'bridge', 'canyon', 'dolphin', 'empire', 'forest', 'glacier', 'harbor', 'island', 'jungle', 'kingdom', 'lantern', 'mountain', 'nebula', 'ocean', 'palace', 'quartz', 'river', 'sunset', 'thunder', 'universe', 'valley', 'waterfall', 'xenon', 'yacht', 'zenith', 'anchor', 'beacon', 'castle', 'dragon', 'eagle', 'flame', 'garden', 'horizon', 'ivory', 'jewel', 'knight', 'lemon', 'melody', 'nova', 'orchid', 'phoenix', 'quill', 'raven', 'silver', 'tiger', 'umbrella', 'violet', 'wizard', 'arrow', 'breeze', 'cloud', 'dusk', 'echo', 'frost', 'glow', 'hawk', 'iron', 'jade'];
const ADJS = ['ancient', 'brilliant', 'calm', 'daring', 'elegant', 'fierce', 'gentle', 'happy', 'icy', 'jolly', 'keen', 'lively', 'mystic', 'noble', 'orange', 'purple', 'quiet', 'rustic', 'sleek', 'tiny', 'urban', 'vivid', 'wild', 'xenial', 'yellow', 'zealous', 'azure', 'bold', 'crisp', 'deep', 'emerald', 'fast', 'graceful', 'huge', 'ideal', 'jazzy', 'kind', 'light', 'mighty', 'neon', 'olive', 'prime', 'quick', 'rare', 'sharp', 'tall', 'unique', 'vast', 'warm', 'xenial', 'youthful', 'zesty'];
const VERBS = ['accelerate', 'bounce', 'capture', 'dance', 'explore', 'float', 'grow', 'hunt', 'imagine', 'jump', 'kindle', 'leap', 'move', 'navigate', 'open', 'play', 'quest', 'rise', 'shine', 'travel', 'unfold', 'venture', 'wander', 'expand', 'yield', 'zoom', 'achieve', 'bloom', 'create', 'discover', 'evolve', 'forge', 'gather', 'hover', 'inspire', 'join', 'keep', 'learn', 'merge', 'nurture', 'observe', 'perform', 'reflect', 'soar', 'transform', 'unlock', 'validate', 'weave'];
function generateWords() {
    const count = Math.min(parseInt(document.getElementById('word-count').value) || 10, 100);
    const cat = document.getElementById('word-category').value;
    let pool = cat === 'nouns' ? NOUNS : cat === 'adjectives' ? ADJS : cat === 'verbs' ? VERBS : [...NOUNS, ...ADJS, ...VERBS];
    const words = shuffle(pool).slice(0, count);
    const chips = words.map(w => `<span class="chip" onclick="copyText('${w}')">${w}</span>`).join('');
    document.getElementById('result-words').innerHTML = buildResultHeader(`${count} ${cat}`, 'words') + `<div class="chips-grid">${chips}</div>`;
    showSparkle();
}

// ===== 7. NUMBERS TO WORDS =====
const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function numToWords(n) {
    if (n === 0) return 'zero';
    if (n < 0) return 'negative ' + numToWords(-n);
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
    if (n < 1e6) return numToWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
    if (n < 1e9) return numToWords(Math.floor(n / 1e6)) + ' million' + (n % 1e6 ? ' ' + numToWords(n % 1e6) : '');
    return numToWords(Math.floor(n / 1e9)) + ' billion' + (n % 1e9 ? ' ' + numToWords(n % 1e9) : '');
}
function convertNumberToWords() {
    const n = parseInt(document.getElementById('ntw-input').value);
    if (isNaN(n)) { showToast('⚠️ Enter a valid number'); return; }
    const words = numToWords(Math.abs(n)) + (n < 0 ? ' (negative)' : '');
    document.getElementById('result-num-to-words').innerHTML = buildResultHeader('Result', 'num-to-words') +
        `<div class="roman-result-big"><div class="r-from">${n.toLocaleString()}</div><div class="r-to" style="font-size:1.4rem">${words}</div></div>`;
    showSparkle();
}

// ===== 8. PASSWORD =====
function generatePasswords() {
    const len = parseInt(document.getElementById('pwd-length').value) || 16;
    const upper = document.getElementById('pwd-upper').checked;
    const lower = document.getElementById('pwd-lower').checked;
    const numbers = document.getElementById('pwd-numbers').checked;
    const symbols = document.getElementById('pwd-symbols').checked;
    const excludeAmb = document.getElementById('pwd-exclude').value === 'true';
    const count = Math.min(parseInt(document.getElementById('pwd-count').value) || 5, 50);
    if (!upper && !lower && !numbers && !symbols) { showToast('⚠️ Select at least one character type'); return; }
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';
    if (excludeAmb) chars = chars.replace(/[0O1lI]/g, '');
    const arr = char => Array.from({ length: len }, () => chars[rand(0, chars.length - 1)]).join('');
    const passwords = Array.from({ length: count }, arr);
    const strength = len >= 20 ? '💪 Very Strong' : len >= 16 ? '✅ Strong' : len >= 12 ? '⚠️ Medium' : '❌ Weak';
    const list = passwords.map(p => `<li data-value="${p}" onclick="copyText('${p}')"><span>${p}</span><span class="copy-hint">click to copy</span></li>`).join('');
    document.getElementById('result-password').innerHTML = buildResultHeader(`${count} passwords · ${strength}`, 'password') + `<ul class="result-list">${list}</ul>`;
    showSparkle();
}

// ===== 9. HASH =====
async function sha(text, algo) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest(algo, enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function md5sim(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
    return Math.abs(hash).toString(16).padStart(8, '0').repeat(4).slice(0, 32);
}
async function generateHash() {
    const input = document.getElementById('hash-input').value;
    if (!input) { showToast('⚠️ Enter some text'); return; }
    const type = document.getElementById('hash-type').value;
    let result;
    if (type === 'md5sim') result = md5sim(input);
    else {
        const algoMap = { sha256: 'SHA-256', sha1: 'SHA-1', sha512: 'SHA-512', sha384: 'SHA-384' };
        result = await sha(input, algoMap[type]);
    }
    document.getElementById('result-hash').innerHTML = buildResultHeader(type.toUpperCase(), 'hash') +
        `<div class="hash-result-block" onclick="copyText('${result}')" title="Click to copy">${result}</div>`;
    showSparkle();
}

// ===== 10. GUID =====
function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16);
    });
}
function formatGUID(g, fmt) {
    if (fmt === 'no-dashes') return g.replace(/-/g, '');
    if (fmt === 'braces') return '{' + g + '}';
    if (fmt === 'uppercase') return g.toUpperCase();
    return g;
}
function generateGUIDs() {
    const count = Math.min(parseInt(document.getElementById('guid-count').value) || 5, 100);
    const fmt = document.getElementById('guid-format').value;
    const guids = Array.from({ length: count }, () => formatGUID(generateGUID(), fmt));
    const list = guids.map(g => `<li data-value="${g}" onclick="copyText('${g}')"><span>${g}</span><span class="copy-hint">copy</span></li>`).join('');
    document.getElementById('result-guid').innerHTML = buildResultHeader(`${count} GUIDs`, 'guid') + `<ul class="result-list">${list}</ul>`;
    showSparkle();
}

// ===== 11. NAMES =====
const nameData = {
    english: { male: ['James', 'Oliver', 'William', 'Harry', 'Noah', 'Jack', 'George', 'Charlie', 'Jacob', 'Alfie', 'Freddie', 'Oscar', 'Henry', 'Leo', 'Archie', 'Ethan', 'Mason', 'Logan', 'Lucas', 'Liam'], female: ['Emma', 'Olivia', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Lily', 'Grace', 'Hannah', 'Chloe', 'Ella', 'Scarlett', 'Aria', 'Luna', 'Zoe', 'Nora', 'Stella'], last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Young', 'Hall', 'Walker'] },
    spanish: { male: ['Carlos', 'Miguel', 'Juan', 'Diego', 'Alejandro', 'Luis', 'Antonio', 'Francisco', 'Javier', 'Roberto'], female: ['Sofia', 'Maria', 'Isabella', 'Valentina', 'Camila', 'Lucia', 'Elena', 'Ana', 'Patricia', 'Carmen'], last: ['Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores'] },
    french: { male: ['Lucas', 'Nathan', 'Thomas', 'Hugo', 'Théo', 'Maxime', 'Arthur', 'Louis', 'Antoine', 'Clément'], female: ['Emma', 'Lea', 'Manon', 'Camille', 'Inès', 'Sarah', 'Jade', 'Chloé', 'Lucie', 'Marie'], last: ['Martin', 'Bernard', 'Dupont', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel'] },
    german: { male: ['Lukas', 'Paul', 'Jonas', 'Felix', 'Leon', 'Maximilian', 'Elias', 'Emil', 'Ben', 'Finn'], female: ['Emma', 'Mia', 'Hannah', 'Lena', 'Anna', 'Marie', 'Lea', 'Sophia', 'Julia', 'Laura'], last: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann'] },
    japanese: { male: ['Haruto', 'Sota', 'Yuto', 'Hayato', 'Yuki', 'Sora', 'Ren', 'Riku', 'Yamato', 'Kaito'], female: ['Yui', 'Aoi', 'Hina', 'Rina', 'Mio', 'Nanami', 'Sakura', 'Nana', 'Mei', 'Riko'], last: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Ito', 'Watanabe', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato'] },
    arabic: { male: ['Mohammed', 'Omar', 'Ahmed', 'Ali', 'Ibrahim', 'Khalid', 'Yousef', 'Abdullah', 'Hassan', 'Hamza'], female: ['Fatima', 'Aisha', 'Maryam', 'Sara', 'Noor', 'Hana', 'Layla', 'Zainab', 'Rania', 'Dina'], last: ['Al-Rashid', 'Al-Farsi', 'Hassan', 'Ibrahim', 'Al-Sayed', 'Al-Amiri', 'Al-Khalid', 'Al-Hassan', 'Malik', 'Al-Amin'] }
};
function generateNames() {
    const count = Math.min(parseInt(document.getElementById('name-count').value) || 10, 200);
    const gender = document.getElementById('name-gender').value;
    const type = document.getElementById('name-type').value;
    const origin = document.getElementById('name-origin').value;
    const db = nameData[origin] || nameData.english;
    const names = Array.from({ length: count }, () => {
        const g = gender === 'any' ? (Math.random() < 0.5 ? 'male' : 'female') : gender;
        const pool = db[g] || db.male;
        const fn = pick(pool), ln = pick(db.last);
        if (type === 'first') return fn;
        if (type === 'last') return ln;
        return fn + ' ' + ln;
    });
    const list = names.map(n => `<li data-value="${n}" onclick="copyText('${n}')"><span>${n}</span><span class="copy-hint">copy</span></li>`).join('');
    document.getElementById('result-names').innerHTML = buildResultHeader(`${count} names`, 'names') + `<ul class="result-list">${list}</ul>`;
    showSparkle();
}

// ===== 12. PHONE =====
const phoneFmt = {
    US: { code: '+1', fmt: () => `+1 (${rand(200, 999)}) ${rand(200, 999)}-${rand(1000, 9999)}` },
    UK: { code: '+44', fmt: () => `+44 ${rand(7000, 7999)} ${rand(100000, 999999)}` },
    DE: { code: '+49', fmt: () => `+49 ${rand(1500, 1799)} ${rand(1000000, 9999999)}` },
    FR: { code: '+33', fmt: () => `+33 ${rand(6, 7)}${rand(10000000, 99999999)}` },
    IN: { code: '+91', fmt: () => `+91 ${rand(7000, 9999)} ${rand(100000, 999999)}` },
    RO: { code: '+40', fmt: () => `+40 7${rand(10, 99)} ${rand(100, 999)} ${rand(100, 999)}` },
    ES: { code: '+34', fmt: () => `+34 ${rand(600, 699)} ${rand(100, 999)} ${rand(100, 999)}` },
    CN: { code: '+86', fmt: () => `+86 ${rand(130, 199)} ${rand(1000, 9999)} ${rand(1000, 9999)}` },
    JP: { code: '+81', fmt: () => `+81 ${rand(70, 90)}-${rand(1000, 9999)}-${rand(1000, 9999)}` },
    AU: { code: '+61', fmt: () => `+61 ${rand(4, 4)}${rand(10000000, 99999999)}` }
};
function generatePhones() {
    const country = document.getElementById('phone-country').value;
    const count = Math.min(parseInt(document.getElementById('phone-count').value) || 5, 100);
    const fmt = phoneFmt[country];
    const phones = Array.from({ length: count }, fmt.fmt);
    const list = phones.map(p => `<li data-value="${p}" onclick="copyText('${p}')"><span>${p}</span><span class="copy-hint">copy</span></li>`).join('');
    document.getElementById('result-phone').innerHTML = buildResultHeader(`${count} phone numbers`, 'phone') + `<ul class="result-list">${list}</ul>`;
    showSparkle();
}

// ===== 13. EMAIL =====
const emailPrefixes = ['alpha', 'beta', 'charlie', 'delta', 'echo', 'foxtrot', 'galaxy', 'hawk', 'island', 'jasper', 'kilo', 'lima', 'mike', 'nova', 'oscar', 'phantom', 'quasar', 'romeo', 'sierra', 'tango', 'ultra', 'victor', 'whiskey', 'xray', 'yankee', 'zulu', 'cool', 'dark', 'fast', 'sky', 'moon', 'star', 'solar', 'pixel', 'cyber', 'neo', 'ultra', 'hyper', 'max', 'pro', 'dev', 'code', 'tech'];
const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'protonmail.com', 'icloud.com', 'hotmail.com', 'mail.com', 'tutanota.com', 'fastmail.com', 'zoho.com'];
function generateEmails() {
    const count = Math.min(parseInt(document.getElementById('email-count').value) || 8, 100);
    const domainSel = document.getElementById('email-domain').value;
    const emails = Array.from({ length: count }, () => {
        const prefix = pick(emailPrefixes) + (Math.random() < 0.6 ? rand(1, 999) : '') + (Math.random() < 0.3 ? '.' + pick(emailPrefixes) : '');
        const domain = domainSel === 'random' ? pick(emailDomains) : domainSel;
        return prefix.toLowerCase() + '@' + domain;
    });
    const list = emails.map(e => `<li data-value="${e}" onclick="copyText('${e}')"><span>${e}</span><span class="copy-hint">copy</span></li>`).join('');
    document.getElementById('result-email').innerHTML = buildResultHeader(`${count} emails`, 'email') + `<ul class="result-list">${list}</ul>`;
    showSparkle();
}

// ===== 14. ADDRESS =====
const addrData = {
    US: { streets: ['Main St', 'Oak Ave', 'Pine Rd', 'Maple Dr', 'Elm St', 'Cedar Ln', 'Birch Blvd', 'Walnut Way', 'Spruce Ct', 'Hickory Pl'], cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin', 'Seattle', 'Denver', 'Boston', 'Miami', 'Atlanta'], states: ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'FL', 'WA', 'CO', 'MA'], zip: () => `${rand(10000, 99999)}` },
    UK: { streets: ['High Street', 'Victoria Road', 'Church Lane', 'Park Avenue', 'Station Road', 'Mill Lane', 'Queens Road', 'Kings Street', 'Green Lane', 'School Road'], cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Bristol', 'Edinburgh', 'Cardiff', 'Sheffield'], states: ['England', 'Scotland', 'Wales'], zip: () => `${pick(['SW', 'NW', 'SE', 'NE', 'EC', 'WC', 'W', 'E', 'N'])}${rand(1, 20)} ${rand(1, 9)}${String.fromCharCode(65 + rand(0, 25))}${String.fromCharCode(65 + rand(0, 25))}` },
    CA: { streets: ['Rue Principale', 'Maple Ave', 'Wellington St', 'Dundas St', 'King Street', 'Bay Street', 'Bloor St', 'Yonge St', 'College St', 'Queen Street'], cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Victoria', 'Halifax'], states: ['ON', 'QC', 'BC', 'AB', 'MB'], zip: () => `${String.fromCharCode(65 + rand(0, 25))}${rand(1, 9)}${String.fromCharCode(65 + rand(0, 25))} ${rand(1, 9)}${String.fromCharCode(65 + rand(0, 25))}${rand(1, 9)}` },
    AU: { streets: ['George Street', 'Pitt Street', 'Collins Street', 'Flinders Lane', 'Swanston Street', 'Bourke Street', 'Elizabeth Street', 'Spring Street', 'Lonsdale Street', 'Lt Collins St'], cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Hobart', 'Darwin', 'Newcastle', 'Gold Coast'], states: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'], zip: () => `${rand(1000, 9999)}` }
};
function generateAddresses() {
    const count = Math.min(parseInt(document.getElementById('addr-count').value) || 3, 50);
    const country = document.getElementById('addr-country').value;
    const db = addrData[country] || addrData.US;
    const countryNames = { US: 'United States', UK: 'United Kingdom', CA: 'Canada', AU: 'Australia' };
    const addrs = Array.from({ length: count }, () => {
        const num = rand(1, 9999);
        const street = pick(db.streets);
        const city = pick(db.cities);
        const state = pick(db.states);
        const zip = db.zip();
        return { num, street, city, state, zip, country: countryNames[country] };
    });
    const cards = addrs.map(a => `<div class="address-card" onclick="copyText('${a.num} ${a.street}, ${a.city}, ${a.state} ${a.zip}, ${a.country}')">
    <div class="addr-label">📍 Address</div>
    <div class="addr-line">${a.num} ${a.street}<br>${a.city}, ${a.state} ${a.zip}<br>${a.country}</div>
  </div>`).join('');
    document.getElementById('result-address').innerHTML = buildResultHeader(`${count} addresses`, 'address') + cards;
    showSparkle();
}

// ===== 15. CREDIT CARD =====
function luhnFinish(partial) {
    let arr = [...partial.split('').map(Number)];
    let sum = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
        let d = arr[i];
        if ((arr.length - 1 - i) % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
        sum += d;
    }
    return (10 - (sum % 10)) % 10;
}
function genCC(type) {
    let prefix, len;
    if (type === 'visa') { prefix = '4'; len = 16; }
    else if (type === 'mastercard') { prefix = pick(['51', '52', '53', '54', '55']); len = 16; }
    else if (type === 'amex') { prefix = pick(['34', '37']); len = 15; }
    else { prefix = '6011'; len = 16; }
    let num = prefix;
    while (num.length < len - 1) num += rand(0, 9);
    num += luhnFinish(num);
    return num.match(/.{1,4}/g).join(' ');
}
function genExpiry() { return `${String(rand(1, 12)).padStart(2, '0')}/${rand(25, 30)}`; }
function genCVV(amex) { return rand(amex ? 1000 : 100, amex ? 9999 : 999).toString(); }
function generateCreditCards() {
    const type = document.getElementById('cc-type').value;
    const count = Math.min(parseInt(document.getElementById('cc-count').value) || 3, 20);
    const typeNames = { visa: 'VISA', mastercard: 'MASTERCARD', amex: 'AMEX', discover: 'DISCOVER' };
    const cards = Array.from({ length: count }, () => ({ num: genCC(type), exp: genExpiry(), cvv: genCVV(type === 'amex') }));
    const html = cards.map(c => `<div class="cc-card-visual" onclick="copyText('${c.num}')">
    <div class="cc-number">${c.num}</div>
    <div class="cc-row">
      <div><div class="cc-label">Expires</div><div class="cc-value">${c.exp}</div></div>
      <div><div class="cc-label">CVV</div><div class="cc-value">${c.cvv}</div></div>
      <div class="cc-type-badge">${typeNames[type]}</div>
    </div>
  </div>`).join('');
    document.getElementById('result-creditcard').innerHTML = buildResultHeader(`${count} test cards (Luhn valid)`, 'creditcard') + html;
    showSparkle();
}

// ===== 16. IBAN =====
const ibanFmt = {
    DE: { len: 22, bban: () => 'DE' + rand(10, 99) + Array.from({ length: 18 }, () => rand(0, 9)).join('') },
    GB: { len: 22, bban: () => 'GB' + rand(10, 99) + pick(['NWBK', 'BARC', 'LOYD', 'HSBC', 'MIDL']) + rand(10000000, 99999999) },
    FR: { len: 27, bban: () => 'FR' + rand(10, 99) + rand(10000, 99999) + rand(10000, 99999) + rand(100000000000, 999999999999) + '00' },
    ES: { len: 24, bban: () => 'ES' + rand(10, 99) + rand(1000, 9999) + rand(1000, 9999) + rand(0, 9) + rand(0, 9) + rand(1000000000, 9999999999) },
    IT: { len: 27, bban: () => 'IT' + rand(10, 99) + String.fromCharCode(65 + rand(0, 25)) + rand(10000, 99999) + rand(10000, 99999) + rand(1000000000, 9999999999) + '0' },
    NL: { len: 18, bban: () => 'NL' + rand(10, 99) + pick(['ABNA', 'RABO', 'INGB', 'TRIO', 'SNSB']) + rand(1000000000, 9999999999) },
    PL: { len: 28, bban: () => 'PL' + rand(10, 99) + Array.from({ length: 24 }, () => rand(0, 9)).join('') },
    RO: { len: 24, bban: () => 'RO' + rand(10, 99) + pick(['AAAA', 'BRDE', 'BTRL', 'CARP']) + Array.from({ length: 16 }, () => rand(0, 9)).join('') }
};
function generateIBANs() {
    const country = document.getElementById('iban-country').value;
    const count = Math.min(parseInt(document.getElementById('iban-count').value) || 5, 50);
    const fmt = ibanFmt[country] || ibanFmt.DE;
    const ibans = Array.from({ length: count }, fmt.bban);
    const list = ibans.map(ib => `<li data-value="${ib}" onclick="copyText('${ib}')"><span>${ib}</span><span class="copy-hint">copy</span></li>`).join('');
    document.getElementById('result-iban').innerHTML = buildResultHeader(`${count} IBANs (${country})`, 'iban') + `<ul class="result-list">${list}</ul>`;
    showSparkle();
}

// ===== 17. MAC =====
function generateMACs() {
    const count = Math.min(parseInt(document.getElementById('mac-count').value) || 5, 100);
    const sep = document.getElementById('mac-separator').value;
    const macs = Array.from({ length: count }, () => {
        const bytes = Array.from({ length: 6 }, () => rand(0, 255).toString(16).padStart(2, '0').toUpperCase());
        if (sep === '.') return bytes.slice(0, 2).join('') + '.' + bytes.slice(2, 4).join('') + '.' + bytes.slice(4, 6).join('');
        return bytes.join(sep);
    });
    const list = macs.map(m => `<li data-value="${m}" onclick="copyText('${m}')"><span>${m}</span><span class="copy-hint">copy</span></li>`).join('');
    document.getElementById('result-mac').innerHTML = buildResultHeader(`${count} MAC addresses`, 'mac') + `<ul class="result-list">${list}</ul>`;
    showSparkle();
}

// ===== 18. COLORS =====
function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => { const k = (n + h / 30) % 12; const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); return Math.round(255 * color).toString(16).padStart(2, '0'); };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}
function hexToRgb(hex) { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return { r, g, b }; }
function generateColors() {
    const count = Math.min(parseInt(document.getElementById('color-count').value) || 8, 50);
    const fmt = document.getElementById('color-format').value;
    const type = document.getElementById('color-type').value;
    const colors = Array.from({ length: count }, () => {
        const h = rand(0, 359);
        let s, l;
        if (type === 'light') { s = rand(30, 70); l = rand(70, 90); }
        else if (type === 'dark') { s = rand(30, 70); l = rand(10, 35); }
        else if (type === 'vivid') { s = rand(80, 100); l = rand(40, 60); }
        else { s = rand(20, 100); l = rand(25, 75); }
        const hex = hslToHex(h, s, l);
        const { r, g, b } = hexToRgb(hex);
        return { hex, r, g, b, h, s, l };
    });
    const swatches = colors.map(c => {
        let display = '';
        if (fmt === 'hex') display = c.hex;
        else if (fmt === 'rgb') display = `rgb(${c.r},${c.g},${c.b})`;
        else if (fmt === 'hsl') display = `hsl(${c.h},${c.s}%,${c.l}%)`;
        else display = `${c.hex}<br>rgb(${c.r},${c.g},${c.b})<br>hsl(${c.h},${c.s}%,${c.l}%)`;
        return `<div class="color-swatch" onclick="copyText('${c.hex}')">
      <div class="swatch-preview" style="background:${c.hex}"></div>
      <div class="swatch-info">
        <div class="swatch-hex">${c.hex}</div>
        <div class="swatch-alt" style="font-size:0.7rem">${display}</div>
      </div>
    </div>`;
    }).join('');
    document.getElementById('result-color').innerHTML = buildResultHeader(`${count} colors`, 'color') + `<div class="color-grid">${swatches}</div>`;
    showSparkle();
}

// ===== 19. DATE & TIME =====
function switchDateTab(tab) {
    currentDateTab = tab;
    ['random', 'unix', 'weekday'].forEach(t => {
        document.getElementById('date-panel-' + t).style.display = t === tab ? 'block' : 'none';
        document.getElementById('date-tab-' + t).classList.toggle('active-tab', t === tab);
    });
}
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function formatDate(d, fmt) {
    const y = d.getFullYear(), mo = d.getMonth(), day = d.getDate();
    if (fmt === 'iso') return `${y}-${String(mo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (fmt === 'us') return `${String(mo + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}/${y}`;
    if (fmt === 'eu') return `${String(day).padStart(2, '0')}/${String(mo + 1).padStart(2, '0')}/${y}`;
    return `${MONTHS[mo]} ${day}, ${y}`;
}
function generateDates() {
    const el = document.getElementById('result-date');
    if (currentDateTab === 'unix') {
        const ts = parseInt(document.getElementById('unix-input').value) || Math.floor(Date.now() / 1000);
        const d = new Date(ts * 1000);
        el.innerHTML = buildResultHeader('Unix Timestamp Conversion', 'date') +
            `<div class="roman-result-big"><div class="r-from">Unix: ${ts}</div><div class="r-to" style="font-size:1.3rem">${d.toUTCString()}</div></div>`;
        showSparkle(); return;
    }
    if (currentDateTab === 'weekday') {
        const count = Math.min(parseInt(document.getElementById('weekday-count').value) || 5, 50);
        const days = Array.from({ length: count }, () => pick(WEEKDAYS));
        const chips = days.map(d => `<span class="chip" onclick="copyText('${d}')">${d}</span>`).join('');
        el.innerHTML = buildResultHeader(`${count} weekdays`, 'date') + `<div class="chips-grid">${chips}</div>`;
        showSparkle(); return;
    }
    const fromVal = document.getElementById('date-from').value || '2000-01-01';
    const toVal = document.getElementById('date-to').value || new Date().toISOString().split('T')[0];
    const count = Math.min(parseInt(document.getElementById('date-count').value) || 5, 100);
    const fmt = document.getElementById('date-format').value;
    const fromMs = new Date(fromVal).getTime(), toMs = new Date(toVal).getTime();
    const dates = Array.from({ length: count }, () => new Date(rand(fromMs, toMs))).sort((a, b) => a - b);
    const list = dates.map(d => { const f = formatDate(d, fmt); return `<li data-value="${f}" onclick="copyText('${f}')"><span>${f}</span><span class="copy-hint">copy</span></li>`; }).join('');
    el.innerHTML = buildResultHeader(`${count} dates`, 'date') + `<ul class="result-list">${list}</ul>`;
    showSparkle();
}

// ===== 20. USERNAME =====
const gamingAdj = ['Dark', 'Shadow', 'Ice', 'Thunder', 'Ghost', 'Hyper', 'Ultra', 'Mega', 'Epic', 'Cyber', 'Neon', 'Doom', 'Blaze', 'Storm', 'Alpha'];
const gamingNoun = ['Dragon', 'Wolf', 'Phoenix', 'Raven', 'Tiger', 'Hawk', 'Viper', 'Cobra', 'Lynx', 'Falcon', 'Knight', 'Blade', 'Axe', 'Ninja', 'Specter'];
function generateUsernames() {
    const count = Math.min(parseInt(document.getElementById('uname-count').value) || 10, 100);
    const style = document.getElementById('uname-style').value;
    const addNums = document.getElementById('uname-numbers').value === 'true';
    const names = Array.from({ length: count }, () => {
        let u;
        if (style === 'gaming') u = pick(gamingAdj) + pick(gamingNoun);
        else if (style === 'professional') { const fn = pick(nameData.english.male.concat(nameData.english.female)).toLowerCase(); const ln = pick(nameData.english.last).toLowerCase(); u = fn + '.' + ln; }
        else u = pick(ADJS) + pick(NOUNS);
        if (addNums) u += rand(1, 999);
        return u;
    });
    const list = names.map(n => `<li data-value="${n}" onclick="copyText('${n}')"><span>${n}</span><span class="copy-hint">copy</span></li>`).join('');
    document.getElementById('result-username').innerHTML = buildResultHeader(`${count} usernames`, 'username') + `<ul class="result-list">${list}</ul>`;
    showSparkle();
}

// ===== 21. COUNTRIES =====
const countries = [
    { name: 'United States', capital: 'Washington D.C.', flag: '🇺🇸' }, { name: 'United Kingdom', capital: 'London', flag: '🇬🇧' },
    { name: 'Germany', capital: 'Berlin', flag: '🇩🇪' }, { name: 'France', capital: 'Paris', flag: '🇫🇷' },
    { name: 'Japan', capital: 'Tokyo', flag: '🇯🇵' }, { name: 'China', capital: 'Beijing', flag: '🇨🇳' },
    { name: 'India', capital: 'New Delhi', flag: '🇮🇳' }, { name: 'Brazil', capital: 'Brasília', flag: '🇧🇷' },
    { name: 'Canada', capital: 'Ottawa', flag: '🇨🇦' }, { name: 'Australia', capital: 'Canberra', flag: '🇦🇺' },
    { name: 'Italy', capital: 'Rome', flag: '🇮🇹' }, { name: 'Spain', capital: 'Madrid', flag: '🇪🇸' },
    { name: 'Russia', capital: 'Moscow', flag: '🇷🇺' }, { name: 'South Korea', capital: 'Seoul', flag: '🇰🇷' },
    { name: 'Mexico', capital: 'Mexico City', flag: '🇲🇽' }, { name: 'Netherlands', capital: 'Amsterdam', flag: '🇳🇱' },
    { name: 'Sweden', capital: 'Stockholm', flag: '🇸🇪' }, { name: 'Norway', capital: 'Oslo', flag: '🇳🇴' },
    { name: 'Switzerland', capital: 'Bern', flag: '🇨🇭' }, { name: 'Argentina', capital: 'Buenos Aires', flag: '🇦🇷' },
    { name: 'South Africa', capital: 'Pretoria', flag: '🇿🇦' }, { name: 'Egypt', capital: 'Cairo', flag: '🇪🇬' },
    { name: 'Nigeria', capital: 'Abuja', flag: '🇳🇬' }, { name: 'Kenya', capital: 'Nairobi', flag: '🇰🇪' },
    { name: 'Turkey', capital: 'Ankara', flag: '🇹🇷' }, { name: 'Poland', capital: 'Warsaw', flag: '🇵🇱' },
    { name: 'Portugal', capital: 'Lisbon', flag: '🇵🇹' }, { name: 'Greece', capital: 'Athens', flag: '🇬🇷' },
    { name: 'Thailand', capital: 'Bangkok', flag: '🇹🇭' }, { name: 'Vietnam', capital: 'Hanoi', flag: '🇻🇳' },
    { name: 'Indonesia', capital: 'Jakarta', flag: '🇮🇩' }, { name: 'Pakistan', capital: 'Islamabad', flag: '🇵🇰' },
    { name: 'Saudi Arabia', capital: 'Riyadh', flag: '🇸🇦' }, { name: 'UAE', capital: 'Abu Dhabi', flag: '🇦🇪' },
    { name: 'Singapore', capital: 'Singapore City', flag: '🇸🇬' }, { name: 'New Zealand', capital: 'Wellington', flag: '🇳🇿' },
    { name: 'Denmark', capital: 'Copenhagen', flag: '🇩🇰' }, { name: 'Finland', capital: 'Helsinki', flag: '🇫🇮' },
    { name: 'Belgium', capital: 'Brussels', flag: '🇧🇪' }, { name: 'Austria', capital: 'Vienna', flag: '🇦🇹' }
];
function generateCountries() {
    const count = Math.min(parseInt(document.getElementById('country-count').value) || 5, 40);
    const withCapital = document.getElementById('country-with-city').value === 'true';
    const picks = shuffle(countries).slice(0, count);
    const html = picks.map(c => `<div class="country-item" onclick="copyText('${c.name}')">
    <div class="country-flag">${c.flag}</div>
    <div class="country-info">
      <div class="country-name">${c.name}</div>
      ${withCapital ? `<div class="country-capital">🏛️ Capital: ${c.capital}</div>` : ''}
    </div>
  </div>`).join('');
    document.getElementById('result-countries').innerHTML = buildResultHeader(`${count} countries`, 'countries') + html;
    showSparkle();
}

// ===== 22. ANIMALS =====
const animals = {
    mammals: ['Lion', 'Tiger', 'Elephant', 'Giraffe', 'Zebra', 'Gorilla', 'Cheetah', 'Leopard', 'Jaguar', 'Bear', 'Wolf', 'Fox', 'Deer', 'Rabbit', 'Panda', 'Koala', 'Kangaroo', 'Hippo', 'Rhino', 'Seal', 'Otter', 'Dolphin', 'Whale', 'Bat', 'Moose', 'Bison'],
    birds: ['Eagle', 'Falcon', 'Owl', 'Parrot', 'Penguin', 'Flamingo', 'Peacock', 'Toucan', 'Hummingbird', 'Robin', 'Hawk', 'Raven', 'Swan', 'Crane', 'Pelican', 'Ostrich', 'Macaw', 'Kingfisher', 'Albatross', 'Condor'],
    reptiles: ['Crocodile', 'Alligator', 'Komodo Dragon', 'Iguana', 'Chameleon', 'Gecko', 'Python', 'Cobra', 'Anaconda', 'Tortoise', 'Sea Turtle', 'Monitor Lizard', 'Gila Monster', 'Skink'],
    marine: ['Shark', 'Octopus', 'Jellyfish', 'Seahorse', 'Clownfish', 'Manta Ray', 'Narwhal', 'Orca', 'Blue Whale', 'Starfish', 'Lobster', 'Crab', 'Squid', 'Barracuda', 'Swordfish', 'Tuna'],
    insects: ['Monarch Butterfly', 'Dragonfly', 'Praying Mantis', 'Stag Beetle', 'Firefly', 'Ladybug', 'Bumblebee', 'Tarantula', 'Scorpion', 'Stick Insect', 'Atlas Moth', 'Cicada', 'Grasshopper']
};
function generateAnimals() {
    const count = Math.min(parseInt(document.getElementById('animal-count').value) || 8, 50);
    const cat = document.getElementById('animal-category').value;
    const pool = cat === 'all' ? Object.values(animals).flat() : (animals[cat] || animals.mammals);
    const picks = shuffle(pool).slice(0, Math.min(count, pool.length));
    const tags = picks.map(a => `<span class="animal-tag" onclick="copyText('${a}')">${a}</span>`).join('');
    document.getElementById('result-animals').innerHTML = buildResultHeader(`${picks.length} animals`, 'animals') + `<div class="animal-tags">${tags}</div>`;
    showSparkle();
}

// ===== 23. TRUTH OR DARE =====
const truths = ['What is your biggest fear?', 'What is the most embarrassing thing you\'ve done?', 'Have you ever lied to a friend to get out of plans?', 'What is your biggest regret?', 'What is the most childish thing you still do?', 'Have you ever cheated in a game?', 'What is your secret talent?', 'Who was your first crush?', 'What is the most adventurous thing you\'ve done?', 'What is a bad habit you have?', 'Have you ever broken something and blamed someone else?', 'What is the strangest dream you\'ve ever had?', 'What is your biggest pet peeve?', 'Have you ever eavesdropped on a private conversation?', 'What is the biggest lie you\'ve ever told?', 'Do you have any phobias?', 'What is the most trouble you\'ve ever gotten into?', 'Have you ever sent a text to the wrong person?', 'What is your most embarrassing nickname?', 'What is your guilty pleasure?'];
const dares = ['Do 20 jumping jacks right now', 'Speak in an accent for the next 2 minutes', 'Send a funny selfie to the group chat', 'Sing the chorus of any song', 'Do your best celebrity impression', 'Say the alphabet backwards as fast as you can', 'Let someone draw on your face', 'Tell a terrible joke and keep a straight face', 'Do a dramatic monologue for one minute', 'Call a friend and say you have important news, then say nothing happened', 'Speak only in questions for 3 minutes', 'Do your best dance move', 'Name 5 world capitals in under 10 seconds', 'Describe your day using only emojis', 'Whisper everything you say for the next 3 minutes', 'Do 10 push-ups', 'Write a haiku about someone in the room', 'Do the worm', 'Stare at someone without blinking as long as you can', 'Answer the next question using only yes or no'];
function switchTDTab(tab) {
    currentTDTab = tab;
    document.getElementById('td-tab-truth').classList.toggle('active-tab', tab === 'truth');
    document.getElementById('td-tab-dare').classList.toggle('active-tab', tab === 'dare');
    document.getElementById('td-tab-both').classList.toggle('active-tab', tab === 'both');
}
function generateTruthDare() {
    const count = Math.min(parseInt(document.getElementById('td-count').value) || 5, 20);
    let items = [];
    for (let i = 0; i < count; i++) {
        if (currentTDTab === 'truth') items.push({ type: 'truth', text: pick(truths) });
        else if (currentTDTab === 'dare') items.push({ type: 'dare', text: pick(dares) });
        else items.push(Math.random() < 0.5 ? { type: 'truth', text: pick(truths) } : { type: 'dare', text: pick(dares) });
    }
    const html = items.map(it => `<div class="td-item" onclick="copyText('${it.text.replace(/'/g, "\\'")}')">
    <span class="td-badge ${it.type}">${it.type.toUpperCase()}</span>
    <span class="td-text">${it.text}</span>
  </div>`).join('');
    document.getElementById('result-truth-dare').innerHTML = buildResultHeader(`${count} prompts`, 'truth-dare') + html;
    showSparkle();
}

// ===== INIT =====
document.getElementById('date-to').value = new Date().toISOString().split('T')[0];
