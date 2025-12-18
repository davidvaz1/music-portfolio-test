// --- 1. Audio Engine (Web Audio API) ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Frequency map for keys
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

// Array of all note frequencies for randomization
const allNoteFrequencies = Object.values(notes);

// New, less synthy, Marimba-like tone function
function playTone(freq) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Sound Design: Sine wave for a clean, non-aggressive tone
    osc.type = 'sine'; 
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Envelope: Fast attack and very quick decay for a 'click' or mallet sound
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.005); // Very fast attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25); // Quick decay

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.25); // Stop the sound quickly
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

// Function to play a random note (for the "Let's Jam" button)
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

// Add randomized sound only to all button/link clicks (mousedown/touchstart)
document.querySelectorAll('a, button, .card').forEach(el => {
    // Use mousedown/touchstart for a responsive click feel
    const clickHandler = () => {
        const randomFreq = allNoteFrequencies[Math.floor(Math.random() * allNoteFrequencies.length)];
        playTone(randomFreq);
    };

    el.addEventListener('mousedown', clickHandler);
    el.addEventListener('touchstart', clickHandler);
    
    // REMOVED: el.addEventListener('mouseenter', ...);
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
    
    // Play a random successful chord on submit
    setTimeout(() => playTone(notes['C']), 0);
    setTimeout(() => playTone(notes['E']), 100);
    setTimeout(() => playTone(notes['G']), 200);

    alert("Thanks for the message! Your message wasn't actually sent (static site), but it sounded good!");
    this.reset();
});
