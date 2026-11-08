// Lines are the Hindi dub as spoken, written in Roman script (transcribed with Whisper,
// cleaned up against the English subtitles that were burned into the source).
// The story package: what the ScrollManga Studio would export for one scene.
// Times are seconds into the clip (voice.m4a, bed.m4a). Anchors are [x, y] fractions of the
// frame (1904x960 layers, subtitles cropped off) where the speaker's mouth or head is;
// a line with no anchor in a shot is spoken off panel (the tail points to the edge).

export const STORY = {
  title: 'Sita Haran',
  subtitle: 'The abduction of Sita',
  from: 'Ramayana: The Legend of Prince Rama (1992)',
  duration: 80.0,
  source: { w: 1904, h: 960 },

  // Layered scenes (media/layers/<scene>/panel.json: background layers by depth, character
  // key poses). Wide shots play on a scene; close-ups are framed stills (media/layers/insets/)
  // over the hut scene's empty background, blurred.
  scenes: ['opening', 'door', 'hut'],

  // kind: wide (a layered scene fills the screen), close (a framed 4:3 inset), insert (a small wide inset).
  // poses: which character key pose shows when (from/to in story seconds; they crossfade).
  // frames: the inset's stills over time. fx/fy: where the camera rests.
  shots: [
    { id: 's0', start: 0.0, end: 10.81, kind: 'wide', scene: 'opening', fx: 0.55, fy: 0.5,
      poses: [{ c: 'sage-arrives', from: 0, to: 8.0 }, { c: 'sage-calls', from: 8.0, to: 10.81 }, { c: 'sita-at-door', from: 6.6, to: 10.81 }] },
    { id: 's1', start: 10.81, end: 30.13, kind: 'wide', scene: 'door', fx: 0.5, fy: 0.4,
      poses: [{ c: 'sita-listens', from: 10.81, to: 14.9 }, { c: 'sita-turns-in', from: 14.9, to: 18.6 }, { c: 'sita-offers', from: 24.9, to: 30.13 }] },
    { id: 's2', start: 30.13, end: 31.63, kind: 'insert', fx: 0.5, fy: 0.5,
      frames: [{ img: 'foot-steps', from: 30.13, to: 30.85 }, { img: 'foot-glow', from: 30.85, to: 31.63 }], glow: { from: 30.85, x: 0.55, y: 0.8 } },
    { id: 's3', start: 31.63, end: 38.97, kind: 'wide', scene: 'hut', fx: 0.6, fy: 0.45,
      poses: [{ c: 'sita-door-offering', from: 31.63, to: 38.97 }, { c: 'sage-standing', from: 31.63, to: 38.97 }] },
    { id: 's4', start: 38.97, end: 44.01, kind: 'close', fx: 0.47, fy: 0.4,
      frames: [{ img: 'sita-close-listens', from: 38.97, to: 41.4 }, { img: 'sita-close-refuses', from: 41.4, to: 44.01 }] },
    { id: 's5', start: 44.01, end: 50.85, kind: 'wide', scene: 'hut', fx: 0.65, fy: 0.45,
      poses: [{ c: 'sita-door-offering', from: 44.01, to: 50.85 }, { c: 'sage-standing', from: 44.01, to: 50.85 }] },
    { id: 's6', start: 50.85, end: 57.56, kind: 'close', fx: 0.47, fy: 0.4, side: 'right',
      frames: [{ img: 'sita-close-torn', from: 50.85, to: 53.0 }, { img: 'sita-close-pleaded', from: 53.0, to: 57.56 }] },
    { id: 's7', start: 57.56, end: 60.96, kind: 'wide', scene: 'hut', fx: 0.45, fy: 0.45,
      poses: [{ c: 'sita-steps-out', from: 57.56, to: 60.96 }, { c: 'sage-standing', from: 57.56, to: 60.96 }] },
    { id: 's8', start: 60.96, end: 62.63, kind: 'close', fx: 0.5, fy: 0.4,
      frames: [{ img: 'ravan-reveal', from: 60.96, to: 62.63 }] },
    { id: 's9', start: 62.63, end: 69.4, kind: 'close', fx: 0.5, fy: 0.4, side: 'right',
      frames: [{ img: 'sita-close-spell', from: 62.63, to: 66.0 }, { img: 'sita-close-eyes-shut', from: 66.0, to: 69.4 }] },
    { id: 's10', start: 69.4, end: 80.0, kind: 'wide', scene: 'hut', fx: 0.62, fy: 0.5,
      poses: [{ c: 'hiran-standing', from: 69.4, to: 80 }, { c: 'grab', from: 69.4, to: 72.9 }, { c: 'ravan-carries-sita', from: 72.9, to: 75.6 }, { c: 'ravan-true-form', from: 75.6, to: 80 }],
      smoke: { from: 75.3, to: 78.6, x: 0.86, y: 0.55 } },
  ],

  // Live caption on the story boxes: the word the narrator is saying gets the word pill.
  // Off in the public build until Prakash clears it (close to his patent-pending "spoken focus").
  captionSync: true,

  // Screen flashes (the film's own cut-to-white moments).
  flashes: [60.96, 69.25],

  // Line times come from speech in the separated voice track (subtitles show up early).
  lines: [
    { who: 'sage', start: 2.9, end: 6.7, text: 'Om Namah Shivay!', at: { s0: [0.64, 0.42] } },
    { who: 'sage', start: 9.0, end: 10.8, text: 'He punyavati devi...', at: { s0: [0.64, 0.42] } },
    { who: 'sage', start: 11.5, end: 13.7, text: '...hum tumse bhiksha maangne aaye hain.', at: { s0: [0.64, 0.42], s1: [0.62, 0.12] } },
    { who: 'sita', start: 28.5, end: 29.6, text: 'Lijiye, bhiksha.', at: { s1: [0.31, 0.22] } },
    { who: 'sage', start: 32.4, end: 34.9, text: 'Aah! Aashcharya!', at: { s3: [0.77, 0.36] } },
    { who: 'sage', start: 35.0, end: 38.0, text: 'Ise kisi ne tumhari raksha ke liye kheencha hai.', at: { s3: [0.77, 0.36] } },
    { who: 'sage', start: 38.0, end: 41.2, text: 'Main ise nahin laangh sakta, tum ise laangh sakti ho. Aao.', at: { s3: [0.77, 0.36], s4: null } },
    { who: 'sita', start: 41.6, end: 44.1, text: 'Bilkul nahin... bilkul nahin.', at: { s4: [0.47, 0.44] } },
    { who: 'sage', start: 44.6, end: 48.0, text: 'Yadi tumne apne haathon se is bhookhe saadhu ko bhojan na karaaya...', at: { s5: [0.75, 0.34] } },
    { who: 'sage', start: 48.0, end: 52.9, text: '...to sarvanaash ho jaayega tumhare pita aur sasur ke kutumbon ka!', at: { s5: [0.75, 0.34], s6: null } },
    { who: 'sage', start: 54.0, end: 57.2, text: 'Socho nahin, aao, punyavati devi!', at: { s6: null } },
  ],

  // Voice sounds with no words and no bubble (gasps, screams, laughter), played forward like lines.
  voiceCues: [
    { start: 0.0, end: 1.3 },
    { start: 69.3, end: 72.1 },
    { start: 73.0, end: 77.8 },
    { start: 78.0, end: 79.7 },
  ],

  // Story text laid over the scene, read by the narrator (media/voices/narr-N.m4a, ElevenLabs,
  // "Agastya - Mahabharata Narration"). `hold` is extra scroll (in story seconds) where the story
  // pauses: the clip's length plus a short breath, so lazy mode waits for the narrator.
  // `until` is when the box fades.
  narration: [
    { at: 0, hold: 15.4, until: 2.3, clip: 'narr-1', text: 'Panchavati, ghane van mein. Ram sone ke hiran ke peechhe gaye hain, aur Lakshman Ram ke peechhe. Jaane se pehle Lakshman ne kutiya ke chaaron or ek rekha kheench di. Jo iske andar rahega, surakshit rahega.' },
    { at: 30.13, hold: 3.8, until: 31.6, clip: 'narr-2', text: 'Saadhu rekha par ruk jaata hai. Aage nahin badhta.' },
    { at: 57.56, hold: 7.4, until: 60.9, clip: 'narr-3', text: 'Bhookhe atithi ko khaali haath lautaana, parivaar par vipatti laana hai. Sita rekha laangh jaati hain.' },
    { at: 60.96, hold: 3.3, until: 62.6, clip: 'narr-4', text: 'Woh saadhu, saadhu tha hi nahin.' },
    // after Raavan's laughter (the last voice cue ends at 79.7), so the narrator doesn't talk over it
    { at: 79.7, hold: 4.5, until: 80, clip: 'narr-5', text: 'Bhes utar jaata hai. Yeh Ravan hai, Lanka ka raja.' },
  ],

  // Sound-effect lettering drawn on a panel for a window of time.
  sfx: [
    { shot: 's2', start: 30.2, end: 31.63, text: 'ZZZT', x: 0.62, y: 0.28, rot: -8 },
    { shot: 's8', start: 61.0, end: 62.63, text: '!!', x: 0.16, y: 0.22, rot: -6 },
    { shot: 's10', start: 73.2, end: 75.2, text: 'SNATCH', x: 0.3, y: 0.2, rot: -10 },
    { shot: 's10', start: 75.3, end: 78.6, text: 'FWOOSH', x: 0.74, y: 0.2, rot: 8 },
  ],
};
