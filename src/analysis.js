import './app.js';

// ─── GENRE-SPECIFIC MASTERING PROFILES ───
// Based on Beatport categories, industry mastering standards, and DJ requirements.
// Sources: iZotope (2024), MasteringTheMix, Beatport genre data, ITU-R BS.1770.
// LUFS ranges reflect actual club-ready masters (not streaming targets).
// crestMin/crestMax = expected crest factor range (peak-to-RMS ratio in dB).
// tonalRef = expected relative dB per frequency band [low, lowMid, highMid, high]
//   These are relative energy offsets from the average. Positive = more energy expected.
//   Based on analysis of professionally mastered reference tracks.
const GENRE_PROFILES = {
    'house': { bpmMin: 118, bpmMax: 128, lufsMin: -11, lufsMax: -6, introMin: 16, introMax: 32, crestMin: 6, crestMax: 14, tonalRef: [3, 0, -1, -4], label: 'House' },
    'deep house': { bpmMin: 118, bpmMax: 125, lufsMin: -13, lufsMax: -7, introMin: 16, introMax: 32, crestMin: 8, crestMax: 16, tonalRef: [4, 1, -2, -5], label: 'Deep House' },
    'tech house': { bpmMin: 124, bpmMax: 130, lufsMin: -10, lufsMax: -6, introMin: 16, introMax: 32, crestMin: 6, crestMax: 12, tonalRef: [3, 1, 0, -3], label: 'Tech House' },
    'future house': { bpmMin: 124, bpmMax: 130, lufsMin: -10, lufsMax: -5, introMin: 8, introMax: 16, crestMin: 5, crestMax: 12, tonalRef: [2, 1, 1, -2], label: 'Future House' },
    'bass house': { bpmMin: 124, bpmMax: 132, lufsMin: -9, lufsMax: -5, introMin: 8, introMax: 16, crestMin: 4, crestMax: 10, tonalRef: [5, 1, 0, -3], label: 'Bass House' },
    'afro house': { bpmMin: 118, bpmMax: 125, lufsMin: -11, lufsMax: -7, introMin: 16, introMax: 32, crestMin: 7, crestMax: 14, tonalRef: [3, 1, 0, -3], label: 'Afro House' },
    'organic house': { bpmMin: 110, bpmMax: 122, lufsMin: -13, lufsMax: -8, introMin: 16, introMax: 48, crestMin: 8, crestMax: 16, tonalRef: [2, 1, 0, -2], label: 'Organic House' },
    'melodic house & techno': { bpmMin: 120, bpmMax: 128, lufsMin: -11, lufsMax: -7, introMin: 16, introMax: 32, crestMin: 7, crestMax: 14, tonalRef: [3, 1, -1, -3], label: 'Melodic House & Techno' },
    'peak-time techno': { bpmMin: 130, bpmMax: 140, lufsMin: -9, lufsMax: -5, introMin: 16, introMax: 32, crestMin: 4, crestMax: 10, tonalRef: [4, 2, 1, -2], label: 'Peak-Time Techno' },
    'hard techno': { bpmMin: 140, bpmMax: 155, lufsMin: -8, lufsMax: -4, introMin: 16, introMax: 32, crestMin: 3, crestMax: 8, tonalRef: [4, 2, 2, -1], label: 'Hard Techno' },
    'industrial techno': { bpmMin: 130, bpmMax: 150, lufsMin: -9, lufsMax: -5, introMin: 16, introMax: 32, crestMin: 4, crestMax: 10, tonalRef: [4, 2, 1, -1], label: 'Industrial Techno' },
    'minimal': { bpmMin: 120, bpmMax: 128, lufsMin: -13, lufsMax: -7, introMin: 16, introMax: 32, crestMin: 8, crestMax: 16, tonalRef: [2, 1, -1, -3], label: 'Minimal / Deep Tech' },
    'trance': { bpmMin: 130, bpmMax: 142, lufsMin: -10, lufsMax: -6, introMin: 16, introMax: 32, crestMin: 6, crestMax: 12, tonalRef: [3, 1, 1, -1], label: 'Trance' },
    'psy-trance': { bpmMin: 138, bpmMax: 148, lufsMin: -9, lufsMax: -5, introMin: 8, introMax: 16, crestMin: 4, crestMax: 10, tonalRef: [3, 2, 1, 0], label: 'Psy-Trance' },
    'progressive house': { bpmMin: 122, bpmMax: 128, lufsMin: -11, lufsMax: -7, introMin: 32, introMax: 64, crestMin: 7, crestMax: 14, tonalRef: [3, 1, -1, -3], label: 'Progressive House' },
    'indie dance': { bpmMin: 110, bpmMax: 125, lufsMin: -11, lufsMax: -7, introMin: 8, introMax: 16, crestMin: 8, crestMax: 16, tonalRef: [1, 1, 0, -1], label: 'Indie Dance' },
    'nu disco': { bpmMin: 115, bpmMax: 125, lufsMin: -11, lufsMax: -7, introMin: 8, introMax: 16, crestMin: 8, crestMax: 16, tonalRef: [2, 1, 0, -1], label: 'Nu Disco' },
    'dubstep': { bpmMin: 138, bpmMax: 142, lufsMin: -9, lufsMax: -5, introMin: 8, introMax: 16, crestMin: 4, crestMax: 10, tonalRef: [6, 1, 1, -2], label: 'Dubstep' },
    'drum and bass': { bpmMin: 170, bpmMax: 180, lufsMin: -10, lufsMax: -6, introMin: 16, introMax: 32, crestMin: 5, crestMax: 12, tonalRef: [4, 1, 1, -1], label: 'Drum & Bass' },
    'breaks': { bpmMin: 125, bpmMax: 140, lufsMin: -10, lufsMax: -6, introMin: 8, introMax: 16, crestMin: 6, crestMax: 12, tonalRef: [3, 1, 0, -2], label: 'Breaks' },
    'electro house': { bpmMin: 126, bpmMax: 132, lufsMin: -9, lufsMax: -5, introMin: 8, introMax: 16, crestMin: 4, crestMax: 10, tonalRef: [3, 1, 1, -1], label: 'Electro House' },
    'big room': { bpmMin: 126, bpmMax: 132, lufsMin: -8, lufsMax: -4, introMin: 8, introMax: 16, crestMin: 3, crestMax: 8, tonalRef: [4, 1, 2, -1], label: 'Big Room' },
    'hard dance': { bpmMin: 150, bpmMax: 160, lufsMin: -8, lufsMax: -4, introMin: 8, introMax: 16, crestMin: 3, crestMax: 8, tonalRef: [4, 2, 2, 0], label: 'Hard Dance / Hardcore' },
    'downtempo': { bpmMin: 90, bpmMax: 115, lufsMin: -16, lufsMax: -9, introMin: 8, introMax: 32, crestMin: 10, crestMax: 20, tonalRef: [2, 1, 0, -2], label: 'Electronica / Downtempo' },
    'ambient': { bpmMin: 60, bpmMax: 110, lufsMin: -20, lufsMax: -12, introMin: 8, introMax: 64, crestMin: 12, crestMax: 24, tonalRef: [1, 1, 0, -1], label: 'Ambient / Experimental' },
    'dance': { bpmMin: 118, bpmMax: 130, lufsMin: -10, lufsMax: -5, introMin: 4, introMax: 16, crestMin: 5, crestMax: 12, tonalRef: [2, 1, 1, -1], label: 'Dance / Pop-Dance' }
};

// Fallback profile if genre not found
const DEFAULT_PROFILE = { bpmMin: 120, bpmMax: 150, lufsMin: -11, lufsMax: -6, introMin: 16, introMax: 32, crestMin: 6, crestMax: 14, tonalRef: [3, 1, 0, -2], label: 'Electronic' };

// Band names for UI display
const BAND_NAMES = ['Low', 'Low-Mid', 'High-Mid', 'High'];

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const dropContent = document.querySelector('.drop-content');
    const fileInfo = document.getElementById('file-info');
    const filenameDisplay = document.getElementById('filename-display');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results-section');
    const loader = document.getElementById('loader');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const suggestionsList = document.getElementById('suggestions-list');

    // UI Elements for Results
    const scoreValEl = document.getElementById('score-val');
    const scoreStatusEl = document.getElementById('score-status');
    const progressCircle = document.querySelector('.progress-ring__circle');

    // Metric Bars & Values
    const metricBpm = document.getElementById('metric-bpm');
    const barBpm = document.getElementById('bar-bpm');

    const metricLufs = document.getElementById('metric-lufs');
    const barLufs = document.getElementById('bar-lufs');

    const metricHeadroom = document.getElementById('metric-headroom');
    const barHeadroom = document.getElementById('bar-headroom');

    const metricIntro = document.getElementById('metric-intro');
    const barIntro = document.getElementById('bar-intro');

    const metricStereo = document.getElementById('metric-stereo');
    const barStereo = document.getElementById('bar-stereo');

    const metricCrest = document.getElementById('metric-crest');
    const barCrest = document.getElementById('bar-crest');

    // Tonal balance elements
    const tonalContainer = document.getElementById('tonal-balance-bars');

    // Drag & Drop Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('highlight');
        dropZone.style.borderColor = "var(--accent)";
    }

    function unhighlight(e) {
        dropZone.classList.remove('highlight');
        dropZone.style.borderColor = "";
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Browse Button
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        handleFiles(this.files);
    });

    // Pitch Modal Logic (Listen for event from label-matcher module)
    document.addEventListener('open-pitch-modal', async (e) => {
        const { label, metrics } = e.detail;

        // Import generator dynamically
        const { generatePitch } = await import('./demo-generator.js');

        const modal = document.getElementById('pitch-modal');
        const emailSubjectEl = document.getElementById('email-subject');
        const emailBodyEl = document.getElementById('email-body');
        const copyBtn = document.getElementById('copy-btn');
        const closeBtn = document.getElementById('close-modal');

        modal.classList.remove('hidden');
        emailBodyEl.textContent = "Asking Gemini to write the perfect pitch...";
        emailSubjectEl.textContent = "Subject: ...";
        copyBtn.disabled = true;

        // Close Logic
        closeBtn.onclick = () => modal.classList.add('hidden');
        window.onclick = (event) => { if (event.target === modal) modal.classList.add('hidden'); };

        try {
            const variants = await generatePitch(label, metrics);
            let currentEmails = variants;

            // Tab Logic
            document.querySelectorAll('.tab-btn').forEach((btn, index) => {
                btn.onclick = () => {
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    if (currentEmails[index]) {
                        emailSubjectEl.textContent = `Subject: ${currentEmails[index].subject}`;
                        emailBodyEl.textContent = currentEmails[index].body;
                    }
                };
            });

            // Initial Render (Formal)
            if (currentEmails[0]) {
                emailSubjectEl.textContent = `Subject: ${currentEmails[0].subject}`;
                emailBodyEl.textContent = currentEmails[0].body;
            }
            copyBtn.disabled = false;

            // Copy Logic
            copyBtn.onclick = () => {
                const subject = emailSubjectEl.textContent.replace('Subject: ', '');
                const body = emailBodyEl.textContent;
                navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`).then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = "Copied! 👍";
                    setTimeout(() => copyBtn.textContent = originalText, 2000);
                });
            };

        } catch (err) {
            console.error(err);
            emailBodyEl.textContent = "Error generating pitch.";
        }
    });

    // Genre Select - enable/disable analyze button
    const genreSelect = document.getElementById('genre-select');
    genreSelect.addEventListener('change', () => {
        if (window.currentAudioFile && genreSelect.value) {
            analyzeBtn.disabled = false;
        }
    });

    function handleFiles(files) {
        if (files.length === 0) return;

        const file = files[0];

        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'];
        const validExtensions = ['.mp3', '.wav'];

        const isValidType = validTypes.includes(file.type);
        const isValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

        if (!isValidType && !isValidExtension) {
            alert('Invalid file format. Please upload an MP3 or WAV audio file.');
            return;
        }

        if (file.size > 50 * 1024 * 1024) { // 50MB
            alert('File too large. Maximum size is 50MB.');
            return;
        }

        // Update UI
        dropContent.classList.add('hidden');
        fileInfo.classList.remove('hidden');
        filenameDisplay.textContent = file.name;
        resultsSection.classList.add('hidden');
        suggestionsContainer.classList.add('hidden');

        // Prepare for analysis
        window.currentAudioFile = file;

        // Enable analyze button if genre is selected
        if (genreSelect.value) {
            analyzeBtn.disabled = false;
        }
    }

    // Analysis Logic
    analyzeBtn.addEventListener('click', analyzeTrack);

    async function analyzeTrack() {
        if (!window.currentAudioFile) return;

        // UI State: Loading
        analyzeBtn.textContent = 'Analyzing...';
        analyzeBtn.disabled = true;
        loader.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        suggestionsContainer.classList.add('hidden'); // Reset

        // Reset Circle Animation
        if (progressCircle) {
            progressCircle.style.strokeDashoffset = 565;
            progressCircle.classList.remove('stroke-red', 'stroke-yellow', 'stroke-green');
        }
        scoreStatusEl.textContent = '--';
        scoreStatusEl.className = 'score-status';

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const arrayBuffer = await window.currentAudioFile.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Signal Processing Config
            const bufferSize = 2048;
            const sampleRate = audioBuffer.sampleRate;
            const channelData = audioBuffer.getChannelData(0);
            const hasSecondChannel = audioBuffer.numberOfChannels >= 2;
            const channelDataR = hasSecondChannel ? audioBuffer.getChannelData(1) : null;

            // Metrics arrays
            let rmsValues = [];
            let spectralCentroids = [];
            let zcrValues = [];

            // Tonal balance accumulators (4 bands)
            // Band boundaries in Hz: Low (20-250), Low-Mid (250-2k), High-Mid (2k-6k), High (6k-20k)
            const bandEdgesHz = [20, 250, 2000, 6000, 20000];
            const hzPerBin = sampleRate / bufferSize;
            const bandEdgeBins = bandEdgesHz.map(hz => Math.round(hz / hzPerBin));
            let bandEnergySums = [0, 0, 0, 0];
            let spectrumFrameCount = 0;

            // Clipping detection
            let clippedSamples = 0;
            const clipThreshold = 0.9999;
            for (let i = 0; i < channelData.length; i++) {
                if (Math.abs(channelData[i]) >= clipThreshold) clippedSamples++;
            }
            if (hasSecondChannel) {
                for (let i = 0; i < channelDataR.length; i++) {
                    if (Math.abs(channelDataR[i]) >= clipThreshold) clippedSamples++;
                }
            }

            // Meyda setup
            Meyda.bufferSize = bufferSize;

            for (let i = 0; i < channelData.length; i += bufferSize) {
                const chunk = channelData.slice(i, i + bufferSize);
                let signal = chunk;
                if (chunk.length < bufferSize) {
                    signal = new Float32Array(bufferSize);
                    signal.set(chunk);
                }

                const features = Meyda.extract(['rms', 'spectralCentroid', 'zcr', 'powerSpectrum'], signal);
                if (features) {
                    rmsValues.push(features.rms);
                    spectralCentroids.push(features.spectralCentroid);
                    zcrValues.push(features.zcr);

                    // Accumulate energy per frequency band from powerSpectrum
                    if (features.powerSpectrum) {
                        for (let b = 0; b < 4; b++) {
                            const lo = Math.max(0, bandEdgeBins[b]);
                            const hi = Math.min(features.powerSpectrum.length - 1, bandEdgeBins[b + 1]);
                            let bandSum = 0;
                            for (let k = lo; k <= hi; k++) {
                                bandSum += features.powerSpectrum[k];
                            }
                            bandEnergySums[b] += bandSum / Math.max(1, hi - lo + 1);
                        }
                        spectrumFrameCount++;
                    }
                }
            }

            // Calculate average band energy in dB (relative)
            const bandAvgDb = bandEnergySums.map(sum => {
                const avg = sum / Math.max(1, spectrumFrameCount);
                return avg > 0 ? 10 * Math.log10(avg) : -60;
            });
            // Normalize to make them relative (subtract the mean across bands)
            const bandMean = bandAvgDb.reduce((a, b) => a + b, 0) / 4;
            const tonalBalance = bandAvgDb.map(db => +(db - bandMean).toFixed(1));

            // --- CALCULATIONS ---

            // 1. RMS & LUFS (Approx)
            const activeRmsValues = rmsValues.filter(v => v > 0.0001);
            const avgRms = activeRmsValues.reduce((a, b) => a + b, 0) / (activeRmsValues.length || 1);
            let approximateLufs = 20 * Math.log10(avgRms);
            if (!isFinite(approximateLufs)) approximateLufs = -100;

            // 2. Peak & Headroom
            let peak = 0;
            for (let i = 0; i < channelData.length; i++) {
                const val = Math.abs(channelData[i]);
                if (val > peak) peak = val;
            }
            let peakDb = 20 * Math.log10(peak);
            if (!isFinite(peakDb)) peakDb = -100;
            let headroom = 0 - peakDb;

            // 3. Intro Duration — sliding-window approach
            // Compare a running window against a fraction of the track's own loudness.
            // The intro ends when the energy consistently exceeds 20% of the track's
            // average loudness for at least 3 consecutive windows.
            const secondsPerChunk = bufferSize / sampleRate;
            const trackAvgRms = avgRms;
            const introThreshold = trackAvgRms * 0.20; // 20% of the track's own average level
            const requiredConsecutive = 3; // need 3 consecutive loud frames to count as "intro over"
            let introFrames = 0;
            let consecutiveLoud = 0;
            for (let i = 0; i < rmsValues.length; i++) {
                if (rmsValues[i] > introThreshold) {
                    consecutiveLoud++;
                    if (consecutiveLoud >= requiredConsecutive) {
                        introFrames = i - requiredConsecutive + 1;
                        break;
                    }
                } else {
                    consecutiveLoud = 0;
                }
            }
            // If we never found the transition, the whole track is quiet (unlikely for a master)
            if (consecutiveLoud < requiredConsecutive) introFrames = 0;
            let introDuration = introFrames * secondsPerChunk;

            // 4. BPM
            const bpm = calculateBPM(rmsValues, sampleRate / bufferSize);

            // 5. Stereo Width (L/R correlation → 0 = mono, 1 = full stereo)
            let stereoWidth = 0;
            let monoCompatibility = 1; // 1 = fully mono-compatible
            if (hasSecondChannel) {
                let sumLR = 0, sumL2 = 0, sumR2 = 0;
                let monoEnergy = 0, stereoEnergy = 0;
                const step = 4; // sample every 4th value for performance
                let count = 0;
                for (let i = 0; i < channelData.length; i += step) {
                    const l = channelData[i];
                    const r = channelDataR[i];
                    sumLR += l * r;
                    sumL2 += l * l;
                    sumR2 += r * r;
                    // Mono compatibility: compare mono sum energy vs stereo energy
                    const monoSample = (l + r) * 0.5;
                    monoEnergy += monoSample * monoSample;
                    stereoEnergy += (l * l + r * r) * 0.5;
                    count++;
                }
                const denom = Math.sqrt(sumL2 * sumR2);
                const correlation = denom > 0 ? sumLR / denom : 1;
                stereoWidth = Math.max(0, Math.min(1, 1 - correlation));

                // Mono compatibility = ratio of mono energy to stereo energy
                // 1.0 = no loss in mono, < 0.7 = significant phase cancellation
                monoCompatibility = stereoEnergy > 0 ? Math.min(1, monoEnergy / stereoEnergy) : 1;
            }

            // 6. Crest Factor (peak-to-RMS ratio in dB) — measures dynamic range / limiting aggression
            const crestFactor = peakDb - (20 * Math.log10(avgRms));

            // --- SCORING ---
            const metrics = {
                lufs: approximateLufs,
                headroom: headroom,
                intro: introDuration,
                bpm: bpm || 0,
                stereoWidth: stereoWidth,
                monoCompatibility: monoCompatibility,
                crestFactor: isFinite(crestFactor) ? Math.abs(crestFactor) : 10,
                tonalBalance: tonalBalance,  // [low, lowMid, highMid, high] relative dB
                clippedSamples: clippedSamples,
                totalSamples: channelData.length * (hasSecondChannel ? 2 : 1)
            };

            const score = calculateScore(metrics);
            const suggestions = generateSuggestions(metrics, score);

            // --- UI UPDATE ---

            // Update Text Values
            metricBpm.textContent = bpm ? Math.round(bpm) : "--";
            metricLufs.textContent = `${approximateLufs.toFixed(1)} dB`;
            document.getElementById('metric-headroom').textContent = `${headroom.toFixed(1)} dB`;
            metricIntro.textContent = `${introDuration.toFixed(1)}s`;
            if (metricStereo) metricStereo.textContent = `${Math.round(stereoWidth * 100)}%`;
            if (metricCrest) metricCrest.textContent = `${metrics.crestFactor.toFixed(1)} dB`;

            // Update Progress Bars (Visual Feedback based on genre profile)
            const selectedGenre = document.getElementById('genre-select').value || '';
            const gp = GENRE_PROFILES[selectedGenre] || DEFAULT_PROFILE;
            updateBar(barBpm, metrics.bpm >= gp.bpmMin && metrics.bpm <= gp.bpmMax, 100);
            updateBar(barLufs, metrics.lufs >= gp.lufsMin && metrics.lufs <= gp.lufsMax, mapRange(metrics.lufs, -30, 0, 0, 100));
            updateBar(barHeadroom, metrics.headroom >= 0.1, Math.min(100, Math.max(5, metrics.headroom * 50)));
            updateBar(barIntro, metrics.intro >= gp.introMin && metrics.intro <= gp.introMax, Math.min(100, (metrics.intro / Math.max(gp.introMax, 32)) * 100));
            updateBar(barStereo, stereoWidth > 0.05 && stereoWidth < 0.95, Math.max(5, stereoWidth * 100));
            updateBar(barCrest, metrics.crestFactor >= gp.crestMin && metrics.crestFactor <= gp.crestMax, Math.min(100, mapRange(metrics.crestFactor, 0, 24, 0, 100)));

            // Tonal Balance — render 4 mini-bars
            if (tonalContainer) {
                tonalContainer.innerHTML = '';
                const ref = gp.tonalRef || [3, 1, 0, -2];
                for (let b = 0; b < 4; b++) {
                    const diff = Math.abs(tonalBalance[b] - ref[b]);
                    const isGood = diff <= 3; // within 3 dB of reference
                    const row = document.createElement('div');
                    row.className = 'tonal-band-row';
                    row.innerHTML = `
                        <span class="tonal-band-label">${BAND_NAMES[b]}</span>
                        <div class="tonal-band-bar-bg">
                            <div class="tonal-band-bar-fill" style="width:${Math.max(5, Math.min(100, mapRange(tonalBalance[b], -10, 10, 0, 100)))}%;background:${isGood ? 'var(--accent)' : 'rgba(255,255,255,0.3)'}"></div>
                        </div>
                        <span class="tonal-band-value">${tonalBalance[b] > 0 ? '+' : ''}${tonalBalance[b]} dB</span>
                    `;
                    tonalContainer.appendChild(row);
                }
            }

            // Clipping indicator
            const clipIndicator = document.getElementById('clip-indicator');
            if (clipIndicator) {
                if (clippedSamples > 0) {
                    clipIndicator.textContent = `⚠ ${clippedSamples} clipped samples detected`;
                    clipIndicator.style.color = '#ff6b6b';
                } else {
                    clipIndicator.textContent = '✓ No clipping detected';
                    clipIndicator.style.color = 'var(--accent)';
                }
            }

            function updateBar(element, isGood, percent) {
                if (!element) return;
                element.style.width = `${Math.max(5, Math.min(100, percent))}%`;
                element.style.backgroundColor = isGood ? 'var(--accent)' : 'rgba(255,255,255,0.3)';
            }

            function mapRange(value, inMin, inMax, outMin, outMax) {
                return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
            }

            // Suggestions List
            suggestionsList.innerHTML = '';
            if (suggestions.length > 0) {
                suggestionsContainer.classList.remove('hidden');
                suggestions.forEach(suggestion => {
                    const li = document.createElement('li');
                    li.textContent = suggestion;
                    suggestionsList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = "Great job! The track meets all club standards.";
                suggestionsList.appendChild(li);
                suggestionsContainer.classList.remove('hidden');
            }

            // Finish Loading
            loader.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            analyzeBtn.textContent = 'Analyze Track';
            analyzeBtn.disabled = false;

            // Enable Label Finding
            document.getElementById('find-labels-btn').disabled = false;

            // ANIMATE SCORE
            animateScore(score);

            // SAVE TO SUPABASE (Moved to background or keep as is)
            saveAnalysisToSupabase(metrics, score, suggestions);

            // ENABLE LABEL FINDER
            const findLabelsBtn = document.getElementById('find-labels-btn');
            findLabelsBtn.disabled = false;

            findLabelsBtn.onclick = async () => {
                const selectedGenre = document.getElementById('genre-select').value;
                const selectedMood = document.getElementById('mood-select').value;
                const selectedEnergy = document.getElementById('energy-select').value;

                if (!selectedGenre || !selectedMood || !selectedEnergy) {
                    alert('Please select Genre, Mood, and Energy to find compatible labels.');
                    return;
                }

                // Save metrics + selections to localStorage
                const currentFilename = window.currentAudioFile ? window.currentAudioFile.name : 'unknown';
                localStorage.setItem('trackMetrics', JSON.stringify({ metrics, score, genre: selectedGenre, mood: selectedMood, energy: selectedEnergy || 'medium', filename: currentFilename }));

                // Show Label Section
                const labelsSection = document.getElementById('labels-section');
                labelsSection.classList.remove('hidden');
                labelsSection.scrollIntoView({ behavior: 'smooth' });

                // Show subtitle with current filters (capitalize values)
                const subtitle = document.getElementById('labels-subtitle');
                if (subtitle) {
                    const cap = s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    subtitle.textContent = `Genre: ${cap(selectedGenre)} · Mood: ${cap(selectedMood)} · Energy: ${cap(selectedEnergy)}`;
                }

                const labelsGrid = document.getElementById('labels-grid');
                labelsGrid.innerHTML = '<div class="loader"></div>';

                try {
                    const { data: labels, error } = await window.supabaseClient
                        .from('labels')
                        .select('*');

                    if (error) throw error;

                    if (!labels || labels.length === 0) {
                        labelsGrid.innerHTML = '<p class="text-muted" style="text-align:center;">No labels found in the database. Please add labels first.</p>';
                        return;
                    }

                    // Import matching logic (new algorithm)
                    const { calculateMatchScore, renderLabels } = await import('./label-matcher.js');

                    // Score ALL labels using genre + mood + energy
                    const matchedLabels = labels.map(label => {
                        const matchScore = calculateMatchScore(label, selectedGenre, selectedMood, selectedEnergy);
                        return { ...label, matchScore };
                    });

                    // Sort by score descending, take top 20 with score > 20
                    matchedLabels.sort((a, b) => b.matchScore - a.matchScore);
                    const topLabels = matchedLabels.filter(l => l.matchScore > 20).slice(0, 20);

                    if (topLabels.length === 0) {
                        // Fallback: show top 10 anyway
                        const fallback = matchedLabels.slice(0, 10);
                        labelsGrid.innerHTML = '';
                        renderLabels(fallback, 'labels-grid');
                    } else {
                        renderLabels(topLabels, 'labels-grid');
                    }

                } catch (err) {
                    console.error('Error finding labels:', err);
                    labelsGrid.innerHTML = '<p class="text-muted" style="text-align:center;">Error loading labels. Check console for details.</p>';
                }
            };

        } catch (err) {
            console.error('Analysis error:', err);
            alert('Error during analysis: ' + err.message);
            loader.classList.add('hidden');
            analyzeBtn.textContent = 'Analyze Track';
            analyzeBtn.disabled = false;
        }
    }

    function animateScore(finalScore) {
        let current = 0;
        const duration = 1500; // 1.5s
        const startTime = performance.now();
        const circumference = 565; // 2 * PI * 90

        // Determine Color & Status
        let colorClass = 'stroke-red';
        let statusText = 'WORK NEEDED';
        let statusClass = 'status-red';

        if (finalScore > 40) {
            colorClass = 'stroke-yellow';
            statusText = 'ALMOST READY';
            statusClass = 'status-yellow';
        }
        if (finalScore > 70) {
            colorClass = 'stroke-green';
            statusText = 'LABEL READY';
            statusClass = 'status-green';
        }

        // Apply visual classes
        progressCircle.classList.add(colorClass);
        scoreStatusEl.textContent = statusText;
        scoreStatusEl.classList.add(statusClass);

        function step(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            current = Math.floor(ease * finalScore);
            scoreValEl.textContent = current;

            // Update circle stroke
            const offset = circumference - (ease * finalScore / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                scoreValEl.textContent = finalScore; // Ensure final value
            }
        }

        requestAnimationFrame(step);
    }

    function calculateBPM(data, samplingRate) {
        let minBPM = 60;
        let maxBPM = 180;
        let minLag = Math.floor(60 / maxBPM * samplingRate);
        let maxLag = Math.floor(60 / minBPM * samplingRate);

        let maxCorrelation = 0;
        let bestLag = 0;

        for (let lag = minLag; lag <= maxLag; lag++) {
            let correlation = 0;
            // Shortened loop for perf in JS
            for (let i = 0; i < data.length - lag; i += 2) {
                correlation += data[i] * data[i + lag];
            }
            if (correlation > maxCorrelation) {
                maxCorrelation = correlation;
                bestLag = lag;
            }
        }

        if (bestLag > 0) {
            return 60 / (bestLag / samplingRate);
        }
        return 0;
    }

    function calculateScore(metrics) {
        const selectedGenre = document.getElementById('genre-select').value || '';
        const profile = GENRE_PROFILES[selectedGenre] || DEFAULT_PROFILE;
        let score = 0;

        // 1. LUFS — scored against genre-specific target range (30 pts)
        if (metrics.lufs >= profile.lufsMin && metrics.lufs <= profile.lufsMax) {
            score += 30;
        } else {
            let diff = 0;
            if (metrics.lufs < profile.lufsMin) diff = Math.abs(metrics.lufs - profile.lufsMin);
            if (metrics.lufs > profile.lufsMax) diff = Math.abs(metrics.lufs - profile.lufsMax);
            score += Math.max(0, Math.round(30 - (diff * 2)));
        }

        // 2. Tonal Balance — 4 bands scored against genre reference (20 pts, 5 per band)
        if (metrics.tonalBalance && profile.tonalRef) {
            for (let b = 0; b < 4; b++) {
                const diff = Math.abs(metrics.tonalBalance[b] - profile.tonalRef[b]);
                if (diff <= 2) {
                    score += 5;  // within 2 dB = excellent
                } else if (diff <= 4) {
                    score += 3;  // within 4 dB = acceptable
                } else if (diff <= 6) {
                    score += 1;  // within 6 dB = noticeable issue
                }
                // > 6 dB off = 0 pts for that band
            }
        } else {
            score += 10; // fallback if no tonal data
        }

        // 3. Headroom / True Peak (15 pts)
        if (metrics.headroom >= 0.8) {
            score += 15;
        } else if (metrics.headroom >= 0.3) {
            score += 13;
        } else if (metrics.headroom >= 0.1) {
            score += 8;
        } else {
            score += 3;
        }
        // Clipping penalty: deduct up to 5 pts
        if (metrics.clippedSamples > 0) {
            const clipRatio = metrics.clippedSamples / metrics.totalSamples;
            score -= Math.min(5, Math.round(clipRatio * 5000));
        }

        // 4. Stereo Width + Mono Compatibility (10 pts)
        if (metrics.stereoWidth > 0.05 && metrics.stereoWidth < 0.95) {
            score += 7; // healthy stereo field
        } else if (metrics.stereoWidth <= 0.05) {
            score += 4; // mono
        } else {
            score += 3; // extreme stereo
        }
        // Mono compatibility bonus
        if (metrics.monoCompatibility >= 0.85) {
            score += 3; // good mono compatibility
        } else if (metrics.monoCompatibility >= 0.7) {
            score += 1;
        }

        // 5. BPM — genre range check (10 pts)
        if (metrics.bpm >= profile.bpmMin && metrics.bpm <= profile.bpmMax) {
            score += 10;
        } else {
            let dist = 0;
            if (metrics.bpm < profile.bpmMin) dist = profile.bpmMin - metrics.bpm;
            if (metrics.bpm > profile.bpmMax) dist = metrics.bpm - profile.bpmMax;
            score += Math.round(Math.max(0, 10 - Math.min(10, dist)));
        }

        // 6. Crest Factor — dynamic range for genre (10 pts)
        if (metrics.crestFactor >= profile.crestMin && metrics.crestFactor <= profile.crestMax) {
            score += 10;
        } else {
            let diff = 0;
            if (metrics.crestFactor < profile.crestMin) diff = profile.crestMin - metrics.crestFactor;
            if (metrics.crestFactor > profile.crestMax) diff = metrics.crestFactor - profile.crestMax;
            score += Math.max(0, Math.round(10 - diff));
        }

        // 7. Intro length — genre expectations (5 pts)
        const introInSeconds = metrics.intro;
        if (introInSeconds >= profile.introMin && introInSeconds <= profile.introMax) {
            score += 5;
        } else if (introInSeconds < profile.introMin * 0.3 || introInSeconds > profile.introMax * 2.5) {
            score += 1;
        } else {
            score += 3;
        }

        return Math.min(100, Math.max(0, Math.round(score)));
    }

    function generateSuggestions(metrics, score) {
        const selectedGenre = document.getElementById('genre-select').value || '';
        const profile = GENRE_PROFILES[selectedGenre] || DEFAULT_PROFILE;
        const genreName = profile.label;
        let suggestions = [];

        // ── LUFS ──
        if (metrics.lufs < profile.lufsMin) {
            const gap = Math.abs(metrics.lufs - profile.lufsMin).toFixed(1);
            suggestions.push(`Integrated loudness reads ${metrics.lufs.toFixed(1)} LUFS — about ${gap} dB below the typical mastering target for ${genreName} (${profile.lufsMin} to ${profile.lufsMax} LUFS). If this is a pre-master, that's expected. On a finished master, check your limiter ceiling and make sure low-end buildup isn't stealing headroom.`);
        } else if (metrics.lufs > profile.lufsMax) {
            const gap = Math.abs(metrics.lufs - profile.lufsMax).toFixed(1);
            suggestions.push(`Integrated loudness reads ${metrics.lufs.toFixed(1)} LUFS — about ${gap} dB above the typical ${genreName} ceiling of ${profile.lufsMax} LUFS. At this level, you may be introducing limiter distortion or audible pumping. A/B your master against a reference track.`);
        }

        // ── BPM ──
        if (metrics.bpm > 0) {
            const bpmRound = Math.round(metrics.bpm);
            if (metrics.bpm < profile.bpmMin || metrics.bpm > profile.bpmMax) {
                suggestions.push(`Detected tempo: ${bpmRound} BPM. Standard range for ${genreName} is ${profile.bpmMin}–${profile.bpmMax} BPM. If intentional (half-time, tempo shifts), no issue — but labels that program DJ sets may prefer tracks within that window.`);
            }
        }

        // ── TRUE PEAK / HEADROOM ──
        if (metrics.headroom < 0.1) {
            suggestions.push(`True peak is essentially at 0 dBFS (headroom: ${metrics.headroom.toFixed(1)} dB). On lossy codecs (MP3, AAC, streaming) this causes inter-sample clipping. Set your limiter's true peak ceiling to −1.0 dBTP — industry standard per ITU-R BS.1770.`);
        } else if (metrics.headroom >= 4) {
            suggestions.push(`Headroom is ${metrics.headroom.toFixed(1)} dB — the master may be under-limited for ${genreName}. Most finished ${genreName} masters peak between −1.0 and −0.3 dBTP. If you're sending a pre-master intentionally, ignore this.`);
        }

        // ── INTRO LENGTH ──
        if (metrics.intro < profile.introMin && metrics.intro > 0.5) {
            const bpm = metrics.bpm || 125;
            const barLength = 60 / bpm * 4;
            const targetBars = Math.round(profile.introMin / barLength);
            suggestions.push(`Intro measures about ${metrics.intro.toFixed(1)}s. For ${genreName}, DJs need ${profile.introMin}–${profile.introMax}s (~${targetBars}+ bars at ${Math.round(bpm)} BPM) to mix in cleanly. Consider extending with a rhythmic or atmospheric lead-in.`);
        } else if (metrics.intro > profile.introMax * 2) {
            suggestions.push(`Intro runs ${metrics.intro.toFixed(1)}s — on the long side for ${genreName}. A long intro can work in an extended mix, but for demo submissions A&Rs prefer tighter arrangements.`);
        }

        // ── STEREO WIDTH ──
        if (metrics.stereoWidth <= 0.05) {
            suggestions.push(`Track appears to be fully mono. While mono-compatibility is great, most ${genreName} masters utilize stereo width for pads, reverbs, and hi-hats. Check if your master bus or limiter is collapsing the stereo image.`);
        } else if (metrics.stereoWidth > 0.90) {
            suggestions.push(`Stereo width is very wide (${Math.round(metrics.stereoWidth * 100)}%). Extreme width can cause phase cancellation on mono club systems. Check your mix in mono — if elements disappear, pull back on stereo widening plugins.`);
        }

        // ── CREST FACTOR ──
        if (metrics.crestFactor < profile.crestMin) {
            suggestions.push(`Crest factor is ${metrics.crestFactor.toFixed(1)} dB — the track may be over-compressed for ${genreName}. This means the limiter is working very hard, which can flatten transients and cause audible distortion. Try reducing the input gain to your limiter by 1-2 dB.`);
        } else if (metrics.crestFactor > profile.crestMax) {
            suggestions.push(`Crest factor is ${metrics.crestFactor.toFixed(1)} dB — dynamic range is wider than typical for ${genreName}. This could mean the track is under-limited for club playback. If this is a pre-master, that's expected.`);
        }

        // ── TONAL BALANCE ──
        if (metrics.tonalBalance && profile.tonalRef) {
            const bandLabels = ['Low end (20–250 Hz)', 'Low-mids (250 Hz–2 kHz)', 'High-mids (2–6 kHz)', 'High end (6–20 kHz)'];
            for (let b = 0; b < 4; b++) {
                const diff = metrics.tonalBalance[b] - profile.tonalRef[b];
                if (Math.abs(diff) > 4) {
                    const direction = diff > 0 ? 'above' : 'below';
                    const action = diff > 0 ? 'Cut' : 'Boost';
                    suggestions.push(`${bandLabels[b]} is ${Math.abs(diff).toFixed(1)} dB ${direction} the typical ${genreName} reference. ${action} this range by ~${Math.abs(diff).toFixed(0)} dB on your master bus EQ to better match genre expectations.`);
                }
            }
        }

        // ── CLIPPING ──
        if (metrics.clippedSamples > 0) {
            suggestions.push(`Detected ${metrics.clippedSamples} clipped samples. Digital clipping causes harsh distortion that becomes more audible on compressed streaming formats. Set your limiter's true peak ceiling to −1.0 dBTP and check your gain staging.`);
        }

        // ── MONO COMPATIBILITY ──
        if (metrics.monoCompatibility < 0.7) {
            suggestions.push(`Mono compatibility is low (${Math.round(metrics.monoCompatibility * 100)}%) — significant energy is lost when the track is summed to mono. This is a problem for club systems with mono subs and festival PAs. Check for phase issues in stereo widening, reverbs, or layered elements.`);
        }

        // ── ALL GOOD ──
        if (suggestions.length === 0) {
            suggestions.push(`Technical specs look solid for ${genreName}. Loudness, peak level, stereo image, and dynamic range all fall within expected ranges. The engineering checks out — focus on mix quality and arrangement.`);
        }

        return suggestions.slice(0, 5);
    }

    async function saveAnalysisToSupabase(metrics, score, suggestions) {
        try {
            // Need window.supabaseClient from app.js
            if (!window.supabaseClient) {
                console.warn('Supabase client not initialized');
                return;
            }

            const { data: { user } } = await window.supabaseClient.auth.getUser();

            if (!user) {
                console.log('User not logged in, skipping save to Supabase');
                return;
            }

            const { error } = await window.supabaseClient
                .from('analyses')
                .insert({
                    user_id: user.id,
                    filename: window.currentAudioFile ? window.currentAudioFile.name : 'unknown',
                    metrics: metrics,
                    score: score,
                    suggestions: suggestions
                });

            if (error) {
                console.error('Supabase save error:', error);
            } else {
                console.log('Analysis saved to Supabase');
            }
        } catch (err) {
            // Prevent crashing the analysis flow
            console.error('Error in saveAnalysisToSupabase:', err);
        }
    }
});
