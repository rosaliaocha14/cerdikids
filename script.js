// Cerdikids Core Logic

// State
let state = {
    stars: 0,
    currentView: 'home',
    soundEnabled: true,
    stats: {
        gameLetters: 0,
        gameNumbers: 0,
        gameColors: 0,
        gameShapes: 0,
        gameMemory: 0,
        gameSinging: 0
    },
    badges: [], // Array of unlocked badge IDs
    timerInterval: null,
    shapeDeck: [], // For randomized non-repeating questions

    // Parent Dashboard Features
    playTime: 0, // Minutes played today
    parentSettings: { // Renamed to avoid confusion
        showGameLetters: true,
        showGameNumbers: true,
        showGameColors: true,
        showGameShapes: true,
        showGameMemory: true,
        showGameSinging: true
    }
};

// Time Tracking Logic
// Time Tracking Logic
setInterval(() => {
    state.playTime++;
    checkTimeLimit();
    saveProgress();
}, 60000); // Increment every minute



const BADGES_CONFIG = [
    { id: 'letter_expert', name: 'Ahli Huruf', icon: '🅰️', reqGame: 'gameLetters', reqCount: 5 },
    { id: 'number_pro', name: 'Jago Hitung', icon: '💯', reqGame: 'gameNumbers', reqCount: 5 },
    { id: 'color_master', name: 'Master Warna', icon: '🎨', reqGame: 'gameColors', reqCount: 5 },
    { id: 'shape_wizard', name: 'Penyihir Bentuk', icon: '🔷', reqGame: 'gameShapes', reqCount: 5 },
    { id: 'memory_king', name: 'Raja Memori', icon: '👑', reqGame: 'gameMemory', reqCount: 3 },
    { id: 'brain_master', name: 'Otak Cerdas', icon: '🧠', reqGame: 'gameMemory', reqCount: 10 },
    { id: 'singing_star', name: 'Bintang Bernyanyi', icon: '🎤', reqGame: 'gameSinging', reqCount: 5 } // New Badge
];

const ALPHABET = [
    { char: 'A', word: 'Apel', icon: '🍎' },
    { char: 'B', word: 'Bola', icon: '⚽' },
    { char: 'C', word: 'Ceri', icon: '🍒' },
    { char: 'D', word: 'Domba', icon: '🐑' },
    { char: 'E', word: 'Es Krim', icon: '🍦' },
    { char: 'F', word: 'Foto', icon: '📷' },
    { char: 'G', word: 'Gajah', icon: '🐘' },
    { char: 'H', word: 'Harimau', icon: '🐯' },
    { char: 'I', word: 'Ikan', icon: '🐟' },
    { char: 'J', word: 'Jerapah', icon: '🦒' },
    { char: 'K', word: 'Kucing', icon: '🐱' },
    { char: 'L', word: 'Lampu', icon: '💡' },
    { char: 'M', word: 'Monyet', icon: '🐒' },
    { char: 'N', word: 'Nanas', icon: '🍍' },
    { char: 'O', word: 'Obor', icon: '🔥' },
    { char: 'P', word: 'Pesawat', icon: '✈️' },
    { char: 'Q', word: 'Quran', icon: '📖' },
    { char: 'R', word: 'Rumah', icon: '🏠' },
    { char: 'S', word: 'Semangka', icon: '🍉' },
    { char: 'T', word: 'Topi', icon: '🎩' },
    { char: 'U', word: 'Unta', icon: '🐫' },
    { char: 'V', word: 'Vas', icon: '🏺' },
    { char: 'W', word: 'Wortel', icon: '🥕' },
    { char: 'X', word: 'Xylophone', icon: '🎹' },
    { char: 'Y', word: 'Yoyo', icon: '🪀' },
    { char: 'Z', word: 'Zebra', icon: '🦓' }
];

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const COUNT_ICONS = ['🍎', '⚽', '🚗', '🎈', '⭐', '🍪', '🐱'];

const COLORS = [
    { name: 'Merah', code: '#FF0000', object: '🍎' },
    { name: 'Biru', code: '#0000FF', object: '�' },
    { name: 'Kuning', code: '#FFFF00', object: '🍌' },
    { name: 'Hijau', code: '#008000', object: '🌳' },
    { name: 'Oranye', code: '#FFA500', object: '🍊' },
    { name: 'Ungu', code: '#800080', object: '🍆' },
    { name: 'Coklat', code: '#A52A2A', object: '🍫' },
    { name: 'Hitam', code: '#000000', object: '⚫' },
    { name: 'Putih', code: '#FFFFFF', object: '⚪' }
];

const SHAPES = [
    { name: 'Lingkaran', icon: '🔴', type: 'circle' },
    { name: 'Persegi', icon: '🟦', type: 'square' },
    { name: 'Segitiga', icon: '🔺', type: 'triangle' },
    { name: 'Bintang', icon: '⭐', type: 'star' },
    { name: 'Hati', icon: '❤️', type: 'heart' },
    { name: 'Persegi Panjang', icon: '▬', type: 'rectangle' },
    { name: 'Oval', icon: '🥚', type: 'oval' },
    { name: 'Belah Ketupat', icon: '🔶', type: 'diamond' }
];





// DOM Elements

const views = {
    home: document.getElementById('view-home'),
    gameLetters: document.getElementById('view-game-letters'),
    gameNumbers: document.getElementById('view-game-numbers'),
    gameColors: document.getElementById('view-game-colors'),
    gameShapes: document.getElementById('view-game-shapes'),
    gameMemory: document.getElementById('view-game-memory'),
    gameSinging: document.getElementById('view-game-singing'),
    dashboard: document.getElementById('view-dashboard')
};


const starDisplay = document.getElementById('star-count');
const parentModal = document.getElementById('parent-modal');
const parentMathQuestion = document.getElementById('parent-math-question');
const parentMathInput = document.getElementById('parent-math-input');

// Sound Effects (Web Speech API)
const speak = (text) => {
    if (!state.soundEnabled) return;

    // Cancel previous to avoid queue buildup
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find Indonesian voice
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));

    if (idVoice) {
        utterance.voice = idVoice;
        utterance.lang = idVoice.lang;
    } else {
        utterance.lang = 'id-ID'; // Fallback attempt
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1.0; // Ensure max volume

    window.speechSynthesis.speak(utterance);
};

const playSound = (type) => {
    // Simple oscillator beeps for positive/negative feedback if speech fails/is redundant
    // For now, we rely on Speech for "Baguss!" or "Coba lagi ya"
};

// Initialization
function init() {
    loadProgress();
    setupNavigation();
    updateStarDisplay();
    mascot.init();
}


// Persistence with Daily Reset Logic
function saveProgress() {
    localStorage.setItem('cerdikids_progress', JSON.stringify(state));
}

function loadProgress() {
    const saved = localStorage.getItem('cerdikids_progress');
    if (saved) {
        const parsed = JSON.parse(saved);
        // Merge deeply to preserve structure
        state.stars = parsed.stars || 0;
        if (parsed.stats) state.stats = { ...state.stats, ...parsed.stats };
        state.badges = parsed.badges || [];

        // Settings & Time Limit
        if (parsed.parentSettings) {
            state.parentSettings = { ...state.parentSettings, ...parsed.parentSettings };
        }

        // Daily Time Reset Check
        const today = new Date().toLocaleDateString();
        if (parsed.lastPlayedDate !== today) {
            state.playTime = 0; // Reset for new day
            state.lastPlayedDate = today;
        } else {
            state.playTime = parsed.playTime || 0;
            state.lastPlayedDate = parsed.lastPlayedDate;
        }

        // Sync Sound Setting
        state.soundEnabled = state.parentSettings.sound !== false;
    } else {
        // First Time
        state.lastPlayedDate = new Date().toLocaleDateString();
    }

    // Initial checks
    applySettings();
    renderBadges();
    checkTimeLimit();
}

// Global Time Limit Check
function checkTimeLimit() {
    const limit = state.parentSettings.timeLimit || 60; // Default 60 mins

    // Soft Warning (5 mins left)
    if (state.playTime === limit - 5) {
        speak("Adik-adik, 5 menit lagi istirahat ya..");
        mascot.say("Sebentar lagi istirahat ya! 🕰️");
    }

    // Time's Up
    const overlay = document.getElementById('time-limit-overlay');
    if (state.playTime >= limit) {
        if (overlay) {
            overlay.classList.add('active');
            window.speechSynthesis.cancel(); // Stop sound
        }
    } else {
        if (overlay) overlay.classList.remove('active');
    }
}

function applySettings() {
    // Apply Game Visibility
    const cards = document.querySelectorAll('.game-card');
    cards.forEach(card => {
        const target = card.getAttribute('data-target');
        const show = state.parentSettings['show' + target.charAt(0).toUpperCase() + target.slice(1)];
        // If setting is undefined (new game), default to true 
        if (show === false) {
            card.style.display = 'none';
        } else {
            card.style.display = 'block';
        }
    });

    // Apply Sound
    state.soundEnabled = state.parentSettings.sound !== false;
}

function updateStarDisplay() {
    if (starDisplay) starDisplay.textContent = state.stars;
}

// Navigation
function navigateTo(viewName) {
    // Hide all views
    Object.values(views).forEach(el => {
        if (el) el.classList.remove('active');
    });

    // Show target view
    if (views[viewName]) {
        views[viewName].classList.add('active');
        state.currentView = viewName;

        // Init game if entering game view
        if (viewName.startsWith('game')) {
            initGame(viewName);
        }
    }
}

function setupNavigation() {
    document.querySelectorAll('[data-target]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = btn.dataset.target;
            if (target === 'dashboard') {
                showParentGate();
            } else {
                navigateTo(target);
            }
        });
    });
}

// Parent Gate
let mathAnswer = 0;
function showParentGate() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    mathAnswer = a + b;
    parentMathQuestion.textContent = `${a} + ${b} = ?`;
    parentMathInput.value = '';
    parentModal.classList.add('active');
}

function checkParentGate() {
    if (parseInt(parentMathInput.value) === mathAnswer) {
        parentModal.classList.remove('active');
        navigateTo('dashboard');
        renderDashboard();
    } else {
        alert('Jawaban salah!');
        parentModal.classList.remove('active');
    }
}

function closeParentGate() {
    parentModal.classList.remove('active');
}

// Game Logic Engine
let currentGameData = null;

function initGame(gameType) {
    const container = document.getElementById(`${gameType}-container`);
    container.innerHTML = ''; // Clear previous

    let question, options, answer;

    switch (gameType) {
        case 'gameLetters':
            showLetterGameMenu(container);
            return;

        case 'gameNumbers':
            showNumberGameMenu(container);
            return;

        case 'gameColors':
            showColorGameMenu(container);
            return;

        case 'gameShapes':
            showShapeGameMenu(container);
            return;

        case 'gameMemory':
            showMemoryGameMenu(container);
            return;

        case 'gameSinging':
            showSingingGameMenu(container);
            return;
    }

    mascot.say(question);
    speak(question);
}



// Timer Logic


function stopTimer() {
    if (state.timerInterval) {
        clearTimeout(state.timerInterval);
        state.timerInterval = null;
    }
    const bar = document.getElementById('game-timer-bar');
    if (bar) {
        const currentWidth = window.getComputedStyle(bar).width;
        bar.style.transition = 'none';
        bar.style.width = currentWidth;
    }
}

// Letter Game Levels
// Letter Game Levels
function showLetterGameMenu(container) {

    container.innerHTML = '<h2>Pilih Level Bermain</h2>';
    const grid = document.createElement('div');
    grid.className = 'game-grid';
    grid.style.marginTop = '20px';

    const levels = [
        { id: 1, title: 'Level 1: Mengenal', icon: '👀', desc: 'Belajar A-Z' },
        { id: 2, title: 'Level 2: Membaca', icon: '📖', desc: 'Suku Kata & Kata' },
        { id: 3, title: 'Level 3: Menulis', icon: '✍️', desc: 'Tebalkan Huruf' }
    ];

    levels.forEach(lvl => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <span class="game-icon">${lvl.icon}</span>
            <h3>${lvl.title}</h3>
            <p>${lvl.desc}</p>
        `;
        card.onclick = () => initLetterLevel(lvl.id, container);
        grid.appendChild(card);
    });
    container.appendChild(grid);
    speak('Pilih level permainan huruf');
}

function initLetterLevel(level, container) {
    container.innerHTML = '';

    if (level === 1) { // Level 1: Mengenal A-Z (Suara & Gambar)
        const title = document.createElement('h2');
        title.textContent = "Klik huruf untuk belajar!";
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'option-grid';

        // Use scrollable container if too many for mobile
        grid.style.maxHeight = '60vh';
        grid.style.overflowY = 'auto';

        ALPHABET.forEach(item => {
            const btn = document.createElement('div');
            btn.className = 'game-option';
            btn.textContent = item.char;
            btn.onclick = () => {
                btn.classList.add('correct');
                // Play sound: "A... Apel"
                speak(`${item.char}...... ${item.word}`);
                mascot.say(`${item.char} untuk ${item.word} ${item.icon}`);
                setTimeout(() => btn.classList.remove('correct'), 1000);
            };
            grid.appendChild(btn);
        });
        container.appendChild(grid);

    } else if (level === 2) { // Level 2: Membaca (Eja Interaktif)

        // Extended Data Pool
        // Extended Data Pool
        const allSyllables = [
            { text: 'BA', spell: 'B... A...', sound: 'Ba' },
            { text: 'BI', spell: 'B... I...', sound: 'Bi' },
            { text: 'BU', spell: 'B... U...', sound: 'Bu' },
            { text: 'BE', spell: 'B... E...', sound: 'Be' },
            { text: 'BO', spell: 'B... O...', sound: 'Bo' },

            { text: 'CA', spell: 'C... A...', sound: 'Ca' },
            { text: 'CI', spell: 'C... I...', sound: 'Ci' },
            { text: 'CU', spell: 'C... U...', sound: 'Cu' },
            { text: 'CE', spell: 'C... E...', sound: 'Ce' },
            { text: 'CO', spell: 'C... O...', sound: 'Co' },

            { text: 'DA', spell: 'D... A...', sound: 'Da' },
            { text: 'DI', spell: 'D... I...', sound: 'Di' },
            { text: 'DU', spell: 'D... U...', sound: 'Du' },
            { text: 'DE', spell: 'D... E...', sound: 'De' },
            { text: 'DO', spell: 'D... O...', sound: 'Do' },

            { text: 'KA', spell: 'K... A...', sound: 'Ka' },
            { text: 'KU', spell: 'K... U...', sound: 'Ku' },
            { text: 'MA', spell: 'M... A...', sound: 'Ma' },
            { text: 'MI', spell: 'M... I...', sound: 'Mi' },
            { text: 'PA', spell: 'P... A...', sound: 'Pa' },
            { text: 'SA', spell: 'S... A...', sound: 'Sa' },
            { text: 'YA', spell: 'Y... A...', sound: 'Ya' }
        ];

        const allWords = [
            { text: 'BUKU', spell: 'B... U... K... U...', sound: 'Buku', icon: '📚' },
            { text: 'BOLA', spell: 'B... O... L... A...', sound: 'Bola', icon: '⚽' },
            { text: 'MAMA', spell: 'M... A... M... A...', sound: 'Mama', icon: '👩' },
            { text: 'PAPA', spell: 'P... A... P... A...', sound: 'Papa', icon: '👨' },
            { text: 'KAKI', spell: 'K... A... K... I...', sound: 'Kaki', icon: '🦶' },
            { text: 'SAPI', spell: 'S... A... P... I...', sound: 'Sapi', icon: '🐄' },
            { text: 'GIGI', spell: 'G... I... G... I...', sound: 'Gigi', icon: '🦷' },
            { text: 'MATA', spell: 'M... A... T... A...', sound: 'Mata', icon: '👀' },
            { text: 'ROTI', spell: 'R... O... T... I...', sound: 'Roti', icon: '🍞' },
            { text: 'TOPI', spell: 'T... O... P... I...', sound: 'Topi', icon: '🎩' }
        ];

        // Randomize Content (Pick 4 Syllables, 4 Words)
        const syllables = allSyllables.sort(() => Math.random() - 0.5).slice(0, 4);
        const words = allWords.sort(() => Math.random() - 0.5).slice(0, 4);

        const title = document.createElement('h2');
        title.textContent = "Klik untuk mengeja!";
        container.appendChild(title);
        speak("Ayo belajar mengeja! Klik kartunya ya.");

        const wrapper = document.createElement('div');
        wrapper.className = 'reading-wrapper';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '20px';
        wrapper.style.alignItems = 'center';

        // Syllable Section
        const sylLabel = document.createElement('h3');
        sylLabel.textContent = "Eja Suku Kata";
        wrapper.appendChild(sylLabel);

        const sylGrid = document.createElement('div');
        sylGrid.className = 'option-grid';
        syllables.forEach(s => {
            const card = document.createElement('div');
            card.className = 'game-option';
            card.style.width = '100px';
            card.style.height = '100px';
            card.style.fontSize = '2rem';
            card.textContent = s.text;
            card.onclick = () => {
                card.classList.add('pop');
                // Spell then say full sound
                speak(`${s.spell} ... ${s.sound}`);
                setTimeout(() => card.classList.remove('pop'), 300);
            };
            sylGrid.appendChild(card);
        });
        wrapper.appendChild(sylGrid);

        // Word Section
        const wordLabel = document.createElement('h3');
        wordLabel.textContent = "Eja Kata";
        wrapper.appendChild(wordLabel);

        const wordGrid = document.createElement('div');
        wordGrid.className = 'option-grid';
        words.forEach(w => {
            const card = document.createElement('div');
            card.className = 'game-option';
            card.style.width = '140px';
            card.style.flexDirection = 'column';
            card.innerHTML = `<span style="font-size:1.5rem">${w.icon}</span><span>${w.text}</span>`;
            card.onclick = () => {
                card.classList.add('pop');
                // Spell then say word
                speak(`${w.spell} ... ${w.sound}`);
                mascot.say(`${w.spell} dibaca ${w.sound}`);
                setTimeout(() => card.classList.remove('pop'), 300);
            };
            wordGrid.appendChild(card);
        });
        wrapper.appendChild(wordGrid);

        // Refresh Button giving control to randomize again
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'btn-secondary';
        refreshBtn.textContent = 'Acak Kata Lain 🔄';
        refreshBtn.onclick = () => initLetterLevel(2, container);
        wrapper.appendChild(refreshBtn);

        container.appendChild(wrapper);

    } else if (level === 3) { // Level 3: Menulis (Canvas Tracing)
        initWritingGame(container);
    }
}

// New Helper for Level 3: Writing Game
function initWritingGame(container) {
    const lettersToTrace = ['A', 'B', 'C', 'D', 'E']; // Sample set
    let currentIdx = 0;

    function renderTraceLevel() {
        container.innerHTML = '';
        const char = lettersToTrace[currentIdx];

        const title = document.createElement('h2');
        title.textContent = `Ayo tulis huruf ${char}`;
        container.appendChild(title);
        speak(`Ayo tulis huruf ${char}`);

        const canvasContainer = document.createElement('div');
        canvasContainer.style.position = 'relative';
        canvasContainer.style.width = '300px';
        canvasContainer.style.height = '300px';
        canvasContainer.style.margin = '20px auto';
        canvasContainer.style.background = '#fff';
        canvasContainer.style.border = '4px wood solid'; // Simulation
        canvasContainer.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        canvasContainer.style.borderRadius = '15px';
        canvasContainer.style.touchAction = 'none'; // Prevent scrolling while drawing

        // Background Letter Reference (Gray)
        const bgLetter = document.createElement('div');
        bgLetter.textContent = char;
        bgLetter.style.position = 'absolute';
        bgLetter.style.top = '0';
        bgLetter.style.left = '0';
        bgLetter.style.width = '100%';
        bgLetter.style.height = '100%';
        bgLetter.style.display = 'flex';
        bgLetter.style.alignItems = 'center';
        bgLetter.style.justifyContent = 'center';
        bgLetter.style.fontSize = '200px';
        bgLetter.style.color = '#e0e0e0'; // Light gray for tracing
        bgLetter.style.fontFamily = 'monospace'; // Blocky font
        bgLetter.style.pointerEvents = 'none';
        canvasContainer.appendChild(bgLetter);

        // Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvasContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 20;
        ctx.strokeStyle = '#4CC9F0'; // Blue ink

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // Drawing Logic (Mouse + Touch)
        function startDraw(e) {
            isDrawing = true;
            const pos = getPos(e);
            lastX = pos.x;
            lastY = pos.y;
        }

        function draw(e) {
            if (!isDrawing) return;
            e.preventDefault();
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            lastX = pos.x;
            lastY = pos.y;
        }

        function stopDraw() {
            isDrawing = false;
        }

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDraw);
        canvas.addEventListener('mouseout', stopDraw);

        canvas.addEventListener('touchstart', startDraw);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDraw);

        container.appendChild(canvasContainer);

        // Controls
        const btnGroup = document.createElement('div');
        btnGroup.style.display = 'flex';
        btnGroup.style.gap = '10px';
        btnGroup.style.justifyContent = 'center';

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Hapus';
        clearBtn.className = 'btn-secondary';
        clearBtn.style.background = '#ff0000';
        clearBtn.onclick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Lanjut';
        nextBtn.className = 'btn-primary';
        nextBtn.onclick = () => {
            mascot.goodJob();
            speak('Bagus sekali tulisannya!');
            currentIdx++;
            if (currentIdx >= lettersToTrace.length) {
                // Done
                speak("Selamat! Kamu Jago Huruf!");
                addStar('gameLetters');

                // Badge Logic
                if (!state.badges.includes('letter_expert')) {
                    state.badges.push('letter_expert');
                    saveProgress();
                    mascot.say("Dapat lencana Ahli Huruf!");
                    renderBadges();
                }

                showLetterGameMenu(container);
            } else {
                renderTraceLevel();
            }
        };

        btnGroup.appendChild(clearBtn);
        btnGroup.appendChild(nextBtn);
        container.appendChild(btnGroup);
    }

    renderTraceLevel();
}

// Number Game Levels
function showNumberGameMenu(container) {
    container.innerHTML = '<h2>Pilih Level Bermain Angka</h2>';
    const grid = document.createElement('div');
    grid.className = 'game-grid';
    grid.style.marginTop = '20px';

    const levels = [
        { id: 1, title: 'Level 1: Mengenal', icon: '1️⃣', desc: 'Belajar 1-10' },
        { id: 2, title: 'Level 2: Menghitung', icon: '🧮', desc: 'Hitung Benda' },
        { id: 3, title: 'Level 3: Tebak', icon: '❓', desc: 'Kuis Angka' }
    ];

    levels.forEach(lvl => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <span class="game-icon">${lvl.icon}</span>
            <h3>${lvl.title}</h3>
            <p>${lvl.desc}</p>
        `;
        card.onclick = () => {
            // Reset session for Level 3
            if (lvl.id === 3) state.numberSession = { count: 0, max: 5, corrects: 0 };
            initNumberLevel(lvl.id, container);
        };
        grid.appendChild(card);
    });
    container.appendChild(grid);
    speak('Pilih level permainan angka');
}

function initNumberLevel(level, container) {

    container.innerHTML = '';

    if (level === 1) { // Mengenal 1-10
        const title = document.createElement('h2');
        title.textContent = "Klik angka untuk mendengarnya";
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'option-grid';

        NUMBERS.forEach(num => {
            const btn = document.createElement('div');
            btn.className = 'game-option';
            btn.textContent = num;
            btn.onclick = () => {
                btn.classList.add('correct');
                speak(`Angka ${num}`);
                mascot.say(`Ini angka ${num}!`);
                setTimeout(() => btn.classList.remove('correct'), 1000);
            };
            grid.appendChild(btn);
        });
        container.appendChild(grid);

    } else if (level === 2) { // Menghitung (Gambar -> Angka)
        const count = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
        const icon = COUNT_ICONS[Math.floor(Math.random() * COUNT_ICONS.length)];

        // Generate visual items
        const visualDisplay = document.createElement('div');
        visualDisplay.style.fontSize = '3rem';
        visualDisplay.style.margin = '1rem';
        visualDisplay.style.textAlign = 'center';

        let visualString = '';
        for (let i = 0; i < count; i++) visualString += icon + ' ';
        visualDisplay.textContent = visualString;

        const question = `Ada berapa ${icon}?`;

        // Options
        let opts = [count];
        while (opts.length < 3) {
            const r = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
            if (!opts.includes(r)) opts.push(r);
        }
        opts = opts.sort(() => Math.random() - 0.5);

        renderGameUI(container, question, opts, count, 'number_count', 20, visualDisplay); // 20s Timer
        speak(question);

    } else if (level === 3) { // Level 3: Campuran (Progress Bar + Reward)

        // Ensure Session Exists (fallback)
        if (!state.numberSession) state.numberSession = { count: 0, max: 5 };

        // Check Completion
        if (state.numberSession.count >= state.numberSession.max) {
            mascot.goodJob();
            speak("Luar biasa! Kamu menyelesaikan semua soal!");

            // Badge Logic
            if (state.stats.gameNumbers >= 5 && !state.badges.includes('number_pro')) {
                state.badges.push('number_pro');
                saveProgress();
                mascot.say("Dapat lencana Jago Hitung!");
                renderBadges();
            }

            container.innerHTML = `
                <div style="text-align:center; animation: pop 0.5s">
                    <div style="font-size:5rem">🏆</div>
                    <h2>Hebat!</h2>
                    <p>Kamu menjawab 5 soal dengan benar!</p>
                    <button class="btn-primary" onclick="showNumberGameMenu(document.getElementById('gameNumbers-container'))">Main Lagi</button>
                </div>
             `;
            state.numberSession = null; // Reset
            return;
        }

        // Increment Progress (Session starts at count 0, this makes it 1 for Q1)
        state.numberSession.count++;
        const currentQ = state.numberSession.count;
        const totalQ = state.numberSession.max;

        // Progress Bar UI
        const progressContainer = document.createElement('div');
        progressContainer.style.width = '100%';
        progressContainer.style.background = '#e0e0e0';
        progressContainer.style.borderRadius = '10px';
        progressContainer.style.height = '20px';
        progressContainer.style.marginBottom = '20px';
        progressContainer.style.overflow = 'hidden';

        const progressBar = document.createElement('div');
        progressBar.style.width = `${(currentQ / totalQ) * 100}%`;
        progressBar.style.height = '100%';
        progressBar.style.background = '#4CC9F0';
        progressBar.style.transition = 'width 0.5s';

        progressContainer.appendChild(progressBar);
        container.appendChild(progressContainer);

        // Randomly choose sub-game type: 0=Quiz (Mana angka X?), 1=Count (Hitung benda)
        const subType = Math.random() > 0.5 ? 'quiz' : 'count';

        if (subType === 'quiz') {
            const target = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
            const question = `Mana angka... ${target}?`;
            let opts = [target];
            while (opts.length < 3) {
                const r = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
                if (!opts.includes(r)) opts.push(r);
            }
            opts = opts.sort(() => Math.random() - 0.5);
            // Re-use number_quiz type which calls initNumberLevel(3) on success
            renderGameUI(container, question, opts, target, 'number_quiz');
            speak(question);

        } else {
            // Counting Game
            const count = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
            const icon = COUNT_ICONS[Math.floor(Math.random() * COUNT_ICONS.length)];

            const visualDisplay = document.createElement('div');
            visualDisplay.style.fontSize = '3rem';
            visualDisplay.style.margin = '1rem';
            visualDisplay.style.textAlign = 'center';
            let visualString = '';
            for (let i = 0; i < count; i++) visualString += icon + ' ';
            visualDisplay.textContent = visualString;

            const question = `Ada berapa ${icon}?`;
            let opts = [count];
            while (opts.length < 3) {
                const r = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
                if (!opts.includes(r)) opts.push(r);
            }
            opts = opts.sort(() => Math.random() - 0.5);

            // NOTE: We need to define a new type OR handle number_count to recall Level 3?
            // Existing handleAnswer for 'number_count' calls initNumberLevel(2). 
            // We need to override this behavior or add a new type 'number_mixed'.
            // Let's use 'number_quiz' type for BOTH but pass counting visual?
            // renderGameUI takes 'extraContent'.
            // If I use 'number_quiz', handleAnswer calls initNumberLevel(3). This is perfect.
            // But 'number_quiz' logic compares `parseInt(val) === correct`.

            renderGameUI(container, question, opts, count, 'number_quiz', 0, visualDisplay);
            speak(question);
        }
    }
}



// Color Game Levels
function showColorGameMenu(container) {
    container.innerHTML = '<h2>Pilih Level Warna</h2>';
    const grid = document.createElement('div');
    grid.className = 'game-grid';
    grid.style.marginTop = '20px';

    const levels = [
        { id: 1, title: 'Level 1: Mengenal', icon: '🎨', desc: 'Belajar Warna Dasar' },
        { id: 2, title: 'Level 2: Menebak', icon: '❓', desc: 'Kuis Warna' },
        { id: 3, title: 'Level 3: Mencocokkan', icon: '🖌️', desc: 'Seret & Taruh' }
    ];

    levels.forEach(lvl => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <span class="game-icon">${lvl.icon}</span>
            <h3>${lvl.title}</h3>
            <p>${lvl.desc}</p>
        `;
        card.onclick = () => initColorLevel(lvl.id, container);
        grid.appendChild(card);
    });
    container.appendChild(grid);
    speak('Pilih level permainan warna');
}

function initColorLevel(level, container) {
    container.innerHTML = '';

    if (level === 1) { // Level 1: Mengenal
        const title = document.createElement('h2');
        title.textContent = "Klik warna untuk mendengarnya";
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'option-grid';

        COLORS.forEach(col => {
            const btn = document.createElement('div');
            btn.className = 'game-option';
            btn.style.backgroundColor = col.code;
            btn.style.width = '120px'; // Larger for colors
            btn.style.height = '120px';
            btn.onclick = () => {
                btn.classList.add('pop');
                speak(`Warna ${col.name}`);
                mascot.say(`Ini warna ${col.name} ${col.object}`);
                setTimeout(() => btn.classList.remove('pop'), 300);
            };
            grid.appendChild(btn);
        });
        container.appendChild(grid);

    } else if (level === 2) { // Level 2: Menebak (Kuis)
        const target = COLORS[Math.floor(Math.random() * COLORS.length)];
        const question = `Mana warna ${target.name}?`;
        const options = COLORS.sort(() => Math.random() - 0.5);

        renderGameUI(container, question, options, target.code, 'color_quiz', 15);
        speak(question);

    } else if (level === 3) { // Level 3: Drag & Drop
        initDragDropColorGame(container);
    }
}

function initDragDropColorGame(container) {
    // Timer
    const timerHTML = document.createElement('div');
    timerHTML.className = 'timer-container active';
    timerHTML.innerHTML = '<div id="game-timer-bar" class="timer-bar"></div>';
    container.appendChild(timerHTML);

    startLevelTimer(45, () => { // 45s for drag drop
        speak("Waktu habis!");
        mascot.say("Waktu Habis!");
        setTimeout(() => initColorLevel(3, container), 2000);
    });

    const title = document.createElement('h2');
    title.textContent = "Seret warna ke benda yang sesuai!";
    title.className = 'game-question';
    container.appendChild(title);
    speak("Seret warna ke benda yang sesuai!");

    const dragContainer = document.createElement('div');
    dragContainer.className = 'drag-container';

    // Randomize Colors and Objects separately
    const deck = [...COLORS].sort(() => Math.random() - 0.5);
    const dropTargets = [...COLORS].sort(() => Math.random() - 0.5);

    // Draggable Sources (Paint buckets/Blobs)
    const sourcesDiv = document.createElement('div');
    sourcesDiv.style.display = 'flex';
    sourcesDiv.style.gap = '20px';
    sourcesDiv.style.flexDirection = 'column';

    deck.forEach(c => {
        const item = document.createElement('div');
        item.draggable = true;
        item.className = 'draggable-item';
        item.style.backgroundColor = c.code;
        item.dataset.color = c.name;

        item.ondragstart = (e) => {
            e.dataTransfer.setData('text/plain', c.name);
            e.target.style.opacity = '0.5';
        };
        item.ondragend = (e) => {
            e.target.style.opacity = '1';
        };

        sourcesDiv.appendChild(item);
    });

    // Drop Targets (Objects in grayscale filter?)
    const targetsDiv = document.createElement('div');
    targetsDiv.style.display = 'flex';
    targetsDiv.style.gap = '20px';
    targetsDiv.style.flexDirection = 'column';

    let matchedCount = 0;

    dropTargets.forEach(c => {
        const target = document.createElement('div');
        target.className = 'drop-target';
        target.textContent = c.object; // Emoji
        target.dataset.expected = c.name; // Expects "Merah" etc.
        // Make it look colorless initially maybe?
        target.style.filter = 'grayscale(100%)';

        target.ondragover = (e) => {
            e.preventDefault(); // Allow drop
            target.classList.add('drag-over');
        };

        target.ondragleave = () => {
            target.classList.remove('drag-over');
        };

        target.ondrop = (e) => {
            e.preventDefault();
            target.classList.remove('drag-over');
            const colorName = e.dataTransfer.getData('text/plain');

            if (colorName === target.dataset.expected) {
                // Correct Match
                target.style.filter = 'none'; // Reveal color
                target.style.background = '#e8f5e9';
                target.style.border = '3px solid #4CAF50';
                target.innerHTML += '✅';
                speak('Benar!');
                // Hide source
                const source = sourcesDiv.querySelector(`[data-color="${colorName}"]`);
                if (source) source.style.visibility = 'hidden';

                matchedCount++;
                if (matchedCount === COLORS.length) {
                    stopTimer();
                    mascot.goodJob();
                    speak("Kamu Master Warna!");
                    addStar('gameColors');
                    setTimeout(() => initColorLevel(3, container), 3000);
                }
            } else {
                speak('Kurang tepat..');
                mascot.say('Coba lagi ya');
            }
        };

        targetsDiv.appendChild(target);
    });

    dragContainer.appendChild(sourcesDiv);
    dragContainer.appendChild(targetsDiv);
    container.appendChild(dragContainer);
}





// Shape Game Levels
function showShapeGameMenu(container) {
    container.innerHTML = '<h2>Pilih Level Bentuk</h2>';
    const grid = document.createElement('div');
    grid.className = 'game-grid';
    grid.style.marginTop = '20px';

    const levels = [
        { id: 1, title: 'Level 1: Mengenal', icon: '👀', desc: 'Belajar Bentuk' },
        { id: 2, title: 'Level 2: Memilih', icon: '☝️', desc: 'Kuis Bentuk' },
        { id: 3, title: 'Level 3: Puzzle', icon: '🧩', desc: 'Susun Bentuk' }
    ];

    levels.forEach(lvl => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <span class="game-icon">${lvl.icon}</span>
            <h3>${lvl.title}</h3>
            <p>${lvl.desc}</p>
        `;
        card.onclick = () => initShapeLevel(lvl.id, container);
        grid.appendChild(card);
    });
    container.appendChild(grid);
    speak('Pilih level permainan bentuk');
}

function initShapeLevel(level, container) {
    container.innerHTML = '';

    if (level === 1) { // Level 1: Mengenal
        const title = document.createElement('h2');
        title.textContent = "Klik bentuk untuk tahu namanya";
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'option-grid';

        SHAPES.forEach(shape => {
            const btn = document.createElement('div');
            btn.className = 'game-option';
            btn.innerHTML = `<div style="font-size: 3rem;">${shape.icon}</div>`;
            btn.onclick = () => {
                btn.classList.add('pop');
                speak(`Ini bentuk ${shape.name}`);
                mascot.say(`Ini adalah ${shape.name}`);
                setTimeout(() => btn.classList.remove('pop'), 300);
            };
            grid.appendChild(btn);
        });
        container.appendChild(grid);

    } else if (level === 2) { // Level 2: Kuis
        const target = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const question = `Mana bentuk ${target.name}?`;

        let opts = [target];
        while (opts.length < 3) {
            const r = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            if (!opts.includes(r)) opts.push(r);
        }
        opts = opts.sort(() => Math.random() - 0.5);

        renderGameUI(container, question, opts, target.name, 'shape_quiz', 15);
        speak(question);

    } else if (level === 3) { // Level 3: Puzzle
        initShapePuzzle(container);
    }
}

function initShapePuzzle(container) {
    // Timer
    const timerHTML = document.createElement('div');
    timerHTML.className = 'timer-container active';
    timerHTML.innerHTML = '<div id="game-timer-bar" class="timer-bar"></div>';
    container.appendChild(timerHTML);

    startLevelTimer(60, () => {
        speak("Waktu habis!");
        mascot.say("Waktu Habis!");
        setTimeout(() => initShapeLevel(3, container), 2000);
    });

    // Multiple Puzzle Templates for Variety
    const puzzles = [
        {
            name: 'Rumah',
            slots: [
                { type: 'triangle', expected: 'Segitiga', icon: '🔺', top: '20px', left: 'auto' }, // Centered logic via flex
                { type: 'square', expected: 'Persegi', icon: '🟦', top: '100px', left: 'auto' }
            ]
        },
        {
            name: 'Es Krim',
            slots: [
                { type: 'circle', expected: 'Lingkaran', icon: '🔴', top: '10px', left: 'auto' },
                { type: 'triangle', expected: 'Segitiga', icon: '🔻', top: '90px', left: 'auto', transform: 'rotate(180deg)' } // Inverted triangle
            ]
        },
        {
            name: 'Pohon',
            slots: [
                { type: 'circle', expected: 'Lingkaran', icon: '🌳', top: '10px', left: 'auto' }, // Green circle
                { type: 'rectangle', expected: 'Persegi Panjang', icon: '🟫', top: '90px', left: 'auto' } // Brown rect
            ]
        },
        {
            name: 'Lampu',
            slots: [
                { type: 'circle', expected: 'Lingkaran', icon: '💡', top: '10px', left: 'auto' }, // Lightbulb
                { type: 'rectangle', expected: 'Persegi Panjang', icon: '⬛', top: '90px', left: 'auto' } // Base
            ]
        },
        {
            name: 'Permen',
            slots: [
                { type: 'circle', expected: 'Lingkaran', icon: '🍭', top: '10px', left: 'auto' }, // Candy
                { type: 'rectangle', expected: 'Persegi Panjang', icon: '⬜', top: '90px', left: 'auto' } // Stick
            ]
        }
    ];

    const currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

    const title = document.createElement('h2');
    title.textContent = `Ayo susun bentuk ${currentPuzzle.name}!`;
    container.appendChild(title);
    speak(`Ayo susun bentuk menjadi ${currentPuzzle.name}!`);

    const puzzleBoard = document.createElement('div');
    puzzleBoard.className = 'puzzle-board';

    // Target Container
    const targetDiv = document.createElement('div');
    targetDiv.className = 'puzzle-target-container';
    targetDiv.style.flexDirection = 'column';
    targetDiv.style.alignItems = 'center';
    targetDiv.style.justifyContent = 'center';
    targetDiv.style.position = 'relative';

    // Render Slots
    currentPuzzle.slots.forEach(s => {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.dataset.expected = s.expected;
        slot.style.width = '100px';
        slot.style.height = '100px';

        // Visual hint (faint)
        slot.innerHTML = `<span style="opacity:0.2; font-size:3rem; transform:${s.transform || 'none'}">${s.icon}</span>`;
        if (s.expected === 'Persegi Panjang') {
            slot.style.width = '60px';
            slot.style.height = '120px';
        }

        slot.ondragover = (e) => {
            e.preventDefault();
            if (!slot.classList.contains('filled')) slot.classList.add('active');
        };
        slot.ondragleave = () => slot.classList.remove('active');
        slot.ondrop = (e) => {
            e.preventDefault();
            slot.classList.remove('active');
            const droppedName = e.dataTransfer.getData('text/plain');

            if (droppedName === slot.dataset.expected) {
                // SUCCESS: Use the TEMPLATE ICON (s.icon) to ensure the visual matches the blueprint
                // This fixes the 'Black Bar' issue for trees and 'Red Cone' vs 'Inverted Triangle' issues.
                slot.innerHTML = `<span style="font-size:3rem; transform:${s.transform || 'none'}">${s.icon}</span>`;
                slot.classList.add('filled');
                speak('Pas!');
                checkPuzzleCompletion();
            } else {
                speak('Belum pas..');
            }
        };

        targetDiv.appendChild(slot);
    });

    // Pieces Pool (Correct + Distractors)
    const piecesDiv = document.createElement('div');
    piecesDiv.className = 'puzzle-pieces';

    // Get needed pieces logic
    const neededShapes = currentPuzzle.slots.map(s => {
        return SHAPES.find(sh => sh.name === s.expected);
    });

    // Add random distractors logic
    let pool = [...neededShapes];
    while (pool.length < 5) {
        const rand = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        if (!pool.includes(rand) && rand) pool.push(rand);
    }

    pool = pool.sort(() => Math.random() - 0.5);

    pool.forEach(p => {
        if (!p) return;
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.draggable = true;
        piece.textContent = p.icon;

        piece.ondragstart = (e) => {
            e.dataTransfer.setData('text/plain', p.name);
            e.dataTransfer.setData('icon', p.icon);
        };

        piecesDiv.appendChild(piece);
    });

    function checkPuzzleCompletion() {
        const filled = targetDiv.querySelectorAll('.filled').length;
        if (filled === currentPuzzle.slots.length) {
            stopTimer();
            mascot.goodJob();
            speak(`Hore! ${currentPuzzle.name} jadi!`);
            addStar('gameShapes');
            setTimeout(() => initShapeLevel(3, container), 3000);
        }
    }

    puzzleBoard.appendChild(targetDiv);
    puzzleBoard.appendChild(piecesDiv);
    container.appendChild(puzzleBoard);
}


// Memory Game Logic
// Memory Game Menu
function showMemoryGameMenu(container) {
    container.innerHTML = '<h2>Pilih Level Memori</h2>';
    const grid = document.createElement('div');
    grid.className = 'game-grid';
    grid.style.marginTop = '20px';

    const levels = [
        { id: 1, title: 'Level 1: Pemula', icon: '👶', desc: 'Ingat 2 Kartu' },
        { id: 2, title: 'Level 2: Jagoan', icon: '😎', desc: 'Ingat 4-6 Kartu' },
        { id: 3, title: 'Level 3: Master', icon: '🧠', desc: 'Tantangan Waktu' }
    ];

    levels.forEach(lvl => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <span class="game-icon">${lvl.icon}</span>
            <h3>${lvl.title}</h3>
            <p>${lvl.desc}</p>
        `;
        card.onclick = () => initMemoryLevel(lvl.id, container);
        grid.appendChild(card);
    });
    container.appendChild(grid);
    speak('Pilih level permainan memori');
}

function initMemoryLevel(level, container) {
    container.innerHTML = '';

    // Config based on level
    let pairCount = 2; // Level 1 default (2 Cards total? No "2 cards"=1 pair is too few? User said "mengingat 2 kartu". Usually means 1 pair. Or 2 pairs.)
    // Interpreting "mengingat 2 kartu" as 2 pairs (4 cards) for better gameplay, or literally 2 cards (1 pair). 1 pair is trivial.
    // Let's do: Level 1 = 2 Pairs (4 Cards). Level 2 = 4-6 Pairs (8-12 Cards). Level 3 = Time limit.

    // Actually user said "mengingat 2 kartu" (Remember 2 cards). If it means 1 pair, it's very easy.
    // I will set Level 1 to 2 Pairs (4 cards total) to be a "game". 
    // Level 2 to 4-6 Pairs.

    let timeLimit = 60;

    if (level === 1) {
        pairCount = 2; // 4 Cards
    } else if (level === 2) {
        pairCount = Math.floor(Math.random() * 3) + 4; // 4, 5, or 6 pairs
        timeLimit = 90;
    } else if (level === 3) {
        pairCount = 6; // 12 Cards fixed for Master
        timeLimit = 45; // Harder time limit
    }

    // Timer
    const timerHTML = document.createElement('div');
    timerHTML.className = 'timer-container active';
    timerHTML.innerHTML = '<div id="game-timer-bar" class="timer-bar"></div>';
    container.appendChild(timerHTML);

    startLevelTimer(timeLimit, () => {
        speak("Waktu habis!");
        mascot.say("Waktu Habis!");
        setTimeout(() => initMemoryLevel(level, container), 2000); // Restart level
    });

    const title = document.createElement('h2');
    title.textContent = "Temukan pasangannya!";
    container.appendChild(title);

    // Grid Setup
    const grid = document.createElement('div');
    grid.className = 'memory-grid';
    // Style grid columns
    // 2 pairs = 4 cards (2x2)
    // 4 pairs = 8 cards (4x2 or 2x4)
    // 6 pairs = 12 cards (3x4 or 4x3)

    if (pairCount <= 2) {
        grid.style.gridTemplateColumns = 'repeat(2, 120px)';
        grid.style.maxWidth = '300px';
    } else if (pairCount <= 4) {
        grid.style.gridTemplateColumns = 'repeat(4, 100px)';
        grid.style.maxWidth = '500px';
    } else {
        grid.style.gridTemplateColumns = 'repeat(4, 90px)'; // Density
        grid.style.maxWidth = '450px';
    }
    grid.style.margin = '20px auto';

    // Generate Cards
    // Pool of emojis
    const emojies = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'];
    // Shuffle pool and take needed amount
    const selectedEmojis = emojies.sort(() => Math.random() - 0.5).slice(0, pairCount);

    // Create pairs
    let cards = [...selectedEmojis, ...selectedEmojis];
    cards = cards.sort(() => Math.random() - 0.5);

    let firstCard = null;
    let lockBoard = false;
    let matchesFound = 0;

    // Card Render
    cards.forEach(emoji => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `
            <div class="front">❓</div>
            <div class="back">${emoji}</div>
        `;

        card.onclick = () => {
            if (lockBoard) return;
            if (card === firstCard) return;
            // if already matched or flipped implicit checks via class
            if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

            card.classList.add('flipped');

            if (!firstCard) {
                firstCard = card;
                return;
            }

            // Second card clicked
            checkMatch(card);
        };

        grid.appendChild(card);
    });

    function checkMatch(secondCard) {
        let isMatch = firstCard.querySelector('.back').textContent === secondCard.querySelector('.back').textContent;

        if (isMatch) {
            disableCards(secondCard);
            speak('Hebat!');
            matchesFound++;
            if (matchesFound === pairCount) {
                stopTimer();
                mascot.goodJob();
                speak('Semua pasangan ditemukan!');
                addStar('gameMemory');

                // Show completion modal or restart
                setTimeout(() => {
                    // Check for Badge Otak Cerdas Logic
                    if (state.stats.gameMemory >= 10 && !state.badges.includes('brain_master')) {
                        state.badges.push('brain_master');
                        saveProgress();
                        mascot.say("Wow! Kamu dapat Lencana Otak Cerdas!");
                        speak("Selamat! Kamu dapat lencana Otak Cerdas");
                        renderBadges();
                    }
                    // Ask to play again or go back menu? For now restart same level for practice
                    // User requested random levels? "setiap level akan di buat random"
                    // We re-call init, it generates new random set.
                    initMemoryLevel(level, container);
                }, 3000);
            }
        } else {
            unflipCards(secondCard);
        }
    }

    function disableCards(secondCard) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard = null;
    }

    function unflipCards(secondCard) {
        lockBoard = true;
        speak('Yah.. beda..');
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard = null;
            lockBoard = false;
        }, 1000);
    }

    container.appendChild(grid);

    // Level 3 Special: Preview Challenge
    if (level === 3) {
        lockBoard = true;
        speak("Hafalkan gambarnya dulu ya...");
        // Flip all cards temporarily
        const allCards = grid.querySelectorAll('.memory-card');
        allCards.forEach(c => c.classList.add('flipped'));

        setTimeout(() => {
            allCards.forEach(c => c.classList.remove('flipped'));
            lockBoard = false;
            speak("Mulai cari!");
        }, 3000); // 3s preview
    }
}

function renderGameUI(container, questionText, options, correctAnswer, type, timerDuration, extraContent) {
    container.innerHTML = ''; // Ensure clear for simpler appending

    // 1. Timer (if requested)
    if (timerDuration) {
        const timerDiv = document.createElement('div');
        timerDiv.className = 'timer-container active';
        timerDiv.innerHTML = '<div id="game-timer-bar" class="timer-bar"></div>';
        container.appendChild(timerDiv);

        startLevelTimer(timerDuration, () => {
            speak("Waktu habis!");
            mascot.say("Waktu Abis! 🐢");
            // Highlight correct answer
            document.querySelectorAll('.game-option').forEach(btn => {
                btn.onclick = null; // Disable clicks
                if (
                    (type === 'image_match' && btn.dataset.val === correctAnswer.char) ||
                    (type === 'text_match' && btn.dataset.val === correctAnswer.char) ||
                    (type === 'number_count' && parseInt(btn.dataset.val) === correctAnswer) ||
                    (type === 'number_quiz' && parseInt(btn.dataset.val) === correctAnswer) ||
                    (type === 'color_quiz' && btn.dataset.val === correctAnswer)
                ) {
                    btn.classList.add('correct');
                } else {
                    btn.style.opacity = 0.5;
                }
            });

            // Move next after delay
            setTimeout(() => {
                if (type.includes('Letter')) showLetterGameMenu(document.getElementById('gameLetters-container'));
                else if (type.includes('Number')) showNumberGameMenu(document.getElementById('gameNumbers-container'));
                else initGame(state.currentView);
            }, 3000);
        });
    }

    const questionEl = document.createElement('h2');
    questionEl.textContent = questionText;
    questionEl.className = 'game-question';

    container.appendChild(questionEl);

    // Insert extra content (like counting images) if provided
    if (extraContent) {
        container.appendChild(extraContent);
    }

    const grid = document.createElement('div');

    grid.className = 'option-grid';

    options.forEach(opt => {
        const btn = document.createElement('div');
        btn.className = 'game-option';

        if (type === 'text') {
            btn.textContent = opt;
            btn.dataset.val = opt;
        } else if (type === 'color_quiz') {
            btn.style.backgroundColor = opt.code;
            btn.dataset.val = opt.code;
        } else if (type === 'shape_quiz') {

            btn.textContent = opt.icon;
            btn.dataset.val = opt.name;
        } else if (type === 'image_match') {

            btn.textContent = opt.icon; // Use icon/emoji as image
            btn.dataset.val = opt.char;
        } else if (type === 'text_match') {
            btn.textContent = opt.char;
            btn.dataset.val = opt.char;
        } else if (type === 'number_count' || type === 'number_quiz') {
            btn.textContent = opt;
            btn.dataset.val = opt;
        }


        btn.onclick = () => handleAnswer(btn, opt, correctAnswer, type);
        grid.appendChild(btn);
    });

    container.appendChild(grid);
}



function handleAnswer(btnElement, selectedValue, correctValue, type) {
    let isCorrect = false;

    if (type === 'color') {
        isCorrect = (selectedValue.code === correctValue);
    } else if (type === 'image_match' || type === 'text_match') {
        isCorrect = (selectedValue.char === correctValue.char);
    } else if (type === 'number_count' || type === 'number_quiz') {
        isCorrect = (parseInt(selectedValue) === parseInt(correctValue));
    } else if (type === 'color_quiz') {
        isCorrect = (selectedValue.code === correctValue);
    } else if (type === 'shape_quiz') {
        isCorrect = (selectedValue.name === correctValue);
    } else {

        isCorrect = (selectedValue === correctValue);
    }


    if (isCorrect) {
        stopTimer();
        btnElement.classList.add('correct');
        speak('Hebat!');

        mascot.goodJob();
        addStar(state.currentView);

        // Handling next round logic for specific levels
        if (type === 'image_match') {
            setTimeout(() => initLetterLevel(2, document.getElementById('gameLetters-container')), 1500);
        } else if (type === 'text_match') {
            setTimeout(() => initLetterLevel(3, document.getElementById('gameLetters-container')), 1500);
        } else if (type === 'number_count') {
            setTimeout(() => initNumberLevel(2, document.getElementById('gameNumbers-container')), 1500);
        } else if (type === 'number_quiz') {
            setTimeout(() => initNumberLevel(3, document.getElementById('gameNumbers-container')), 1500);
        } else if (type === 'color_quiz') {
            setTimeout(() => initColorLevel(2, document.getElementById('gameColors-container')), 1500);
        } else if (type === 'shape_quiz') {
            setTimeout(() => initShapeLevel(2, document.getElementById('gameShapes-container')), 1500);
        } else {
            setTimeout(() => {

                initGame(state.currentView); // Next round for normal games
            }, 1500);
        }

    } else {
        btnElement.classList.add('wrong');
        speak('Coba lagi ya');
        setTimeout(() => btnElement.classList.remove('wrong'), 500);
    }
}

function addStar(gameType) {
    state.stars++;
    if (gameType && state.stats[gameType] !== undefined) {
        state.stats[gameType]++;
    }
    checkBadges();

    saveProgress();
    updateStarDisplay();
    // Animation effect
    const star = document.querySelector('.star-icon');
    star.style.transform = 'scale(1.5) rotate(20deg)';
    setTimeout(() => star.style.transform = '', 300);
}

function renderDashboard() {
    const dashContainer = document.getElementById('dashboard-content');

    // Calculate stats
    const limit = state.parentSettings.timeLimit || 60;
    const progressPercent = Math.min((state.playTime / limit) * 100, 100);

    dashContainer.innerHTML = `
        <div class="dashboard-grid">
            <!-- Stats Card -->
            <div class="dash-card stats-card">
                <h3>📊 Aktivitas Hari Ini</h3>
                <div class="time-stat">
                    <div style="font-size:2.5rem; color:var(--primary-blue)">${state.playTime} <span style="font-size:1rem">menit</span></div>
                    <div style="font-size:0.9rem; color:#888">dari batas ${limit} menit</div>
                    <div class="progress-bar-bg" style="margin-top:10px; height:10px; background:#eee; border-radius:5px; overflow:hidden">
                        <div style="width:${progressPercent}%; height:100%; background:${progressPercent > 90 ? 'red' : 'var(--primary-green)'}"></div>
                    </div>
                </div>
            </div>

            <!-- Settings Card -->
            <div class="dash-card settings-card">
                <h3>⚙️ Pengaturan Orang Tua</h3>
                
                <div class="setting-item">
                    <label>Batas Waktu Harian (menit)</label>
                    <input type="range" min="10" max="180" step="10" value="${limit}" onchange="updateSetting('timeLimit', this.value)">
                    <span style="font-weight:bold; color:var(--primary-pink)">${limit} Menit</span>
                </div>

                <div class="setting-item">
                    <label>Suara Aplikasi</label>
                    <button class="toggle-btn ${state.parentSettings.sound !== false ? 'active' : ''}" onclick="toggleSetting('sound')">
                        ${state.parentSettings.sound !== false ? 'ON 🔊' : 'OFF 🔇'}
                    </button>
                </div>
            </div>

            <!-- Curriculum Visibility -->
            <div class="dash-card curriculum-card">
                <h3>📚 Materi Belajar</h3>
                <div class="toggles-grid">
                    <button class="toggle-pill ${state.parentSettings.showGameLetters !== false ? 'active' : ''}" onclick="toggleSetting('showGameLetters')">Huruf</button>
                    <button class="toggle-pill ${state.parentSettings.showGameNumbers !== false ? 'active' : ''}" onclick="toggleSetting('showGameNumbers')">Angka</button>
                    <button class="toggle-pill ${state.parentSettings.showGameColors !== false ? 'active' : ''}" onclick="toggleSetting('showGameColors')">Warna</button>
                    <button class="toggle-pill ${state.parentSettings.showGameShapes !== false ? 'active' : ''}" onclick="toggleSetting('showGameShapes')">Bentuk</button>
                    <button class="toggle-pill ${state.parentSettings.showGameMemory !== false ? 'active' : ''}" onclick="toggleSetting('showGameMemory')">Memori</button>
                    <button class="toggle-pill ${state.parentSettings.showGameSinging !== false ? 'active' : ''}" onclick="toggleSetting('showGameSinging')">Menyanyi</button>
                </div>
            </div>
        </div>

        <button onclick="localStorage.clear(); location.reload()" class="btn-secondary" style="background:#ef476f; margin-top:20px; width:100%">Reset Semua Data</button>
    `;
    renderBadges();
}

// Helper for Dashboard
window.updateSetting = (key, value) => {
    state.parentSettings[key] = parseInt(value);
    saveProgress();
    checkTimeLimit();
    renderDashboard(); // Re-render to show updates
};

window.toggleSetting = (key) => {
    if (state.parentSettings[key] === undefined) state.parentSettings[key] = true;
    state.parentSettings[key] = !state.parentSettings[key];
    saveProgress();
    applySettings();
    renderDashboard();
};

function checkBadges() {
    let newBadge = false;
    BADGES_CONFIG.forEach(badge => {
        if (!state.badges.includes(badge.id)) {
            if (state.stats[badge.reqGame] >= badge.reqCount) {
                state.badges.push(badge.id);
                newBadge = true;
                mascot.say(`Wow! Kamu dapat lencana ${badge.name}!`);
                speak(`Selamat! Kamu dapat lencana ${badge.name}`);
            }
        }
    });
    if (newBadge) saveProgress();
}

function renderBadges() {
    const grid = document.getElementById('badge-grid');
    if (!grid) return;
    grid.innerHTML = '';
    BADGES_CONFIG.forEach(badge => {
        const isUnlocked = state.badges.includes(badge.id);
        const div = document.createElement('div');
        div.className = `badge ${isUnlocked ? 'unlocked' : ''}`;
        div.innerHTML = `
            <span class="badge-icon">${badge.icon}</span>
            <div class="badge-name">${badge.name}</div>
        `;
        grid.appendChild(div);
    });
}

// Mascot Controller
const mascot = {
    el: document.getElementById('mascot-container'),
    bubble: document.getElementById('mascot-bubble'),
    init() {
        this.el = document.getElementById('mascot-container');
        this.bubble = document.getElementById('mascot-bubble');
        setInterval(() => this.idle(), 10000);
    },
    say(text) {
        if (!this.bubble) return;
        this.bubble.textContent = text;
        this.bubble.classList.add('active');
        setTimeout(() => this.bubble.classList.remove('active'), 4000);
    },
    goodJob() {
        this.say('Hore! Kamu hebat! 🌟');
        this.el.querySelector('.mascot-body').style.animation = 'bounce 0.5s infinite';
        setTimeout(() => this.el.querySelector('.mascot-body').style.animation = 'bounce 3s infinite', 2000);
    },
    idle() {
        // Random idle chatter
        const messages = ['Ayo main lagi!', 'Aku suka belajar', 'Semangat!', 'Kamu anak pintar'];
        if (Math.random() > 0.7) {
            this.say(messages[Math.floor(Math.random() * messages.length)]);
        }
    }
};


function startLevelTimer(durationSeconds, onComplete) {
    stopTimer(); // Clear existing

    // Slight delay to allow DOM insertion before finding element
    setTimeout(() => {
        const bar = document.getElementById('game-timer-bar');
        if (!bar) return;

        // Reset state
        bar.style.transition = 'none';
        bar.style.width = '100%';

        // Force reflow
        bar.offsetWidth;

        // Start animation
        bar.style.transition = `width ${durationSeconds}s linear`;
        bar.style.width = '0%';

        // Start logic timeout
        state.timerInterval = setTimeout(() => {
            onComplete();
        }, durationSeconds * 1000);
    }, 50);
}

// Global scope exposures for inline HTML event handlers
window.checkParentGate = checkParentGate;

window.closeParentGate = closeParentGate;

// Init
window.addEventListener('load', init);


// Singing Game Levels
function showSingingGameMenu(container) {
    container.innerHTML = '<h2>Pilih Lagu & Level</h2>';
    const grid = document.createElement('div');
    grid.className = 'game-grid';
    grid.style.marginTop = '20px';

    const levels = [
        { id: 1, title: 'Level 1: Nonton', icon: '🎧', desc: 'Dengar & Lihat' },
        { id: 2, title: 'Level 2: Karaoke', icon: '🎤', desc: 'Ikuti Irama' },
        { id: 3, title: 'Level 3: Kuis', icon: '❓', desc: 'Tebak Lagu' }
    ];

    levels.forEach(lvl => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <span class="game-icon">${lvl.icon}</span>
            <h3>${lvl.title}</h3>
            <p>${lvl.desc}</p>
        `;
        card.onclick = () => initSingingLevel(lvl.id, container);
        grid.appendChild(card);
    });
    container.appendChild(grid);
    speak('Ayo pilih level bernyanyi');
}

function initSingingLevel(level, container) {
    container.innerHTML = '';

    // Song Data (Expanded Library)
    const SONG_LIBRARY = [
        {
            title: "Balonku Ada Lima 🎈",
            lyrics: [
                { text: "Balonku ada lima", duration: 2000 },
                { text: "Rupa-rupa warnanya", duration: 2000 },
                { text: "Hijau kuning kelabu", duration: 2000 },
                { text: "Merah muda dan biru", duration: 2000 },
                { text: "Meletus balon hijau.. DOR!", duration: 2500 },
                { text: "Hatiku sangat kacau", duration: 2000 },
                { text: "Balonku tinggal empat", duration: 2000 },
                { text: "Kupegang erat-erat", duration: 2000 }
            ],
            quiz: {
                question: "Apa warna balon yang meletus?",
                options: ["Merah", "Hijau", "Biru"],
                correct: "Hijau",
                feedback: "Benar! Balon Hijau meletus.. DOR!"
            }
        },
        {
            title: "Pelangi-Pelangi 🌈",
            lyrics: [
                { text: "Pelangi-pelangi", duration: 2000 },
                { text: "Alangkah indahmu", duration: 2000 },
                { text: "Merah kuning hijau", duration: 2000 },
                { text: "Di langit yang biru", duration: 2000 },
                { text: "Pelukismu agung", duration: 2000 },
                { text: "Siapa gerangan", duration: 2000 },
                { text: "Pelangi-pelangi", duration: 2000 },
                { text: "Ciptaan Tuhan", duration: 2000 }
            ],
            quiz: {
                question: "Apa warna pelangi di lagu tadi?",
                options: ["Hitam Putih", "Merah Kuning Hijau", "Ungu Coklat"],
                correct: "Merah Kuning Hijau",
                feedback: "Betul! Merah, Kuning, Hijau!"
            }
        },
        {
            title: "Bintang Kecil ✨",
            lyrics: [
                { text: "Bintang kecil", duration: 2000 },
                { text: "Di langit yang biru", duration: 2000 },
                { text: "Amat banyak", duration: 2000 },
                { text: "Menghias angkasa", duration: 2000 },
                { text: "Aku ingin", duration: 2000 },
                { text: "Terbang dan menari", duration: 2000 },
                { text: "Jauh tinggi", duration: 2000 },
                { text: "Ke tempat kau berada", duration: 3000 }
            ],
            quiz: {
                question: "Bintang kecil adanya di mana?",
                options: ["Di Laut", "Di Tanah", "Di Langit"],
                correct: "Di Langit",
                feedback: "Tepat sekali! Bintang ada di langit."
            }
        },
        {
            title: "Satu-Satu Aku Sayang Ibu 👪",
            lyrics: [
                { text: "Satu-satu", duration: 1500 },
                { text: "Aku sayang ibu", duration: 1500 },
                { text: "Dua-dua", duration: 1500 },
                { text: "Juga sayang ayah", duration: 1500 },
                { text: "Tiga-tiga", duration: 1500 },
                { text: "Sayang adik kakak", duration: 1500 },
                { text: "Satu dua tiga", duration: 1500 },
                { text: "Sayang semuanya", duration: 2000 }
            ],
            quiz: {
                question: "Siapa yang disayang nomor satu?",
                options: ["Ayah", "Ibu", "Kakak"],
                correct: "Ibu",
                feedback: "Benar! Satu-satu aku sayang Ibu."
            }
        },
        {
            title: "A B C 🔤",
            lyrics: [
                { text: "A B C D E F G", duration: 2000 },
                { text: "H I J K L M N", duration: 2000 },
                { text: "O P Q R S T U", duration: 2000 },
                { text: "V W X Y Z", duration: 2000 },
                { text: "Sekarang aku tahu", duration: 2000 },
                { text: "Apa itu A B C", duration: 2000 }
            ],
            quiz: {
                question: "Huruf apa setelah A?",
                options: ["B", "C", "D"],
                correct: "B",
                feedback: "Benar! Setelah A adalah B."
            }
        },
        {
            title: "Sepuluh Anak Ayam 🐣",
            lyrics: [
                { text: "Tek kotek kotek kotek", duration: 2000 },
                { text: "Anak ayam turun berkotek", duration: 2000 },
                { text: "Anak ayam turunlah sepuluh", duration: 2000 },
                { text: "Mati satu tinggallah sembilan", duration: 2000 },
                { text: "Anak ayam turunlah sembilan", duration: 2000 },
                { text: "Mati satu tinggallah delapan", duration: 2000 }
            ],
            quiz: {
                question: "Suara anak ayam bagaimana?",
                options: ["Meong", "Tek kotek", "Mbek"],
                correct: "Tek kotek",
                feedback: "Betul! Tek kotek kotek kotek."
            }
        },
        {
            title: "Topi Saya Bundar 🎩",
            lyrics: [
                { text: "Topi saya bundar", duration: 2000 },
                { text: "Bundar topi saya", duration: 2000 },
                { text: "Kalau tidak bundar", duration: 2000 },
                { text: "Bukan topi saya", duration: 2000 }
            ],
            quiz: {
                question: "Bagaimana bentuk topi saya?",
                options: ["Kotak", "Segitiga", "Bundar"],
                correct: "Bundar",
                feedback: "Tepat! Topi saya bundar."
            }
        },
        {
            title: "Naik Kereta Api 🚂",
            lyrics: [
                { text: "Naik kereta api ... tut ... tut ... tut", duration: 2500 },
                { text: "Siapa hendak turut", duration: 2000 },
                { text: "Ke Bandung ... Surabaya", duration: 2000 },
                { text: "Bolehlah naik dengan percuma", duration: 2000 },
                { text: "Ayo kawanku lekas naik", duration: 2000 },
                { text: "Keretaku tak berhenti lama", duration: 2000 }
            ],
            quiz: {
                question: "Kereta api bunyinya bagaimana?",
                options: ["Din din", "Tut tut tut", "Brem brem"],
                correct: "Tut tut tut",
                feedback: "Benar! Tut... tut... tut..."
            }
        },
        {
            title: "Cicak di Dinding 🦎",
            lyrics: [
                { text: "Cicak-cicak di dinding", duration: 2000 },
                { text: "Diam-diam merayap", duration: 2000 },
                { text: "Datang seekor nyamuk", duration: 2000 },
                { text: "Hap ... lalu ditangkap", duration: 2000 }
            ],
            quiz: {
                question: "Apa yang ditangkap cicak?",
                options: ["Nyamuk", "Lalat", "Semut"],
                correct: "Nyamuk",
                feedback: "Hap! Lalu ditangkap nyamuknya."
            }
        },
        {
            title: "Bangun Tidur 🛌",
            lyrics: [
                { text: "Bangun tidur kuterus mandi", duration: 2000 },
                { text: "Tidak lupa menggosok gigi", duration: 2000 },
                { text: "Habis mandi kutolong ibu", duration: 2000 },
                { text: "Membersihkan tempat tidurku", duration: 2000 }
            ],
            quiz: {
                question: "Habis mandi tolong siapa?",
                options: ["Ayah", "Ibu", "Adik"],
                correct: "Ibu",
                feedback: "Pintar! Habis mandi kutolong Ibu."
            }
        }
    ];

    // Pick Random Song
    const selectedSong = SONG_LIBRARY[Math.floor(Math.random() * SONG_LIBRARY.length)];
    const songLyrics = selectedSong.lyrics;

    if (level === 1) { // Level 1: Nonton & Dengar
        const title = document.createElement('h2');
        title.textContent = selectedSong.title;
        container.appendChild(title);

        const lyricBox = document.createElement('div');
        lyricBox.style.fontSize = '2rem';
        lyricBox.style.margin = '40px';
        lyricBox.style.minHeight = '100px';
        lyricBox.style.color = '#4CC9F0';
        lyricBox.style.fontWeight = 'bold';
        lyricBox.textContent = "Siap mendengarkan?";
        container.appendChild(lyricBox);

        const playBtn = document.createElement('button');
        playBtn.className = 'btn-primary';
        playBtn.textContent = 'Mulai Lagu ▶️';
        container.appendChild(playBtn);

        playBtn.onclick = () => {
            playBtn.style.display = 'none';
            let i = 0;

            function playNextLine() {
                if (i >= songLyrics.length) {
                    mascot.goodJob();
                    speak("Lagu selesai! Lanjut lagu berikutnya!");
                    setTimeout(() => initSingingLevel(level, container), 3000);
                    return;
                }

                const line = songLyrics[i];
                lyricBox.textContent = line.text;
                lyricBox.style.animation = 'none';
                lyricBox.offsetHeight; /* trigger reflow */
                lyricBox.style.animation = 'bounce 0.5s';

                speak(line.text);
                mascot.el.querySelector('.mascot-body').style.animation = 'bounce 1s';

                setTimeout(() => {
                    i++;
                    playNextLine();
                }, line.duration);
            }
            playNextLine();
        };

    } else if (level === 2) { // Level 2: Karaoke / Visual Rhythm
        const title = document.createElement('h2');
        title.textContent = `Karaoke: ${selectedSong.title}`;
        container.appendChild(title);
        speak("Ayo ikuti iramanya!");

        // Visual Grid (Visualizer)
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
        grid.style.gap = '10px';
        grid.style.maxWidth = '500px';
        grid.style.margin = '20px auto';

        // Create 25 boxes
        const boxes = [];
        for (let j = 0; j < 25; j++) {
            const box = document.createElement('div');
            box.style.background = '#ddd';
            box.style.height = '50px';
            box.style.borderRadius = '50%';
            grid.appendChild(box);
            boxes.push(box);
        }
        container.appendChild(grid);

        const lyricBox = document.createElement('div');
        lyricBox.style.marginTop = '20px';
        lyricBox.style.fontSize = '1.5rem';
        container.appendChild(lyricBox);

        const startBtn = document.createElement('button');
        startBtn.className = 'btn-primary';
        startBtn.textContent = 'Mulai Karaoke 🎤';
        startBtn.onclick = () => {
            startBtn.style.display = 'none';
            let i = 0;

            function karaokeLoop() {
                if (i >= songLyrics.length) {
                    mascot.goodJob();
                    speak("Hebat! Lanjut lagu berikutnya!");
                    setTimeout(() => initSingingLevel(level, container), 3000);
                    return;
                }

                const line = songLyrics[i];
                lyricBox.textContent = line.text;
                speak(line.text);

                // Flash random boxes to rhythm
                const flashInterval = setInterval(() => {
                    const randomBox = boxes[Math.floor(Math.random() * boxes.length)];
                    randomBox.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
                    setTimeout(() => randomBox.style.background = '#ddd', 300);
                }, 400);

                setTimeout(() => {
                    clearInterval(flashInterval);
                    i++;
                    karaokeLoop();
                }, line.duration);
            }
            karaokeLoop();
        };
        container.appendChild(startBtn);

    } else if (level === 3) { // Level 3: Quiz
        const title = document.createElement('h2');
        title.textContent = "Kuis Lagu";
        container.appendChild(title);

        // Use Quiz Data from Song
        const question = selectedSong.quiz.question;
        const options = selectedSong.quiz.options;
        const correct = selectedSong.quiz.correct;

        // Display "Listening to..." hint
        const hint = document.createElement('p');
        hint.textContent = `(Lagu: ${selectedSong.title})`;
        hint.style.color = '#888';
        container.appendChild(hint);

        const qEl = document.createElement('div');
        qEl.style.fontSize = '2rem';
        qEl.style.marginBottom = '20px';
        qEl.textContent = question;
        container.appendChild(qEl);
        speak(question);

        const optGrid = document.createElement('div');
        optGrid.className = 'option-grid';

        options.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'game-option quiz-option';
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === correct) {
                    btn.classList.add('correct');
                    speak(selectedSong.quiz.feedback);
                    mascot.goodJob();
                    addStar('gameSinging');

                    if (state.stats.gameSinging >= 5 && !state.badges.includes('singing_star')) {
                        state.badges.push('singing_star');
                        saveProgress();
                        mascot.say("Dapat lencana Bintang Bernyanyi!");
                        renderBadges();
                    }
                    setTimeout(() => initSingingLevel(level, container), 2000);
                } else {
                    btn.classList.add('wrong');
                    speak("Salah.. coba ingat lagi lagunya.");
                    setTimeout(() => btn.classList.remove('wrong'), 500);
                }
            };
            optGrid.appendChild(btn);
        });
        container.appendChild(optGrid);
    }
}
