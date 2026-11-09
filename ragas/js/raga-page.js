/* एक राग का पन्ना: प्रदर्शन, नोट्स और इस राग के विशिष्ट अभ्यास।
   swara-app.js के बाद चलता है और उसके सामान्य फ़ंक्शन (playItems, getPhrases, notationHTML आदि) इस्तेमाल करता है। */
(function () {
    const key = window.LOCKED_RAGA;
    const raga = RAGAS[key];
    if (!raga || key === 'all') { location.replace('index.html'); return; }

    const byId = id => document.getElementById(id);
    const SEMI = { S: 0, r: 1, R: 2, g: 3, G: 4, m: 5, M: 6, P: 7, d: 8, D: 9, n: 10, N: 11 };
    const odd = { round: null, answered: false, score: 0, total: 0 };
    const nxt = { round: null, answered: false, score: 0, total: 0 };

    /* ---------- प्रदर्शन और नोट्स ---------- */
    function videoId(entry) {
        if (entry.id) return entry.id;
        const match = (entry.url || '').match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
        return match ? match[1] : null;
    }

    function renderVideos() {
        const entry = COLLECTION[key] || {};
        const list = (entry.videos || []).filter(video => videoId(video));
        const box = byId('videoList');
        if (list.length === 0) {
            box.innerHTML = `<p class="empty-note">${esc(t('videosEmpty'))} ${esc(t('videosHow'))}</p>`;
        } else {
            box.innerHTML = list.map((video, index) => {
                const id = videoId(video);
                const title = video.title || ragaName(key);
                return `<article class="video-card">`
                    + `<button class="video-thumb" type="button" data-index="${index}" aria-label="${esc(t('playVideo'))}: ${esc(title)}">`
                    + `<img loading="lazy" src="https://i.ytimg.com/vi/${esc(id)}/hqdefault.jpg" alt=""><span class="play-badge" aria-hidden="true">▶</span></button>`
                    + `<div class="video-meta"><h3>${esc(title)}</h3>`
                    + (video.artist ? `<p class="artist">${esc(video.artist)}</p>` : '')
                    + (video.note ? `<p class="vnote">${esc(video.note)}</p>` : '')
                    + `<a href="https://www.youtube.com/watch?v=${esc(id)}" target="_blank" rel="noopener noreferrer">${esc(t('openYT'))}</a></div></article>`;
            }).join('');
            box.querySelectorAll('.video-thumb').forEach(button => {
                button.addEventListener('click', () => {
                    const video = list[Number(button.dataset.index)];
                    const frame = document.createElement('iframe');
                    frame.className = 'video-frame';
                    frame.src = `https://www.youtube-nocookie.com/embed/${videoId(video)}?autoplay=1&rel=0${video.start ? `&start=${Number(video.start)}` : ''}`;
                    frame.title = video.title || ragaName(key);
                    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
                    frame.allowFullscreen = true;
                    button.replaceWith(frame);
                });
            });
        }
        byId('listenNotes').textContent = entry.notes || '';
    }

    function renderHeader() {
        byId('ragaTitle').textContent = ragaName(key);
        const other = lang === 'hi' ? (RAGA_EN[key] || '') : raga.name;
        const parts = [other, t('swarasCount', { n: num(raga.notes.length) })];
        if (raga.tuning && Object.keys(raga.tuning).length) parts.push(t('thatTuned'));
        byId('ragaSubtitle').textContent = parts.filter(Boolean).join(' · ');
        document.title = `${ragaName(key)} — ${t('lab')}`;
        byId('trainerLink').href = `trainer.html?r=${encodeURIComponent(key)}`;
    }

    function renderNav() {
        const keys = ragaKeys().filter(k => k !== 'all');
        const index = keys.indexOf(key);
        const prev = keys[(index - 1 + keys.length) % keys.length];
        const next = keys[(index + 1) % keys.length];
        byId('ragaNav').innerHTML =
            `<a href="raga.html?r=${encodeURIComponent(prev)}">${esc(t('prevRaga'))} · ${esc(ragaName(prev))}</a>`
            + `<a href="raga.html?r=${encodeURIComponent(next)}">${esc(ragaName(next))} · ${esc(t('nextRaga'))}</a>`;
    }

    /* ---------- अभ्यास 1: गलत स्वर पहचानिए ---------- */
    const ODD_LENGTH = 6;

    function showScore(id, box) { byId(id).textContent = `${num(box.score)}/${num(box.total)}`; }

    function oddButtons(enabled) {
        byId('oddButtons').innerHTML = Array.from({ length: ODD_LENGTH }, (_, i) =>
            `<button class="pos-btn" type="button" data-i="${i}" aria-label="${esc(t('posWord'))} ${num(i + 1)}"${enabled ? '' : ' disabled'}>${num(i + 1)}</button>`
        ).join('');
    }

    function oddPlay(items) {
        playItems(items, {
            noteDuration: 0.55, gap: 0.05,
            onNote: index => {
                byId('oddButtons').querySelectorAll('.pos-btn').forEach(b => b.classList.toggle('playing', Number(b.dataset.i) === index));
            },
            onDone: () => byId('oddButtons').querySelectorAll('.pos-btn').forEach(b => b.classList.remove('playing'))
        });
    }

    function oddNewRound() {
        if (state.isPlaying) return;
        const inRaga = SWARAS.filter(s => raga.notes.includes(s.id));
        const outside = SWARAS.filter(s => !raga.notes.includes(s.id));
        if (inRaga.length < 2 || outside.length === 0) return;

        let index = Math.floor(Math.random() * inRaga.length);
        const base = [];
        for (let i = 0; i < ODD_LENGTH; i++) {
            if (i > 0) {
                let candidate;
                do { candidate = Math.max(0, Math.min(inRaga.length - 1, index + Math.floor(Math.random() * 5) - 2)); } while (candidate === index);
                index = candidate;
            }
            base.push(inRaga[index]);
        }
        const pos = Math.floor(Math.random() * ODD_LENGTH);
        const right = base[pos];
        // राग से बाहर का सबसे पास का स्वर चुनें, ताकि गलती सुनने लायक हो।
        const distance = s => Math.abs(SEMI[s.id] - SEMI[right.id]);
        const nearest = Math.min(...outside.map(distance));
        const choices = outside.filter(s => distance(s) === nearest);
        const wrong = choices[Math.floor(Math.random() * choices.length)];

        const items = base.map(swara => ({ swara, mult: 1 }));
        items[pos] = { swara: wrong, mult: 1 };
        odd.round = { items, pos, wrong, right };
        odd.answered = false;
        oddButtons(true);
        byId('oddFeedback').textContent = '';
        byId('oddFeedback').className = 'feedback';
        byId('oddReplayBtn').disabled = false;
        oddPlay(items);
    }

    function oddAnswer(i) {
        const round = odd.round;
        if (!round || odd.answered || state.isPlaying) return;
        odd.answered = true;
        odd.total++;
        const ok = i === round.pos;
        if (ok) odd.score++;
        const buttons = byId('oddButtons').querySelectorAll('.pos-btn');
        buttons[round.pos].classList.add('correct');
        if (!ok) buttons[i].classList.add('wrong');
        const feedback = byId('oddFeedback');
        feedback.textContent = t(ok ? 'oddCorrect' : 'oddWrong', { pos: num(round.pos + 1), wrong: swaraName(round.wrong), right: swaraName(round.right) });
        feedback.className = `feedback ${ok ? 'success' : 'error'}`;
        showScore('oddScore', odd);
    }

    /* ---------- अभ्यास 2: आगे कौन-सा स्वर? ---------- */
    function pitchOf(item) { return SEMI[item.swara.id] + 12 * Math.log2(item.mult); }

    function nextNewRound() {
        if (state.isPlaying) return;
        const phrases = getPhrases(key);
        if (!phrases) return;
        const useAaroh = Math.random() < 0.5;
        const phrase = useAaroh ? phrases.aaroh : phrases.avaroh;
        if (phrase.length < 3) return;
        const k = 2 + Math.floor(Math.random() * (phrase.length - 2));
        const unique = new Map();
        [...phrases.aaroh, ...phrases.avaroh].forEach(item => unique.set(`${item.swara.id}|${item.mult}`, item));
        const options = [...unique.values()].sort((a, b) => pitchOf(a) - pitchOf(b));
        nxt.round = { prefix: phrase.slice(0, k), target: phrase[k], options, kind: t(useAaroh ? 'lblAaroh' : 'lblAvaroh'), n: k };
        nxt.answered = false;
        byId('nextOptions').innerHTML = options.map((item, i) =>
            `<button class="opt-btn" type="button" data-i="${i}">${notationHTML([item], 0)}</button>`).join('');
        byId('nextFeedback').textContent = t('nextHint', { kind: nxt.round.kind, n: num(k) });
        byId('nextFeedback').className = 'feedback';
        byId('nextReplayBtn').disabled = false;
        playItems(nxt.round.prefix, { noteDuration: 0.6, gap: 0.05 });
    }

    function nextAnswer(i) {
        const round = nxt.round;
        if (!round || nxt.answered || state.isPlaying) return;
        nxt.answered = true;
        nxt.total++;
        const chosen = round.options[i];
        const ok = chosen.swara.id === round.target.swara.id && chosen.mult === round.target.mult;
        if (ok) nxt.score++;
        const buttons = byId('nextOptions').querySelectorAll('.opt-btn');
        round.options.forEach((item, index) => {
            if (item.swara.id === round.target.swara.id && item.mult === round.target.mult) buttons[index].classList.add('correct');
        });
        if (!ok) buttons[i].classList.add('wrong');
        const feedback = byId('nextFeedback');
        feedback.textContent = t(ok ? 'nextCorrect' : 'nextWrong', { swara: swaraName(round.target.swara) });
        feedback.className = `feedback ${ok ? 'success' : 'error'}`;
        showScore('nextScore', nxt);
        playItems([...round.prefix, round.target], { noteDuration: 0.6, gap: 0.05 });
    }

    /* ---------- भाषा बदलने पर / आरम्भ ---------- */
    function renderAll() {
        renderHeader();
        renderVideos();
        renderNav();
        showScore('oddScore', odd);
        showScore('nextScore', nxt);
        const hasPhrases = Boolean(getPhrases(key));
        byId('nextControls').hidden = !hasPhrases;
        byId('nextDesc').textContent = hasPhrases ? t('drillNextDesc') : t('drillNeedsPhrases');
        if (!odd.round) oddButtons(false);
    }
    window.onLanguageApplied = renderAll;

    document.addEventListener('DOMContentLoaded', () => {
        byId('oddPlayBtn').addEventListener('click', oddNewRound);
        byId('oddReplayBtn').addEventListener('click', () => { if (odd.round && !state.isPlaying) oddPlay(odd.round.items); });
        byId('oddButtons').addEventListener('click', event => {
            const button = event.target.closest('.pos-btn');
            if (button && !button.disabled) oddAnswer(Number(button.dataset.i));
        });
        byId('nextPlayBtn').addEventListener('click', nextNewRound);
        byId('nextReplayBtn').addEventListener('click', () => {
            if (nxt.round && !state.isPlaying) playItems(nxt.answered ? [...nxt.round.prefix, nxt.round.target] : nxt.round.prefix, { noteDuration: 0.6, gap: 0.05 });
        });
        byId('nextOptions').addEventListener('click', event => {
            const button = event.target.closest('.opt-btn');
            if (button) nextAnswer(Number(button.dataset.i));
        });
        renderAll();
    });
})();
