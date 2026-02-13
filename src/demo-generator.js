
const GEMINI_API_KEY = "AIzaSyAv_NPbgitT4i8jJSoX7ty-J_SNl73j7oA";
const MODEL_NAME = "gemini-2.0-flash";

export async function generatePitch(label, trackMetrics, artistName = "Artist") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    // Build rich context from label data
    const labelInfo = [];
    if (label.bio) labelInfo.push(`Label description: ${label.bio}`);
    if (label.mood && label.mood.length) labelInfo.push(`Label mood: ${label.mood.join(', ')}`);
    if (label.style && label.style.length) labelInfo.push(`Label style: ${label.style.join(', ')}`);
    if (label.subgenres && label.subgenres.length) labelInfo.push(`Genres: ${label.subgenres.join(', ')}`);
    if (label.energy || label.energy_profile) labelInfo.push(`Energy: ${label.energy || label.energy_profile}`);

    const trackInfo = [];
    if (trackMetrics.bpm) trackInfo.push(`BPM: ${Math.round(trackMetrics.bpm)}`);
    if (trackMetrics.lufs) trackInfo.push(`LUFS: ${trackMetrics.lufs.toFixed(1)}`);
    if (trackMetrics.energyStdDev !== undefined) {
        trackInfo.push(`Energy style: ${trackMetrics.energyStdDev > 0.15 ? 'High Energy / Dynamic' : 'Deep / Atmospheric / Subtle'}`);
    }

    const promptText = `You are an expert music industry manager specializing in electronic music demo submissions.

Write 3 variants of a pitch email to submit a demo to ${label.name}.

${labelInfo.length > 0 ? `ABOUT THE LABEL:\n${labelInfo.join('\n')}` : ''}

${trackInfo.length > 0 ? `ABOUT THE TRACK:\n${trackInfo.join('\n')}` : ''}

The 3 variants must be:
1) Formal and professional
2) Direct and concise  
3) Personal and creative

Rules:
- Each email must have a subject line and body
- MAX 120 words per variant
- Be authentic, not robotic
- Skip generic phrases like "I hope this email finds you well"
- Reference the label's specific style/sound if known
- Be respectful but confident
- Write in English

Respond ONLY with a valid JSON array, no markdown formatting:
[{"subject": "...", "body": "..."}, {"subject": "...", "body": "..."}, {"subject": "...", "body": "..."}]`;

    const requestBody = {
        contents: [{
            parts: [{ text: promptText }]
        }],
        generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2048
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error('Gemini API error:', response.status, errData);
            throw new Error(`API Error ${response.status}: ${errData?.error?.message || response.statusText}`);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            throw new Error('No candidates returned from Gemini API');
        }

        const candidate = data.candidates[0].content.parts[0].text;

        // Parse JSON — handle markdown code blocks
        let jsonString = candidate.trim();
        if (jsonString.startsWith('```json')) {
            jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (jsonString.startsWith('```')) {
            jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        const emailVariants = JSON.parse(jsonString);

        // Validate structure
        if (!Array.isArray(emailVariants) || emailVariants.length < 1) {
            throw new Error('Invalid response format: expected array of email variants');
        }

        return emailVariants;

    } catch (error) {
        console.error("Error generating pitch:", error);
        throw error;
    }
}

export async function generateFollowUp(labelName, trackName) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const promptText = `Write a brief follow-up email for a demo sent to ${labelName} one week ago.
Track name: "${trackName || 'my demo'}".
Goal: politely ask if they had a chance to listen.
Tone: Professional but not pushy.
Max 60 words.

Respond ONLY with a JSON object: {"subject": "...", "body": "..."}`;

    const requestBody = {
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const data = await response.json();
        const candidate = data.candidates[0].content.parts[0].text;

        let jsonString = candidate.trim();
        if (jsonString.startsWith('```json')) {
            jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (jsonString.startsWith('```')) {
            jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error generating follow-up:", error);
        throw error;
    }
}
