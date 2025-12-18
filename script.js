// --- 1. Audio Engine (Web Audio API) ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const notes = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00
};

// Play a synthesized tone
function playTone(freq, type = 'triangle') {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Audio Envelope (Prevent clicking sounds)
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

// --- 2. Interactivity ---

// Piano Click/Touch Handlers
const keys = document.querySelectorAll('.key');

keys.forEach(key => {
    // Mouse Interaction
    key.addEventListener('mousedown', () => {
        triggerKey(key);
    });

    // Touch Interaction (for mobile)
    key.addEventListener('touchstart', (e) => {
        e.preventDefault(); // prevents mouse emulation
        triggerKey(key);
    });

    key.addEventListener('mouseup', () => removeActive(key));
    key.addEventListener('mouseleave', () => removeActive(key));
    key.addEventListener('touchend', () => removeActive(key));
});

function triggerKey(key) {
    const note = key.getAttribute('data-note');
    if(notes[note]) {
        playTone(notes[note]);
        key.classList.add('playing');
    }
}

function removeActive(key) {
    key.classList.remove('playing');
}

// Play random note from "Let's Jam" button
function playRandomNote() {
    const keysArr = Object.keys(notes);
    const randomKey = keysArr[Math.floor(Math.random() * keysArr.length)];
    const keyElement = document.querySelector(`.key[data-note="${randomKey}"]`);
    
    playTone(notes[randomKey]);
    
    if(keyElement) {
        keyElement.classList.add('playing');
        setTimeout(() => keyElement.classList.remove('playing'), 200);
    }
}

// Add 'blip' sound to all buttons and links
document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('mouseenter', () => {
        playTone(800, 'sine'); // High pitch sine blip
    });
});


// --- 3. Dynamic Content ---

const MUSICAL_QUOTES = [
    "Code is poetry, but software is a symphony.",
    "Debugging is like practicing scales: tedious but necessary.",
    "Refactoring: The remixing of code.",
    "Algorithm: A composer's score for the CPU."
];

// Set random quote on load
document.getElementById('dynamic-quote').innerText = 
    MUSICAL_QUOTES[Math.floor(Math.random() * MUSICAL_QUOTES.length)];


// --- 4. Contact Form Handler ---
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Play a "Success" chord
    setTimeout(() => playTone(notes['C']), 0);
    setTimeout(() => playTone(notes['E']), 100);
    setTimeout(() => playTone(notes['G']), 200);

    alert("Thanks for the message! Since this is a static demo, your message wasn't actually sent, but it sounded good!");
    this.reset();
});
