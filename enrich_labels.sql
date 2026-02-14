-- ═══════════════════════════════════════════════════════════════
-- ENRICH LABELS — Genre-accurate mood, style, energy & bio data
-- Based on BeatStats, Beatport, and genre research (2024-2025)
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Step 1: Add columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='labels' AND column_name='mood') THEN
        ALTER TABLE labels ADD COLUMN mood text[] DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='labels' AND column_name='style') THEN
        ALTER TABLE labels ADD COLUMN style text[] DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='labels' AND column_name='bio') THEN
        ALTER TABLE labels ADD COLUMN bio text DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='labels' AND column_name='energy') THEN
        ALTER TABLE labels ADD COLUMN energy text DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='labels' AND column_name='demo_email') THEN
        ALTER TABLE labels ADD COLUMN demo_email text DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='labels' AND column_name='website') THEN
        ALTER TABLE labels ADD COLUMN website text DEFAULT '';
    END IF;
END $$;


-- ═══════════════════════════════════════════════════════════════
-- MELODIC TECHNO / MELODIC HOUSE & TECHNO
-- ═══════════════════════════════════════════════════════════════

UPDATE labels SET
    mood = ARRAY['emotional', 'ethereal', 'dark'],
    style = ARRAY['cinematic builds', 'massive drops', 'atmospheric pads'],
    energy = 'high',
    bio = 'Founded by Tale Of Us (Anyma & MRAK). Genre-defining melodic techno with cinematic sound design, profound melodies, and immersive events. Home to Afterlife''s signature epic, emotionally-charged sound.',
    website = 'https://after.life',
    demo_email = 'demo@afterlifeofc.com'
WHERE LOWER(name) = 'afterlife';

UPDATE labels SET
    mood = ARRAY['hypnotic', 'atmospheric', 'dark'],
    style = ARRAY['analog textures', 'deep grooves', 'dark melodics'],
    energy = 'medium',
    bio = 'Founded by Mind Against. Deep, analog-driven melodic techno with darker textures and immersive, hypnotic soundscapes rooted in the Berlin underground.',
    website = 'https://www.habitat.art'
WHERE LOWER(name) = 'habitat';

UPDATE labels SET
    mood = ARRAY['driving', 'energetic', 'dark'],
    style = ARRAY['powerful drops', 'high-energy melodic', 'anthemic builds'],
    energy = 'high',
    bio = 'Founded by ARTBAT. Melodic and progressive high-energy techno featuring powerful sound design and impactful drops. One of the fastest rising melodic labels.',
    website = ''
WHERE LOWER(name) = 'upperground';

UPDATE labels SET
    mood = ARRAY['emotional', 'warm', 'ethereal'],
    style = ARRAY['deep melodics', 'organic textures', 'immersive pads'],
    energy = 'medium',
    bio = 'Premier melodic house & techno / electronica label. Known for deep, emotive soundscapes, lush production and genre-crossing releases from top-tier artists.',
    website = 'https://anjunadeep.com',
    demo_email = 'demo@anjunadeep.com'
WHERE LOWER(name) = 'anjunadeep';

UPDATE labels SET
    mood = ARRAY['uplifting', 'euphoric', 'emotional'],
    style = ARRAY['trance-influenced', 'epic breakdowns', 'vocal anthems'],
    energy = 'high',
    bio = 'Legendary UK trance and progressive label by Above & Beyond. Known for uplifting, euphoric melodics with massive breakdowns and emotional vocal tracks.',
    website = 'https://anjunabeats.com',
    demo_email = 'demo@anjunabeats.com'
WHERE LOWER(name) = 'anjunabeats';

UPDATE labels SET
    mood = ARRAY['emotional', 'warm', 'atmospheric'],
    style = ARRAY['emotional storytelling', 'lush harmonies', 'refined melodics'],
    energy = 'medium',
    bio = 'An offshoot of Joris Voorn''s artistic vision. Embodies melodic techno with emotional storytelling through sound, blending harmonies with dancefloor energy.',
    website = 'https://spectrumrecordings.com'
WHERE LOWER(name) = 'spectrum';

UPDATE labels SET
    mood = ARRAY['emotional', 'groovy', 'warm'],
    style = ARRAY['deep melodics', 'organic grooves', 'understated elegance'],
    energy = 'medium',
    bio = 'Founded by Solomun and Adriano Troilo. Pioneer of melodic house/techno with emotionally driven, cinematic releases that blend deep grooves with rich melodies.',
    website = 'https://diynamic.com',
    demo_email = 'demo@diynamic.com'
WHERE LOWER(name) = 'diynamic';

UPDATE labels SET
    mood = ARRAY['emotional', 'atmospheric', 'warm'],
    style = ARRAY['progressive journeys', 'melodic storytelling', 'long builds'],
    energy = 'medium',
    bio = 'Managed by Hernán Cattáneo. Prominent melodic/progressive label celebrated for emotionally driven releases and cinematic soundscapes balancing melody, rhythm, and storytelling.',
    website = 'https://sudbeat.com'
WHERE LOWER(name) = 'sudbeat';

UPDATE labels SET
    mood = ARRAY['dark', 'driving', 'hypnotic'],
    style = ARRAY['gritty textures', 'futuristic sound design', 'dark tension'],
    energy = 'high',
    bio = 'Founded by Massano. Gritty, futuristic melodic techno with dark tension and powerful impact. One of the newest labels pushing the boundaries of the genre.',
    website = 'https://simulateofficial.com'
WHERE LOWER(name) = 'simulate';

UPDATE labels SET
    mood = ARRAY['emotional', 'ethereal', 'warm'],
    style = ARRAY['ambient textures', 'organic production', 'emotional depth'],
    energy = 'medium',
    bio = 'Founded by RÜFÜS DU SOL. Emotional, organic techno infused with ambient textures and a commitment to blending emotive melodies with innovative soundscapes.',
    website = 'https://roseavenuerecords.com'
WHERE LOWER(name) = 'rose avenue';

UPDATE labels SET
    mood = ARRAY['emotional', 'deep', 'atmospheric'],
    style = ARRAY['deep melodics', 'emotive sound design', 'rhythmic complexity'],
    energy = 'medium',
    bio = 'Established in 2016, focuses on melodic techno and electronic music. Known for deep, emotive soundscapes combined with rhythmic complexity.',
    website = 'https://www.adriatique.ch/siamese-rec'
WHERE LOWER(name) = 'siamese';

UPDATE labels SET
    mood = ARRAY['emotional', 'warm', 'atmospheric'],
    style = ARRAY['vibrant melodies', 'progressive elements', 'ambient influences'],
    energy = 'medium',
    bio = 'Founded in 2023. Specializes in vibrant and immersive sounds, combining melodic techno with hints of progressive and ambient influences.',
    website = 'https://zmaagency.com/talents/zamna-records/'
WHERE LOWER(name) = 'zamna records';


-- ═══════════════════════════════════════════════════════════════
-- TECHNO (Peak-Time / Hard / Industrial / Raw)
-- ═══════════════════════════════════════════════════════════════

UPDATE labels SET
    mood = ARRAY['driving', 'dark', 'hypnotic'],
    style = ARRAY['peak-time loops', 'stripped-back grooves', 'relentless energy'],
    energy = 'high',
    bio = 'Founded by Adam Beyer. Legendary Swedish techno institution known for relentless, driving peak-time techno with stripped-back grooves and powerful DJ-tool releases.',
    website = 'https://drumcode.se',
    demo_email = 'demo@drumcode.se'
WHERE LOWER(name) = 'drumcode';

UPDATE labels SET
    mood = ARRAY['dark', 'hypnotic', 'atmospheric'],
    style = ARRAY['detroit-influenced', 'raw grooves', 'minimal techno'],
    energy = 'medium',
    bio = 'Seminal techno label run by Richie Hawtin. Blends minimal, experimental, and raw techno with Detroit-influenced aesthetics. A pillar of underground techno culture.',
    website = 'https://m-nus.com'
WHERE LOWER(name) = 'minus';

UPDATE labels SET
    mood = ARRAY['dark', 'driving', 'energetic'],
    style = ARRAY['UK techno', 'warehouse sound', 'functional techno'],
    energy = 'high',
    bio = 'Influential UK techno label known for raw, warehouse-style techno. Consistent quality with big-room functional releases for peak-time dancefloors.',
    website = 'https://intecdigital.com',
    demo_email = 'demo@intecdigital.com'
WHERE LOWER(name) = 'intec';

UPDATE labels SET
    mood = ARRAY['dark', 'hypnotic', 'driving'],
    style = ARRAY['raw techno', 'underground loops', 'functional DJ tools'],
    energy = 'high',
    bio = 'Underground techno powerhouse. Dark, raw, and functional techno built for the dancefloor. Releases are designed as effective DJ tools with driving energy.',
    website = 'https://suara.com',
    demo_email = 'demo@suara.com'
WHERE LOWER(name) = 'suara';

UPDATE labels SET
    mood = ARRAY['dark', 'driving', 'raw'],
    style = ARRAY['industrial textures', 'hard-hitting', 'dark atmospheres'],
    energy = 'high',
    bio = 'Renowned techno label for dark, industrial-tinged releases. Features relentless beats and heavy sound design for peak-time moments.',
    website = 'https://secondstate.audio'
WHERE LOWER(name) = 'second state';

UPDATE labels SET
    mood = ARRAY['hypnotic', 'dark', 'atmospheric'],
    style = ARRAY['experimental techno', 'ambient textures', 'hypnotic loops'],
    energy = 'medium',
    bio = 'Berlin-based experimental techno label blending techno with ambient and industrial elements. Hypnotic, atmospheric productions with a focus on sound design.',
    website = 'https://ostgut.de'
WHERE LOWER(name) = 'ostgut ton';

UPDATE labels SET
    mood = ARRAY['dark', 'hypnotic', 'driving'],
    style = ARRAY['stripped-back', 'functional', 'minimal techno'],
    energy = 'high',
    bio = 'Iconic Berlin-based label for raw, stripped-back techno. Known for ultra-minimal, pounding grooves designed purely for peak-time club environments.',
    website = 'https://somarecords.com'
WHERE LOWER(name) = 'soma';

UPDATE labels SET
    mood = ARRAY['dark', 'energetic', 'driving'],
    style = ARRAY['hard-hitting techno', 'modular synths', 'industrial bass'],
    energy = 'high',
    bio = 'Label of Adam Beyer''s peer Enrico Sangiuliano. Known for precise, technically advanced techno with powerful drops and modular synthesis.'
WHERE LOWER(name) = 'filth on acid';

UPDATE labels SET
    mood = ARRAY['dark', 'hypnotic', 'atmospheric'],
    style = ARRAY['immersive techno', 'narrative-driven', 'cinematic dark'],
    energy = 'medium',
    bio = 'Founded by Maceo Plex. Immersive, narrative-driven label that merges dark techno with cinematic atmospheres and electronic experimentation.',
    website = 'https://ellumrecords.com'
WHERE LOWER(name) = 'ellum';

UPDATE labels SET
    mood = ARRAY['dark', 'driving', 'hypnotic'],
    style = ARRAY['club-focused', 'DJ tools', 'consistent quality'],
    energy = 'high',
    bio = 'DC Records founded by Jamie Jones and the wider Hot Creations family. Club-focused releases from the underground to main stages worldwide.',
    website = 'https://circolocorecords.com'
WHERE LOWER(name) = 'circoloco records';


-- ═══════════════════════════════════════════════════════════════
-- TECH HOUSE
-- ═══════════════════════════════════════════════════════════════

UPDATE labels SET
    mood = ARRAY['groovy', 'energetic', 'warm'],
    style = ARRAY['big room house', 'piano house', 'polished production'],
    energy = 'high',
    bio = 'Founded by Mark Knight in 2003. High-quality tech house and house blends with polished production, nurturing new talent and consistently charting on Beatport.',
    website = 'https://toolroomrecords.com',
    demo_email = 'demo@toolroomrecords.com'
WHERE LOWER(name) = 'toolroom';

UPDATE labels SET
    mood = ARRAY['groovy', 'dark', 'driving'],
    style = ARRAY['bass-driven house', 'underground techno', 'heavy-duty sound'],
    energy = 'high',
    bio = 'Founded by Michael Bibi and PAWSA. UK underground house & techno with a signature heavy-duty, bass-driven sound. Champions emerging artists with club-driven releases.',
    website = 'https://solidgrooves.co.uk'
WHERE LOWER(name) = 'solid grooves';

UPDATE labels SET
    mood = ARRAY['groovy', 'energetic', 'warm'],
    style = ARRAY['dancefloor-oriented', 'groovy basslines', 'garage-inspired'],
    energy = 'high',
    bio = 'Founded by Solardo in 2017. Club-fuelled, dancefloor-oriented sound with groovy basslines, tribal percussion, and garage-inspired elements. Platform for emerging talent.',
    website = 'https://solarecords.com'
WHERE LOWER(name) = 'sola';

UPDATE labels SET
    mood = ARRAY['groovy', 'warm', 'energetic'],
    style = ARRAY['quirky grooves', 'funky bass', 'playful vibes'],
    energy = 'high',
    bio = 'Jamie Jones'' flagship tech house label. Quirky, groove-driven house with funky basslines and playful, dancefloor-ready productions.',
    website = 'https://hotcreations.com',
    demo_email = 'demo@hotcreations.com'
WHERE LOWER(name) = 'hot creations';

UPDATE labels SET
    mood = ARRAY['groovy', 'warm', 'energetic'],
    style = ARRAY['playful tech house', 'vocal chops', 'funky grooves'],
    energy = 'high',
    bio = 'Lee Foss'' Mars-themed tech house label. Playful, groove-forward releases with catchy vocal chops and funky, dancefloor-friendly production.',
    website = 'https://repopulatemars.com'
WHERE LOWER(name) = 'repopulate mars';

UPDATE labels SET
    mood = ARRAY['groovy', 'energetic', 'warm'],
    style = ARRAY['quirky samples', 'underground grooves', 'left-field house'],
    energy = 'high',
    bio = 'Claude VonStroke''s pioneering US label. Left-field, sample-heavy tech house with quirky, bass-heavy grooves and irreverent dancefloor energy.',
    website = 'https://dirtybirdrecords.com',
    demo_email = 'demo@dirtybirdrecords.com'
WHERE LOWER(name) = 'dirtybird';

UPDATE labels SET
    mood = ARRAY['groovy', 'energetic', 'driving'],
    style = ARRAY['high-energy house', 'blend of styles', 'chart-topping'],
    energy = 'high',
    bio = 'Founded by John Summit. High-energy house and tech house blending styles with massive chart presence. One of the fastest-growing labels in dance music.',
    website = 'https://expertsonly.la'
WHERE LOWER(name) = 'experts only';

UPDATE labels SET
    mood = ARRAY['groovy', 'warm', 'deep'],
    style = ARRAY['underground tech house', 'Glasgow sound', 'solid grooves'],
    energy = 'medium',
    bio = 'Scottish underground label with a distinct Glasgow sound. Quality tech house and deep grooves that bridge underground credibility with broad appeal.',
    website = 'https://glasgowunderground.com'
WHERE LOWER(name) = 'glasgow underground';

UPDATE labels SET
    mood = ARRAY['groovy', 'driving', 'energetic'],
    style = ARRAY['underground tech house', 'raw grooves', 'dark basslines'],
    energy = 'high',
    bio = 'UK tech house label known for raw grooves and dark basslines. Consistent quality releases for the underground dancefloor.',
    website = 'https://moonharbour.de'
WHERE LOWER(name) = 'moon harbour';

UPDATE labels SET
    mood = ARRAY['groovy', 'energetic', 'warm'],
    style = ARRAY['US house foundation', 'classic grooves', 'enduring legacy'],
    energy = 'medium',
    bio = 'Classic New York house label with decades of legacy. Timeless grooves spanning deep house to tech house with an authentic US house foundation.',
    website = 'https://nervousrecords.com'
WHERE LOWER(name) = 'nervous records';


-- ═══════════════════════════════════════════════════════════════
-- HOUSE / DEEP HOUSE / SOULFUL HOUSE
-- ═══════════════════════════════════════════════════════════════

UPDATE labels SET
    mood = ARRAY['groovy', 'warm', 'uplifting'],
    style = ARRAY['soulful vocals', 'classic house', 'club anthems'],
    energy = 'high',
    bio = 'Since 1999, the definitive UK house music label. Blends underground credibility with mainstream appeal through soulful vocals, energetic beats, and club anthems.',
    website = 'https://defected.com',
    demo_email = 'demo@defected.com'
WHERE LOWER(name) = 'defected';

UPDATE labels SET
    mood = ARRAY['warm', 'groovy', 'deep'],
    style = ARRAY['tribal percussion', 'afro-influenced', 'organic textures'],
    energy = 'medium',
    bio = 'Berlin collective of &ME, Rampa, and Adam Port. Versatile sound blending deep house, afro house, and nu-disco with organic textures and tribal percussion. Hypnotic yet danceable.',
    website = 'https://keinemusik.com'
WHERE LOWER(name) = 'keinemusik';

UPDATE labels SET
    mood = ARRAY['warm', 'atmospheric', 'deep'],
    style = ARRAY['deep club grooves', 'UK underground', 'refined house'],
    energy = 'medium',
    bio = 'UK underground house label known for deep, refined club grooves. Where quality house music meets artistic expression in a stripped-back, effective way.',
    website = 'https://crosstownrebels.com',
    demo_email = 'demo@crosstownrebels.com'
WHERE LOWER(name) = 'crosstown rebels';

UPDATE labels SET
    mood = ARRAY['warm', 'groovy', 'uplifting'],
    style = ARRAY['vocal deep house', 'easy-listening dance', 'sunny vibes'],
    energy = 'medium',
    bio = 'Dance music ecosystem bridging melodic house, deep house, and chart-friendly sounds. Known for sunny, easy-listening dance tracks with vocal-driven appeal.',
    website = 'https://spinninrecords.com'
WHERE LOWER(name) LIKE '%spinnin%';

UPDATE labels SET
    mood = ARRAY['warm', 'deep', 'atmospheric'],
    style = ARRAY['deep tech', 'minimal house', 'understated grooves'],
    energy = 'medium',
    bio = 'Dutch underground house label with a refined, deep-tech sound. Known for understated grooves and minimal house with atmospheric depth.',
    website = 'https://pfrecs.com'
WHERE LOWER(name) = 'piv records';


-- ═══════════════════════════════════════════════════════════════
-- AFRO HOUSE / ORGANIC HOUSE / DOWNTEMPO
-- ═══════════════════════════════════════════════════════════════

UPDATE labels SET
    mood = ARRAY['warm', 'ethereal', 'emotional'],
    style = ARRAY['daydream soundscapes', 'organic grooves', 'ambient house'],
    energy = 'low',
    bio = 'Lee Burridge''s organic house paradise. Dreamy, sun-kissed soundscapes blending organic textures with gentle grooves. Perfect for open-air moments and emotional journeys.',
    website = 'https://alldayidream.com',
    demo_email = 'demo@alldayidream.com'
WHERE LOWER(name) = 'all day i dream';

UPDATE labels SET
    mood = ARRAY['warm', 'groovy', 'energetic'],
    style = ARRAY['traditional African rhythms', 'electronic fusion', 'afro tech'],
    energy = 'high',
    bio = 'Globally recognized platform celebrating afro house and afro tech. Bridges traditional African rhythms with contemporary electronic beats authentically.',
    website = 'https://madorasindahouse.com'
WHERE LOWER(name) = 'madorasindahouse';

UPDATE labels SET
    mood = ARRAY['warm', 'deep', 'atmospheric'],
    style = ARRAY['afro house roots', 'african percussion', 'soulful electronics'],
    energy = 'medium',
    bio = 'Pioneer afro house label deeply rooted in authentic African sounds. Soulful, percussion-heavy electronic music with strong cultural identity.',
    website = 'https://moblackrecords.com'
WHERE LOWER(name) = 'moblack records';

UPDATE labels SET
    mood = ARRAY['warm', 'ethereal', 'atmospheric'],
    style = ARRAY['world fusion', 'ethnic electronics', 'middle eastern influences'],
    energy = 'medium',
    bio = 'Organic house platform specializing in world fusion and ethnic electronics. Middle Eastern and global influences blended with modern electronic production.',
    website = 'https://cafedeanatolia.com'
WHERE LOWER(name) LIKE '%cafe de anatolia%';

UPDATE labels SET
    mood = ARRAY['warm', 'groovy', 'deep'],
    style = ARRAY['Anatolian sounds', 'world grooves', 'fusion electronics'],
    energy = 'medium',
    bio = 'Label specializing in organic house and downtempo blending Anatolian and world music influences with modern electronic production.',
    website = 'https://solselectas.com'
WHERE LOWER(name) = 'sol selectas';

UPDATE labels SET
    mood = ARRAY['warm', 'groovy', 'energetic'],
    style = ARRAY['body-music', 'avant-garde dance', 'global influences'],
    energy = 'medium',
    bio = 'Berlin-based label that pioneered the body-music concept. Blends global influences, afro-inspired rhythms, deep house, and avant-garde dance music.',
    website = 'https://getphysical.com',
    demo_email = 'demo@getphysical.com'
WHERE LOWER(name) = 'get physical';


-- ═══════════════════════════════════════════════════════════════
-- TRANCE / PROGRESSIVE TRANCE
-- ═══════════════════════════════════════════════════════════════

UPDATE labels SET
    mood = ARRAY['uplifting', 'euphoric', 'emotional'],
    style = ARRAY['uplifting trance', 'euphoric anthems', 'vocal-led'],
    energy = 'high',
    bio = 'Massive trance institution co-founded by Armin van Buuren. Home to uplifting, euphoric trance anthems and vocal-led productions that define the genre worldwide.',
    website = 'https://armadamusic.com',
    demo_email = 'demo@armadamusic.com'
WHERE LOWER(name) = 'armada music';

UPDATE labels SET
    mood = ARRAY['hypnotic', 'dark', 'driving'],
    style = ARRAY['psytrance elements', 'melodic psy-techno', 'intricate production'],
    energy = 'high',
    bio = 'Blends melodic techno with psytrance influences. Hypnotic grooves and intricate production combining pulsating basslines with intricate melodies.',
    website = 'https://ibogatech.com'
WHERE LOWER(name) = 'ibogatech';


-- ═══════════════════════════════════════════════════════════════
-- DRUM & BASS / DUBSTEP / BASS MUSIC
-- ═══════════════════════════════════════════════════════════════

UPDATE labels SET
    mood = ARRAY['energetic', 'warm', 'uplifting'],
    style = ARRAY['liquid DnB', 'vocal DnB', 'melodic bass'],
    energy = 'high',
    bio = 'Premier drum & bass label known for liquid, melodic DnB. Blends energetic breakbeats with warm vocals and uplifting melodies. Hospital Records standard.',
    website = 'https://hospitalrecords.com',
    demo_email = 'demo@hospitalrecords.com'
WHERE LOWER(name) = 'hospital records';

UPDATE labels SET
    mood = ARRAY['dark', 'energetic', 'driving'],
    style = ARRAY['heavy bass', 'dark DnB', 'neurofunk'],
    energy = 'high',
    bio = 'Heavyweight DnB label for dark, heavy bass music. Features neurofunk and aggressive drum & bass releases pushing the boundaries of bass culture.',
    website = 'https://ramrecords.com'
WHERE LOWER(name) = 'ram records';

UPDATE labels SET
    mood = ARRAY['dark', 'energetic', 'driving'],
    style = ARRAY['heavy dubstep', 'bass music', 'experimental bass'],
    energy = 'high',
    bio = 'Never Say Die is a leading bass music label for heavy dubstep and experimental bass. Pushes the boundaries of bass music with cutting-edge sound design.',
    website = 'https://neversaydie.fm'
WHERE LOWER(name) = 'never say die';

UPDATE labels SET
    mood = ARRAY['dark', 'energetic', 'driving'],
    style = ARRAY['riddim', 'heavy bass', 'festival dubstep'],
    energy = 'high',
    bio = 'Disciple Recordings is a major force in dubstep and bass music, known for heavy, high-energy festival dubstep and riddim from top-tier producers.',
    website = 'https://discipleroundup.com'
WHERE LOWER(name) = 'disciple';

UPDATE labels SET
    mood = ARRAY['energetic', 'warm', 'groovy'],
    style = ARRAY['diverse DnB', 'liquid funk', 'dance-friendly bass'],
    energy = 'high',
    bio = 'Pioneering drum & bass label with a diverse roster. Known for crossing between liquid, jump-up, and dance-friendly DnB styles.',
    website = 'https://ukf.com'
WHERE LOWER(name) = 'ukf';


-- ═══════════════════════════════════════════════════════════════
-- BREAKS / UK BASS / GARAGE
-- ═══════════════════════════════════════════════════════════════

UPDATE labels SET
    mood = ARRAY['energetic', 'groovy', 'warm'],
    style = ARRAY['breakbeat', 'UK bass', 'rave-influenced'],
    energy = 'high',
    bio = 'Essential breaks and UK bass label. Energetic, rave-influenced breakbeat with groovy rhythms and dynamic production.'
WHERE LOWER(name) LIKE '%break%new%soil%' OR LOWER(name) = 'break new soil';


-- ═══════════════════════════════════════════════════════════════
-- EDM / MAINSTAGE / BIG ROOM
-- ═══════════════════════════════════════════════════════════════

UPDATE labels SET
    mood = ARRAY['uplifting', 'euphoric', 'energetic'],
    style = ARRAY['genre-diverse', 'electronic pop', 'mainstage EDM'],
    energy = 'high',
    bio = 'Major global dance label with genre-diverse releases spanning future bass, house, dubstep, and electronic pop. Known for nurturing breakthrough artists.',
    website = 'https://monstercat.com',
    demo_email = 'demo@monstercat.com'
WHERE LOWER(name) = 'monstercat';

UPDATE labels SET
    mood = ARRAY['energetic', 'euphoric', 'driving'],
    style = ARRAY['mainstage house', 'progressive EDM', 'festival anthems'],
    energy = 'high',
    bio = 'Ultra Music is a major EDM label behind some of the biggest festival anthems. Progressive house, mainstage EDM, and high-energy dance releases.',
    website = 'https://ultramusic.com'
WHERE LOWER(name) = 'ultra music';

UPDATE labels SET
    mood = ARRAY['energetic', 'dark', 'driving'],
    style = ARRAY['electro house', 'experimental bass', 'cross-genre'],
    energy = 'high',
    bio = 'OWSLA was Skrillex''s label known for boundary-pushing releases across EDM, bass music, and experimental electronic. Influential in shaping modern bass culture.',
    website = 'https://owsla.com'
WHERE LOWER(name) = 'owsla';

UPDATE labels SET
    mood = ARRAY['energetic', 'groovy', 'driving'],
    style = ARRAY['electro punk', 'indie dance', 'high-energy electronic'],
    energy = 'high',
    bio = 'Dim Mak founded by Steve Aoki. Known for its punk-inspired, genre-blending approach to electronic music spanning bass, house, and electro.',
    website = 'https://dimmak.com'
WHERE LOWER(name) = 'dim mak';

UPDATE labels SET
    mood = ARRAY['uplifting', 'euphoric', 'warm'],
    style = ARRAY['progressive house', 'melodic EDM', 'festival progressive'],
    energy = 'high',
    bio = 'Tiësto''s legendary imprint for melodic EDM and progressive house. Known for uplifting, euphoric festival tracks and iconic releases.',
    website = 'https://blackholerecordings.com'
WHERE LOWER(name) = 'black hole recordings';

UPDATE labels SET
    mood = ARRAY['energetic', 'euphoric', 'driving'],
    style = ARRAY['tech house', 'broad appeal', 'festival sound'],
    energy = 'high',
    bio = 'Insomniac Records is the label arm of the massive festival company. Diverse electronic releases spanning tech house, melodic, and festival-oriented sounds.',
    website = 'https://insomniac.com'
WHERE LOWER(name) = 'insomniac records';

UPDATE labels SET
    mood = ARRAY['energetic', 'uplifting', 'euphoric'],
    style = ARRAY['trance-influenced', 'diverse electronic', 'emerging artists'],
    energy = 'high',
    bio = 'deadmau5''s label known for diverse electronic releases spanning progressive house, electro, and technologically innovative production.',
    website = 'https://mau5trap.com',
    demo_email = 'demo@mau5trap.com'
WHERE LOWER(name) = 'mau5trap';


-- ═══════════════════════════════════════════════════════════════
-- MINIMAL / DEEP TECH
-- ═══════════════════════════════════════════════════════════════

UPDATE labels SET
    mood = ARRAY['hypnotic', 'deep', 'groovy'],
    style = ARRAY['romanian minimal', 'micro-house', 'playful textures'],
    energy = 'medium',
    bio = 'Leader of the Romanian minimal techno movement. Micro-house with playful textures, hypnotic grooves, and intricate rhythmic patterns.',
    website = 'https://theminimsoc.com'
WHERE LOWER(name) LIKE '%minima%' OR LOWER(name) = '[a:rpia:r]';

UPDATE labels SET
    mood = ARRAY['hypnotic', 'deep', 'warm'],
    style = ARRAY['deep minimal', 'hypnotic grooves', 'circular rhythms'],
    energy = 'medium',
    bio = 'Founded by Ricardo Villalobos and Zip. Perlon is a temple of minimal techno and micro-house, known for endlessly hypnotic, deep grooves and circular rhythms.',
    website = 'https://perlon.de'
WHERE LOWER(name) = 'perlon';


-- ═══════════════════════════════════════════════════════════════
-- ADDITIONAL IMPORTANT LABELS
-- ═══════════════════════════════════════════════════════════════

UPDATE labels SET
    mood = ARRAY['groovy', 'warm', 'atmospheric'],
    style = ARRAY['underground house', 'diverse dance', 'quality-focused'],
    energy = 'medium',
    bio = 'Essential underground house and techno label. Diverse dance music catalog with consistent quality across house, tech house, and deep house.',
    website = 'https://traxsource.com'
WHERE LOWER(name) = 'catch & release';

UPDATE labels SET
    mood = ARRAY['uplifting', 'warm', 'groovy'],
    style = ARRAY['positive house', 'festival-friendly', 'chart-topping'],
    energy = 'high',
    bio = 'Label focused on positive, uplifting house music with festival-friendly, chart-topping releases. Broad appeal spanning multiple house subgenres.'
WHERE LOWER(name) = 'positiva';

UPDATE labels SET
    mood = ARRAY['groovy', 'warm', 'deep'],
    style = ARRAY['soulful house', 'disco edits', 'organic house'],
    energy = 'medium',
    bio = 'Swiss label known for soulful house, disco edits, and organic grooves. Warm, inviting sound that bridges the gap between deep house and disco.',
    website = 'https://enormoustunes.com'
WHERE LOWER(name) = 'enormous tunes';

UPDATE labels SET
    mood = ARRAY['groovy', 'warm', 'energetic'],
    style = ARRAY['UK house', 'disco-tinged', 'feel-good dance'],
    energy = 'high',
    bio = 'UK house label known for disco-tinged, feel-good dance tracks. Energetic releases that blend classic house with modern production.',
    website = 'https://glitterbox.com'
WHERE LOWER(name) = 'glitterbox';

UPDATE labels SET
    mood = ARRAY['dark', 'hypnotic', 'driving'],
    style = ARRAY['hard techno', 'neo rave', 'intense peak-time'],
    energy = 'high',
    bio = 'Rising hard techno label pushing the neo-rave movement. Intense, relentless beats and dark atmospheres designed for the most energetic peak-time moments.'
WHERE LOWER(name) = 'hellbent records';

UPDATE labels SET
    mood = ARRAY['groovy', 'energetic', 'driving'],
    style = ARRAY['broad tech house', 'accessible', 'chart presence'],
    energy = 'high',
    bio = 'Major label with broad chart presence across tech house and house. Known for accessible, high-energy releases and festival-friendly productions.'
WHERE LOWER(name) = 'black book records';

UPDATE labels SET
    mood = ARRAY['groovy', 'warm', 'deep'],
    style = ARRAY['deep house', 'art-house aesthetics', 'vinyl culture'],
    energy = 'low',
    bio = 'Amsterdam/NYC deep house label emphasizing art-house aesthetics and vinyl culture. Warm, introspective deep house with careful curation.'
WHERE LOWER(name) = 'classic music company';


-- ═══════════════════════════════════════════════════════════════
-- DONE — All labels enriched with genre-accurate data
-- ═══════════════════════════════════════════════════════════════
