import './app.js'; // Imports Supabase client
import { generatePitch } from './demo-generator.js';

// --- EXPORTED FUNCTIONS (used by analysis.js when dynamically imported) ---

export function calculateMatchScore(trackMetrics, label) {
    let score = 0;

    // 1. BPM Compatibility (35 pts)
    const trackBpm = Math.round(trackMetrics.bpm);
    const labelMin = label.bpm_min || 0;
    const labelMax = label.bpm_max || 999;

    if (trackBpm >= labelMin && trackBpm <= labelMax) {
        score += 35;
    } else {
        let diff = 0;
        if (trackBpm < labelMin) diff = labelMin - trackBpm;
        if (trackBpm > labelMax) diff = trackBpm - labelMax;
        let penalty = diff * 5;
        score += Math.max(0, 35 - penalty);
    }

    // 2. Energy Match (30 pts)
    let trackEnergy = 'medium';
    if (trackMetrics.energyStdDev > 0.15) trackEnergy = 'high';
    else if (trackMetrics.energyStdDev < 0.05) trackEnergy = 'low';

    const labelEnergy = (label.energy_profile || 'medium').toLowerCase();

    if (trackEnergy === labelEnergy) {
        score += 30;
    } else if (
        (trackEnergy === 'high' && labelEnergy === 'medium') ||
        (trackEnergy === 'medium' && labelEnergy === 'high') ||
        (trackEnergy === 'medium' && labelEnergy === 'low') ||
        (trackEnergy === 'low' && labelEnergy === 'medium')
    ) {
        score += 15;
    }

    // 3. LUFS Proximity (20 pts)
    const trackLufs = trackMetrics.lufs;
    const labelLufs = label.lufs_typical || -9;
    const lufsDiff = Math.abs(trackLufs - labelLufs);

    if (lufsDiff <= 1) {
        score += 20;
    } else {
        let penalty = (lufsDiff - 1) * 2;
        score += Math.max(0, 20 - penalty);
    }

    // 4. Vocal Match (15 pts)
    const trackHasVocals = trackMetrics.vocalPresence > 40;
    const labelHasVocals = label.vocal || false;

    if (trackHasVocals === labelHasVocals) {
        score += 15;
    }

    return Math.round(score);
}

export function renderLabels(labels, metrics, containerId = 'labels-grid') {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    grid.innerHTML = '';

    labels.forEach(label => {
        const card = document.createElement('div');
        card.className = 'label-card';

        // Badge Color
        let badgeClass = 'match-badge';
        if (label.matchScore < 70) badgeClass += ' medium';
        if (label.matchScore < 40) badgeClass += ' low';

        // Subgenres
        const subgenres = (label.subgenres || []).slice(0, 3).map(g =>
            `<span class="genre-tag">${g}</span>`
        ).join('');

        card.innerHTML = `
            <div class="label-header">
                <div>
                    <div class="label-name">${label.name}</div>
                    <div class="label-location">${label.country || 'Unknown'}</div>
                </div>
                <div class="${badgeClass}">${label.matchScore}% Match</div>
            </div>
            
            <div class="tags-container">
                ${subgenres}
            </div>
            
            <div style="margin-top: auto; display: flex; gap: 10px;">
                <button class="btn-pitch btn-primary generate-pitch-btn" style="flex: 1; font-size: 0.85rem; padding: 10px;" data-label-id="${label.id}">
                    Generate Pitch ✨
                </button>
            </div>
        `;

        // Attach pitch modal event
        const btn = card.querySelector('.generate-pitch-btn');
        btn.addEventListener('click', () => {
            const event = new CustomEvent('open-pitch-modal', { detail: { label, metrics } });
            document.dispatchEvent(event);
        });

        grid.appendChild(card);
    });
}

// --- STANDALONE PAGE LOGIC (only runs on label-fit.html) ---
// Guard: only run if we're on the label-fit page
const isLabelFitPage = document.getElementById('no-results') !== null;

if (isLabelFitPage) {
    document.addEventListener('DOMContentLoaded', async () => {
        const loader = document.getElementById('loader');
        const labelsGrid = document.getElementById('labels-grid');
        const noResults = document.getElementById('no-results');

        // 1. Retrieve Track Metrics from LocalStorage
        const storedMetrics = localStorage.getItem('trackMetrics');
        if (!storedMetrics) {
            alert('No analysis data found. Please analyze a track first.');
            window.location.href = 'analysis.html';
            return;
        }

        const { metrics, score: demoScore } = JSON.parse(storedMetrics);

        // 2. Fetch Labels from Supabase
        try {
            const { data: labels, error } = await window.supabaseClient
                .from('labels')
                .select('*');

            if (error) throw error;

            // 3. Match & Score Labels
            const matchedLabels = labels.map(label => {
                const matchScore = calculateMatchScore(metrics, label);
                return { ...label, matchScore };
            });

            matchedLabels.sort((a, b) => b.matchScore - a.matchScore);
            const topLabels = matchedLabels.slice(0, 20);

            loader.classList.add('hidden');

            if (topLabels.length === 0) {
                noResults.classList.remove('hidden');
                return;
            }

            renderLabels(topLabels, metrics);
            labelsGrid.classList.remove('hidden');

        } catch (err) {
            console.error('Error fetching labels:', err);
            loader.classList.add('hidden');
            alert('Failed to load labels. Check console for details.');
        }

        // 4. Modal Event Listeners (only on label-fit.html)
        const modal = document.getElementById('pitch-modal');
        const closeModalBtn = document.getElementById('close-modal');
        const emailSubjectEl = document.getElementById('email-subject');
        const emailBodyEl = document.getElementById('email-body');
        const copyBtn = document.getElementById('copy-btn');
        const tabBtns = document.querySelectorAll('.tab-btn');

        let currentEmails = [];

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const subject = emailSubjectEl.textContent.replace('Subject: ', '');
                const body = emailBodyEl.textContent;
                navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`).then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = "Copied! 👍";
                    setTimeout(() => copyBtn.textContent = originalText, 2000);
                });
            });
        }

        tabBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (!currentEmails[index]) return;
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                emailSubjectEl.textContent = `Subject: ${currentEmails[index].subject}`;
                emailBodyEl.textContent = currentEmails[index].body;
            });
        });

        // Listen for pitch modal open event
        document.addEventListener('open-pitch-modal', async (e) => {
            const { label, metrics } = e.detail;

            modal.classList.remove('hidden');
            emailBodyEl.textContent = "Asking Gemini to write the perfect pitch...";
            emailSubjectEl.textContent = "Subject: ...";
            copyBtn.disabled = true;

            try {
                const variants = await generatePitch(label, metrics);
                currentEmails = variants;

                // Default to first variant
                if (currentEmails[0]) {
                    emailSubjectEl.textContent = `Subject: ${currentEmails[0].subject}`;
                    emailBodyEl.textContent = currentEmails[0].body;
                }
                copyBtn.disabled = false;
            } catch (err) {
                emailBodyEl.textContent = "Error generating pitch. Please try again.";
                console.error(err);
            }
        });
    });
}
