// Game state
let secretWord = '';
let currentAttempt = 0;
let currentGuess = '';
const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

// Word list (you'll need to load this from wordle.txt)
const wordList = ['crane', 'slate', 'audio', 'raise', 'tiger', 'house', 'mouse', 'beach', 'plant', 'world']; // Example words

// DOM elements
const gameBoard = document.getElementById('game-board');
const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const newGameBtn = document.getElementById('new-game-btn');
const message = document.getElementById('message');
const currentAttemptDisplay = document.getElementById('current-attempt');
const keys = document.querySelectorAll('.key');

// Initialize game
function initGame() {
    secretWord = wordList[Math.floor(Math.random() * wordList.length)].toLowerCase();
    currentAttempt = 0;
    currentGuess = '';
    message.textContent = '';
    message.className = 'message';
    guessInput.value = '';
    guessInput.disabled = false;
    submitBtn.disabled = false;
    currentAttemptDisplay.textContent = '0';
    
    // Reset board
    document.querySelectorAll('.tile').forEach(tile => {
        tile.textContent = '';
        tile.className = 'tile';
    });
    
    // Reset keyboard
    document.querySelectorAll('.key').forEach(key => {
        key.className = key.classList.contains('key-wide') ? 'key key-wide' : 'key';
    });
    
    console.log('Secret word:', secretWord); // For testing
}

// Handle guess submission
function submitGuess() {
    const guess = guessInput.value.toLowerCase().trim();
    
    // Validation
    if (guess.length !== WORD_LENGTH) {
        showMessage('Word must be 5 letters!', 'error');
        return;
    }
    
    if (!wordList.includes(guess)) {
        showMessage('Word not in dictionary!', 'error');
        guessInput.classList.add('shake');
        setTimeout(() => guessInput.classList.remove('shake'), 500);
        return;
    }
    
    // Process guess
    processGuess(guess);
    guessInput.value = '';
    currentGuess = '';
}

// Process the guess
function processGuess(guess) {
    const row = gameBoard.children[currentAttempt];
    const tiles = row.children;
    const feedback = checkGuess(guess, secretWord);
    
    // Display guess with colors
    for (let i = 0; i < WORD_LENGTH; i++) {
        tiles[i].textContent = guess[i].toUpperCase();
        tiles[i].classList.add('filled');
        
        setTimeout(() => {
            tiles[i].classList.add(feedback[i]);
            updateKeyboard(guess[i], feedback[i]);
        }, i * 300);
    }
    
    currentAttempt++;
    currentAttemptDisplay.textContent = currentAttempt;
    
    // Check win/loss
    setTimeout(() => {
        if (guess === secretWord) {
            showMessage(`🎉 Congratulations! You won in ${currentAttempt} attempts!`, 'success');
            endGame();
        } else if (currentAttempt >= MAX_ATTEMPTS) {
            showMessage(`😞 Game Over! The word was "${secretWord.toUpperCase()}"`, 'error');
            endGame();
        }
    }, WORD_LENGTH * 300 + 100);
}

// Check guess logic (same as Python version)
function checkGuess(guess, secret) {
    const feedback = Array(WORD_LENGTH).fill('absent');
    const secretLetters = secret.split('');
    
    // First pass: mark correct positions
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess[i] === secret[i]) {
            feedback[i] = 'correct';
            secretLetters[i] = null;
        }
    }
    
    // Second pass: mark present letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (feedback[i] === 'absent' && secretLetters.includes(guess[i])) {
            feedback[i] = 'present';
            secretLetters[secretLetters.indexOf(guess[i])] = null;
        }
    }
    
    return feedback;
}

// Update keyboard colors
function updateKeyboard(letter, state) {
    const key = Array.from(keys).find(k => k.dataset.key === letter);
    if (!key) return;
    
    // Only update if new state is "better" (correct > present > absent)
    const priority = { 'correct': 3, 'present': 2, 'absent': 1 };
    const currentState = key.classList.contains('correct') ? 'correct' :
                        key.classList.contains('present') ? 'present' :
                        key.classList.contains('absent') ? 'absent' : 'none';
    
    if (!currentState || priority[state] > priority[currentState]) {
        key.classList.remove('correct', 'present', 'absent');
        key.classList.add(state);
    }
}

// Show message
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
}

// End game
function endGame() {
    guessInput.disabled = true;
    submitBtn.disabled = true;
}

// Event listeners
submitBtn.addEventListener('click', submitGuess);
newGameBtn.addEventListener('click', initGame);

guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitGuess();
    }
});

guessInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '');
});

// Keyboard clicks
keys.forEach(key => {
    key.addEventListener('click', () => {
        if (key.id === 'enter-key') {
            submitGuess();
        } else if (key.id === 'backspace-key') {
            guessInput.value = guessInput.value.slice(0, -1);
        } else {
            if (guessInput.value.length < WORD_LENGTH) {
                guessInput.value += key.dataset.key;
            }
        }
        guessInput.focus();
    });
});

// Start game on load
initGame();