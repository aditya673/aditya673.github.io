/* राग-डेटा / Raga data: स्वर, श्रुति-स्थान और आरोह-अवरोह।
   नया राग जोड़ने के लिए RAGAS, RAGA_EN (और चाहें तो PHRASES) में एक-एक पंक्ति जोड़ें। */
// आधार स्वर: मध्य सप्तक के पश्चिमी पिचों के समतुल्य नाम देवनागरी में।
const SCALES = [
    { name: 'सी', freq: 261.63 },
    { name: 'सी तीव्र / डी कोमल', freq: 277.18 },
    { name: 'डी', freq: 293.66 },
    { name: 'डी तीव्र / ई कोमल', freq: 311.13 },
    { name: 'ई', freq: 329.63 },
    { name: 'एफ', freq: 349.23 },
    { name: 'एफ तीव्र / जी कोमल', freq: 369.99 },
    { name: 'जी', freq: 392.00 },
    { name: 'जी तीव्र / ए कोमल', freq: 415.30 },
    { name: 'ए', freq: 440.00 },
    { name: 'ए तीव्र / बी कोमल', freq: 466.16 },
    { name: 'बी', freq: 493.88 }
];

// अति कोमल श्रुति-स्थान (पाइथागोरीय अनुपात), सामान्य कोमल स्वर से कुछ नीचे:
//   रे १६/१५ (११२ सेंट) → २५६/२४३ (९० सेंट)
//   ग ६/५ (३१६ सेंट)   → ३२/२७ (२९४ सेंट)
//   ध ८/५ (८१४ सेंट)   → १२८/८१ (७९२ सेंट)
//   नि ९/५ (१०१८ सेंट) → १६/९ (९९६ सेंट)
const ATI = { r: 256/243, g: 32/27, d: 128/81, n: 16/9 };

// बारह स्वर और उनके सामान्य (शुद्ध अंतराल) अनुपात। `ati` वह अति कोमल अनुपात है जो किसी राग में लग सकता है।
const SWARAS = [
    { id: 'S', symbol: 'सा', name: 'सा',        detail: 'षड्ज',  ratio: 1,     isShuddha: true },
    { id: 'r', symbol: 'रे', name: 'रे (कोमल)',  detail: 'कोमल',  ratio: 16/15, isShuddha: false, ati: ATI.r },
    { id: 'R', symbol: 'रे', name: 'रे (शुद्ध)', detail: 'शुद्ध', ratio: 9/8,   isShuddha: true },
    { id: 'g', symbol: 'ग',  name: 'ग (कोमल)',  detail: 'कोमल',  ratio: 6/5,   isShuddha: false, ati: ATI.g },
    { id: 'G', symbol: 'ग',  name: 'ग (शुद्ध)', detail: 'शुद्ध', ratio: 5/4,   isShuddha: true },
    { id: 'm', symbol: 'म',  name: 'म (शुद्ध)', detail: 'शुद्ध', ratio: 4/3,   isShuddha: true },
    { id: 'M', symbol: 'म',  name: 'म (तीव्र)', detail: 'तीव्र', ratio: 45/32, isShuddha: false },
    { id: 'P', symbol: 'प',  name: 'प',         detail: 'पंचम',  ratio: 3/2,   isShuddha: true },
    { id: 'd', symbol: 'ध',  name: 'ध (कोमल)',  detail: 'कोमल',  ratio: 8/5,   isShuddha: false, ati: ATI.d },
    { id: 'D', symbol: 'ध',  name: 'ध (शुद्ध)', detail: 'शुद्ध', ratio: 5/3,   isShuddha: true },
    { id: 'n', symbol: 'नि', name: 'नि (कोमल)', detail: 'कोमल',  ratio: 9/5,   isShuddha: false, ati: ATI.n },
    { id: 'N', symbol: 'नि', name: 'नि (शुद्ध)', detail: 'शुद्ध', ratio: 15/8,  isShuddha: true }
];

/* राग: `notes` में प्रयुक्त स्वर, `tuning` में उस राग के विशिष्ट श्रुति-स्थान (स्वर → अनुपात),
   `andolan` में वे स्वर जिन पर आंदोलन (धीमा कंपन) लगता है, और `note` में अतिरिक्त टिप्पणी।
   जिन रागों में `tuning` नहीं है, उनमें सामान्य अनुपात ही लगते हैं।
   श्रुति-स्थान परंपरा और घराने के अनुसार थोड़े बदलते हैं; किसी राग को बदलना हो तो केवल उसकी `tuning` पंक्ति बदलें। */
const RAGAS = {
    'abhogi':            { name: 'अभोगी', notes: ['S','R','g','m','D'] },
    'ahir_bhairav':      { name: 'अहीर भैरव', notes: ['S','r','G','m','P','D','n'], tuning: { r: ATI.r } },
    'alhaiya_bilawal':   { name: 'अल्हैया बिलावल', notes: ['S','R','G','m','P','D','n','N'] },
    'asavari':           { name: 'आसावरी', notes: ['S','R','g','m','P','d','n'] },
    'bageshri':          { name: 'बागेश्री', notes: ['S','R','g','m','P','D','n'] },
    'bahar':             { name: 'बहार', notes: ['S','R','g','m','P','D','n','N'] },
    'basant':            { name: 'बसंत', notes: ['S','r','G','m','M','P','d','N'] },
    'bhairav':           { name: 'भैरव', notes: ['S','r','G','m','P','d','N'], tuning: { r: ATI.r, d: ATI.d } },
    'bhairavi':          { name: 'भैरवी', notes: ['S','r','g','m','P','d','n'] },
    'bhimpalasi':        { name: 'भीमपलासी', notes: ['S','R','g','m','P','D','n'] },
    'bhoopali':          { name: 'भूपाली (भूप)', notes: ['S','R','G','P','D'], tuning: { R: 10/9, D: 5/3 },
                           note: 'रे को १०/९ पर रखा गया है, जिससे ध (५/३) के साथ शुद्ध पंचम-संवाद बनता है।',
                           noteEn: 'Re is set at 10/9, which makes a pure fifth with Dha (5/3).' },
    'bihag':             { name: 'बिहाग', notes: ['S','R','G','m','M','P','D','N'] },
    'bilawal':           { name: 'बिलावल', notes: ['S','R','G','m','P','D','N'] },
    'brindavani_sarang': { name: 'वृन्दावनी सारंग', notes: ['S','R','m','P','n','N'] },
    'charukeshi':        { name: 'चारुकेशी', notes: ['S','R','G','m','P','d','n'] },
    'darbari':           { name: 'दरबारी कान्हड़ा', notes: ['S','R','g','m','P','d','n'], tuning: { g: ATI.g, d: ATI.d }, andolan: ['g','d'],
                           note: 'ग और ध पर आंदोलन (धीमा कंपन) भी लगाया गया है, जो इस राग की पहचान है।',
                           noteEn: 'Ga and Dha also carry andolan (a slow oscillation), a hallmark of this raga.' },
    'desh':              { name: 'देश', notes: ['S','R','G','m','P','D','n','N'] },
    'durga':             { name: 'दुर्गा', notes: ['S','R','m','P','D'], tuning: { D: 27/16 },
                           note: 'ध को २७/१६ पर रखा गया है, जिससे रे (९/८) के साथ शुद्ध पंचम-संवाद बनता है।',
                           noteEn: 'Dha is set at 27/16, which makes a pure fifth with Re (9/8).' },
    'gorakh_kalyan':     { name: 'गोरख कल्याण', notes: ['S','R','m','D','n'] },
    'hameer':            { name: 'हमीर', notes: ['S','R','G','m','M','P','D','N'] },
    'hindol':            { name: 'हिंडोल', notes: ['S','G','M','D','N'] },
    'jaunpuri':          { name: 'जौनपुरी', notes: ['S','R','g','m','P','d','n'] },
    'jog':               { name: 'जोग', notes: ['S','g','G','m','P','n','N'] },
    'kafi':              { name: 'काफी', notes: ['S','R','g','m','P','D','n'] },
    'kedar':             { name: 'केदार', notes: ['S','R','G','m','M','P','D','N'] },
    'khamaj':            { name: 'खमाज', notes: ['S','R','G','m','P','D','n','N'] },
    'madhuvanti':        { name: 'मधुवंती', notes: ['S','R','g','M','P','D','N'] },
    'malkauns':          { name: 'मालकौंस', notes: ['S','g','m','d','n'], tuning: { g: ATI.g, d: ATI.d } },
    'marwa':             { name: 'मारवा', notes: ['S','r','G','M','D','N'], tuning: { r: ATI.r } },
    'megh':              { name: 'मेघ', notes: ['S','R','m','P','n'] },
    'multani':           { name: 'मुल्तानी', notes: ['S','r','g','M','P','d','N'], tuning: { r: ATI.r, g: ATI.g, d: ATI.d } },
    'patdeep':           { name: 'पटदीप', notes: ['S','R','g','m','P','D','N'] },
    'purvi':             { name: 'पूर्वी', notes: ['S','r','G','m','M','P','d','N'] },
    'shankara':          { name: 'शंकरा', notes: ['S','R','G','P','D','N'] },
    'shree':             { name: 'श्री', notes: ['S','r','G','M','P','d','N'], tuning: { r: ATI.r } },
    'shuddha_kalyan':    { name: 'शुद्ध कल्याण', notes: ['S','R','G','M','P','D','N'] },
    'sohini':            { name: 'सोहनी', notes: ['S','r','G','M','D','N'] },
    'tilak_kamod':       { name: 'तिलक कामोद', notes: ['S','R','G','m','P','D','N'] },
    'todi':              { name: 'तोड़ी', notes: ['S','r','g','M','P','d','N'], tuning: { r: ATI.r, g: ATI.g, d: ATI.d } },
    'yaman':             { name: 'यमन', notes: ['S','R','G','M','P','D','N'] },
    'bairagi_bhairav':   { name: 'बैरागी भैरव', notes: ['S','r','m','P','n'], tuning: { r: ATI.r } },
    'chandrakauns':      { name: 'चंद्रकौंस', notes: ['S','g','m','d','N'] },
    'gunkali':           { name: 'गुणकली', notes: ['S','r','m','P','d'], tuning: { r: ATI.r, d: ATI.d } },
    'bhupal_todi':       { name: 'भूपाल तोड़ी', notes: ['S','r','g','P','d'], tuning: { r: ATI.r, g: ATI.g, d: ATI.d } },
    'shivranjani':       { name: 'शिवरंजनी', notes: ['S','R','g','P','D'] },
    'hansadhwani':       { name: 'हंसध्वनि', notes: ['S','R','G','P','N'] },
    'kalavati':          { name: 'कलावती', notes: ['S','G','P','D','n'] },
    'kirwani':           { name: 'किरवानी', notes: ['S','R','g','m','P','d','N'] },
    'nat_bhairav':       { name: 'नट भैरव', notes: ['S','R','g','m','P','d','N'] },
    'vibhas':            { name: 'विभास', notes: ['S','r','G','P','d'] },
    'jaijaiwanti':       { name: 'जयजयवंती', notes: ['S','R','g','G','m','P','D','n','N'] },
    'puriya':            { name: 'पूरिया', notes: ['S','r','G','M','D','N'], tuning: { r: ATI.r } },
    'puriya_dhanashree': { name: 'पूरिया धनाश्री', notes: ['S','r','G','M','P','d','N'], tuning: { r: ATI.r } },
    'lalit':             { name: 'ललित', notes: ['S','r','G','m','M','d','N'] },
    'kamod':             { name: 'कामोद', notes: ['S','R','G','m','M','P','D','N'] },
    'maru_bihag':        { name: 'मारू बिहाग', notes: ['S','R','G','m','M','P','D','N'] },
    'miyan_malhar':      { name: 'मियाँ की मल्हार', notes: ['S','R','g','m','P','D','n','N'] },
    'all':               { name: 'सभी बारह स्वर', notes: ['S','r','R','g','G','m','M','P','d','D','n','N'] }
};

/* आरोह-अवरोह (भातखंडे परंपरा की सामान्य रूपरेखा)।
   संकेत: सा रे ग म प ध नि स्वर-अक्षर (कोमल: r g d n, तीव्र म: M, शुद्ध म: m); पहले बिंदु = मंद्र (.N), बाद में उद्धरण = तार (S')।
   जिन रागों की प्रविष्टि यहाँ नहीं है, उनके लिए केवल स्वर क्रम से बजेगा। नया राग जोड़ने या बदलने के लिए एक पंक्ति लिखें। */
const PHRASES = {
    abhogi:            ["S R g m D S'",            "S' D m g R S"],
    ahir_bhairav:      ["S r G m P D n S'",        "S' n D P m G r S"],
    asavari:           ["S R m P d S'",            "S' n d P m g R S"],
    bhairav:           ["S r G m P d N S'",        "S' N d P m G r S"],
    bhairavi:          ["S r g m P d n S'",        "S' n d P m g r S"],
    bhoopali:          ["S R G P D S'",            "S' D P G R S"],
    bilawal:           ["S R G m P D N S'",        "S' N D P m G R S"],
    brindavani_sarang: ["S R m P N S'",            "S' n P m R S"],
    charukeshi:        ["S R G m P d n S'",        "S' n d P m G R S"],
    darbari:           ["S R g m P d n S'",        "S' d n P m P g m R S"],
    desh:              ["S R m P N S'",            "S' n D P D m G R G S"],
    durga:             ["S R m P D S'",            "S' D P m R S"],
    hindol:            ["S G M D N S'",            "S' N D M G S"],
    jaunpuri:          ["S R m P d n S'",          "S' n d P m g R S"],
    kafi:              ["S R g m P D n S'",        "S' n D P m g R S"],
    khamaj:            ["S G m P D N S'",          "S' n D P m G R S"],
    madhuvanti:        [".N S g M P N S'",         "S' N D P M g R S"],
    malkauns:          ["S g m d n S'",            "S' n d m g S"],
    megh:              ["S R m P n S'",            "S' n P m R S"],
    todi:              ["S r g M P d N S'",        "S' N d P M g r S"],
    yaman:             [".N R G M P D N S'",       "S' N D P M G R S"],
    bairagi_bhairav:   ["S r m P n S'",            "S' n P m r S"],
    chandrakauns:      ["S g m d N S'",            "S' N d m g S"],
    gunkali:           ["S r m P d S'",            "S' d P m r S"],
    bhupal_todi:       ["S r g P d S'",            "S' d P g r S"],
    shivranjani:       ["S R g P D S'",            "S' D P g R S"],
    hansadhwani:       ["S R G P N S'",            "S' N P G R S"],
    kalavati:          ["S G P D n S'",            "S' n D P G S"],
    kirwani:           ["S R g m P d N S'",        "S' N d P m g R S"],
    vibhas:            ["S r G P d S'",            "S' d P G r S"]
};


const ROMAN = { S: 'Sa', r: 'Re', R: 'Re', g: 'Ga', G: 'Ga', m: 'Ma', M: 'Ma', P: 'Pa', d: 'Dha', D: 'Dha', n: 'Ni', N: 'Ni' };
const DETAIL_EN = { 'षड्ज': 'Shadja', 'कोमल': 'komal', 'शुद्ध': 'shuddha', 'तीव्र': 'tivra', 'पंचम': 'Pancham', 'अति कोमल': 'ati-komal' };
const SCALE_EN = ['C', 'C♯ / D♭', 'D', 'D♯ / E♭', 'E', 'F', 'F♯ / G♭', 'G', 'G♯ / A♭', 'A', 'A♯ / B♭', 'B'];
const RAGA_EN = {
    abhogi: 'Abhogi', ahir_bhairav: 'Ahir Bhairav', alhaiya_bilawal: 'Alhaiya Bilawal', asavari: 'Asavari', bageshri: 'Bageshri',
    bahar: 'Bahar', basant: 'Basant', bhairav: 'Bhairav', bhairavi: 'Bhairavi', bhimpalasi: 'Bhimpalasi', bhoopali: 'Bhoopali (Bhoop)',
    bihag: 'Bihag', bilawal: 'Bilawal', brindavani_sarang: 'Brindavani Sarang', charukeshi: 'Charukeshi', darbari: 'Darbari Kanada',
    desh: 'Desh', durga: 'Durga', gorakh_kalyan: 'Gorakh Kalyan', hameer: 'Hameer', hindol: 'Hindol', jaunpuri: 'Jaunpuri', jog: 'Jog',
    kafi: 'Kafi', kedar: 'Kedar', khamaj: 'Khamaj', madhuvanti: 'Madhuvanti', malkauns: 'Malkauns', marwa: 'Marwa', megh: 'Megh',
    multani: 'Multani', patdeep: 'Patdeep', purvi: 'Purvi', shankara: 'Shankara', shree: 'Shree', shuddha_kalyan: 'Shuddha Kalyan',
    sohini: 'Sohini', tilak_kamod: 'Tilak Kamod', todi: 'Todi', yaman: 'Yaman', bairagi_bhairav: 'Bairagi Bhairav', chandrakauns: 'Chandrakauns', gunkali: 'Gunkali', bhupal_todi: 'Bhupal Todi',
    shivranjani: 'Shivranjani', hansadhwani: 'Hansadhwani', kalavati: 'Kalavati', kirwani: 'Kirwani', nat_bhairav: 'Nat Bhairav',
    vibhas: 'Vibhas', jaijaiwanti: 'Jaijaiwanti', puriya: 'Puriya', puriya_dhanashree: 'Puriya Dhanashree', lalit: 'Lalit',
    kamod: 'Kamod', maru_bihag: 'Maru Bihag', miyan_malhar: 'Miyan ki Malhar',
    all: 'All twelve swaras'
};
