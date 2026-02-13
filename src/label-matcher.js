import './app.js'; // Imports Supabase client
import { generatePitch } from './demo-generator.js';

document.addEventListener('DOMContentLoaded', async () => {
    const loader = document.getElementById('loader');
    const labelsGrid = document.getElementById('labels-grid');
    const noResults = document.getElementById('no-results');

    // Modal Elements
    const modal = document.getElementById('pitch-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const emailSubjectEl = document.getElementById('email-subject');
    const emailBodyEl = document.getElementById('email-body');
    const copyBtn = document.getElementById('copy-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');

    let currentEmails = []; // Store generated variants

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

        // 4. Sort by Match Score (Descending)
        matchedLabels.sort((a, b) => b.matchScore - a.matchScore);

        // 5. Render Top 20
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
});

function calculateMatchScore(trackMetrics, label) {
    let score = 0;

    // --- 1. BPM Compatibility (35 pts) ---
    // If track BPM inside label range = 35. 
    // Else -5 pts per BPM difference.
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

    // --- 2. Energy Match (30 pts) ---
    // Compare label.energy_profile with track.energyStdDev
    // High > 0.15, Medium 0.05-0.15, Low < 0.05 (based on analysis.js thresholds)

    // Determine track energy string
    let trackEnergy = 'medium';
    if (trackMetrics.energyStdDev > 0.15) trackEnergy = 'high';
    else if (trackMetrics.energyStdDev < 0.05) trackEnergy = 'low';

    // Label energy might be null, default to medium
    const labelEnergy = (label.energy_profile || 'medium').toLowerCase();

    if (trackEnergy === labelEnergy) {
        score += 30;
    } else if (
        (trackEnergy === 'high' && labelEnergy === 'medium') ||
        (trackEnergy === 'medium' && labelEnergy === 'high') ||
        (trackEnergy === 'medium' && labelEnergy === 'low') ||
        (trackEnergy === 'low' && labelEnergy === 'medium')
    ) {
        score += 15; // Partial match for adjacent energy levels
    } else {
        score += 0; // No points for High vs Low
    }

    // --- 3. LUFS Proximity (20 pts) ---
    // Closer to lufs_typical = more points.
    // Let's assume a range of +/- 1 LUFS is perfect, then decay.
    const trackLufs = trackMetrics.lufs;
    const labelLufs = label.lufs_typical || -9; // Default if missing

    const lufsDiff = Math.abs(trackLufs - labelLufs);

    if (lufsDiff <= 1) {
        score += 20;
    } else {
        // loose 2 points per 1db difference beyond 1db
        let penalty = (lufsDiff - 1) * 2;
        score += Math.max(0, 20 - penalty);
    }

    // --- 4. Vocal Match (15 pts) ---
    // We don't have vocal detection in Meyda easily without complex models.
    // However, the prompt asks: "confronta la presenza/assenza vocal".
    // Since our current analysis DOES NOT detect vocals, we will assume:
    // If the label accepts BOTH vocal and non-vocal (or if 'vocal' column implies 'vocal heavy'),
    // we need to know if the TRACK is vocal.

    // PROBLEM: We don't have 'is_vocal' in trackMetrics from analysis.js.
    // SOLUTION: For now, I'll default to awarding points if label.vocal is FALSE (instrumental safe) 
    // OR if we assume the track is instrumental by default.
    // BUT the prompt explicitly says: "15pt se la presenza/assenza vocal coincide."
    // Since I cannot detect vocals with the current script, I will assume the track is 'Instrumental' (vocal = false) for now
    // UNLESS we add a UI toggle for the user to say "Is this a vocal track?".

    // NOTE: For this iteration, I will assume matching 'vocal' boolean from label 
    // against a hardcoded 'false' (Instrumental) or random, OR better:
    // I will treat this as "Label accepts demos? (+15)" to be nice, 
    // OR I will default to 15 points to avoid penalizing for a missing feature.

    // CORRECT APPROACH based on constraints:
    // I will add a `hasVocals` property to metrics in analysis.js (default false for now) 
    // or just assume false. Let's assume False for now as Meyda doesn't detect voice.
    const trackHasVocals = false; // Placeholder
    const labelHasVocals = label.vocal || false;

    if (trackHasVocals === labelHasVocals) {
        score += 15;
    }

    return Math.round(score);
}

function renderLabels(labels, metrics) {
    const grid = document.getElementById('labels-grid');
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
                <button class="btn-pitch generate-pitch-btn" style="flex: 1; background: var(--accent-color); color: black; border:none;" data-label-id="${label.id}">
                    Generate Pitch ✨
                </button>
            </div>
        `;

        // Attach event listener immediately to the button
        const btn = card.querySelector('.generate-pitch-btn');
        btn.addEventListener('click', () => openPitchModal(label, metrics));

        grid.appendChild(card);
    });
}

async function openPitchModal(label, metrics) {
    const modal = document.getElementById('pitch-modal');
    const emailSubjectEl = document.getElementById('email-subject');
    const emailBodyEl = document.getElementById('email-body');
    const copyBtn = document.getElementById('copy-btn');

    modal.classList.remove('hidden');
    emailBodyEl.textContent = "Asking Gemini to write the perfect pitch...";
    emailSubjectEl.textContent = "Subject: ...";
    copyBtn.disabled = true;

    try {
        const variants = await generatePitch(label, metrics);
        window.currentEmails = variants; // Store for tab switching

        // Default to first variant (Formal)
        updateModalContent(0);
        copyBtn.disabled = false;

    } catch (err) {
        emailBodyEl.textContent = "Error generating pitch. Please try again.";
        console.error(err);
    }
}

function updateModalContent(index) {
    if (!window.currentEmails || !window.currentEmails[index]) return;

    const email = window.currentEmails[index];
    document.getElementById('email-subject').textContent = `Subject: ${email.subject}`;
    document.getElementById('email-body').textContent = email.body;

    // Update active tab
    document.querySelectorAll('.tab-btn').forEach((btn, i) => {
        if (i === index) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

// Global Event Listeners for Modal
document.querySelectorAll('.tab-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => updateModalContent(index));
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('pitch-modal').classList.add('hidden');
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const subject = document.getElementById('email-subject').textContent.replace('Subject: ', '');
    const body = document.getElementById('email-body').textContent;
    const textToCopy = `Subject: ${subject}\n\n${body}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = document.getElementById('copy-btn').textContent;
        document.getElementById('copy-btn').textContent = "Copied! 👍";
        setTimeout(() => {
            document.getElementById('copy-btn').textContent = originalText;
        }, 2000);
    });
});
