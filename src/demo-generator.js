// ─── SMART PITCH TEMPLATES ───
// No API needed. Professional templates with dynamic variable replacement.

export function generatePitch(label, trackMetrics, artistName = "Artist") {
    // Build context strings from label data
    const labelName = label.name || 'your label';
    const genres = Array.isArray(label.subgenres) ? label.subgenres.join(', ') : '';
    const moods = Array.isArray(label.mood) ? label.mood.join(' / ') : '';
    const energy = label.energy || label.energy_profile || '';

    // Track info
    const bpm = trackMetrics.bpm ? Math.round(trackMetrics.bpm) : null;
    const lufs = trackMetrics.lufs ? trackMetrics.lufs.toFixed(1) : null;
    const isHighEnergy = trackMetrics.energyStdDev !== undefined && trackMetrics.energyStdDev > 0.15;

    // Build a one-liner about the track's sound
    const trackDescParts = [];
    if (bpm) trackDescParts.push(`${bpm} BPM`);
    if (genres) trackDescParts.push(genres.split(',')[0].trim()); // primary genre
    if (moods) trackDescParts.push(moods.split('/')[0].trim().toLowerCase());
    const trackOneLiner = trackDescParts.length > 0
        ? trackDescParts.join(', ')
        : 'electronic';

    // Build a sentence about why this label specifically
    const labelFitLine = genres
        ? `I've been following ${labelName}'s releases in the ${genres.split(',')[0].trim()} space`
        : `I've been following ${labelName}'s catalogue`;

    const moodLine = moods
        ? `I think the ${moods.toLowerCase()} direction of this track aligns well with your sound.`
        : `I believe this track fits the direction of your releases.`;

    const trackSpecLine = bpm
        ? `The track sits at ${bpm} BPM${lufs ? ` / ${lufs} LUFS` : ''} — ready for release.`
        : '';

    // ── VARIANT 1: Formal & Professional ──
    const formal = {
        subject: `Demo Submission — ${trackOneLiner}`,
        body: `Hi ${labelName} team,

${labelFitLine} and I'd like to submit a track for your consideration.

${moodLine}${trackSpecLine ? '\n\n' + trackSpecLine : ''}

The demo is attached as a private streaming link. Happy to send a WAV if there's interest.

Looking forward to hearing your thoughts.

Best regards`
    };

    // ── VARIANT 2: Direct & Concise ──
    const direct = {
        subject: `Demo for ${labelName}`,
        body: `Hey,

Got a ${trackOneLiner} track that I think fits ${labelName}'s sound. ${moodLine}

${trackSpecLine ? trackSpecLine + '\n\n' : ''}Link attached — let me know if you'd like the full WAV.

Cheers`
    };

    // ── VARIANT 3: Personal & Creative ──
    const creative = {
        subject: `New ${trackOneLiner} — would love your ears on this`,
        body: `Hi there,

${labelFitLine} — your A&R taste is exactly why I'm reaching out.

I've been working on a ${isHighEnergy ? 'high-energy' : 'deep, atmospheric'} piece that I think would sit well alongside your recent releases. ${moodLine}

${trackSpecLine ? trackSpecLine + '\n\n' : ''}Would love your honest feedback — even a "not for us" helps me grow.

Thanks for your time`
    };

    // Return as resolved promise (keeps the same async interface)
    return Promise.resolve([formal, direct, creative]);
}

export function generateFollowUp(labelName, trackName) {
    const track = trackName || 'my recent demo';

    const email = {
        subject: `Following up — ${track}`,
        body: `Hi ${labelName} team,

I sent over "${track}" about a week ago and wanted to check if you had a chance to listen.

No rush at all — I know you receive a lot of demos. Just want to make sure it didn't slip through.

Happy to answer any questions or send alternative formats.

Thanks again for considering it.

Best regards`
    };

    return Promise.resolve(email);
}
