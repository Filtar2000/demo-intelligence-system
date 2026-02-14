import './app.js';

// ─── GENRE-SPECIFIC MASTERING PROFILES ───
// Based on Beatport categories, industry mastering standards, and DJ requirements.
// Sources: iZotope, MasteringTheMix, Beatport genre data, DJ community standards.
const GENRE_PROFILES = {
    'house': { bpmMin: 118, bpmMax: 128, lufsMin: -10, lufsMax: -7, introMin: 16, introMax: 32, energyMin: 0.06, label: 'House' },
    'deep house': { bpmMin: 118, bpmMax: 125, lufsMin: -12, lufsMax: -8, introMin: 16, introMax: 32, energyMin: 0.05, label: 'Deep House' },
    'tech house': { bpmMin: 124, bpmMax: 130, lufsMin: -9, lufsMax: -7, introMin: 16, introMax: 32, energyMin: 0.07, label: 'Tech House' },
    'future house': { bpmMin: 124, bpmMax: 130, lufsMin: -9, lufsMax: -6, introMin: 8, introMax: 16, energyMin: 0.08, label: 'Future House' },
    'bass house': { bpmMin: 124, bpmMax: 132, lufsMin: -8, lufsMax: -6, introMin: 8, introMax: 16, energyMin: 0.09, label: 'Bass House' },
    'afro house': { bpmMin: 118, bpmMax: 125, lufsMin: -10, lufsMax: -8, introMin: 16, introMax: 32, energyMin: 0.06, label: 'Afro House' },
    'organic house': { bpmMin: 110, bpmMax: 122, lufsMin: -12, lufsMax: -9, introMin: 16, introMax: 48, energyMin: 0.04, label: 'Organic House' },
    'melodic house & techno': { bpmMin: 120, bpmMax: 128, lufsMin: -10, lufsMax: -8, introMin: 16, introMax: 32, energyMin: 0.06, label: 'Melodic House & Techno' },
    'peak-time techno': { bpmMin: 130, bpmMax: 140, lufsMin: -8, lufsMax: -6, introMin: 16, introMax: 32, energyMin: 0.08, label: 'Peak-Time Techno' },
    'hard techno': { bpmMin: 140, bpmMax: 155, lufsMin: -7, lufsMax: -5, introMin: 16, introMax: 32, energyMin: 0.10, label: 'Hard Techno' },
    'industrial techno': { bpmMin: 130, bpmMax: 150, lufsMin: -8, lufsMax: -6, introMin: 16, introMax: 32, energyMin: 0.09, label: 'Industrial Techno' },
    'minimal': { bpmMin: 120, bpmMax: 128, lufsMin: -12, lufsMax: -8, introMin: 16, introMax: 32, energyMin: 0.04, label: 'Minimal / Deep Tech' },
    'trance': { bpmMin: 130, bpmMax: 142, lufsMin: -9, lufsMax: -7, introMin: 16, introMax: 32, energyMin: 0.08, label: 'Trance' },
    'psy-trance': { bpmMin: 138, bpmMax: 148, lufsMin: -8, lufsMax: -6, introMin: 8, introMax: 16, energyMin: 0.09, label: 'Psy-Trance' },
    'progressive house': { bpmMin: 122, bpmMax: 128, lufsMin: -10, lufsMax: -8, introMin: 32, introMax: 64, energyMin: 0.05, label: 'Progressive House' },
    'indie dance': { bpmMin: 110, bpmMax: 125, lufsMin: -10, lufsMax: -8, introMin: 8, introMax: 16, energyMin: 0.06, label: 'Indie Dance' },
    'nu disco': { bpmMin: 115, bpmMax: 125, lufsMin: -10, lufsMax: -8, introMin: 8, introMax: 16, energyMin: 0.06, label: 'Nu Disco' },
    'dubstep': { bpmMin: 138, bpmMax: 142, lufsMin: -8, lufsMax: -6, introMin: 8, introMax: 16, energyMin: 0.10, label: 'Dubstep' },
    'drum and bass': { bpmMin: 170, bpmMax: 180, lufsMin: -9, lufsMax: -7, introMin: 16, introMax: 32, energyMin: 0.08, label: 'Drum & Bass' },
    'breaks': { bpmMin: 125, bpmMax: 140, lufsMin: -9, lufsMax: -7, introMin: 8, introMax: 16, energyMin: 0.07, label: 'Breaks' },
    'electro house': { bpmMin: 126, bpmMax: 132, lufsMin: -8, lufsMax: -6, introMin: 8, introMax: 16, energyMin: 0.09, label: 'Electro House' },
    'big room': { bpmMin: 126, bpmMax: 132, lufsMin: -7, lufsMax: -5, introMin: 8, introMax: 16, energyMin: 0.10, label: 'Big Room' },
    'hard dance': { bpmMin: 150, bpmMax: 160, lufsMin: -7, lufsMax: -5, introMin: 8, introMax: 16, energyMin: 0.10, label: 'Hard Dance / Hardcore' },
    'downtempo': { bpmMin: 90, bpmMax: 115, lufsMin: -14, lufsMax: -10, introMin: 8, introMax: 32, energyMin: 0.03, label: 'Electronica / Downtempo' },
    'ambient': { bpmMin: 60, bpmMax: 110, lufsMin: -18, lufsMax: -12, introMin: 8, introMax: 64, energyMin: 0.02, label: 'Ambient / Experimental' },
    'dance': { bpmMin: 118, bpmMax: 130, lufsMin: -9, lufsMax: -6, introMin: 4, introMax: 16, energyMin: 0.07, label: 'Dance / Pop-Dance' }
};

// Fallback profile if genre not found
const DEFAULT_PROFILE = { bpmMin: 120, bpmMax: 150, lufsMin: -10, lufsMax: -7, introMin: 16, introMax: 32, energyMin: 0.06, label: 'Electronic' };

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
    const barHeadroom = document.getElementById('bar-headroom'); // will represent peak safety

    const metricIntro = document.getElementById('metric-intro');
    const barIntro = document.getElementById('bar-intro');

    const metricEnergy = document.getElementById('metric-energy-var');
    const barEnergy = document.getElementById('bar-energy');

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
            const channelData = audioBuffer.getChannelData(0); // Analyze first channel (mono)

            // Metrics arrays
            let rmsValues = [];
            let spectralCentroids = [];
            let zcrValues = [];

            // Meyda setup
            Meyda.bufferSize = bufferSize;

            for (let i = 0; i < channelData.length; i += bufferSize) {
                const chunk = channelData.slice(i, i + bufferSize);
                let signal = chunk;
                if (chunk.length < bufferSize) {
                    signal = new Float32Array(bufferSize);
                    signal.set(chunk);
                }

                const features = Meyda.extract(['rms', 'spectralCentroid', 'zcr'], signal);
                if (features) {
                    rmsValues.push(features.rms);
                    spectralCentroids.push(features.spectralCentroid);
                    zcrValues.push(features.zcr);
                }
            }

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

            // 4. Energy Variation
            const meanRms = rmsValues.reduce((a, b) => a + b, 0) / rmsValues.length;
            const variance = rmsValues.reduce((a, b) => a + Math.pow(b - meanRms, 2), 0) / rmsValues.length;
            const energyStdDev = Math.sqrt(variance);

            // 5. BPM
            const bpm = calculateBPM(rmsValues, sampleRate / bufferSize);

            // 6. Vocal Presence Heuristic (Simple)
            // Vocals often have high variance in spectral centroid between 1000Hz and 3000Hz
            // We'll use a simple threshold on the variance of the centroid
            const centroidMean = spectralCentroids.reduce((a, b) => a + b, 0) / spectralCentroids.length;
            const centroidVariance = spectralCentroids.reduce((a, b) => a + Math.pow(b - centroidMean, 2), 0) / spectralCentroids.length;
            const centroidStdDev = Math.sqrt(centroidVariance);

            // Heuristic: Pop/Vocal tracks often have high centroid variability
            const vocalScore = Math.min(100, Math.round(mapRange(centroidStdDev, 10, 50, 0, 100)));
            const hasVocals = vocalScore > 40; // Arbitrary threshold

            // --- SCORING ---
            const metrics = {
                lufs: approximateLufs,
                headroom: headroom,
                intro: introDuration,
                energyStdDev: energyStdDev,
                bpm: bpm || 0,
                vocalPresence: vocalScore // 0-100
            };

            const score = calculateScore(metrics);
            const suggestions = generateSuggestions(metrics, score);

            // --- UI UPDATE ---

            // Update Text Values
            metricBpm.textContent = bpm ? Math.round(bpm) : "--";
            metricLufs.textContent = `${approximateLufs.toFixed(1)} dB`;
            document.getElementById('metric-headroom').textContent = `${headroom.toFixed(1)} dB`;
            metricIntro.textContent = `${introDuration.toFixed(1)}s`;
            metricEnergy.textContent = energyStdDev.toFixed(3);

            // Update Progress Bars (Visual Feedback based on genre profile)
            const selectedGenre = document.getElementById('genre-select').value || '';
            const gp = GENRE_PROFILES[selectedGenre] || DEFAULT_PROFILE;
            updateBar(barBpm, metrics.bpm >= gp.bpmMin && metrics.bpm <= gp.bpmMax, 100);
            updateBar(barLufs, metrics.lufs >= gp.lufsMin && metrics.lufs <= gp.lufsMax, mapRange(metrics.lufs, -30, 0, 0, 100));
            // For mastered tracks: 0.3–1 dB headroom is standard; > 0 dB true peak = problem
            updateBar(barHeadroom, metrics.headroom >= 0.1, Math.min(100, Math.max(5, metrics.headroom * 50)));
            updateBar(barIntro, metrics.intro >= gp.introMin && metrics.intro <= gp.introMax, Math.min(100, (metrics.intro / Math.max(gp.introMax, 32)) * 100));
            updateBar(barEnergy, metrics.energyStdDev >= gp.energyMin, Math.min(100, metrics.energyStdDev * 500));

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
                localStorage.setItem('trackMetrics', JSON.stringify({ metrics, score, genre: selectedGenre, mood: selectedMood, energy: selectedEnergy }));

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
            score += Math.max(0, Math.round(30 - (diff * 4)));
        }

        // 2. BPM — scored against genre-specific range (25 pts)
        if (metrics.bpm >= profile.bpmMin && metrics.bpm <= profile.bpmMax) {
            score += 25;
        } else {
            let dist = 0;
            if (metrics.bpm < profile.bpmMin) dist = profile.bpmMin - metrics.bpm;
            if (metrics.bpm > profile.bpmMax) dist = metrics.bpm - profile.bpmMax;
            let penalty = (dist / 20) * 25;
            score += Math.round(Math.max(0, 25 - penalty));
        }

        // 3. Headroom — for finished masters, 0.3–1 dB is standard (15 pts)
        // True peak above 0 dBFS = clipping risk on conversion
        if (metrics.headroom >= 0.3) {
            score += 15;  // any headroom above 0.3 dB is fine for a master
        } else if (metrics.headroom >= 0.1) {
            score += 10;  // very tight but acceptable
        } else {
            score += 3;   // true peak essentially at 0 — inter-sample clipping risk
        }

        // 4. Intro length — scored against genre expectations (15 pts)
        const introInSeconds = metrics.intro;
        if (introInSeconds >= profile.introMin && introInSeconds <= profile.introMax) {
            score += 15;
        } else if (introInSeconds < profile.introMin * 0.5 || introInSeconds > profile.introMax * 2) {
            score += 0;
        } else {
            score += 8; // partial credit
        }

        // 5. Energy dynamics — minimum variation for genre (15 pts)
        if (metrics.energyStdDev >= profile.energyMin) {
            score += 15;
        } else {
            let ratio = metrics.energyStdDev / profile.energyMin;
            score += Math.round(ratio * 15);
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
            suggestions.push(`Integrated loudness reads ${metrics.lufs.toFixed(1)} LUFS — about ${gap} dB below the typical mastering target for ${genreName} (${profile.lufsMin} to ${profile.lufsMax} LUFS). If this is a pre-master, that's expected. On a finished master, check your limiter ceiling and make sure low-end buildup isn't stealing headroom from the rest of the spectrum.`);
        } else if (metrics.lufs > profile.lufsMax) {
            const gap = Math.abs(metrics.lufs - profile.lufsMax).toFixed(1);
            suggestions.push(`Integrated loudness reads ${metrics.lufs.toFixed(1)} LUFS — about ${gap} dB above the typical ${genreName} ceiling of ${profile.lufsMax} LUFS. At this level, you may be introducing limiter distortion or audible pumping. Pull the output ceiling back and A/B your master against a reference track.`);
        }

        // ── BPM ──
        if (metrics.bpm > 0) {
            const bpmRound = Math.round(metrics.bpm);
            if (metrics.bpm < profile.bpmMin || metrics.bpm > profile.bpmMax) {
                suggestions.push(`Detected tempo: ${bpmRound} BPM. Standard range for ${genreName} is ${profile.bpmMin}–${profile.bpmMax} BPM. If this is intentional (half-time feel, tempo shifts), no issue — but labels that program DJ sets may prefer tracks within that window.`);
            }
        }

        // ── TRUE PEAK / HEADROOM ──
        // This is a finished master — near-zero headroom is normal.
        // Only warn about true peak clipping risk.
        if (metrics.headroom < 0.1) {
            suggestions.push(`True peak is essentially at 0 dBFS (headroom: ${metrics.headroom.toFixed(1)} dB). On lossy codecs (MP3, AAC, streaming) this almost always causes inter-sample clipping. Set your limiter's true peak ceiling to −0.3 dBTP or lower — this is an industry standard (ITU-R BS.1770).`);
        } else if (metrics.headroom >= 3) {
            suggestions.push(`Headroom is ${metrics.headroom.toFixed(1)} dB — the master may be under-limited for ${genreName}. Most finished ${genreName} masters peak between −1.0 and −0.3 dBTP. If you're sending a pre-master intentionally, ignore this.`);
        }

        // ── INTRO LENGTH ──
        if (metrics.intro < profile.introMin && metrics.intro > 0.5) {
            // Only flag if we have a reasonable reading (>0.5s means we actually detected some intro)
            const bpm = metrics.bpm || 125;
            const barLength = 60 / bpm * 4; // seconds per bar
            const targetBars = Math.round(profile.introMin / barLength);
            suggestions.push(`Intro measures about ${metrics.intro.toFixed(1)}s. For ${genreName}, DJs typically need ${profile.introMin}–${profile.introMax}s (~${targetBars}+ bars at ${Math.round(bpm)} BPM) to mix in cleanly. Consider extending with a rhythmic or atmospheric lead-in.`);
        } else if (metrics.intro > profile.introMax * 2) {
            suggestions.push(`Intro runs ${metrics.intro.toFixed(1)}s — on the long side even for ${genreName}. A long intro can work in an extended mix, but for demo submissions most A&Rs prefer a tighter arrangement.`);
        }

        // ── ENERGY DYNAMICS ──
        if (metrics.energyStdDev < profile.energyMin) {
            suggestions.push(`Dynamic variation is low (${metrics.energyStdDev.toFixed(3)}). ${genreName} tracks benefit from contrast between sections — breakdowns, builds, drops. Automate filters, use arrangement dynamics, or add transitional FX to create tension and release.`);
        }

        // ── ALL GOOD ──
        if (suggestions.length === 0) {
            suggestions.push(`Technical specs look solid for ${genreName}. Loudness, BPM, peak level, intro, and dynamics are all within expected ranges. Focus on mix quality, arrangement, and making sure it stands out musically — the engineering checks out.`);
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
