-- ENRICH LABELS: Add mood, style, bio, demo_email, website columns
-- Run this in Supabase SQL Editor

-- Step 1: Add new columns
ALTER TABLE labels ADD COLUMN IF NOT EXISTS mood text[];
ALTER TABLE labels ADD COLUMN IF NOT EXISTS style text[];
ALTER TABLE labels ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE labels ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE labels ADD COLUMN IF NOT EXISTS demo_email text;
ALTER TABLE labels ADD COLUMN IF NOT EXISTS energy text;

-- Step 2: Populate top labels with enriched data
-- Each UPDATE sets mood, style, bio, demo_email, website, energy

-- ═══════════════════════════════════════════════
-- MELODIC HOUSE & TECHNO
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['ethereal','emotional','cinematic','dark'],
  style = ARRAY['atmospheric','melodic','epic','textured'],
  energy = 'high',
  bio = 'Founded by Tale Of Us (Anyma & MRAK) in 2016. Known for haunting melodies, deep basslines, and immersive soundscapes. Cinematic techno with emotional depth. One of the most influential melodic techno labels.',
  demo_email = 'demo@after.life',
  website = 'https://after.life'
WHERE name = 'Afterlife';

UPDATE labels SET
  mood = ARRAY['dreamy','emotional','introspective','warm'],
  style = ARRAY['melodic','lush','soulful','atmospheric'],
  energy = 'medium',
  bio = 'Founded by Above & Beyond and James Grant in 2005. Emotive deep house and progressive with lush melodies, rich chords, and atmospheric production. Soulful and welcoming sound.',
  demo_email = NULL,
  website = 'https://anjunadeep.com'
WHERE name = 'Anjunadeep';

UPDATE labels SET
  mood = ARRAY['groovy','warm','percussive','hypnotic'],
  style = ARRAY['groovy','percussive','tribal','melodic'],
  energy = 'medium',
  bio = 'Berlin collective founded by &ME, Rampa, and Adam Port. Eclectic mix of deep house, melodic house, and Afro-influenced beats. Infectious grooves with atmospheric, emotive soundscapes.',
  demo_email = 'drop@keinemusik.com',
  website = 'https://keinemusik.com'
WHERE name = 'Keinemusik';

UPDATE labels SET
  mood = ARRAY['dark','driving','hypnotic','powerful'],
  style = ARRAY['driving','industrial','raw','structured'],
  energy = 'high',
  bio = 'Founded by Adam Beyer. The powerhouse of peak-time techno. Hard-hitting kicks, industrial snares, hypnotic grooves, and dark atmospheric textures. Made by a DJ for DJs.',
  demo_email = 'demo@drumcode.se',
  website = 'https://drumcode.se'
WHERE name = 'Drumcode';

UPDATE labels SET
  mood = ARRAY['hypnotic','deep','dark','atmospheric'],
  style = ARRAY['rolling','dubby','hypnotic','minimal'],
  energy = 'medium',
  bio = 'Premium melodic techno and house from Cocoon founder Sven Väth. Deep, hypnotic grooves with a focus on DJ-friendly productions.',
  demo_email = 'demo@cocoon.net',
  website = 'https://cocoon.net'
WHERE name = 'Cocoon Recordings';

UPDATE labels SET
  mood = ARRAY['dark','aggressive','raw','intense'],
  style = ARRAY['acid','aggressive','driving','distorted'],
  energy = 'high',
  bio = 'Reinier Zonneveld''s label. Aggressive techno with acid lines, high energy, and relentless drive. Not for the faint-hearted.',
  demo_email = 'demos@filthonacid.nl',
  website = 'https://filthonacid.nl'
WHERE name = 'Filth on Acid';

UPDATE labels SET
  mood = ARRAY['emotional','cinematic','deep','melancholic'],
  style = ARRAY['atmospheric','cinematic','melodic','progressive'],
  energy = 'medium',
  bio = 'Solomun''s label. Emotional but effective on the dancefloor. Melodic house with indie dance influences and deep emotional depth.',
  demo_email = 'solomundemo@diynamic.com',
  website = 'https://diynamic.com'
WHERE name = 'Diynamic Music';

UPDATE labels SET
  mood = ARRAY['ethereal','dreamy','melancholic','deep'],
  style = ARRAY['progressive','melodic','layered','atmospheric'],
  energy = 'medium',
  bio = 'Berlin label known for deep, atmospheric melodic techno. Rich textures, evolving soundscapes, and emotional depth.',
  demo_email = NULL,
  website = 'https://steyoyoke.com'
WHERE name = 'STEYOYOKE';

UPDATE labels SET
  mood = ARRAY['dark','hypnotic','mysterious','deep'],
  style = ARRAY['minimal','mysterious','deep','evolving'],
  energy = 'medium',
  bio = 'Stil vor Talent delivers refined melodic house and techno from Berlin. Sophisticated, mysterious productions with careful attention to detail.',
  demo_email = 'demo@stilvortalent.de',
  website = 'https://stilvortalent.de'
WHERE name = 'Stil vor Talent';

UPDATE labels SET
  mood = ARRAY['uplifting','emotional','warm','dreamy'],
  style = ARRAY['melodic','progressive','lush','emotive'],
  energy = 'medium',
  bio = 'Melodic progressive house with emotional depth. Warm, uplifting productions that blend classic progressive with modern melodic sensibilities.',
  demo_email = 'demo@einmusika.com',
  website = 'https://einmusika.com'
WHERE name = 'Einmusika Recordings';

UPDATE labels SET
  mood = ARRAY['dark','hypnotic','industrial','relentless'],
  style = ARRAY['dark','stripped','raw','industrial'],
  energy = 'high',
  bio = 'Charlotte de Witte''s label. Stripped-back but hard-hitting techno with an uncompromising attitude and raw energy.',
  demo_email = NULL,
  website = 'https://kntxt.be'
WHERE name IN (SELECT name FROM labels WHERE name ILIKE '%KNTXT%' LIMIT 1);

UPDATE labels SET
  mood = ARRAY['dark','emotional','cinematic','deep'],
  style = ARRAY['melodic','cinematic','dark','textured'],
  energy = 'medium',
  bio = 'Dark, atmospheric melodic techno with cinematic undertones. Releases that push the boundaries of melodic and emotional techno.',
  demo_email = 'demo@rukusofficial.com',
  website = NULL
WHERE name = 'RUKUS';

-- ═══════════════════════════════════════════════
-- HOUSE
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['uplifting','feel-good','soulful','vibrant'],
  style = ARRAY['vocal','soulful','groovy','polished'],
  energy = 'high',
  bio = 'The biggest house label, founded 1999. Soulful vocals, energetic beats, feel-good vibes. Blends underground credibility with mainstream appeal. Home of house music.',
  demo_email = 'demos@defected.com',
  website = 'https://defected.com'
WHERE name = 'Defected Records';

UPDATE labels SET
  mood = ARRAY['uplifting','celebratory','vibrant','joyful'],
  style = ARRAY['disco','vocal','theatrical','vibrant'],
  energy = 'high',
  bio = 'Defected''s disco-house sub-label. Bold, theatrical, inclusive vibes with classic disco sounds and modern vocal house. Celebratory and vibrant.',
  demo_email = 'demos@defected.com',
  website = 'https://glitterbox.net'
WHERE name = 'Glitterboxibiza';

UPDATE labels SET
  mood = ARRAY['energetic','groovy','driving','precise'],
  style = ARRAY['chunky','groovy','polished','bass-heavy'],
  energy = 'high',
  bio = 'Mark Knight''s tech house powerhouse since 2003. Chunky drums, signature basslines, high production quality. Not too leftfield, not too commercial — perfectly in between.',
  demo_email = NULL,
  website = 'https://toolroomrecords.com'
WHERE name = 'Toolroom Records';

UPDATE labels SET
  mood = ARRAY['funky','raw','groovy','underground'],
  style = ARRAY['funky','raw','groovy','bass-heavy'],
  energy = 'high',
  bio = 'The Martinez Brothers'' label. Raw, funky house with tech house edge. Underground dance music with a New York attitude.',
  demo_email = 'demos@cuttinheadz.com',
  website = NULL
WHERE name = 'Cuttin'' Headz';

UPDATE labels SET
  mood = ARRAY['groovy','minimal','hypnotic','underground'],
  style = ARRAY['rolling','stripped','groovy','techy'],
  energy = 'medium',
  bio = 'Underground London label. Rolling basslines, dubby textures, and hypnotic minimal grooves. Quality deep tech and house.',
  demo_email = 'promo@fuselondon.net',
  website = 'https://fuselondon.net'
WHERE name = 'FUSE London';

UPDATE labels SET
  mood = ARRAY['dark','groovy','rolling','underground'],
  style = ARRAY['rolling','minimal','techy','raw'],
  energy = 'high',
  bio = 'Michael Bibi''s label. Rolling tech house with minimal influences. Underground, groove-focused sound with precise production.',
  demo_email = 'demos@solidgrooves.co.uk',
  website = NULL
WHERE name = 'Solid Grooves Records';

UPDATE labels SET
  mood = ARRAY['quirky','fun','playful','energetic'],
  style = ARRAY['bass-heavy','quirky','fun','groovy'],
  energy = 'high',
  bio = 'Claude VonStroke''s San Francisco label. Fun, quirky bass-driven house music. Known for its playful approach to tech/deep house and wild BBQ parties.',
  demo_email = NULL,
  website = 'https://dfrtybird.com'
WHERE name = 'DIRTYBIRD';

UPDATE labels SET
  mood = ARRAY['groovy','dark','hypnotic','deep'],
  style = ARRAY['dark','groovy','techy','stripped'],
  energy = 'high',
  bio = 'Jamie Jones label. Dark, groovy house and tech house. Peak-time underground dance music.',
  demo_email = NULL,
  website = NULL
WHERE name = 'Hot Creations';

-- ═══════════════════════════════════════════════
-- DEEP HOUSE
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['dreamy','organic','ethereal','peaceful'],
  style = ARRAY['organic','dreamy','gentle','melodic'],
  energy = 'low',
  bio = 'Lee Burridge''s label. Dreamy, organic house with gentle melodies and emotive soundscapes. Music for sun-drenched moments and spiritual gatherings.',
  demo_email = 'music@alldayidream.com',
  website = 'https://alldayidream.com'
WHERE name = 'All Day I Dream';

UPDATE labels SET
  mood = ARRAY['dark','underground','eclectic','deep'],
  style = ARRAY['eclectic','underground','diverse','deep'],
  energy = 'medium',
  bio = 'Damian Lazarus'' London label. Eclectic deep house with melodic and tech influences. Underground and boundary-pushing.',
  demo_email = 'info@crosstownrebels.com',
  website = 'https://crosstownrebels.com'
WHERE name = 'Crosstown Rebels';

UPDATE labels SET
  mood = ARRAY['warm','deep','smooth','sophisticated'],
  style = ARRAY['deep','smooth','warm','refined'],
  energy = 'medium',
  bio = 'Hot Since 82''s label. Warm, sophisticated deep house with melodic elements. Smooth productions designed for intimate dancefloor moments.',
  demo_email = 'demos@hotsince82.com',
  website = NULL
WHERE name = 'Knee Deep In Sound';

UPDATE labels SET
  mood = ARRAY['deep','introspective','atmospheric','organic'],
  style = ARRAY['organic','downtempo','atmospheric','deep'],
  energy = 'low',
  bio = 'DJ Koze''s eclectic label. Deep, organic productions spanning house, downtempo, and experimental. Quirky and artistic.',
  demo_email = 'contact@pamparecords.com',
  website = 'https://pamparecords.com'
WHERE name = 'Pampa Records';

-- ═══════════════════════════════════════════════
-- TECH HOUSE
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['energetic','driving','groovy','dark'],
  style = ARRAY['driving','techy','groovy','polished'],
  energy = 'high',
  bio = 'Solardo''s label. Peak-time tech house with driving energy and polished production. A go-to for dancefloor-ready tracks.',
  demo_email = 'music@solardo.net',
  website = NULL
WHERE name = 'Sola Records';

UPDATE labels SET
  mood = ARRAY['funky','groovy','fun','vibrant'],
  style = ARRAY['groovy','funky','bass-heavy','playful'],
  energy = 'high',
  bio = 'Lee Foss'' label. Groovy, funky tech house with vibrant energy. Fun dancefloor music with quality production.',
  demo_email = 'demos@repopulatemars.com',
  website = NULL
WHERE name = 'Repopulate Mars';

-- ═══════════════════════════════════════════════
-- AFRO HOUSE
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['spiritual','tribal','deep','warm'],
  style = ARRAY['tribal','percussive','organic','deep'],
  energy = 'medium',
  bio = 'The leader in Afro House music. Tribal drums, deep vibes, and spiritual grooves rooted in African musical traditions.',
  demo_email = 'demo@moblack.com',
  website = NULL
WHERE name = 'MoBlack';

UPDATE labels SET
  mood = ARRAY['spiritual','tribal','deep','warm'],
  style = ARRAY['tribal','percussive','organic','deep'],
  energy = 'medium',
  bio = 'Italian label leading the Afro House movement. Tribal drums, deep vibes, and spiritual grooves.',
  demo_email = 'demo@moblack.com',
  website = NULL
WHERE name = 'Madorasindahouse';

-- ═══════════════════════════════════════════════
-- ELECTRONICA / DOWNTEMPO
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['ambient','eclectic','artistic','experimental'],
  style = ARRAY['downtempo','eclectic','melodic','organic'],
  energy = 'low',
  bio = 'Kompakt: Cologne-based institution. Eclectic catalog spanning ambient pop, techno, and melodic electronic. Known for Pop Ambient compilations. Highly artistic.',
  demo_email = 'label@kompakt.fm',
  website = 'https://kompakt.fm'
WHERE name = 'Kompakt';

UPDATE labels SET
  mood = ARRAY['groovy','eclectic','warm','percussive'],
  style = ARRAY['eclectic','organic','percussive','melodic'],
  energy = 'medium',
  bio = 'Flying Circus by Audiofly. Eclectic melodic house with organic textures and global influences.',
  demo_email = 'demos@audioflymusic.com',
  website = NULL
WHERE name = 'Flying Circus';

-- ═══════════════════════════════════════════════
-- BIG ROOM / EDM
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['energetic','euphoric','uplifting','powerful'],
  style = ARRAY['epic','big-room','festival','anthemic'],
  energy = 'high',
  bio = 'Hardwell''s label. Big room, anthem-driving sound designed for massive festival stages. Euphoric drops and high energy.',
  demo_email = NULL,
  website = 'https://revealedrecordings.com'
WHERE name = 'Revealed';

UPDATE labels SET
  mood = ARRAY['energetic','euphoric','driving','fun'],
  style = ARRAY['festival','diverse','electro','big-room'],
  energy = 'high',
  bio = 'Martin Garrix''s label. High-energy electronic music spanning big room, future bass, and progressive. Festival-ready anthems with youthful energy.',
  demo_email = 'demos@stmpdrcrds.com',
  website = 'https://stmpdrcrds.com'
WHERE name = 'STMPD RCRDS';

UPDATE labels SET
  mood = ARRAY['energetic','euphoric','diverse','driving'],
  style = ARRAY['diverse','polished','festival','big-room'],
  energy = 'high',
  bio = 'Nicky Romero''s label. Versatile electronic label spanning big room, electro house, and progressive. Platform for emerging talent.',
  demo_email = NULL,
  website = 'https://protocolrecordings.com'
WHERE name = 'Protocol';

UPDATE labels SET
  mood = ARRAY['euphoric','powerful','energetic','anthemic'],
  style = ARRAY['big-room','festival','anthemic','massive'],
  energy = 'high',
  bio = 'W&W''s label. Maximum energy mainstage music. Big room and hardstyle-influenced anthems for the biggest stages.',
  demo_email = 'demos@raveculture.com',
  website = 'https://raveculture.com'
WHERE name = 'Rave Culture';

UPDATE labels SET
  mood = ARRAY['energetic','diverse','uplifting','driving'],
  style = ARRAY['diverse','polished','festival','accessible'],
  energy = 'high',
  bio = 'Major electronic label since 1995. Diverse catalog spanning all EDM genres. Platform for both established and emerging artists.',
  demo_email = 'demo@ultramusic.com',
  website = 'https://ultramusic.com'
WHERE name = 'Ultra Music';

UPDATE labels SET
  mood = ARRAY['euphoric','uplifting','emotional','energetic'],
  style = ARRAY['trance','uplifting','festival','anthemic'],
  energy = 'high',
  bio = 'Dutch powerhouse spanning trance, house, big room, and more. Home to Armin van Buuren and thousands of releases since 2003.',
  demo_email = NULL,
  website = 'https://armadamusic.com'
WHERE name = 'Armada Music';

-- ═══════════════════════════════════════════════
-- DUBSTEP / BASS
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['dark','aggressive','intense','heavy'],
  style = ARRAY['heavy','bass-heavy','aggressive','experimental'],
  energy = 'high',
  bio = 'Premium bass music label. One of the biggest names in dubstep, featuring Barely Alive, Funtcase, and more. Aggressive, heavy productions.',
  demo_email = 'demos@disciplerecs.com',
  website = 'https://disciplerecs.com'
WHERE name = 'Disciple';

UPDATE labels SET
  mood = ARRAY['diverse','energetic','futuristic','fun'],
  style = ARRAY['diverse','polished','electronic','bass-heavy'],
  energy = 'high',
  bio = 'Massive independent label. Diverse electronic music from dubstep to DnB to trance. Platform for emerging bass music talent worldwide.',
  demo_email = NULL,
  website = 'https://monstercat.com'
WHERE name = 'Monstercat';

UPDATE labels SET
  mood = ARRAY['dark','experimental','deep','intense'],
  style = ARRAY['experimental','bass-heavy','deep','atmospheric'],
  energy = 'high',
  bio = 'Zeds Dead''s label. Experimental bass music with depth. Dark, atmospheric productions pushing boundaries of bass culture.',
  demo_email = NULL,
  website = NULL
WHERE name = 'Deadbeats';

-- ═══════════════════════════════════════════════
-- DRUM & BASS
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['dark','intense','precise','heavy'],
  style = ARRAY['technical','dark','heavy','precise'],
  energy = 'high',
  bio = 'One of the most respected DnB labels. Dark, technical, and precise drum and bass with uncompromising quality standards.',
  demo_email = NULL,
  website = 'https://criticalmusic.com'
WHERE name = 'Critical Music';

UPDATE labels SET
  mood = ARRAY['energetic','heavy','dark','intense'],
  style = ARRAY['heavy','dark','aggressive','technical'],
  energy = 'high',
  bio = 'Friction''s label. High-quality drum and bass spanning liquid, jump-up, and neurofunk. One of the scene''s biggest platforms.',
  demo_email = NULL,
  website = 'https://shogunaudio.co.uk'
WHERE name = 'Shogun Audio';

UPDATE labels SET
  mood = ARRAY['dark','intense','legendary','underground'],
  style = ARRAY['technical','dark','rolling','underground'],
  energy = 'high',
  bio = 'Goldie''s legendary DnB label since 1994. Pioneered intelligent drum and bass. Dark, technical, and influential.',
  demo_email = 'info@metalheadz.co.uk',
  website = 'https://metalheadz.co.uk'
WHERE name = 'Metalheadz';

UPDATE labels SET
  mood = ARRAY['legendary','rolling','deep','atmospheric'],
  style = ARRAY['deep','rolling','legendary','jungle'],
  energy = 'high',
  bio = 'Andy C''s legendary DnB label. Classic jungle and modern drum and bass. Rolling basslines and precise productions since 1992.',
  demo_email = 'info@ramrecords.com',
  website = 'https://ramrecords.com'
WHERE name = 'RAM Records';

UPDATE labels SET
  mood = ARRAY['uplifting','melodic','smooth','emotional'],
  style = ARRAY['liquid','melodic','smooth','soulful'],
  energy = 'high',
  bio = 'Home of liquid drum and bass. Melodic, soulful DnB with vocals and smooth production. High energy but uplifting.',
  demo_email = NULL,
  website = 'https://hospitalrecords.com'
WHERE name = 'Hospital Records';

-- ═══════════════════════════════════════════════
-- TRANCE
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['euphoric','uplifting','emotional','spiritual'],
  style = ARRAY['uplifting','anthemic','melodic','epic'],
  energy = 'high',
  bio = 'The premier uplifting trance label by Aly & Fila. Euphoric, emotional trance with soaring melodies and epic breakdowns.',
  demo_email = 'demos@futuresoundofegypt.com',
  website = 'https://futuresoundofegypt.com'
WHERE name = 'Future Sound of Egypt';

UPDATE labels SET
  mood = ARRAY['uplifting','progressive','emotional','anthemic'],
  style = ARRAY['progressive','melodic','anthemic','uplifting'],
  energy = 'high',
  bio = 'Above & Beyond''s label. Progressive and uplifting trance with emotional depth. Anthemic melodies and festival-ready productions.',
  demo_email = NULL,
  website = 'https://anjunabeats.com'
WHERE name = 'Anjunabeats';

-- ═══════════════════════════════════════════════
-- PROGRESSIVE HOUSE
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['deep','hypnotic','progressive','atmospheric'],
  style = ARRAY['progressive','deep','evolving','layered'],
  energy = 'medium',
  bio = 'Hernán Cattáneo''s label. Deep progressive house with hypnotic soundscapes. Artistic, layered productions that evolve slowly and beautifully.',
  demo_email = 'demos@sudbeat.com',
  website = NULL
WHERE name = 'Sudbeat Music';

UPDATE labels SET
  mood = ARRAY['dark','deep','hypnotic','brooding'],
  style = ARRAY['dark','progressive','deep','atmospheric'],
  energy = 'medium',
  bio = 'Dark, brooding progressive house with depth. Quality deep progressive releases.',
  demo_email = 'demos@outtalimitsrecordings.com',
  website = NULL
WHERE name = 'Outta Limits Recordings';

-- ═══════════════════════════════════════════════
-- MINIMAL / DEEP TECH
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['groovy','minimal','hypnotic','underground'],
  style = ARRAY['minimal','stripped','groovy','rolling'],
  energy = 'medium',
  bio = 'Underground minimal and deep tech label. Stripped-back, groove-driven productions for late-night dancefloors.',
  demo_email = 'demos@noartmusic.com',
  website = NULL
WHERE name = 'No Art';

UPDATE labels SET
  mood = ARRAY['dark','rolling','hypnotic','groovy'],
  style = ARRAY['rolling','minimal','dark','hypnotic'],
  energy = 'medium',
  bio = 'Hot Creations'' tech-focused sister label. Darker, deeper sound. Rolling minimal grooves with hypnotic textures.',
  demo_email = NULL,
  website = NULL
WHERE name = 'Hottrax';

-- ═══════════════════════════════════════════════
-- HARD DANCE / HARDCORE
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['euphoric','powerful','energetic','anthemic'],
  style = ARRAY['hardstyle','anthemic','festival','massive'],
  energy = 'high',
  bio = 'Major hardstyle label with artists like Coone and Da Tweekaz. Euphoric and raw hardstyle anthems for massive festivals.',
  demo_email = NULL,
  website = 'https://dirtyworkz.com'
WHERE name = 'Dirty Workz';

UPDATE labels SET
  mood = ARRAY['euphoric','powerful','intense','driving'],
  style = ARRAY['hardstyle','hard','raw','anthemic'],
  energy = 'high',
  bio = 'Legendary hardstyle label since 2002. Home to Scantraxx Reloaded, Silver, Gold sub-labels. The hardstyle institution.',
  demo_email = NULL,
  website = 'https://scantraxx.com'
WHERE name = 'Scantraxx';

-- ═══════════════════════════════════════════════
-- PSY-TRANCE
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['psychedelic','hypnotic','trippy','intense'],
  style = ARRAY['psychedelic','driving','complex','layered'],
  energy = 'high',
  bio = 'Full-on and progressive psytrance from Germany. Layered, psychedelic productions with driving energy.',
  demo_email = 'info@bluetunes-records.com',
  website = NULL
WHERE name = 'Blue Tunes Records';

-- ═══════════════════════════════════════════════
-- FUTURE HOUSE / BASS HOUSE
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['energetic','fun','groovy','vibrant'],
  style = ARRAY['bouncy','groovy','bass-heavy','polished'],
  energy = 'high',
  bio = 'Oliver Heldens'' label. Bouncy future house and bass house with infectious grooves. Fun, high-energy dancefloor music.',
  demo_email = NULL,
  website = 'https://heldeeprecords.com'
WHERE name = 'Heldeep';

UPDATE labels SET
  mood = ARRAY['dark','underground','bass-heavy','raw'],
  style = ARRAY['bass-heavy','underground','dark','groovy'],
  energy = 'high',
  bio = 'AC Slater''s underground bass house label. Dark, raw, bass-driven house music born from the UK underground.',
  demo_email = NULL,
  website = 'https://nightbassrecords.com'
WHERE name = 'Night Bass';

UPDATE labels SET
  mood = ARRAY['diverse','energetic','fun','dark'],
  style = ARRAY['bass-heavy','disco','diverse','groovy'],
  energy = 'high',
  bio = 'Don Diablo''s label. Future house and bass house with a polished, futuristic edge.',
  demo_email = NULL,
  website = 'https://hexagonhq.com'
WHERE name = 'Hexagon / Generation Hex';

-- ═══════════════════════════════════════════════
-- BREAKS
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['energetic','fun','diverse','groovy'],
  style = ARRAY['breaks','groovy','diverse','bass-heavy'],
  energy = 'high',
  bio = 'Classic breakbeat label. Funky, energetic breaks and bass-driven productions.',
  demo_email = 'admin@bombstrikes.net',
  website = NULL
WHERE name = 'Bombstrikes';

-- ═══════════════════════════════════════════════
-- DANCE / POP-DANCE
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['uplifting','feel-good','funky','vibrant'],
  style = ARRAY['accessible','vocal','pop-dance','polished'],
  energy = 'high',
  bio = 'UK dance label known for accessible, feel-good dance music. Platform for emerging dance-pop talent.',
  demo_email = 'Adam.Griffin@perfecthavoc.com',
  website = 'https://perfecthavoc.com'
WHERE name = 'Perfect Havoc';

-- ═══════════════════════════════════════════════
-- TECHNO
-- ═══════════════════════════════════════════════

UPDATE labels SET
  mood = ARRAY['dark','industrial','raw','relentless'],
  style = ARRAY['industrial','raw','noisy','distorted'],
  energy = 'high',
  bio = 'Perc''s UK label. Industrial, noisy techno with raw power and experimental edge. Hammering rhythms and distorted textures.',
  demo_email = NULL,
  website = 'https://perctrax.com'
WHERE name IN (SELECT name FROM labels WHERE name ILIKE '%Perc Trax%' LIMIT 1);

UPDATE labels SET
  mood = ARRAY['dark','legendary','diverse','underground'],
  style = ARRAY['diverse','underground','legendary','driving'],
  energy = 'high',
  bio = 'Legendary Glasgow label by Slam since 1991. Industrial and peak-time techno. One of the most important techno labels ever.',
  demo_email = NULL,
  website = 'https://somarecords.com'
WHERE name = 'Soma Records';

UPDATE labels SET
  mood = ARRAY['dark','precise','hypnotic','minimal'],
  style = ARRAY['minimal','precise','dark','hypnotic'],
  energy = 'high',
  bio = 'Ben Klock''s Berlin label. Precise, dark techno. Berghain-associated sound with hypnotic grooves and meticulous production.',
  demo_email = 'demo@klockworks.de',
  website = 'https://klockworks.de'
WHERE name = 'Klockworks Official';

UPDATE labels SET
  mood = ARRAY['dark','powerful','industrial','driving'],
  style = ARRAY['driving','industrial','dark','powerful'],
  energy = 'high',
  bio = 'Boys Noize Records: Alex Ridha''s Berlin label. Eclectic but hard-hitting electronic music spanning techno, electro, and bass.',
  demo_email = 'info@boysnoize.com',
  website = 'https://boysnoize.com'
WHERE name = 'Boysnoize Records';

UPDATE labels SET
  mood = ARRAY['dark','hypnotic','atmospheric','deep'],
  style = ARRAY['atmospheric','stripped','dark','deep'],
  energy = 'medium',
  bio = 'Radio Slave''s label. Deep, atmospheric techno and house. Quality underground releases with depth.',
  demo_email = 'loverekids@gmail.com',
  website = NULL
WHERE name = 'REKIDS';

-- Done! All major labels now have mood, style, energy, bio, and demo_email data.
