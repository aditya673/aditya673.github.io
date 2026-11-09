/* भाषा / Language */
const I18N = {
    hi: {
        pageTitle: 'स्वर अभ्यास — श्रवण प्रशिक्षण', backLink: 'पोर्टफोलियो पर वापस', title: 'स्वर अभ्यास',
        subtitle: 'हिंदुस्तानी शास्त्रीय संगीत — श्रवण प्रशिक्षण',
        lblScale: 'आधार स्वर (सा)', lblRaga: 'राग', lblTuning: 'स्वरस्थान',
        tuningRaga: 'राग के अनुसार श्रुति', tuningStd: 'सामान्य (शुद्ध अंतराल)',
        lblMode: 'अभ्यास का प्रकार', mode1: 'एकल स्वर', mode2: 'दो स्वरों का क्रम', mode3: 'तीन स्वरों का क्रम',
        mode4: 'चार स्वरों का क्रम', mode5: 'पाँच स्वरों का क्रम',
        lblStep: 'स्वरों के बीच की दूरी', stepNear: 'निकट स्वर (सरल)', stepMid: 'मध्यम', stepAny: 'कोई भी स्वर (कठिन)',
        lblTanpuraTune: 'तानपुरे का मिलान', lblOctave: 'सप्तक',
        mandra: 'मंद्र सप्तक', madhya: 'मध्य सप्तक', taar: 'तार सप्तक',
        volFlute: 'बाँसुरी की ध्वनि', volTanpura: 'तानपुरे की ध्वनि',
        tanpura: 'तानपुरा', tanpuraNote: 'चार तारों की तानपुरा ध्वनि', on: 'चालू', off: 'बंद',
        scoreTitle: 'आपकी शुद्धता', scoreCaption: 'सही उत्तर / कुल प्रयास', streak: 'लगातार सही:', reset: 'अंक रीसेट करें',
        btnPlay: 'स्वर सुनें', btnRepeat: 'पुनः सुनें', btnSa: 'सा सुनें', btnRaga: 'आरोह-अवरोह सुनें', btnReveal: 'उत्तर दिखाएँ',
        guessTitle: 'आपका अनुमान',
        panelNote: 'कोई स्वर सुनाए बिना बटन दबाने पर वह स्वर बजेगा, इसलिए आप स्वरों को परख भी सकते हैं। शॉर्टकट: N — नया स्वर, R — पुनः सुनें।',
        msgStart: 'आरम्भ करने के लिए «स्वर सुनें» दबाएँ।', msgListening: 'ध्यान से सुनिए…', msgRepeating: 'स्वरक्रम दोहराया जा रहा है…',
        msgCorrect: 'सही! बहुत अच्छा!', msgWrong: 'गलत। सही स्वरक्रम था: {seq}', msgReveal: 'उत्तर: {seq}',
        msgRagaChanged: 'राग बदल गया है। नया स्वर सुनने के लिए «स्वर सुनें» दबाएँ।',
        msgTuningRaga: 'अब राग के अनुसार श्रुति-स्थान लग रहे हैं।', msgTuningStd: 'अब सामान्य (शुद्ध अंतराल) स्वरस्थान लग रहे हैं।',
        msgModeChanged: 'अभ्यास का प्रकार बदल गया है। «स्वर सुनें» दबाएँ।', msgStepChanged: 'कठिनाई बदल गई है। «स्वर सुनें» दबाएँ।',
        msgScoreReset: 'अंक रीसेट कर दिए गए हैं।', msgScalePlaying: 'राग के स्वर सुनिए: आरोह और अवरोह…',
        msgScaleDone: 'अब «स्वर सुनें» दबाकर अभ्यास कीजिए।',
        lblAaroh: 'आरोह', lblAvaroh: 'अवरोह', msgPhrases: 'पहले आरोह, फिर अवरोह सुनिए…',
        msgScaleFallback: 'इस राग का आरोह-अवरोह अभी जोड़ा नहीं गया; इसके स्वर क्रम से सुनाए जा रहे हैं…',
        phrasesMissing: 'इस राग का आरोह-अवरोह अभी जोड़ा नहीं गया है।',
        legend: 'रेखांकित = कोमल (बैंगनी = अति कोमल) · ऊपर रेखा = तीव्र म · बिंदु ऊपर/नीचे = तार/मंद्र सप्तक',
        ariaNote: '{oct} सप्तक, {swara}', ragaInfoTitle: 'राग {name} के स्वर',
        atiItem: '{sym} ({cents}, सामान्य कोमल {std})', atiNote: 'इस राग में अति कोमल श्रुति लगती है: {list}।',
        stdNote: '«सामान्य» स्वरस्थान चुना है, इसलिए इस राग के विशिष्ट श्रुति-स्थान अभी नहीं लग रहे।',
        cents: 'सेंट', hz: 'हर्ट्ज़', langBtn: 'English',
        refTitle: 'श्रुति-स्थान की तालिका (गुरु से मिलान के लिए)',
        refIntro: 'ये मान सामान्य परंपरा पर आधारित हैं और घराने के अनुसार बदल सकते हैं। हर खाने में «अनुपात · सेंट (सा से)» दिया है। अपने गुरु से मिलान करके स्रोत-कोड की RAGAS तालिका में संबंधित राग की tuning पंक्ति बदली जा सकती है।',
        refRaga: 'राग', refSwara: 'स्वर', refUsed: 'इस राग में', refStd: 'सामान्य', refDiff: 'अंतर (सेंट)'
    },
    en: {
        pageTitle: 'Swara Practice — Ear Training', backLink: 'Back to portfolio', title: 'Swara Practice',
        subtitle: 'Hindustani classical music — ear training',
        lblScale: 'Base pitch (Sa)', lblRaga: 'Raga', lblTuning: 'Tuning',
        tuningRaga: 'Raga-specific shruti', tuningStd: 'Standard (just intervals)',
        lblMode: 'Exercise type', mode1: 'Single swara', mode2: 'Sequence of two swaras', mode3: 'Sequence of three swaras',
        mode4: 'Sequence of four swaras', mode5: 'Sequence of five swaras',
        lblStep: 'Distance between swaras', stepNear: 'Neighbouring swaras (easier)', stepMid: 'Medium', stepAny: 'Any swara (harder)',
        lblTanpuraTune: 'Tanpura tuning', lblOctave: 'Octaves',
        mandra: 'Mandra (lower) octave', madhya: 'Madhya (middle) octave', taar: 'Taar (upper) octave',
        volFlute: 'Flute volume', volTanpura: 'Tanpura volume',
        tanpura: 'Tanpura', tanpuraNote: 'Four-string tanpura drone', on: 'On', off: 'Off',
        scoreTitle: 'Your accuracy', scoreCaption: 'correct / total attempts', streak: 'Current streak:', reset: 'Reset score',
        btnPlay: 'Play swaras', btnRepeat: 'Repeat', btnSa: 'Play Sa', btnRaga: 'Hear aaroh & avaroh', btnReveal: 'Show answer',
        guessTitle: 'Your guess',
        panelNote: 'Pressing a button when nothing is being asked simply plays that swara, so you can also explore the notes. Shortcuts: N — new prompt, R — repeat.',
        msgStart: 'Press “Play swaras” to begin.', msgListening: 'Listen carefully…', msgRepeating: 'Repeating the sequence…',
        msgCorrect: 'Correct! Well done!', msgWrong: 'Not quite. The correct sequence was: {seq}', msgReveal: 'Answer: {seq}',
        msgRagaChanged: 'Raga changed. Press “Play swaras” for a new prompt.',
        msgTuningRaga: 'Now using the raga’s own shruti positions.', msgTuningStd: 'Now using standard just-interval pitches.',
        msgModeChanged: 'Exercise type changed. Press “Play swaras”.', msgStepChanged: 'Difficulty changed. Press “Play swaras”.',
        msgScoreReset: 'Score reset.', msgScalePlaying: 'Listen to the raga’s swaras: ascending, then descending…',
        msgScaleDone: 'Now press “Play swaras” to practise.',
        lblAaroh: 'Aaroh', lblAvaroh: 'Avaroh', msgPhrases: 'Listen to the aaroh, then the avaroh…',
        msgScaleFallback: 'Aaroh/avaroh for this raga isn’t added yet; playing its swaras in order…',
        phrasesMissing: 'Aaroh/avaroh for this raga has not been added yet.',
        legend: 'Underline = komal (purple = ati-komal) · overline = tivra Ma · dot above/below = taar/mandra octave',
        ariaNote: '{oct} octave, {swara}', ragaInfoTitle: 'Swaras of Raga {name}',
        atiItem: '{sym} ({cents}; usual komal is {std})', atiNote: 'This raga uses ati-komal shruti: {list}.',
        stdNote: 'Standard tuning is selected, so this raga’s own shruti positions are not being applied.',
        cents: 'cents', hz: 'Hz', langBtn: 'हिन्दी',
        refTitle: 'Shruti reference table (for checking with your teacher)',
        refIntro: 'These values follow common practice and vary by gharana. Each cell shows “ratio · cents above Sa”. After checking with your teacher, edit the tuning line of the relevant raga in the RAGAS table in the page source.',
        refRaga: 'Raga', refSwara: 'Swara', refUsed: 'In this raga', refStd: 'Standard', refDiff: 'Difference (cents)'
    }
};
let lang = 'hi';

function t(key, params) {
    let text = (I18N[lang] && I18N[lang][key] !== undefined) ? I18N[lang][key] : (I18N.hi[key] !== undefined ? I18N.hi[key] : key);
    if (params) Object.keys(params).forEach(name => { text = text.split(`{${name}}`).join(params[name]); });
    return text;
}

const OCTAVE_WORD = {
    hi: { taar: 'तार', madhya: 'मध्य', mandra: 'मंद्र' },
    en: { taar: 'Taar', madhya: 'Madhya', mandra: 'Mandra' }
};

function num(value) { return lang === 'hi' ? toDevanagariDigits(value) : String(value); }
function sym(swara) { return lang === 'hi' ? swara.symbol : ROMAN[swara.id]; }
function ragaName(key) { return lang === 'hi' ? RAGAS[key].name : (RAGA_EN[key] || key); }
function octaveWord(id) { return OCTAVE_WORD[lang][id]; }
function detailText(hiText) { return lang === 'hi' ? hiText : (DETAIL_EN[hiText] || hiText); }

// भिन्न के रूप में अनुपात (जैसे 256/243)।
function ratioText(ratio) {
    for (let den = 1; den <= 128; den++) {
        const numerator = Math.round(ratio * den);
        if (Math.abs(numerator / den - ratio) < 1e-9) return `${num(numerator)}/${num(den)}`;
    }
    return ratio.toFixed(4);
}

const DEVANAGARI_DIGITS = '०१२३४५६७८९';
function toDevanagariDigits(value) {
    return String(value).replace(/[0-9]/g, digit => DEVANAGARI_DIGITS[Number(digit)]);
}

Object.assign(I18N.hi, {
    lab: 'रागा लैब', labSub: 'हर राग के लिए चुने हुए प्रदर्शन और उसी राग का विशिष्ट श्रवण अभ्यास — एक चलती परियोजना',
    backLab: 'रागा लैब पर वापस', universalTrainer: 'सार्वभौमिक स्वर अभ्यास',
    universalDesc: 'किसी भी राग या सभी बारह स्वरों पर स्वर पहचानने का अभ्यास करें।', openTrainer: 'अभ्यास खोलें',
    searchPlaceholder: 'राग खोजें…', filterAll: 'सभी', filterVideos: 'प्रदर्शन के साथ', filterPhrases: 'आरोह-अवरोह के साथ',
    countRagas: '{n} राग', cardVideos: '{n} प्रदर्शन', cardPhrases: 'आरोह-अवरोह', noMatch: 'कोई राग नहीं मिला।',
    aboutTitle: 'इस परियोजना के बारे में',
    aboutText: 'यह एक चलती परियोजना है। हर राग के लिए मैं YouTube पर सुने हुए प्रदर्शन इकट्ठा करता हूँ, साथ में उस राग का विशिष्ट श्रवण अभ्यास (स्वर पहचान, गलत स्वर पहचानना, आगे का स्वर) और एक सार्वभौमिक स्वर अभ्यास है। श्रुति-स्थान और आरोह-अवरोह सामान्य परंपरा पर आधारित हैं और गुरु से मिलान के लिए खुले हैं; राग धीरे-धीरे जुड़ते रहेंगे।',
    secListen: 'सुनिए', secTrain: 'इस राग का श्रवण अभ्यास', videosEmpty: 'अभी इस राग के प्रदर्शन नहीं जुड़े हैं।',
    videosHow: 'जोड़ने के लिए js/collection.js में इस राग की प्रविष्टि भरें।', playVideo: 'चलाएँ', openYT: 'YouTube पर खोलें',
    prevRaga: '← पिछला राग', nextRaga: 'अगला राग →', swarasCount: '{n} स्वर', thatTuned: 'श्रुति-स्थान सहित',
    drillOddTitle: 'गलत स्वर पहचानिए', drillOddDesc: 'छह स्वरों के इस वाक्यांश में एक स्वर राग से बाहर के स्वर से बदल दिया गया है। बताइए कौन-सा स्थान?',
    drillNextTitle: 'आगे कौन-सा स्वर?', drillNextDesc: 'आरोह या अवरोह का आरम्भ सुनिए और अगला स्वर चुनिए।',
    drillPlay: 'वाक्यांश सुनें', drillReplay: 'फिर सुनें', drillScore: 'अंक:', drillNeedsPhrases: 'इस राग का आरोह-अवरोह जुड़ने पर यह अभ्यास खुलेगा।',
    oddCorrect: 'सही! स्थान {pos} पर {wrong} था, जबकि {right} होना चाहिए था।',
    oddWrong: 'गलत। गलत स्वर स्थान {pos} पर था: {wrong} (सही: {right})।',
    nextHint: '{kind} के पहले {n} स्वर बजे। अगला कौन-सा?', nextCorrect: 'सही! अगला स्वर {swara} है।', nextWrong: 'गलत। अगला स्वर {swara} था।',
    refNone: 'इस राग के लिए अलग से श्रुति-स्थान नहीं रखे गए; सामान्य अनुपात लगते हैं।', posWord: 'स्थान'
});
Object.assign(I18N.en, {
    lab: 'Raga Lab', labSub: 'Collected performances and raga-specific ear training for every raga — an ongoing project',
    backLab: 'Back to Raga Lab', universalTrainer: 'Universal ear trainer',
    universalDesc: 'Practise identifying swaras in any raga, or across all twelve.', openTrainer: 'Open the trainer',
    searchPlaceholder: 'Search ragas…', filterAll: 'All', filterVideos: 'With performances', filterPhrases: 'With aaroh/avaroh',
    countRagas: '{n} ragas', cardVideos: '{n} performances', cardPhrases: 'aaroh/avaroh', noMatch: 'No ragas match.',
    aboutTitle: 'About this project',
    aboutText: 'This is an ongoing project. For each raga I collect YouTube performances I have listened to, alongside ear training specific to that raga (swara identification, spotting the wrong note, what comes next) and a universal ear trainer. Shruti positions and aaroh/avaroh follow common practice and are open to correction by my teacher; ragas will keep being added.',
    secListen: 'Listen', secTrain: 'Ear training for this raga', videosEmpty: 'No performances have been added for this raga yet.',
    videosHow: 'To add one, fill in this raga’s entry in js/collection.js.', playVideo: 'Play', openYT: 'Open on YouTube',
    prevRaga: '← Previous raga', nextRaga: 'Next raga →', swarasCount: '{n} swaras', thatTuned: 'with shruti positions',
    drillOddTitle: 'Spot the wrong note', drillOddDesc: 'In this six-note phrase one swara has been swapped for a note outside the raga. Which position is it?',
    drillNextTitle: 'What comes next?', drillNextDesc: 'Hear the start of the aaroh or avaroh and choose the next swara.',
    drillPlay: 'Play phrase', drillReplay: 'Play again', drillScore: 'Score:', drillNeedsPhrases: 'This drill unlocks once the raga’s aaroh/avaroh is added.',
    oddCorrect: 'Correct! Position {pos} had {wrong} instead of {right}.',
    oddWrong: 'Not quite. The wrong note was at position {pos}: {wrong} (it should be {right}).',
    nextHint: 'The first {n} swaras of the {kind} were played. What comes next?', nextCorrect: 'Correct! The next swara is {swara}.', nextWrong: 'Not quite. The next swara was {swara}.',
    refNone: 'This raga has no separate shruti positions; the standard ratios are used.', posWord: 'position'
});
// हिन्दी में यहाँ ही नाम-अनुसार क्रम; 'all' सबसे अंत में।
function ragaKeys() {
    return Object.keys(RAGAS).sort((a, b) => {
        if (a === 'all') return 1;
        if (b === 'all') return -1;
        return ragaName(a).localeCompare(ragaName(b), lang === 'hi' ? 'hi' : 'en');
    });
}

function esc(text) {
    return String(text === undefined || text === null ? '' : text)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// सभी पन्नों के लिए एक ही भाषा-चयन।
const LANG_KEY = 'swarLang';
function detectLanguage() {
    try {
        const saved = localStorage.getItem(LANG_KEY);
        if (saved === 'hi' || saved === 'en') return saved;
    } catch (error) { /* ignore */ }
    // पहली बार: हिंदी/मराठी/संस्कृत/नेपाली ब्राउज़र में हिंदी, अन्यथा अंग्रेज़ी। इसे बदलने के लिए यहाँ 'hi' या 'en' लौटाएँ।
    return /^(hi|mr|sa|ne)/i.test(navigator.language || '') ? 'hi' : 'en';
}
function setLanguage(value) {
    lang = value;
    try { localStorage.setItem(LANG_KEY, value); } catch (error) { /* ignore */ }
}
