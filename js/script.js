const pokemon = [
    {
        name: 'pikachu',
        hints: [
            'This Pokémon shocked Ash when they first met!',
            'It loves riding on Ash\'s shoulder!'
        ],
        image: 'assets/images/pikachu.webp'
    },
    {
        name: 'bulbasaur',
        hints: [
            'This starter Pokémon has a plant bulb on its back!',
            'It can be found napping in bright sunlight!'
        ],
        image: 'assets/images/bulbasaur.webp'
    },
    {
        name: 'charmander',
        hints: [
            'The flame on its tail shows its life force!',
            'This Pokémon nearly died in the rain while waiting for its trainer!'
        ],
        image: 'assets/images/charmander.webp'
    },
    {
        name: 'squirtle',
        hints: [
            'This water-type Pokémon formed a gang with cool sunglasses!',
            'It helps fight fires in its spare time!'
        ],
        image: 'assets/images/squirtle.webp'
    },
    {
        name: 'jigglypuff',
        hints: [
            'This Pokémon puts everyone to sleep with its song!',
            'It gets angry and draws on people\'s faces when they fall asleep!'
        ],
        image: 'assets/images/jigglypuff.webp'
    }
];

let currentPokemon;
let hintsUsed = 0;
let gameActive = true;
let isAnimating = false;

function revealPokemon() {
    const pokemonBox = document.getElementById('pokemon-box');
    
    // Preload image to prevent flashing
    const img = new Image();
    img.src = currentPokemon.image;
    img.onload = () => {
        // Add dramatic reveal sound effect (optional)
        const revealSound = new Audio('assets/sounds/reveal.mp3');
        revealSound.volume = 0.5;
        revealSound.play().catch(() => {}); // Catch and ignore audio play errors
        
        // Start the reveal animation
        pokemonBox.style.backgroundImage = `url(${currentPokemon.image})`;
        pokemonBox.classList.add('reveal');
        
        // Update result message with dramatic timing
        const resultMessage = document.getElementById('result-message');
        resultMessage.style.opacity = '0';
        
        setTimeout(() => {
            resultMessage.textContent = `It's ${currentPokemon.name.toUpperCase()}!`;
            resultMessage.style.opacity = '1';
            resultMessage.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                resultMessage.style.transform = 'scale(1)';
                // Show play again prompt after the reveal
                showPlayAgainPrompt();
            }, 200);
        }, 1500);
        
        // Reset animation state after completion
        setTimeout(() => {
            isAnimating = false;
        }, 2500);
    };
    
    img.onerror = () => {
        // Fallback if image fails to load
        console.error('Failed to load Pokemon image:', currentPokemon.image);
        pokemonBox.style.backgroundColor = '#e74c3c';
        isAnimating = false;
    };
}

function showPlayAgainPrompt() {
    const gameControls = document.querySelector('.game-controls');
    
    // Clear existing controls
    gameControls.innerHTML = `
        <button id="play-again-btn" class="success-btn">Play Again</button>
    `;
    
    // Add event listener to new button
    document.getElementById('play-again-btn').addEventListener('click', () => {
        if (!isAnimating) {
            resetGameControls();
            initializeGame();
        }
    });
}

function resetGameControls() {
    const gameControls = document.querySelector('.game-controls');
    
    // Restore original controls
    gameControls.innerHTML = `
        <input type="text" id="guess-input" placeholder="Enter Pokémon name">
        <button id="submit-btn">Submit</button>
        <button id="hint-btn">Get Hint (<span id="hints-left">2</span> left)</button>
    `;
    
    // Reattach event listeners
    document.getElementById('submit-btn').addEventListener('click', checkGuess);
    document.getElementById('hint-btn').addEventListener('click', showHint);
    document.getElementById('guess-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkGuess();
        }
    });
}

function initializeGame() {
    // Prevent reinitializing during animation
    if (isAnimating) return;
    
    currentPokemon = pokemon[Math.floor(Math.random() * pokemon.length)];
    hintsUsed = 0;
    gameActive = true;
    isAnimating = false;
    
    // Reset UI elements
    const resultMessage = document.getElementById('result-message');
    const guessInput = document.getElementById('guess-input');
    const hintsContainer = document.getElementById('hints-container');
    const hintsLeft = document.getElementById('hints-left');
    const hintBtn = document.getElementById('hint-btn');
    const submitBtn = document.getElementById('submit-btn');
    const pokemonBox = document.getElementById('pokemon-box');

    resultMessage.textContent = '';
    guessInput.value = '';
    guessInput.disabled = false;
    hintsContainer.innerHTML = '';
    hintsLeft.textContent = '2';
    hintBtn.disabled = false;
    submitBtn.disabled = false;

    // Reset pokemon box
    pokemonBox.style.backgroundImage = 'none';
    pokemonBox.classList.remove('reveal');

    // Focus on input for immediate typing
    guessInput.focus();
}

function checkGuess() {
    if (!gameActive || isAnimating) return;

    const guessInput = document.getElementById('guess-input');
    const guess = guessInput.value.toLowerCase().trim();
    const resultMessage = document.getElementById('result-message');

    // Input validation
    if (!guess) {
        resultMessage.textContent = 'Please enter a guess!';
        resultMessage.style.color = '#e74c3c';
        guessInput.focus();
        return;
    }

    // Check for special characters or numbers
    if (!/^[a-zA-Z]+$/.test(guess)) {
        resultMessage.textContent = 'Please use only letters!';
        resultMessage.style.color = '#e74c3c';
        return;
    }

    if (!pokemon.some(p => p.name === guess)) {
        resultMessage.textContent = 'That\'s not one of our Pokémon!';
        resultMessage.style.color = '#e74c3c';
        guessInput.value = '';
        guessInput.focus();
        return;
    }

    if (guess === currentPokemon.name) {
        isAnimating = true;
        resultMessage.textContent = 'You got it!';
        resultMessage.style.color = '#27ae60';
        gameActive = false;
        
        // Disable controls
        guessInput.disabled = true;
        document.getElementById('hint-btn').disabled = true;
        document.getElementById('submit-btn').disabled = true;
        
        revealPokemon();
    } else {
        resultMessage.textContent = 'Try again!';
        resultMessage.style.color = '#e74c3c';
        guessInput.value = '';
        guessInput.focus();
    }
}

function showHint() {
    if (hintsUsed >= 2 || !gameActive || isAnimating) return;

    const hintsContainer = document.getElementById('hints-container');
    const hintElement = document.createElement('p');
    hintElement.className = 'hint';
    hintElement.textContent = currentPokemon.hints[hintsUsed];
    
    // Add fade-in animation to hints
    hintElement.style.opacity = '0';
    hintsContainer.appendChild(hintElement);
    setTimeout(() => {
        hintElement.style.opacity = '1';
    }, 10);

    hintsUsed++;
    document.getElementById('hints-left').textContent = 2 - hintsUsed;
    
    if (hintsUsed >= 2) {
        document.getElementById('hint-btn').disabled = true;
    }
}

// Event Listeners
document.getElementById('submit-btn').addEventListener('click', checkGuess);
document.getElementById('hint-btn').addEventListener('click', showHint);

// Handle Enter key and prevent form submission
document.getElementById('guess-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkGuess();
    }
});

// Prevent multiple rapid submissions
let debounceTimer;
document.getElementById('guess-input').addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        e.target.value = e.target.value.toLowerCase();
    }, 300);
});

// Handle image loading errors
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.error('Failed to load Pokemon image:', e.target.src);
        e.target.style.display = 'none';
    }
}, true);

// Initialize the game when the page loads
window.addEventListener('load', initializeGame); 