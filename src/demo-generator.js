
const GEMINI_API_KEY = "AIzaSyAv_NPbgitT4i8jJSoX7ty-J_SNl73j7oA";
const MODEL_NAME = "gemini-1.5-flash";

export async function generatePitch(label, trackMetrics, artistName = "Artist") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    // Construct the prompt
    const promptText = `
    Sei un manager musicale esperto di musica elettronica. Scrivi 3 varianti di email di pitch per inviare una demo a ${label.name}. 
    La traccia ha: BPM ${Math.round(trackMetrics.bpm)}, stile/energia ${trackMetrics.energyStdDev > 0.15 ? 'High Energy' : 'Deep/Atmospheric'}.
    
    Le 3 varianti devono essere: 
    1) Formale e professionale
    2) Diretta e concisa
    3) Personale e creativa
    
    Ogni email deve avere oggetto e corpo. 
    MAX 150 parole per variante. 
    Il tono deve essere autentico, non "robotico". Evita frasi fatte come "I hope this email finds you well". Vai dritto al punto ma con educazione.
    
    Rispondi SOLO con un JSON array valido: 
    [{"subject": "...", "body": "..."}, {"subject": "...", "body": "..."}, {"subject": "...", "body": "..."}]
    `;

    const requestBody = {
        contents: [{
            parts: [{
                text: promptText
            }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Extract text from response
        const candidate = data.candidates[0].content.parts[0].text;

        // Parse JSON from the text (it might be wrapped in ```json ... ```)
        let jsonString = candidate.trim();
        if (jsonString.startsWith('```json')) {
            jsonString = jsonString.replace(/^```json/, '').replace(/```$/, '');
        } else if (jsonString.startsWith('```')) {
            jsonString = jsonString.replace(/^```/, '').replace(/```$/, '');
        }

        const emailVariants = JSON.parse(jsonString);
        return emailVariants;

    } catch (error) {
        console.error("Error generating pitch:", error);
        throw error;
    }
}

export async function generateFollowUp(labelName, trackName) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const promptText = `
    Scrivi una breve email di follow-up per una demo inviata a ${labelName} una settimana fa.
    Nome traccia: "${trackName || 'my demo'}".
    L'obiettivo è chiedere gentilmente se hanno avuto modo di ascoltarla.
    Tono: Professionale ma non assillante.
    Max 60 parole.
    
    Rispondi SOLO con un JSON objet: {"subject": "...", "body": "..."}
    `;

    const requestBody = {
        contents: [{ parts: [{ text: promptText }] }]
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
            jsonString = jsonString.replace(/^```json/, '').replace(/```$/, '');
        } else if (jsonString.startsWith('```')) {
            jsonString = jsonString.replace(/^```/, '').replace(/```$/, '');
        }

        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error generating follow-up:", error);
        throw error;
    }
}
