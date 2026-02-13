import './app.js'; // Imports Supabase client
import { generatePitch } from './demo-generator.js';

// ─── SCORING: Genre (40%) + Mood (35%) + Energy (25%) ───

export function calculateMatchScore(label, userGenre, userMood, userEnergy) {
    let genreScore = 0;
    let moodScore = 0;
    let energyScore = 0;

    // 1. GENRE MATCH (40 pts)
    const subs = Array.isArray(label.subgenres) ? label.subgenres : [];
    const selLower = userGenre.toLowerCase();

    // Genre alias mapping for flexible matching
    const genreAliases = {
        'melodic techno': ['melodic techno', 'melodic house & techno', 'melodic house'],
        'melodic house': ['melodic house & techno', 'melodic house', 'melodic techno'],
        'house': ['house', 'deep house', 'tech house'],
        'deep house': ['deep house', 'house'],
        'tech house': ['tech house', 'house', 'minimal|deep tech'],
        'minimal': ['minimal|deep tech', 'minimal', 'deep tech'],
        'peak-time techno': ['techno', 'peak-time techno'],
        'hard techno': ['techno', 'hard techno'],
        'industrial techno': ['techno', 'industrial techno'],
        'afro house': ['afro house'],
        'organic house': ['organic house', 'electronica|downtempo', 'deep house'],
        'trance': ['trance'],
        'psy-trance': ['psy-trance', 'trance'],
        'progressive house': ['progressive house', 'melodic house & techno'],
        'dubstep': ['dubstep'],
        'drum and bass': ['drum&bass', 'drum and bass'],
        'breaks': ['breaks'],
        'electro house': ['electro house'],
        'big room': ['big room', 'electro house'],
        'hard dance': ['hard dance|hardcore', 'hard dance'],
        'downtempo': ['electronica|downtempo', 'ambient'],
        'ambient': ['ambient', 'electronica|downtempo'],
        'indie dance': ['indie dance', 'melodic house & techno'],
        'nu disco': ['nu disco', 'house'],
        'dance': ['dance'],
        'future house': ['future house'],
        'bass house': ['bass house', 'future house']
    };

    const aliases = genreAliases[selLower] || [selLower];

    const hasGenreMatch = subs.some(g => {
        const gLower = g.toLowerCase();
        return aliases.some(alias =>
            gLower.includes(alias) || alias.includes(gLower) ||
            alias.split(' ').some(w => w.length > 3 && gLower.includes(w))
        );
    });
    if (hasGenreMatch) genreScore = 40;

    // 2. MOOD MATCH (35 pts)
    const labelMoods = Array.isArray(label.mood) ? label.mood.map(m => m.toLowerCase()) : [];
    if (labelMoods.length > 0) {
        // Mood affinity map — related moods get partial score
        const moodAffinities = {
            'dark': ['hypnotic', 'atmospheric', 'driving'],
            'hypnotic': ['dark', 'atmospheric', 'warm'],
            'driving': ['energetic', 'dark'],
            'uplifting': ['euphoric', 'emotional', 'ethereal'],
            'emotional': ['melancholic', 'ethereal', 'warm', 'uplifting'],
            'ethereal': ['atmospheric', 'warm', 'emotional', 'dreamy'],
            'groovy': ['warm', 'energetic', 'funky'],
            'energetic': ['driving', 'groovy', 'raw'],
            'atmospheric': ['ethereal', 'dark', 'hypnotic', 'cinematic'],
            'warm': ['groovy', 'ethereal', 'deep']
        };

        if (labelMoods.includes(userMood)) {
            moodScore = 35;
        } else {
            const related = moodAffinities[userMood] || [];
            const overlap = labelMoods.filter(m => related.includes(m));
            if (overlap.length > 0) moodScore = 20;
        }
    } else {
        // No mood data → give partial credit if genre matched
        moodScore = hasGenreMatch ? 10 : 0;
    }

    // 3. ENERGY MATCH (25 pts)
    const labelEnergy = (label.energy || label.energy_profile || '').toLowerCase();
    if (labelEnergy) {
        if (labelEnergy === userEnergy) {
            energyScore = 25;
        } else if (
            (labelEnergy === 'high' && userEnergy === 'medium') ||
            (labelEnergy === 'medium' && userEnergy === 'high') ||
            (labelEnergy === 'medium' && userEnergy === 'low') ||
            (labelEnergy === 'low' && userEnergy === 'medium')
        ) {
            energyScore = 12;
        }
    } else {
        // No energy data → give partial credit if genre matched
        energyScore = hasGenreMatch ? 8 : 0;
    }

    return genreScore + moodScore + energyScore;
}

// ─── RENDER LABEL CARDS ───

export function renderLabels(labels, containerId = 'labels-grid') {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = '';

    labels.forEach(label => {
        const card = document.createElement('div');
        card.className = 'label-card';
        card.style.cursor = 'pointer';

        // Score badge
        let badgeClass = 'match-badge';
        if (label.matchScore < 70) badgeClass += ' medium';
        if (label.matchScore < 40) badgeClass += ' low';

        // Subgenres (max 3)
        const subgenres = (label.subgenres || []).slice(0, 3).map(g =>
            `<span class="genre-tag">${g}</span>`
        ).join('');

        // Mood tags (max 2)
        const moods = (label.mood || []).slice(0, 2).map(m =>
            `<span class="genre-tag mood-tag">${m}</span>`
        ).join('');

        // Energy indicator
        const energyVal = label.energy || label.energy_profile || '';
        const energyIcon = energyVal === 'high' ? '🔥' : energyVal === 'medium' ? '⚡' : energyVal === 'low' ? '🌙' : '';

        card.innerHTML = `
            <div class="label-header">
                <div>
                    <div class="label-name">${label.name}</div>
                    <div class="label-location">${energyIcon} ${label.country || ''}</div>
                </div>
                <div class="${badgeClass}">${label.matchScore}%</div>
            </div>
            <div class="tags-container">
                ${subgenres}${moods}
            </div>
            ${label.bio ? `<p class="label-bio-preview">${label.bio.substring(0, 80)}...</p>` : ''}
        `;

        // Open label detail on click
        card.addEventListener('click', () => {
            openLabelDetail(label);
        });

        grid.appendChild(card);
    });
}

// ─── LABEL DETAIL MODAL ───

let currentDetailLabel = null;

function openLabelDetail(label) {
    currentDetailLabel = label;
    const modal = document.getElementById('label-detail-modal');
    if (!modal) return;

    document.getElementById('ld-name').textContent = label.name;
    document.getElementById('ld-score').textContent = `${label.matchScore}% Match`;

    // Bio
    const bioEl = document.getElementById('ld-bio');
    bioEl.textContent = label.bio || 'No description available for this label.';

    // Tags (genres + moods + styles)
    const tagsEl = document.getElementById('ld-tags');
    tagsEl.innerHTML = '';
    const allTags = [
        ...(label.subgenres || []).map(g => ({ text: g, type: 'genre' })),
        ...(label.mood || []).map(m => ({ text: m, type: 'mood' })),
        ...(label.style || []).map(s => ({ text: s, type: 'style' }))
    ];
    allTags.forEach(tag => {
        const span = document.createElement('span');
        span.className = `ld-tag ld-tag-${tag.type}`;
        span.textContent = tag.text;
        tagsEl.appendChild(span);
    });

    // Energy
    const energyVal = label.energy || label.energy_profile || '';
    const energyWrap = document.getElementById('ld-energy-wrap');
    if (energyVal) {
        document.getElementById('ld-energy').textContent = energyVal.charAt(0).toUpperCase() + energyVal.slice(1);
        energyWrap.style.display = '';
    } else {
        energyWrap.style.display = 'none';
    }

    // Demo email
    const emailWrap = document.getElementById('ld-email-wrap');
    const demoEmail = label.demo_email || label.email || '';
    // Only show if it looks like an actual email
    const isEmail = demoEmail.includes('@') && !demoEmail.includes('http');
    if (isEmail) {
        const emailEl = document.getElementById('ld-email');
        emailEl.textContent = demoEmail;
        emailEl.href = `mailto:${demoEmail}`;
        emailWrap.style.display = '';
    } else {
        emailWrap.style.display = 'none';
    }

    // Website
    const websiteWrap = document.getElementById('ld-website-wrap');
    if (label.website) {
        const wsEl = document.getElementById('ld-website');
        wsEl.textContent = label.website.replace(/^https?:\/\//, '');
        wsEl.href = label.website;
        websiteWrap.style.display = '';
    } else {
        websiteWrap.style.display = 'none';
    }

    // SoundCloud
    const scWrap = document.getElementById('ld-sc-wrap');
    if (label.soundcloud_url) {
        document.getElementById('ld-soundcloud').href = label.soundcloud_url;
        scWrap.style.display = '';
    } else {
        scWrap.style.display = 'none';
    }

    // Generate Pitch button — show only if there's a valid email
    const pitchBtn = document.getElementById('ld-generate-pitch');
    if (isEmail) {
        pitchBtn.style.display = 'block';
    } else {
        pitchBtn.style.display = 'none';
    }

    modal.classList.remove('hidden');
}

// ─── PITCH MODAL LOGIC ───

let currentEmails = [];
let currentPitchLabel = null;

function initPitchModal() {
    const pitchModal = document.getElementById('pitch-modal');
    const detailModal = document.getElementById('label-detail-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const closeDetailBtn = document.getElementById('close-label-detail');
    const copyBtn = document.getElementById('copy-btn');
    const mailtoBtn = document.getElementById('mailto-btn');
    const retryBtn = document.getElementById('retry-pitch');
    const tabBtns = document.querySelectorAll('#pitch-modal .tab-btn');
    const generateBtn = document.getElementById('ld-generate-pitch');

    // Close detail modal
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', () => detailModal.classList.add('hidden'));
    }
    if (detailModal) {
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) detailModal.classList.add('hidden');
        });
    }

    // Close pitch modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => pitchModal.classList.add('hidden'));
    }
    if (pitchModal) {
        pitchModal.addEventListener('click', (e) => {
            if (e.target === pitchModal) pitchModal.classList.add('hidden');
        });
    }

    // Generate pitch from detail modal
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            if (!currentDetailLabel) return;
            currentPitchLabel = currentDetailLabel;
            detailModal.classList.add('hidden');
            await showPitchModal(currentDetailLabel);
        });
    }

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.tab);
            if (!currentEmails[idx]) return;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('email-subject').textContent = `Subject: ${currentEmails[idx].subject}`;
            document.getElementById('email-body').textContent = currentEmails[idx].body;
        });
    });

    // Copy button
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const subject = document.getElementById('email-subject').textContent.replace('Subject: ', '');
            const body = document.getElementById('email-body').textContent;
            navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`).then(() => {
                copyBtn.textContent = '✅ Copied!';
                setTimeout(() => copyBtn.textContent = '📋 Copy to Clipboard', 2000);
            });
        });
    }

    // Open in Mail App
    if (mailtoBtn) {
        mailtoBtn.addEventListener('click', () => {
            const subject = document.getElementById('email-subject').textContent.replace('Subject: ', '');
            const body = document.getElementById('email-body').textContent;
            const email = currentPitchLabel?.demo_email || currentPitchLabel?.email || '';
            const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;
        });
    }

    // Retry
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            if (currentPitchLabel) showPitchModal(currentPitchLabel);
        });
    }
}

async function showPitchModal(label) {
    const pitchModal = document.getElementById('pitch-modal');
    const pitchLoading = document.getElementById('pitch-loading');
    const pitchContent = document.getElementById('pitch-content');
    const pitchError = document.getElementById('pitch-error');

    pitchModal.classList.remove('hidden');
    pitchLoading.classList.remove('hidden');
    pitchContent.classList.add('hidden');
    pitchError.classList.add('hidden');

    // Get stored metrics
    const storedMetrics = localStorage.getItem('trackMetrics');
    const trackMetrics = storedMetrics ? JSON.parse(storedMetrics).metrics : {};

    try {
        const variants = await generatePitch(label, trackMetrics);
        currentEmails = variants;

        if (currentEmails[0]) {
            document.getElementById('email-subject').textContent = `Subject: ${currentEmails[0].subject}`;
            document.getElementById('email-body').textContent = currentEmails[0].body;
        }

        // Reset tabs
        document.querySelectorAll('#pitch-modal .tab-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === 0);
        });

        pitchLoading.classList.add('hidden');
        pitchContent.classList.remove('hidden');
    } catch (err) {
        console.error('Pitch generation error:', err);
        pitchLoading.classList.add('hidden');
        pitchError.classList.remove('hidden');
    }
}

// ─── ALSO SUPPORT LEGACY open-pitch-modal EVENT (from analysis.js) ───

document.addEventListener('open-pitch-modal', async (e) => {
    currentPitchLabel = e.detail.label;
    await showPitchModal(e.detail.label);
});

// ─── STANDALONE PAGE LOGIC (label-fit.html) ───
const isLabelFitPage = document.getElementById('no-results') !== null;

if (isLabelFitPage) {
    document.addEventListener('DOMContentLoaded', async () => {
        const loader = document.getElementById('loader');
        const labelsGrid = document.getElementById('labels-grid');
        const noResults = document.getElementById('no-results');

        const storedMetrics = localStorage.getItem('trackMetrics');
        if (!storedMetrics) {
            alert('No analysis data found. Please analyze a track first.');
            window.location.href = 'analysis.html';
            return;
        }

        const { metrics } = JSON.parse(storedMetrics);

        try {
            const { data: labels, error } = await window.supabaseClient
                .from('labels')
                .select('*');
            if (error) throw error;

            const matchedLabels = labels.map(label => {
                const matchScore = calculateMatchScore(label, 'house', 'groovy', 'medium');
                return { ...label, matchScore };
            });
            matchedLabels.sort((a, b) => b.matchScore - a.matchScore);
            const topLabels = matchedLabels.slice(0, 20);

            loader.classList.add('hidden');

            if (topLabels.length === 0) {
                noResults.classList.remove('hidden');
                return;
            }

            renderLabels(topLabels);
            labelsGrid.classList.remove('hidden');
        } catch (err) {
            console.error('Error fetching labels:', err);
            loader.classList.add('hidden');
            alert('Failed to load labels.');
        }

        initPitchModal();
    });
} else {
    // On analysis.html, init modals after DOM
    document.addEventListener('DOMContentLoaded', () => {
        initPitchModal();
    });
}
