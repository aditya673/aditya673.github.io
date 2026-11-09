/* रागा लैब का मुखपृष्ठ: सभी रागों की सूची, खोज और फ़िल्टर। */
(function () {
    let filter = 'all';
    let query = '';
    const byId = id => document.getElementById(id);

    function videoCount(key) {
        return ((COLLECTION[key] && COLLECTION[key].videos) || []).length;
    }

    function matches(key) {
        if (filter === 'videos' && videoCount(key) === 0) return false;
        if (filter === 'phrases' && !PHRASES[key]) return false;
        if (!query) return true;
        const haystack = `${RAGAS[key].name} ${RAGA_EN[key] || ''} ${key}`.toLowerCase();
        return haystack.includes(query);
    }

    function cardHTML(key) {
        const raga = RAGAS[key];
        const videos = videoCount(key);
        const mini = SWARAS.filter(s => raga.notes.includes(s.id)).map(swara => {
            const tuned = raga.tuning && raga.tuning[swara.id] !== undefined;
            const ati = tuned && swara.ati !== undefined && Math.abs(raga.tuning[swara.id] - swara.ati) < 1e-9;
            return `<span class="mini${ati ? ' ati' : ''}">${esc(sym(swara))}</span>`;
        }).join('');
        const other = lang === 'hi' ? (RAGA_EN[key] || '') : raga.name;
        const tags = (videos ? `<span class="tag has">${esc(t('cardVideos', { n: num(videos) }))}</span>` : '')
            + (PHRASES[key] ? `<span class="tag has">${esc(t('cardPhrases'))}</span>` : '');
        return `<a class="raga-card" href="raga.html?r=${encodeURIComponent(key)}">`
            + `<h3>${esc(ragaName(key))}</h3><p class="card-sub">${esc(other)}</p>`
            + `<div class="mini-swaras">${mini}</div><div class="card-badges">${tags}</div></a>`;
    }

    function render() {
        const keys = ragaKeys().filter(key => key !== 'all' && matches(key));
        byId('resultCount').textContent = t('countRagas', { n: num(keys.length) });
        byId('ragaGrid').innerHTML = keys.length
            ? keys.map(cardHTML).join('')
            : `<p class="empty-note">${esc(t('noMatch'))}</p>`;
    }

    function applyLanguage() {
        document.documentElement.lang = lang;
        document.title = t('lab');
        document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
        byId('searchInput').placeholder = t('searchPlaceholder');
        byId('langToggle').textContent = t('langBtn');
        render();
    }

    document.addEventListener('DOMContentLoaded', () => {
        lang = detectLanguage();
        byId('searchInput').addEventListener('input', event => {
            query = event.target.value.trim().toLowerCase();
            render();
        });
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                filter = chip.dataset.filter;
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('active', c === chip));
                render();
            });
        });
        byId('langToggle').addEventListener('click', () => {
            setLanguage(lang === 'hi' ? 'en' : 'hi');
            applyLanguage();
        });
        applyLanguage();
    });
})();
