import './app.js';

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
        dropZone.style.borderColor = "#fff";
    }

    function unhighlight(e) {
        dropZone.classList.remove('highlight');
        dropZone.style.borderColor = "var(--accent-color)";
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

            // 3. Intro Duration
            let introFrames = 0;
            const energyThreshold = 0.1;
            for (let i = 0; i < rmsValues.length; i++) {
                if (rmsValues[i] > energyThreshold) {
                    introFrames = i;
                    break;
                }
            }
            if (introFrames === 0 && avgRms < 0.05) introFrames = rmsValues.length;
            const secondsPerChunk = bufferSize / sampleRate;
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

            // Update Progress Bars (Visual Feedback based on quality)
            updateBar(barBpm, metrics.bpm >= 120 && metrics.bpm <= 150, 100);
            updateBar(barLufs, metrics.lufs >= -14 && metrics.lufs <= -6, mapRange(metrics.lufs, -30, 0, 0, 100));
            updateBar(barHeadroom, metrics.headroom >= 3, Math.min(100, metrics.headroom * 10));
            updateBar(barIntro, metrics.intro >= 16 && metrics.intro <= 32, Math.min(100, (metrics.intro / 60) * 100)); // normalized to 60s
            updateBar(barEnergy, metrics.energyStdDev > 0.05, Math.min(100, metrics.energyStdDev * 500));

            function updateBar(element, isGood, percent) {
                element.style.width = `${Math.max(5, Math.min(100, percent))}%`;
                element.style.backgroundColor = isGood ? '#4caf50' : '#f44336';
                if (!isGood && percent > 0 && percent < 100) element.style.backgroundColor = '#ffc107'; // yellow for mid
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

            // ANIMATE SCORE
            animateScore(score);

            // SAVE TO SUPABASE (Moved to background or keep as is)
            saveAnalysisToSupabase(metrics, score, suggestions);

            // ENABLE LABEL FINDER
            const findLabelsBtn = document.getElementById('find-labels-btn');
            findLabelsBtn.disabled = false;

            findLabelsBtn.onclick = () => {
                // Save metrics to local storage for the next page to use
                const dataToSave = {
                    metrics: metrics,
                    score: score,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem('trackMetrics', JSON.stringify(dataToSave));

                // Navigate
                window.location.href = 'label-fit.html';
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
        let score = 0;

        // 1. LUFS (-14 to -6)
        if (metrics.lufs >= -14 && metrics.lufs <= -6) {
            score += 25;
        } else {
            let diff = 0;
            if (metrics.lufs < -14) diff = Math.abs(metrics.lufs - (-14));
            if (metrics.lufs > -6) diff = Math.abs(metrics.lufs - (-6));
            let points = 25 - (diff * 3);
            score += Math.max(0, points);
        }

        // 2. Headroom (>3dB = 20, <1dB = 0)
        if (metrics.headroom >= 3) {
            score += 20;
        } else if (metrics.headroom <= 1) {
            score += 0;
        } else {
            let ratio = (metrics.headroom - 1) / 2;
            score += Math.round(ratio * 20);
        }

        // 3. Intro (16-32s)
        if (metrics.intro >= 16 && metrics.intro <= 32) {
            score += 20;
        } else if (metrics.intro < 8 || metrics.intro > 60) {
            score += 0;
        } else {
            score += 10; // Partial credit
        }

        // 4. Energy (>0.15 = 20, <0.05 = 5)
        if (metrics.energyStdDev > 0.15) {
            score += 20;
        } else if (metrics.energyStdDev < 0.05) {
            score += 5;
        } else {
            let range = 0.10;
            let val = metrics.energyStdDev - 0.05;
            let ratio = val / range;
            score += 5 + Math.round(ratio * 15);
        }

        // 5. BPM (120-150)
        if (metrics.bpm >= 120 && metrics.bpm <= 150) {
            score += 15;
        } else {
            let dist = 0;
            if (metrics.bpm < 120) dist = 120 - metrics.bpm;
            if (metrics.bpm > 150) dist = metrics.bpm - 150;
            let penalty = (dist / 30) * 15;
            score += Math.round(Math.max(0, 15 - penalty));
        }

        // 6. Vocal Bonus (Small bonus for detection)
        if (metrics.vocalPresence > 50) {
            score += 5; // Bonus checks
        }

        return Math.min(100, Math.max(0, Math.round(score)));
    }

    function generateSuggestions(metrics, score) {
        let suggestions = [];

        // Note: Suggestions requested in Italian per previous prompt, but UI text in English.
        // The user prompt said: "(tutto questo che ti ho detto però sul sito lo devi tradurre in inglese)"
        // referring to the UI layout. However, the previous prompt specifically asked for Italian suggestions.
        // I will keep suggestions in Italian to match the specific logic request, but ensure all UI labels are English.
        // Wait, "tutto questo che ti ho detto però sul sito lo devi tradurre in inglese" implies the whole site text including new UI.
        // I will translate these suggestions to English to be consistent with the "whole site in English" request in this turn.

        // LUFS
        if (metrics.lufs < -14) {
            suggestions.push("Volume too low: The track sounds soft compared to club standards. Aim for -10 to -8 LUFS in mastering.");
        } else if (metrics.lufs > -6) {
            suggestions.push("Volume too high: The track is over-compressed. reduce limiting to recover dynamics (target -9 LUFS).");
        }

        // Headroom
        if (metrics.headroom < 3) {
            suggestions.push(`Insufficient Headroom (${metrics.headroom.toFixed(1)}dB): Labels often require -3dB or -6dB headroom for mastering. Lower the master fader.`);
        }

        // Intro
        if (metrics.intro < 16) {
            suggestions.push("Intro too short: DJs need time to mix. Extend the intro to at least 16-32 seconds (8-16 bars).");
        } else if (metrics.intro > 60) {
            suggestions.push("Intro too long: Risk of losing attention. Try to condense the intro to under 60 seconds.");
        }

        // Energy
        if (metrics.energyStdDev < 0.05) {
            suggestions.push("Flat dynamics: The track has little energy variation. Ensure drops have impact relative to breaks.");
        }

        // BPM
        if (metrics.bpm < 115 || metrics.bpm > 155) {
            suggestions.push(`Unusual BPM (${Math.round(metrics.bpm)}): For standard club music, aim for the 120-150 BPM range.`);
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
