const SAPTAKS = [
    { id: 'taar', mult: 2, name: 'तार', dotPosition: 'top' },
    { id: 'madhya', mult: 1, name: 'मध्य', dotPosition: null },
    { id: 'mandra', mult: 0.5, name: 'मंद्र', dotPosition: 'bottom' }
];

// तानपुरे की पहली तार (मंद्र सप्तक में): प, म, शुद्ध नि या कोमल नि।
const TANPURA_TUNINGS = {
    auto: { name: 'राग के अनुसार', en: 'According to the raga', ratio: null },
    P:    { name: 'सा – प (पंचम)', en: 'Sa – Pa (Pancham)', ratio: 0.75 },
    m:    { name: 'सा – म (मध्यम)', en: 'Sa – Ma (Madhyam)', ratio: 2 / 3 },
    N:    { name: 'सा – शुद्ध नि', en: 'Sa – shuddha Ni', ratio: 15 / 16 },
    n:    { name: 'सा – कोमल नि', en: 'Sa – komal Ni', ratio: 0.9 }
};
const STEP_LIMITS = { near: 2, mid: 4, any: Infinity };
const STORAGE_KEY = 'swarAbhyasSettings.v2' + (window.LOCKED_RAGA ? '.raga' : '');


let lastFeedback = { key: 'msgStart', type: '', params: null };
/* अनुप्रयोग की स्थिति */
let audioCtx = null;
let fluteMasterGain = null;
let tanpuraMasterGain = null;
let fluteWave = null;
let fluteBus = null;
let breathBuffer = null;
let baseFreq = SCALES[1].freq;

const state = {
    raga: 'yaman',
    modeLength: 1,
    difficulty: 'near',
    tuning: 'raga',
    tanpuraTune: 'auto',
    isPlaying: false,
    tanpuraOn: false,
    tanpuraInterval: null,
    score: 0,
    total: 0,
    streak: 0,
    promptSequence: [],
    guessSequence: []
};

const $ = id => document.getElementById(id);
const els = {
    scaleSelect: $('scaleSelect'),
    ragaSelect: $('ragaSelect'),
    tuningSelect: $('tuningSelect'),
    modeSelect: $('modeSelect'),
    stepSelect: $('stepSelect'),
    tanpuraTuneSelect: $('tanpuraTuneSelect'),
    mandraCheck: $('mandraCheck'),
    taarCheck: $('taarCheck'),
    ragaChips: $('ragaChips'),
    ragaNote: $('ragaNote'),
    ragaInfoTitle: $('ragaInfoTitle'),
    tanpuraToggleBtn: $('tanpuraToggleBtn'),
    tanpuraStateText: $('tanpuraStateText'),
    playPromptBtn: $('playPromptBtn'),
    repeatPromptBtn: $('repeatPromptBtn'),
    playSaBtn: $('playSaBtn'),
    playRagaBtn: $('playRagaBtn'),
    revealBtn: $('revealBtn'),
    guessVisualizer: $('guessVisualizer'),
    feedbackText: $('feedbackText'),
    taarGrid: $('taarGrid'),
    madhyaGrid: $('madhyaGrid'),
    mandraGrid: $('mandraGrid'),
    taarLabel: $('taarLabel'),
    madhyaLabel: $('madhyaLabel'),
    mandraLabel: $('mandraLabel'),
    scoreVal: $('scoreVal'),
    totalVal: $('totalVal'),
    streakVal: $('streakVal'),
    resetBtn: $('resetScoreBtn'),
    fluteVolSlider: $('fluteVolSlider'),
    tanpuraVolSlider: $('tanpuraVolSlider'),
    ragaPhrases: $('ragaPhrases'),
    langToggle: $('langToggle'),
    shrutiRef: $('shrutiRef')
};

/* श्रुति-स्थान की गणना */

// वर्तमान राग और स्वरस्थान-सेटिंग के अनुसार स्वर का वास्तविक अनुपात।
function effectiveRatio(swara, ragaKey = state.raga) {
    const raga = RAGAS[ragaKey];
    if (state.tuning === 'raga' && raga.tuning && raga.tuning[swara.id] !== undefined) {
        return raga.tuning[swara.id];
    }
    return swara.ratio;
}

function isAti(swara, ratio) {
    return swara.ati !== undefined && Math.abs(ratio - swara.ati) < 1e-9;
}

function swaraDetail(swara) {
    return detailText(isAti(swara, effectiveRatio(swara)) ? 'अति कोमल' : swara.detail);
}

function swaraName(swara) {
    if (swara.id === 'S' || swara.id === 'P') return sym(swara);
    return `${sym(swara)} (${swaraDetail(swara)})`;
}

function centsOf(ratio) {
    return 1200 * Math.log2(ratio);
}

function centsText(ratio) {
    return `${num(Math.round(centsOf(ratio)))} ${t('cents')}`;
}

function hasAndolan(swara) {
    const raga = RAGAS[state.raga];
    return state.tuning === 'raga' && Array.isArray(raga.andolan) && raga.andolan.includes(swara.id);
}

/* ध्वनि निर्माण */
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        fluteMasterGain = audioCtx.createGain();
        fluteMasterGain.gain.value = els.fluteVolSlider.value;
        fluteMasterGain.connect(audioCtx.destination);

        tanpuraMasterGain = audioCtx.createGain();
        tanpuraMasterGain.gain.value = els.tanpuraVolSlider.value;
        tanpuraMasterGain.connect(audioCtx.destination);

        // बाँसुरी जैसी कोमल तरंग: मूल स्वर प्रबल, ऊँचे हार्मोनिक हल्के।
        fluteWave = audioCtx.createPeriodicWave(
            new Float32Array([0, 0, 0, 0, 0, 0]),
            new Float32Array([0, 1, 0.22, 0.1, 0.04, 0.02])
        );

        // फूँक की हल्की सरसराहट के लिए दोहराया जाने वाला शोर।
        breathBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
        const breathData = breathBuffer.getChannelData(0);
        for (let i = 0; i < breathData.length; i++) breathData[i] = Math.random() * 2 - 1;

        // बाँसुरी → (सीधी ध्वनि + हल्की गूँज) → मास्टर वॉल्यूम।
        fluteBus = audioCtx.createGain();
        const dry = audioCtx.createGain();
        const wet = audioCtx.createGain();
        const reverb = audioCtx.createConvolver();
        reverb.buffer = buildImpulse(1.5, 2.8);
        dry.gain.value = 0.85;
        wet.gain.value = 0.22;
        fluteBus.connect(dry);
        dry.connect(fluteMasterGain);
        fluteBus.connect(reverb);
        reverb.connect(wet);
        wet.connect(fluteMasterGain);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

// कक्ष जैसी हल्की गूँज के लिए कृत्रिम आवेग-प्रतिक्रिया।
function buildImpulse(seconds, decay) {
    const length = Math.floor(audioCtx.sampleRate * seconds);
    const impulse = audioCtx.createBuffer(2, length, audioCtx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
        const data = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
        }
    }
    return impulse;
}

function playFluteNote(swara, saptakMult, timeOffset, duration = 0.8) {
    const freq = baseFreq * effectiveRatio(swara) * saptakMult;
    const t0 = audioCtx.currentTime + timeOffset;
    const end = t0 + duration;
    const andolan = hasAndolan(swara);

    // स्वर: आरम्भ में पल भर का हल्का उठान, फिर स्थिर।
    const osc = audioCtx.createOscillator();
    osc.setPeriodicWave(fluteWave);
    osc.frequency.setValueAtTime(freq * 0.985, t0);
    osc.frequency.exponentialRampToValueAtTime(freq, t0 + 0.07);

    // कंपन (सेंट में): देर से शुरू होने वाला हल्का; आंदोलन वाले स्वर पर धीमा और चौड़ा।
    const vibrato = audioCtx.createOscillator();
    const vibratoDepth = audioCtx.createGain();
    vibrato.frequency.setValueAtTime(andolan ? 3 : 5.2, t0);
    vibratoDepth.gain.setValueAtTime(0, t0);
    vibratoDepth.gain.setValueAtTime(0, t0 + 0.15);
    vibratoDepth.gain.linearRampToValueAtTime(andolan ? 22 : 7, t0 + 0.5);
    vibrato.connect(vibratoDepth);
    vibratoDepth.connect(osc.detune);

    // ऊँचे हार्मोनिक आरम्भ में थोड़े खुले, फिर नर्म।
    const tone = audioCtx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.Q.setValueAtTime(0.6, t0);
    tone.frequency.setValueAtTime(Math.min(freq * 7, 12000), t0);
    tone.frequency.exponentialRampToValueAtTime(Math.min(freq * 4, 9000), t0 + 0.25);

    // साँस के दबाव जैसा आयाम।
    const attack = 0.07;
    const release = Math.min(0.14, duration / 3);
    const amp = audioCtx.createGain();
    amp.gain.setValueAtTime(0, t0);
    amp.gain.linearRampToValueAtTime(0.75, t0 + attack);
    amp.gain.linearRampToValueAtTime(0.58, t0 + attack + 0.22);
    amp.gain.setValueAtTime(0.58, end - release);
    amp.gain.linearRampToValueAtTime(0, end);

    // साँस की बहुत हल्की धड़कन।
    const tremolo = audioCtx.createOscillator();
    const tremoloDepth = audioCtx.createGain();
    const tremoloGain = audioCtx.createGain();
    tremolo.frequency.setValueAtTime(4.6, t0);
    tremoloDepth.gain.setValueAtTime(0.03, t0);
    tremoloGain.gain.setValueAtTime(0.97, t0);
    tremolo.connect(tremoloDepth);
    tremoloDepth.connect(tremoloGain.gain);

    // फूँक की सरसराहट।
    const breath = audioCtx.createBufferSource();
    const breathFilter = audioCtx.createBiquadFilter();
    const breathGain = audioCtx.createGain();
    breath.buffer = breathBuffer;
    breath.loop = true;
    breathFilter.type = 'bandpass';
    breathFilter.frequency.setValueAtTime(Math.min(freq * 2.2, 6000), t0);
    breathFilter.Q.setValueAtTime(1.2, t0);
    breathGain.gain.setValueAtTime(0, t0);
    breathGain.gain.linearRampToValueAtTime(0.09, t0 + 0.03);
    breathGain.gain.linearRampToValueAtTime(0.035, t0 + 0.2);
    breathGain.gain.setValueAtTime(0.035, end - release);
    breathGain.gain.linearRampToValueAtTime(0, end);

    osc.connect(tone);
    tone.connect(amp);
    amp.connect(tremoloGain);
    tremoloGain.connect(fluteBus);
    breath.connect(breathFilter);
    breathFilter.connect(breathGain);
    breathGain.connect(fluteBus);

    osc.start(t0);
    vibrato.start(t0);
    tremolo.start(t0);
    breath.start(t0, Math.random() * 1.5);
    [osc, vibrato, tremolo, breath].forEach(node => node.stop(end + 0.05));
}

// items: [{ swara, mult }]
function playItems(items, { noteDuration = 0.8, gap = 0.1, onDone = null, onNote = null } = {}) {
    initAudio();
    state.isPlaying = true;
    updateControls();

    items.forEach((item, index) => {
        if (!item.swara) return; // विराम
        playFluteNote(item.swara, item.mult, index * (noteDuration + gap), noteDuration);
        if (onNote) window.setTimeout(() => onNote(index), index * (noteDuration + gap) * 1000);
    });

    const totalDuration = items.length * (noteDuration + gap) * 1000;
    window.setTimeout(() => {
        state.isPlaying = false;
        updateControls();
        if (onDone) onDone();
    }, totalDuration);
}

function sequenceToItems(sequence) {
    return sequence.map(note => ({
        swara: SWARAS.find(s => s.id === note.swaraId),
        mult: SAPTAKS.find(s => s.id === note.saptakId).mult
    }));
}

function playSequence(sequence) {
    playItems(sequenceToItems(sequence));
}

function playSingleNotePreview(saptakId, swaraId) {
    const swara = SWARAS.find(item => item.id === swaraId);
    const saptak = SAPTAKS.find(item => item.id === saptakId);
    initAudio();
    playFluteNote(swara, saptak.mult, 0, 0.5);
}

function playReferenceSa() {
    if (state.isPlaying) return;
    initAudio();
    playItems([{ swara: SWARAS[0], mult: 1 }], { noteDuration: 1.8, gap: 0.1 });
}

// "S R G m P D N S'" जैसे पाठ को स्वर-सूची में बदलें। पहले बिंदु = मंद्र, बाद में उद्धरण = तार।
function parsePhrase(text) {
    return text.trim().split(/\s+/).map(token => {
        let mult = 1;
        if (token.startsWith('.')) { mult = 0.5; token = token.slice(1); }
        else if (token.endsWith("'")) { mult = 2; token = token.slice(0, -1); }
        return { swara: SWARAS.find(s => s.id === token), mult };
    }).filter(item => item.swara);
}

function getPhrases(ragaKey) {
    const entry = PHRASES[ragaKey];
    if (!entry) return null;
    return { aaroh: parsePhrase(entry[0]), avaroh: parsePhrase(entry[1]) };
}

function clearPhraseHighlight() {
    els.ragaPhrases.querySelectorAll('.playing').forEach(el => el.classList.remove('playing'));
}

function highlightPhraseNote(position) {
    clearPhraseHighlight();
    const el = els.ragaPhrases.querySelector(`[data-pos="${position}"]`);
    if (el) el.classList.add('playing');
}

// राग का आरोह फिर अवरोह (विराम के बाद); प्रविष्टि न हो तो राग के स्वर क्रम से।
function playRagaScale() {
    if (state.isPlaying) return;
    const phrases = getPhrases(state.raga);
    let items;
    if (phrases) {
        items = [...phrases.aaroh, { swara: null }, ...phrases.avaroh];
        setFeedback('msgPhrases', '');
    } else {
        const notes = SWARAS.filter(s => RAGAS[state.raga].notes.includes(s.id));
        items = [
            ...notes.map(swara => ({ swara, mult: 1 })),
            { swara: SWARAS[0], mult: 2 },
            ...[...notes].reverse().map(swara => ({ swara, mult: 1 }))
        ];
        setFeedback('msgScaleFallback', '');
    }
    playItems(items, {
        noteDuration: 0.6,
        gap: 0.05,
        onNote: highlightPhraseNote,
        onDone: () => { clearPhraseHighlight(); setFeedback('msgScaleDone', ''); }
    });
}

function playTanpuraString(ratio, startTime) {
    const freq = baseFreq * ratio;
    const oscSaw = audioCtx.createOscillator();
    const oscTri = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    oscSaw.type = 'sawtooth';
    oscTri.type = 'triangle';
    oscSaw.frequency.setValueAtTime(freq, startTime);
    oscTri.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.Q.setValueAtTime(2.5, startTime);
    filter.frequency.setValueAtTime(freq * 8, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 1.5);
    filter.frequency.linearRampToValueAtTime(freq, startTime + 4.5);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.3, startTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.1, startTime + 2.0);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 5.0);

    const mixGainSaw = audioCtx.createGain();
    const mixGainTri = audioCtx.createGain();
    mixGainSaw.gain.value = 0.35;
    mixGainTri.gain.value = 0.65;
    oscSaw.connect(mixGainSaw);
    oscTri.connect(mixGainTri);
    mixGainSaw.connect(filter);
    mixGainTri.connect(filter);
    filter.connect(gain);
    gain.connect(tanpuraMasterGain);

    oscSaw.start(startTime);
    oscTri.start(startTime);
    oscSaw.stop(startTime + 5.5);
    oscTri.stop(startTime + 5.5);
}

function tanpuraFirstRatio() {
    let key = state.tanpuraTune;
    if (key === 'auto') {
        const notes = RAGAS[state.raga].notes;
        key = notes.includes('P') ? 'P' : (notes.includes('N') ? 'N' : 'm');
    }
    return TANPURA_TUNINGS[key].ratio;
}

function scheduleTanpuraCycle() {
    if (!state.tanpuraOn) return;
    const now = audioCtx.currentTime;
    playTanpuraString(tanpuraFirstRatio(), now);
    playTanpuraString(1.0, now + 1.0);
    playTanpuraString(1.0, now + 2.0);
    playTanpuraString(0.5, now + 3.0);
}

function toggleTanpura() {
    initAudio();
    state.tanpuraOn = !state.tanpuraOn;
    els.tanpuraToggleBtn.classList.toggle('is-on', state.tanpuraOn);
    els.tanpuraToggleBtn.setAttribute('aria-pressed', String(state.tanpuraOn));
    els.tanpuraStateText.innerText = state.tanpuraOn ? t('on') : t('off');

    if (state.tanpuraOn) {
        scheduleTanpuraCycle();
        state.tanpuraInterval = window.setInterval(scheduleTanpuraCycle, 4500);
    } else {
        window.clearInterval(state.tanpuraInterval);
    }
}

/* सेटिंग का संग्रह (केवल इसी ब्राउज़र में) */
function saveSettings() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            scale: els.scaleSelect.value,
            lang: lang,
            raga: state.raga,
            tuning: state.tuning,
            mode: state.modeLength,
            difficulty: state.difficulty,
            tanpuraTune: state.tanpuraTune,
            mandra: els.mandraCheck.checked,
            taar: els.taarCheck.checked,
            fluteVol: els.fluteVolSlider.value,
            tanpuraVol: els.tanpuraVolSlider.value
        }));
    } catch (error) { /* संग्रह उपलब्ध न हो तो चुपचाप आगे बढ़ें */ }
}

function loadSettings() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch (error) { saved = {}; }

    if (saved.scale !== undefined && SCALES[saved.scale]) els.scaleSelect.value = saved.scale;
    if (saved.raga && RAGAS[saved.raga]) state.raga = saved.raga;
    if (saved.tuning === 'raga' || saved.tuning === 'standard') state.tuning = saved.tuning;
    if ([1, 2, 3, 4, 5].includes(Number(saved.mode))) state.modeLength = Number(saved.mode);
    if (STEP_LIMITS[saved.difficulty] !== undefined) state.difficulty = saved.difficulty;
    if (TANPURA_TUNINGS[saved.tanpuraTune]) state.tanpuraTune = saved.tanpuraTune;
    els.mandraCheck.checked = Boolean(saved.mandra);
    els.taarCheck.checked = Boolean(saved.taar);
    if (saved.fluteVol !== undefined) els.fluteVolSlider.value = saved.fluteVol;
    if (saved.tanpuraVol !== undefined) els.tanpuraVolSlider.value = saved.tanpuraVol;

    baseFreq = SCALES[els.scaleSelect.value].freq;
    els.ragaSelect.value = state.raga;
    els.tuningSelect.value = state.tuning;
    els.modeSelect.value = String(state.modeLength);
    els.stepSelect.value = state.difficulty;
    els.tanpuraTuneSelect.value = state.tanpuraTune;
}

/* दृश्य */
function buildSelect(select, entries) {
    const previous = select.value;
    select.innerHTML = '';
    entries.forEach(([value, label]) => {
        const option = document.createElement('option');
        option.value = value;
        option.innerText = label;
        select.appendChild(option);
    });
    if (previous && [...select.options].some(option => option.value === previous)) select.value = previous;
}

// भाषा बदलने पर सारा पाठ फिर से बनाएँ।
function applyLanguage() {
    document.documentElement.lang = lang;
    document.title = t('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });

    buildSelect(els.scaleSelect, SCALES.map((scale, index) =>
        [String(index), `${lang === 'hi' ? scale.name : SCALE_EN[index]} (${num(scale.freq.toFixed(2))} ${t('hz')})`]));
    buildSelect(els.ragaSelect, ragaKeys().map(key => [key, ragaName(key)]));
    buildSelect(els.tanpuraTuneSelect, Object.keys(TANPURA_TUNINGS).map(key =>
        [key, lang === 'hi' ? TANPURA_TUNINGS[key].name : TANPURA_TUNINGS[key].en]));

    els.tanpuraStateText.innerText = state.tanpuraOn ? t('on') : t('off');
    els.langToggle.textContent = t('langBtn');
    renderScore();
    refreshRagaView();
    renderVisualizer();
    renderFeedback();
    renderShrutiRef();
    if (typeof window.onLanguageApplied === 'function') window.onLanguageApplied();
}

function renderShrutiRef() {
    let rows = '';
    Object.keys(RAGAS).forEach(key => {
        const raga = RAGAS[key];
        if (!raga.tuning) return;
        if (window.LOCKED_RAGA && key !== window.LOCKED_RAGA) return;
        const swaras = SWARAS.filter(s => raga.notes.includes(s.id) && raga.tuning[s.id] !== undefined);
        swaras.forEach((swara, index) => {
            const used = raga.tuning[swara.id];
            const diff = Math.round(centsOf(used) - centsOf(swara.ratio));
            const sign = diff > 0 ? '+' : (diff < 0 ? '−' : '');
            rows += `<tr>${index === 0 ? `<th scope="rowgroup" rowspan="${swaras.length}">${ragaName(key)}</th>` : ''}`
                + `<td>${sym(swara)}</td>`
                + `<td>${ratioText(used)} · ${num(Math.round(centsOf(used)))}</td>`
                + `<td>${ratioText(swara.ratio)} · ${num(Math.round(centsOf(swara.ratio)))}</td>`
                + `<td>${sign}${num(Math.abs(diff))}</td></tr>`;
        });
    });
    if (!rows) {
        els.shrutiRef.innerHTML = `<p class="ref-intro">${t('refNone')}</p>`;
        return;
    }
    els.shrutiRef.innerHTML = `<p class="ref-intro">${t('refIntro')}</p>`
        + `<div class="table-wrap"><table class="ref-table"><thead><tr><th>${t('refRaga')}</th><th>${t('refSwara')}</th>`
        + `<th>${t('refUsed')}</th><th>${t('refStd')}</th><th>${t('refDiff')}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function setupUI() {
    lang = detectLanguage();

    SAPTAKS.forEach(saptak => {
        const grid = $(`${saptak.id}Grid`);
        SWARAS.forEach(swara => {
            const button = document.createElement('button');
            button.type = 'button';
            button.id = `btn-${saptak.id}-${swara.id}`;
            button.className = `swara-btn ${swara.isShuddha ? 'shuddha' : 'vikrit'}`;

            const dot = saptak.dotPosition
                ? `<span class="octave-dot ${saptak.dotPosition}" aria-hidden="true"></span>`
                : '';
            button.innerHTML = `${dot}
                <span class="swara-symbol"></span>
                <span class="swara-detail"></span>`;
            button.addEventListener('click', () => handleGuessInput(saptak.id, swara.id));
            grid.appendChild(button);
        });
    });

    applyLanguage();
    els.scaleSelect.value = '1';
    els.ragaSelect.value = state.raga;
    loadSettings();
    // रागा लैब के किसी राग-पन्ने (LOCKED_RAGA) या ?r=राग वाले लिंक पर राग पहले से चुना जाता है।
    const forcedRaga = window.LOCKED_RAGA || new URLSearchParams(location.search).get('r');
    if (forcedRaga && RAGAS[forcedRaga]) {
        state.raga = forcedRaga;
        els.ragaSelect.value = forcedRaga;
    }
    els.mandraGrid.classList.toggle('hidden', !els.mandraCheck.checked);
    els.taarGrid.classList.toggle('hidden', !els.taarCheck.checked);
    updateOctaveLabels();
    refreshRagaView();
}

function updateOctaveLabels() {
    const showLabels = els.mandraCheck.checked || els.taarCheck.checked;
    els.taarLabel.hidden = !(showLabels && els.taarCheck.checked);
    els.madhyaLabel.hidden = !showLabels;
    els.mandraLabel.hidden = !(showLabels && els.mandraCheck.checked);
}

// राग या स्वरस्थान बदलने पर सभी संबंधित दृश्य फिर से बनाएँ।
function refreshRagaView() {
    renderRagaInfo();
    updateGridState();
    updateControls();
}

function notationHTML(items, offset) {
    return items.map((item, index) => {
        const swara = item.swara;
        const classes = ['nt'];
        if (item.mult === 2) classes.push('taar');
        if (item.mult === 0.5) classes.push('mandra');
        if (swara.id === 'M') classes.push('tivra');
        else if (!swara.isShuddha) classes.push(isAti(swara, effectiveRatio(swara)) ? 'ati' : 'komal');
        return `<span class="${classes.join(' ')}" data-pos="${offset + index}">${sym(swara)}</span>`;
    }).join('');
}

function renderPhrases() {
    const phrases = getPhrases(state.raga);
    if (!phrases) {
        els.ragaPhrases.innerHTML = `<p class="phrase-note">${t('phrasesMissing')}</p>`;
        return;
    }
    els.ragaPhrases.innerHTML =
        `<div class="phrase-row"><span class="phrase-label">${t('lblAaroh')}</span><span class="phrase-notes">${notationHTML(phrases.aaroh, 0)}</span></div>`
        + `<div class="phrase-row"><span class="phrase-label">${t('lblAvaroh')}</span><span class="phrase-notes">${notationHTML(phrases.avaroh, phrases.aaroh.length + 1)}</span></div>`
        + `<p class="phrase-note">${t('legend')}</p>`;
}

function renderRagaInfo() {
    const raga = RAGAS[state.raga];
    els.ragaInfoTitle.innerText = t('ragaInfoTitle', { name: ragaName(state.raga) });
    els.ragaChips.innerHTML = '';

    const atiNames = [];
    SWARAS.filter(s => raga.notes.includes(s.id)).forEach(swara => {
        const ratio = effectiveRatio(swara);
        const ati = isAti(swara, ratio);
        if (ati) atiNames.push({ swara, ratio });

        const chip = document.createElement('span');
        chip.className = `chip ${swara.isShuddha ? 'shuddha' : 'vikrit'}${ati ? ' ati' : ''}`;
        chip.title = `${swaraName(swara)} — ${centsText(ratio)}`;
        chip.innerHTML = `${sym(swara)}<small>${swaraDetail(swara)}</small>`;
        els.ragaChips.appendChild(chip);
    });

    const parts = [];
    if (atiNames.length > 0) {
        const list = atiNames.map(({ swara, ratio }) =>
            t('atiItem', { sym: sym(swara), cents: centsText(ratio), std: centsText(swara.ratio) })
        ).join('; ');
        parts.push(t('atiNote', { list }));
    } else if (state.tuning === 'standard' && raga.tuning) {
        parts.push(t('stdNote'));
    }
    const note = lang === 'hi' ? raga.note : raga.noteEn;
    if (state.tuning === 'raga' && note) parts.push(note);
    els.ragaNote.innerText = parts.join(' ');
    renderPhrases();
}

function updateGridState() {
    const allowedNotes = RAGAS[state.raga].notes;
    const visibleCount = allowedNotes.length;
    const cols = visibleCount <= 8 ? visibleCount : 6;

    SAPTAKS.forEach(saptak => {
        $(`${saptak.id}Grid`).style.setProperty('--cols', cols);
        SWARAS.forEach(swara => {
            const button = $(`btn-${saptak.id}-${swara.id}`);
            if (!button) return;
            const inRaga = allowedNotes.includes(swara.id);
            const ratio = effectiveRatio(swara);
            const ati = isAti(swara, ratio);

            button.classList.toggle('out-of-raga', !inRaga);
            button.classList.toggle('ati', ati);
            button.disabled = state.isPlaying || !inRaga;
            button.querySelector('.swara-symbol').innerText = sym(swara);
            button.querySelector('.swara-detail').innerText = swaraDetail(swara);
            button.title = `${swaraName(swara)} — ${centsText(ratio)}`;
            button.setAttribute('aria-label', t('ariaNote', { oct: octaveWord(saptak.id), swara: swaraName(swara) }));
        });
    });
}

function updateControls() {
    const busy = state.isPlaying;
    const hasPrompt = state.promptSequence.length > 0;
    els.playPromptBtn.disabled = busy;
    els.repeatPromptBtn.disabled = busy || !hasPrompt;
    els.revealBtn.disabled = busy || !hasPrompt;
    els.playSaBtn.disabled = busy;
    els.playRagaBtn.disabled = busy;
    updateGridState();
}

function renderScore() {
    els.scoreVal.innerText = num(state.score);
    els.totalVal.innerText = num(state.total);
    els.streakVal.innerText = num(state.streak);
}

function renderVisualizer(isError = false) {
    els.guessVisualizer.innerHTML = '';
    for (let index = 0; index < state.modeLength; index++) {
        const box = document.createElement('div');
        box.className = 'guess-slot';

        if (index < state.guessSequence.length) {
            const guess = state.guessSequence[index];
            const swara = SWARAS.find(item => item.id === guess.swaraId);
            const saptak = SAPTAKS.find(item => item.id === guess.saptakId);
            if (saptak.dotPosition) {
                const dot = document.createElement('span');
                dot.className = `octave-dot ${saptak.dotPosition}`;
                dot.setAttribute('aria-hidden', 'true');
                box.appendChild(dot);
            }
            const symbol = document.createElement('span');
            symbol.className = 'slot-symbol';
            symbol.innerText = sym(swara);
            box.appendChild(symbol);
            const detail = document.createElement('span');
            detail.className = 'slot-detail';
            detail.innerText = swaraDetail(swara);
            box.appendChild(detail);
            box.classList.add(isError && index === state.guessSequence.length - 1 ? 'incorrect' : 'correct');
        } else {
            box.classList.add('empty');
            box.innerText = '·';
        }
        els.guessVisualizer.appendChild(box);
    }
}

// संदेश कुंजी के रूप में रखे जाते हैं ताकि भाषा बदलने पर वही संदेश नई भाषा में दिखे।
function setFeedback(key, type, params) {
    lastFeedback = { key, type: type || '', params: params || null };
    renderFeedback();
}

function renderFeedback() {
    const resolved = {};
    if (lastFeedback.params) {
        Object.keys(lastFeedback.params).forEach(name => {
            const value = lastFeedback.params[name];
            resolved[name] = typeof value === 'function' ? value() : value;
        });
    }
    els.feedbackText.innerText = t(lastFeedback.key, resolved);
    els.feedbackText.className = `feedback${lastFeedback.type ? ` ${lastFeedback.type}` : ''}`;
}

function describeSequence(sequence) {
    return sequence.map(note => {
        const swara = SWARAS.find(item => item.id === note.swaraId);
        const saptak = SAPTAKS.find(item => item.id === note.saptakId);
        const octavePrefix = saptak.id === 'madhya' ? '' : `${octaveWord(saptak.id)} `;
        return `${octavePrefix}${swaraName(swara)}`;
    }).join(' — ');
}

function clearRound() {
    state.promptSequence = [];
    updateControls();
}

/* अभ्यास का तर्क */
function generatePrompt() {
    if (state.isPlaying) return;
    initAudio();
    state.guessSequence = [];
    renderVisualizer();
    setFeedback('msgListening', '');

    const allowedNotes = RAGAS[state.raga].notes;
    const allowedSaptaks = ['madhya'];
    if (els.mandraCheck.checked) allowedSaptaks.push('mandra');
    if (els.taarCheck.checked) allowedSaptaks.push('taar');

    // स्वरों को नीचे से ऊपर के क्रम में रखें, ताकि पास-पास के स्वर सचमुच पास के हों।
    const validPool = [];
    ['mandra', 'madhya', 'taar'].forEach(saptakId => {
        if (!allowedSaptaks.includes(saptakId)) return;
        SWARAS.forEach(swara => {
            if (allowedNotes.includes(swara.id)) validPool.push({ saptakId, swaraId: swara.id });
        });
    });

    const maxStep = STEP_LIMITS[state.difficulty];
    const sequence = [];
    let currentIndex = Math.floor(Math.random() * validPool.length);
    for (let index = 0; index < state.modeLength; index++) {
        if (index > 0) {
            const low = Math.max(0, currentIndex - maxStep);
            const high = Math.min(validPool.length - 1, currentIndex + maxStep);
            let next = currentIndex;
            if (high > low) {
                do { next = low + Math.floor(Math.random() * (high - low + 1)); } while (next === currentIndex);
            }
            currentIndex = next;
        }
        sequence.push(validPool[currentIndex]);
    }

    state.promptSequence = sequence;
    playSequence(state.promptSequence);
}

function repeatPrompt() {
    if (state.promptSequence.length === 0 || state.isPlaying) return;
    setFeedback('msgRepeating', '');
    playSequence(state.promptSequence);
}

function revealAnswer() {
    if (state.promptSequence.length === 0 || state.isPlaying) return;
    state.total++;
    state.streak = 0;
    renderScore();
    const answer = state.promptSequence;
    setFeedback('msgReveal', 'error', { seq: () => describeSequence(answer) });
    clearRound();
}

function handleGuessInput(saptakId, swaraId) {
    initAudio();
    if (state.isPlaying) return;

    // कोई स्वर सुनाया न गया हो तो बटन केवल स्वर परखने के लिए है।
    if (state.promptSequence.length === 0) {
        playSingleNotePreview(saptakId, swaraId);
        return;
    }

    const currentGuessIndex = state.guessSequence.length;
    if (currentGuessIndex >= state.modeLength) return;

    playSingleNotePreview(saptakId, swaraId);
    const expectedNote = state.promptSequence[currentGuessIndex];
    const isCorrect = expectedNote.swaraId === swaraId && expectedNote.saptakId === saptakId;

    state.guessSequence.push({ saptakId, swaraId });

    if (isCorrect) {
        renderVisualizer();
        if (state.guessSequence.length === state.modeLength) {
            state.score++;
            state.total++;
            state.streak++;
            renderScore();
            setFeedback('msgCorrect', 'success');
            clearRound();
        }
    } else {
        state.total++;
        state.streak = 0;
        renderScore();
        renderVisualizer(true);
        const answer = state.promptSequence;
        setFeedback('msgWrong', 'error', { seq: () => describeSequence(answer) });
        clearRound();
    }
}

function resetRound(message) {
    state.promptSequence = [];
    state.guessSequence = [];
    renderVisualizer();
    refreshRagaView();
    setFeedback(message, '');
}

/* नियंत्रण */
els.scaleSelect.addEventListener('change', event => {
    baseFreq = SCALES[event.target.value].freq;
    saveSettings();
});

els.ragaSelect.addEventListener('change', event => {
    state.raga = event.target.value;
    saveSettings();
    resetRound('msgRagaChanged');
});

els.tuningSelect.addEventListener('change', event => {
    state.tuning = event.target.value;
    saveSettings();
    resetRound(state.tuning === 'raga' ? 'msgTuningRaga' : 'msgTuningStd');
});

els.modeSelect.addEventListener('change', event => {
    state.modeLength = Number.parseInt(event.target.value, 10);
    saveSettings();
    resetRound('msgModeChanged');
});

els.stepSelect.addEventListener('change', event => {
    state.difficulty = event.target.value;
    saveSettings();
    resetRound('msgStepChanged');
});

els.tanpuraTuneSelect.addEventListener('change', event => {
    state.tanpuraTune = event.target.value;
    saveSettings();
});

els.mandraCheck.addEventListener('change', event => {
    els.mandraGrid.classList.toggle('hidden', !event.target.checked);
    updateOctaveLabels();
    saveSettings();
});

els.taarCheck.addEventListener('change', event => {
    els.taarGrid.classList.toggle('hidden', !event.target.checked);
    updateOctaveLabels();
    saveSettings();
});

els.playPromptBtn.addEventListener('click', generatePrompt);
els.repeatPromptBtn.addEventListener('click', repeatPrompt);
els.revealBtn.addEventListener('click', revealAnswer);
els.playSaBtn.addEventListener('click', playReferenceSa);
els.playRagaBtn.addEventListener('click', playRagaScale);
els.tanpuraToggleBtn.addEventListener('click', toggleTanpura);
els.langToggle.addEventListener('click', () => {
    setLanguage(lang === 'hi' ? 'en' : 'hi');
    saveSettings();
    applyLanguage();
});

els.resetBtn.addEventListener('click', () => {
    state.score = 0;
    state.total = 0;
    state.streak = 0;
    state.promptSequence = [];
    state.guessSequence = [];
    renderScore();
    renderVisualizer();
    updateControls();
    setFeedback('msgScoreReset', '');
});

els.fluteVolSlider.addEventListener('input', event => {
    if (fluteMasterGain) fluteMasterGain.gain.value = event.target.value;
    saveSettings();
});

els.tanpuraVolSlider.addEventListener('input', event => {
    if (tanpuraMasterGain) tanpuraMasterGain.gain.value = event.target.value;
    saveSettings();
});

document.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.matches('input, select, textarea')) return;
    const key = event.key.toLowerCase();
    if (key === 'n' && !els.playPromptBtn.disabled) generatePrompt();
    if (key === 'r' && !els.repeatPromptBtn.disabled) repeatPrompt();
});

window.addEventListener('DOMContentLoaded', setupUI);
    