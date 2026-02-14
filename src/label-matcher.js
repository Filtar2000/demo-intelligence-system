import './app.js'; // Imports Supabase client
import { generatePitch } from './demo-generator.js';

// ─── HELPER: Capitalize first letter ───
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── SCORING: Genre (40%) + Mood (35%) + Energy (25%) ───

export function calculateMatchScore(label, userGenre, userMood, userEnergy) {
    let genreScore = 0;
    let moodScore = 0;
    let energyScore = 0;

    const selLower = (userGenre || '').toLowerCase().trim();
    const moodLower = (userMood || '').toLowerCase().trim();
    const energyLower = (userEnergy || '').toLowerCase().trim();

    // 1. GENRE MATCH (40 pts)
    const subs = Array.isArray(label.subgenres)
        ? label.subgenres.map(s => String(s).toLowerCase().trim())
        : [];

    // Comprehensive genre alias mapping based on Beatport categories
    const genreAliases = {
        'melodic house & techno': ['melodic house & techno', 'melodic house', 'melodic techno', 'progressive house'],
        'melodic house': ['melodic house & techno', 'melodic house', 'melodic techno', 'progressive house'],
        'melodic techno': ['melodic house & techno', 'melodic techno', 'melodic house', 'progressive house'],
        'house': ['house', 'deep house', 'tech house', 'funky house', 'jackin house', 'soulful house'],
        'deep house': ['deep house', 'house', 'organic house', 'soulful house'],
        'tech house': ['tech house', 'house', 'minimal|deep tech', 'deep tech'],
        'minimal': ['minimal|deep tech', 'minimal', 'deep tech', 'minimal techno'],
        'deep tech': ['deep tech', 'minimal|deep tech', 'tech house', 'minimal'],
        'techno': ['techno', 'peak-time techno', 'hard techno', 'industrial techno', 'raw techno'],
        'peak-time techno': ['techno', 'peak-time techno', 'hard techno', 'driving techno'],
        'hard techno': ['techno', 'hard techno', 'industrial techno', 'peak-time techno'],
        'industrial techno': ['techno', 'industrial techno', 'hard techno'],
        'raw techno': ['techno', 'raw techno', 'hard techno'],
        'afro house': ['afro house', 'afro tech', 'organic house'],
        'afro tech': ['afro tech', 'afro house', 'tech house'],
        'organic house': ['organic house', 'electronica|downtempo', 'deep house', 'afro house', 'downtempo'],
        'trance': ['trance', 'uplifting trance', 'vocal trance'],
        'psy-trance': ['psy-trance', 'trance', 'psytrance'],
        'progressive house': ['progressive house', 'melodic house & techno', 'melodic techno', 'progressive trance'],
        'progressive trance': ['progressive trance', 'progressive house', 'trance'],
        'dubstep': ['dubstep', 'riddim'],
        'drum and bass': ['drum&bass', 'drum and bass', 'dnb', 'jungle'],
        'drum&bass': ['drum&bass', 'drum and bass', 'dnb', 'jungle'],
        'breaks': ['breaks', 'breakbeat', 'uk bass'],
        'electro house': ['electro house', 'electro', 'big room'],
        'big room': ['big room', 'electro house', 'mainstage'],
        'hard dance': ['hard dance|hardcore', 'hard dance', 'hardcore', 'hardstyle'],
        'downtempo': ['electronica|downtempo', 'ambient', 'downtempo', 'organic house', 'chillout'],
        'ambient': ['ambient', 'electronica|downtempo', 'downtempo'],
        'indie dance': ['indie dance', 'nu disco', 'melodic house & techno'],
        'nu disco': ['nu disco', 'indie dance', 'disco', 'house'],
        'dance': ['dance', 'dance/pop', 'pop dance'],
        'future house': ['future house', 'bass house', 'house'],
        'bass house': ['bass house', 'future house', 'house', 'uk bass'],
        'uk garage': ['uk garage', 'garage', 'speed garage', 'bassline'],
        'latin house': ['latin house', 'house', 'afro house'],
        'jackin house': ['jackin house', 'house', 'funky house', 'tech house'],
        'soulful house': ['soulful house', 'deep house', 'house', 'vocal house'],
        'electronica': ['electronica|downtempo', 'electronica', 'ambient', 'experimental']
    };

    const aliases = genreAliases[selLower] || [selLower];

    // Check for genre match with flexible matching
    let bestGenreMatch = 0;
    for (const sub of subs) {
        for (const alias of aliases) {
            if (sub === alias) {
                bestGenreMatch = 40; // exact match
                break;
            }
            if (sub.includes(alias) || alias.includes(sub)) {
                bestGenreMatch = Math.max(bestGenreMatch, 35); // partial match
            }
            // Check shared keywords (3+ chars)
            const keywords = alias.split(/[\s&|/]+/).filter(w => w.length > 3);
            if (keywords.some(w => sub.includes(w))) {
                bestGenreMatch = Math.max(bestGenreMatch, 25); // keyword match
            }
        }
        if (bestGenreMatch === 40) break;
    }
    genreScore = bestGenreMatch;

    // 2. MOOD MATCH (35 pts)
    const labelMoods = Array.isArray(label.mood) ? label.mood.map(m => m.toLowerCase().trim()) : [];
    if (labelMoods.length > 0 && moodLower) {
        // Comprehensive mood affinity map
        const moodAffinities = {
            'dark': ['hypnotic', 'atmospheric', 'driving', 'raw', 'industrial', 'intense'],
            'hypnotic': ['dark', 'atmospheric', 'warm', 'deep', 'minimal', 'trippy'],
            'driving': ['energetic', 'dark', 'raw', 'powerful', 'intense', 'peak-time'],
            'uplifting': ['euphoric', 'emotional', 'ethereal', 'melodic', 'dreamy', 'positive'],
            'emotional': ['melancholic', 'ethereal', 'warm', 'uplifting', 'dreamy', 'cinematic'],
            'ethereal': ['atmospheric', 'warm', 'emotional', 'dreamy', 'ambient', 'cinematic'],
            'groovy': ['warm', 'energetic', 'funky', 'soulful', 'deep', 'playful'],
            'energetic': ['driving', 'groovy', 'raw', 'powerful', 'intense', 'peak-time'],
            'atmospheric': ['ethereal', 'dark', 'hypnotic', 'cinematic', 'ambient', 'deep'],
            'warm': ['groovy', 'ethereal', 'deep', 'soulful', 'organic', 'emotional']
        };

        if (labelMoods.includes(moodLower)) {
            moodScore = 35; // Direct match
        } else {
            const related = moodAffinities[moodLower] || [];
            const overlap = labelMoods.filter(m => related.includes(m));
            if (overlap.length > 0) {
                moodScore = Math.min(25, 15 + (overlap.length * 5)); // Partial, scaled by matches
            }
        }
    } else if (labelMoods.length === 0) {
        // No mood data — give neutral score so labels aren't penalized
        moodScore = 12;
    }

    // 3. ENERGY MATCH (25 pts)
    const labelEnergy = (label.energy || '').toLowerCase().trim();
    if (labelEnergy && energyLower) {
        const energyLevels = { 'low': 1, 'medium': 2, 'high': 3 };
        const userLevel = energyLevels[energyLower] || 2;
        const labelLevel = energyLevels[labelEnergy] || 2;
        const diff = Math.abs(userLevel - labelLevel);

        if (diff === 0) energyScore = 25;      // Exact match
        else if (diff === 1) energyScore = 12;  // Adjacent
        else energyScore = 3;                    // Opposite
    } else if (!labelEnergy) {
        // No energy data — give neutral score
        energyScore = 8;
    }

    return genreScore + moodScore + energyScore;
}

// ─── RENDER LABEL CARDS ───

export function renderLabels(labels, containerId = 'labels-grid') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    labels.forEach(label => {
        const card = document.createElement('div');
        card.className = 'label-card';
        card.style.cursor = 'pointer';

        // Score badge class
        const scoreNum = Math.round(label.matchScore);
        const badgeClass = scoreNum >= 70 ? '' : scoreNum >= 40 ? 'medium' : 'low';

        // Tags
        const subs = Array.isArray(label.subgenres) ? label.subgenres.slice(0, 3) : [];
        const moods = Array.isArray(label.mood) ? label.mood.slice(0, 2) : [];

        const tagsHtml = [
            ...subs.map(g => `<span class="genre-tag">${capitalize(g)}</span>`),
            ...moods.map(m => `<span class="genre-tag mood-tag">${capitalize(m)}</span>`)
        ].join('');

        // Energy icon
        const energy = (label.energy || '').toLowerCase();
        const energyIcon = energy === 'high' ? '🔥' : energy === 'medium' ? '⚡' : energy === 'low' ? '🌊' : '';

        // Bio preview
        const bio = label.bio || '';
        const bioPreview = bio.length > 80 ? bio.substring(0, 80) + '…' : bio;

        card.innerHTML = `
            <div class="label-header">
                <div>
                    <div class="label-name">${label.name || 'Unknown'} ${energyIcon}</div>
                    <div class="label-location">${label.location || ''}</div>
                </div>
                <span class="match-badge ${badgeClass}">${scoreNum}%</span>
            </div>
            <div class="tags-container">${tagsHtml}</div>
            ${bioPreview ? `<div class="label-bio-preview">${bioPreview}</div>` : ''}
        `;

        card.addEventListener('click', () => openLabelDetail(label));
        container.appendChild(card);
    });

    // Init modals after rendering
    initPitchModal();
}

// ─── LABEL DETAIL MODAL ───

let currentDetailLabel = null;

function openLabelDetail(label) {
    currentDetailLabel = label;
    const modal = document.getElementById('label-detail-modal');
    if (!modal) return;

    // Name + Score
    document.getElementById('ld-name').textContent = label.name || 'Unknown';
    const scoreEl = document.getElementById('ld-score');
    if (scoreEl) scoreEl.textContent = `${Math.round(label.matchScore || 0)}% Match`;

    // Bio
    const bioEl = document.getElementById('ld-bio');
    if (bioEl) bioEl.textContent = label.bio || 'No description available.';

    // Tags
    const tagsEl = document.getElementById('ld-tags');
    if (tagsEl) {
        const subs = Array.isArray(label.subgenres) ? label.subgenres : [];
        const moods = Array.isArray(label.mood) ? label.mood : [];
        const styles = Array.isArray(label.style) ? label.style : [];
        tagsEl.innerHTML = [
            ...subs.map(g => `<span class="ld-tag ld-tag-genre">${capitalize(g)}</span>`),
            ...moods.map(m => `<span class="ld-tag ld-tag-mood">${capitalize(m)}</span>`),
            ...styles.map(s => `<span class="ld-tag ld-tag-style">${capitalize(s)}</span>`)
        ].join('');
    }

    // Energy
    const energyEl = document.getElementById('ld-energy');
    if (energyEl) energyEl.textContent = capitalize(label.energy || 'N/A');

    // Demo email
    const emailWrap = document.getElementById('ld-email-wrap');
    const demoEmail = label.demo_email || label.email || '';
    const isEmail = demoEmail.includes('@') && !demoEmail.includes('http');
    if (emailWrap) {
        if (isEmail) {
            const emailEl = document.getElementById('ld-email');
            emailEl.textContent = demoEmail;
            emailEl.href = `mailto:${demoEmail}`;
            emailWrap.style.display = '';
        } else {
            emailWrap.style.display = 'none';
        }
    }

    // Website
    const websiteWrap = document.getElementById('ld-website-wrap');
    if (websiteWrap) {
        if (label.website) {
            const wsEl = document.getElementById('ld-website');
            wsEl.textContent = label.website.replace(/^https?:\/\//, '');
            wsEl.href = label.website;
            websiteWrap.style.display = '';
        } else {
            websiteWrap.style.display = 'none';
        }
    }

    // SoundCloud
    const scWrap = document.getElementById('ld-sc-wrap');
    if (scWrap) {
        if (label.soundcloud_url) {
            document.getElementById('ld-soundcloud').href = label.soundcloud_url;
            scWrap.style.display = '';
        } else {
            scWrap.style.display = 'none';
        }
    }

    // Generate Pitch button — always show (even without email, pitch is useful)
    const pitchBtn = document.getElementById('ld-generate-pitch');
    if (pitchBtn) {
        pitchBtn.style.display = 'block';
    }

    modal.classList.remove('hidden');

    // Ensure pitch modal bindings are always initialized
    initPitchModal();
}

// ─── PITCH MODAL LOGIC ───

let currentEmails = [];
let currentPitchLabel = null;
let pitchModalInitialized = false;

function initPitchModal() {
    // Prevent double-binding
    if (pitchModalInitialized) return;
    pitchModalInitialized = true;

    const pitchModal = document.getElementById('pitch-modal');
    const detailModal = document.getElementById('label-detail-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const closeDetailBtn = document.getElementById('close-label-detail');
    const copyBtn = document.getElementById('copy-btn');
    const mailtoBtn = document.getElementById('mailto-btn');
    const retryBtn = document.getElementById('retry-pitch');
    const tabBtns = document.querySelectorAll('#pitch-modal .tab-btn');
    const generateBtn = document.getElementById('ld-generate-pitch');

    // ─ Close detail modal ─
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (detailModal) detailModal.classList.add('hidden');
        });
    }
    if (detailModal) {
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) detailModal.classList.add('hidden');
        });
    }

    // ─ Close pitch modal ─
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (pitchModal) pitchModal.classList.add('hidden');
        });
    }
    if (pitchModal) {
        pitchModal.addEventListener('click', (e) => {
            if (e.target === pitchModal) pitchModal.classList.add('hidden');
        });
    }

    // ─ Generate pitch from detail modal ─
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            if (!currentDetailLabel) return;
            currentPitchLabel = currentDetailLabel;
            if (detailModal) detailModal.classList.add('hidden');
            await showPitchModal(currentDetailLabel);
        });
    }

    // ─ Tab switching ─
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

    // ─ Copy button ─
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

    // ─ Open in Mail App ─
    if (mailtoBtn) {
        mailtoBtn.addEventListener('click', () => {
            const subject = document.getElementById('email-subject').textContent.replace('Subject: ', '');
            const body = document.getElementById('email-body').textContent;
            const email = currentPitchLabel?.demo_email || currentPitchLabel?.email || '';
            const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;
        });
    }

    // ─ Retry ─
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            if (currentPitchLabel) showPitchModal(currentPitchLabel);
        });
    }

    // ─ Mark as Sent — auto-create submission in CRM ─
    const markSentBtn = document.getElementById('mark-sent-btn');
    const markSentConfirm = document.getElementById('mark-sent-confirm');

    if (markSentBtn) {
        markSentBtn.addEventListener('click', async () => {
            if (!currentPitchLabel) return;
            if (!window.supabaseClient) {
                markSentBtn.textContent = 'Login required to track';
                markSentBtn.disabled = true;
                return;
            }

            const { data: { user } } = await window.supabaseClient.auth.getUser();
            if (!user) {
                markSentBtn.textContent = 'Login required to track';
                markSentBtn.disabled = true;
                return;
            }

            markSentBtn.disabled = true;
            markSentBtn.textContent = 'Saving...';

            // Get track name from localStorage analysis data
            const storedMetrics = localStorage.getItem('trackMetrics');
            let trackName = '';
            if (storedMetrics) {
                try {
                    const parsed = JSON.parse(storedMetrics);
                    trackName = parsed.filename || '';
                } catch (e) { /* ignore */ }
            }
            // Fallback: try the global currentAudioFile if on analysis page
            if (!trackName && window.currentAudioFile) {
                trackName = window.currentAudioFile.name;
            }

            const today = new Date().toISOString().split('T')[0];

            try {
                const { error } = await window.supabaseClient
                    .from('submissions')
                    .insert({
                        user_id: user.id,
                        label_name: currentPitchLabel.name,
                        track_name: trackName || null,
                        sent_date: today,
                        status: 'sent',
                        notes: `Pitched via DIS — ${currentPitchLabel.name}`
                    });

                if (error) throw error;

                // Success
                markSentBtn.classList.add('hidden');
                if (markSentConfirm) markSentConfirm.classList.remove('hidden');
            } catch (err) {
                console.error('Error tracking submission:', err);
                markSentBtn.textContent = '✗ Error — try again';
                markSentBtn.disabled = false;
            }
        });
    }
}

async function showPitchModal(label) {
    const pitchModal = document.getElementById('pitch-modal');
    const pitchLoading = document.getElementById('pitch-loading');
    const pitchContent = document.getElementById('pitch-content');
    const pitchError = document.getElementById('pitch-error');

    if (!pitchModal) return;

    pitchModal.classList.remove('hidden');
    if (pitchLoading) pitchLoading.classList.remove('hidden');
    if (pitchContent) pitchContent.classList.add('hidden');
    if (pitchError) pitchError.classList.add('hidden');

    // Reset "Mark as Sent" state for this new pitch
    const markSentBtn = document.getElementById('mark-sent-btn');
    const markSentConfirm = document.getElementById('mark-sent-confirm');
    if (markSentBtn) {
        markSentBtn.classList.remove('hidden');
        markSentBtn.disabled = false;
        markSentBtn.textContent = '✓ Mark as Sent — Track in Submissions';
    }
    if (markSentConfirm) markSentConfirm.classList.add('hidden');

    // Get stored metrics
    const storedMetrics = localStorage.getItem('trackMetrics');
    const trackMetrics = storedMetrics ? JSON.parse(storedMetrics).metrics : {};

    try {
        const variants = await generatePitch(label, trackMetrics || {});
        currentEmails = variants;

        if (currentEmails[0]) {
            document.getElementById('email-subject').textContent = `Subject: ${currentEmails[0].subject}`;
            document.getElementById('email-body').textContent = currentEmails[0].body;
        }

        // Reset tabs
        document.querySelectorAll('#pitch-modal .tab-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === 0);
        });

        if (pitchLoading) pitchLoading.classList.add('hidden');
        if (pitchContent) pitchContent.classList.remove('hidden');
    } catch (err) {
        console.error('Pitch generation error:', err);
        if (pitchLoading) pitchLoading.classList.add('hidden');
        if (pitchError) pitchError.classList.remove('hidden');
    }
}

// ─── SUPPORT LEGACY open-pitch-modal EVENT ───

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
            // Show inline empty state instead of alert popup
            loader.classList.add('hidden');
            const emptyState = document.getElementById('empty-state');
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        const { genre, mood, energy } = JSON.parse(storedMetrics);

        try {
            const { data: labels, error } = await window.supabaseClient
                .from('labels')
                .select('*');
            if (error) throw error;

            const matchedLabels = labels.map(label => {
                const matchScore = calculateMatchScore(label, genre || 'house', mood || 'groovy', energy || 'medium');
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
            labelsGrid.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">Could not load labels. Check your connection and try again.</p>';
            labelsGrid.classList.remove('hidden');
        }
    });
}
