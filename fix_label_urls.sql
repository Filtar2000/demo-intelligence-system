-- ═══════════════════════════════════════════════════════════════
-- FIX LABEL WEBSITES — Keep only verified URLs, clear the rest
-- Run this in Supabase SQL Editor AFTER enrich_labels.sql
-- ═══════════════════════════════════════════════════════════════

-- Step 1: Fix wrong URLs with verified ones
UPDATE labels SET website = 'https://after.life' WHERE LOWER(name) = 'afterlife';
UPDATE labels SET website = 'https://somarecords.com' WHERE LOWER(name) = 'soma records';
UPDATE labels SET website = 'https://simulateofficial.com' WHERE LOWER(name) = 'simulate';

-- Step 2: Confirm correct URLs (no change needed, just documenting)
-- drumcode.se ✅ | anjunadeep.com ✅ | anjunabeats.com ✅
-- diynamic.com ✅ | defected.com ✅ | keinemusik.com ✅
-- crosstownrebels.com ✅ | hotcreations.com ✅ | ostgut.de ✅
-- toolroomrecords.com ✅ | armadamusic.com ✅ | dirtybirdrecords.com ✅
-- alldayidream.com ✅ | hospitalrecords.com ✅ | monstercat.com ✅
-- mau5trap.com ✅

-- Step 3: Clear unverified/guessed URLs
-- These labels had URLs that were likely guessed from the label name
-- and could not be independently verified through RA, Beatport, or Wikipedia
UPDATE labels SET website = '' WHERE LOWER(name) IN (
    'habitat',
    'upperground',
    'spectrum',
    'rose avenue',
    'zamna records',
    'piv records',
    'sola',
    'repopulate mars',
    'experts only',
    'glasgow underground',
    'moon harbour',
    'nervous records',
    'madorasindahouse',
    'moblack records',
    'cafe de anatolia',
    'sol selectas',
    'enormous tunes',
    'glitterbox',
    'catch & release',
    'ibogatech',
    'solid grooves',
    'ellum',
    'circoloco',
    'spinnin records',
    'protocol recordings',
    'second state',
    'intec digital',
    'suara',
    'minus',
    'sudbeat',
    'siamese',
    'ram records',
    'never say die',
    'disciple',
    'eatbrain',
    'viper recordings',
    'mdlbeast records',
    'revealed recordings',
    'musical freedom',
    'stmpd'
);
