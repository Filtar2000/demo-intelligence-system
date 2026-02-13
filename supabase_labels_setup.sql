-- 1. Create the 'labels' table
CREATE TABLE IF NOT EXISTS labels (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subgenres text[], -- Array of strings
  country text,
  size text CHECK (size IN ('major','mid','indie')),
  bpm_min integer,
  bpm_max integer,
  lufs_typical numeric,
  vocal boolean DEFAULT false,
  accepts_demos boolean DEFAULT true,
  demo_method text, -- 'form', 'email', 'labelradar', etc.
  demo_url text,
  avg_track_duration integer, -- in seconds
  energy_profile text CHECK (energy_profile IN ('high','medium','low')),
  notes text,
  created_at timestamp DEFAULT now()
);

-- 2. Enable Row Level Security (RLS) - Optional but good practice
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy to allow anyone to READ labels (Public access for the app)
DROP POLICY IF EXISTS "Public read access for labels" ON labels;
CREATE POLICY "Public read access for labels" ON labels FOR SELECT USING (true);


-- 4. Insert 30+ Labels across requested subgenres
INSERT INTO labels (name, subgenres, country, size, bpm_min, bpm_max, lufs_typical, vocal, accepts_demos, demo_method, demo_url, energy_profile, notes)
VALUES
  -- Melodic Techno / House
  ('Afterlife Records', ARRAY['melodic techno','melodic house'], 'Italy', 'major', 120, 128, -9, false, true, 'form', 'https://www.afterlife.it/demos', 'high', 'Cinematic, emotional, large build-ups.'),
  ('Anjunadeep', ARRAY['melodic house','deep house'], 'UK', 'major', 115, 126, -10, true, true, 'form', 'https://anjunadeep.com/demos', 'medium', 'Emotive, atmospheric, vocal-heavy.'),
  ('Keinemusik', ARRAY['melodic house','afro house'], 'Germany', 'major', 118, 124, -9, true, false, 'none', '', 'medium', 'Groovy, percussive, very selective.'),

  -- Peak-time Techno
  ('Drumcode', ARRAY['peak-time techno'], 'Sweden', 'major', 128, 135, -7, false, true, 'email', 'demos@drumcode.se', 'high', 'Big room techno, driving kicks, mainstage sound.'),
  ('Terminal M', ARRAY['peak-time techno'], 'Germany', 'mid', 128, 134, -7, false, true, 'email', 'demos@terminalm.com', 'high', 'Energetic, funky techno.'),
  ('Filth on Acid', ARRAY['peak-time techno','acid techno'], 'Netherlands', 'major', 130, 138, -6, false, true, 'email', 'demos@filthonacid.com', 'high', 'Aggressive, acid lines, high energy.'),

  -- Hard Techno
  ('Exhale', ARRAY['hard techno'], 'Belgium', 'major', 140, 155, -5, false, true, 'email', 'demos@exhalemusic.net', 'high', 'Fast, industrial, rave sounds.'),
  ('KNTXT', ARRAY['hard techno','acid techno'], 'Belgium', 'major', 135, 150, -6, false, true, 'email', 'demos@kntxt.be', 'high', 'Charlotte de Witte label, stripped back but hard.'),
  ('Possession', ARRAY['hard techno','industrial techno'], 'France', 'mid', 140, 160, -5, false, true, 'email', 'demos@possession.com', 'high', 'Rave, fast, punk attitude.'),

  -- Minimal / Deep Tech
  ('Solid Grooves', ARRAY['minimal','deep tech'], 'UK', 'major', 124, 130, -8, true, true, 'email', 'demos@solidgrooves.co.uk', 'medium', 'Rolling basslines, groovy, techy.'),
  ('Cuttin Headz', ARRAY['minimal','house','tech house'], 'USA', 'major', 125, 130, -7, true, true, 'email', 'demos@cuttinheadz.com', 'high', 'The Martinez Brothers label, funky and raw.'),
  ('Fuse London', ARRAY['minimal','deep tech'], 'UK', 'mid', 126, 132, -8, false, true, 'email', 'demos@fuselondon.net', 'medium', 'Dubby, rolling, hypnotic.'),

  -- Afro House
  ('MoBlack Records', ARRAY['afro house'], 'Italy', 'major', 118, 124, -9, true, true, 'email', 'demos@moblack.com', 'medium', 'The leader in Afro House, tribal drums, deep vibes.'),
  ('RISE Music', ARRAY['afro house'], 'Germany', 'mid', 120, 125, -9, true, true, 'email', 'demos@rise-music.com', 'medium', 'Watergate resident Hyenah related, deep and spiritual.'),
  ('Innervisions', ARRAY['melodic house','indie dance','afro house'], 'Germany', 'major', 118, 126, -9, false, false, 'none', '', 'medium', 'Dixon & Ame, very high quality control.'),

  -- Organic House
  ('All Day I Dream', ARRAY['organic house'], 'USA', 'major', 118, 123, -11, false, true, 'email', 'demos@alldayidream.com', 'low', 'Dreamy, clouds, melodies, emotive.'),
  ('Sol Selectas', ARRAY['organic house','downtempo'], 'USA', 'mid', 105, 122, -10, false, true, 'form', 'https://solselectas.com/demos', 'low', 'Global sounds, tribal, desert vibes.'),
  ('TrybesOf', ARRAY['organic house'], 'USA', 'mid', 118, 124, -10, false, true, 'email', 'demos@trybesof.com', 'low', 'Lee Burridge label, similar to ADID but slightly fiercer.'),

  -- Indie Dance
  ('Diynamic', ARRAY['indie dance','melodic house'], 'Germany', 'major', 120, 126, -8, true, true, 'form', 'https://diynamic.com/demos', 'high', 'Solomun label, emotional but effective on the floor.'),
  ('Life and Death', ARRAY['indie dance','post-punk'], 'Italy', 'mid', 110, 128, -9, true, true, 'email', 'demos@lifeanddeath.us', 'medium', 'Eccentric, dark, melodic.'),
  ('Correspondant', ARRAY['indie dance','dark disco'], 'France', 'indie', 115, 125, -8, true, true, 'email', 'demos@correspondant.com', 'medium', 'Jennifer Cardini, electro and disco influences.'),

  -- Nu Disco
  ('Glitterbox', ARRAY['nu disco','house'], 'UK', 'major', 120, 128, -8, true, true, 'email', 'demos@glitterboxibiza.com', 'high', 'Defected sub-label, classic disco sounds, vocal.'),
  ('Toy Tonics', ARRAY['nu disco','indie dance'], 'Germany', 'mid', 115, 125, -9, false, true, 'email', 'demos@toytonics.de', 'medium', 'Funky, jam-session feel, organic instruments.'),
  ('Defected', ARRAY['house','nu disco'], 'UK', 'major', 122, 128, -7, true, true, 'form', 'https://defected.com/demos', 'high', 'The biggest house label, vocal heavy, accessible.'),

  -- Industrial Techno
  ('Mord', ARRAY['industrial techno'], 'Netherlands', 'mid', 135, 145, -6, false, true, 'email', 'demos@mord.box', 'high', 'Bas Mooy, nasty, distorted, raw.'),
  ('Perc Trax', ARRAY['industrial techno'], 'UK', 'mid', 135, 150, -5, false, true, 'email', 'demos@perctrax.com', 'high', 'Perc, noisy, hammering.'),
  ('Soma Records', ARRAY['industrial techno','peak-time techno'], 'UK', 'major', 130, 140, -6, false, true, 'form', 'https://soma.com/demos', 'high', 'Legendary Glasgow label, Slam.'),

  -- Ambient / Experimental
  ('Warp Records', ARRAY['experimental','ambient','idm'], 'UK', 'major', 70, 180, -12, false, true, 'form', 'https://warp.net/demos', 'low', 'Aphex Twin, Boards of Canada, highly artistic.'),
  ('Ghostly International', ARRAY['ambient','downtempo'], 'USA', 'major', 80, 130, -11, false, true, 'email', 'demos@ghostly.com', 'low', 'Design-centric, atmospheric, various genres.'),
  ('Erased Tapes', ARRAY['ambient','modern classical'], 'UK', 'mid', 60, 120, -14, false, true, 'email', 'demos@erasedtapes.com', 'low', 'Nils Frahm, piano, atmospheric.');
