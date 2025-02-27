const pokemon = [
    {
        name: 'pikachu',
        image: 'pikachu-silhouette.png',
        hint: 'This Pokémon shocked Ash when they first met!'
    },
    {
        name: 'bulbasaur',
        image: 'bulbasaur-silhouette.png',
        hint: 'This starter Pokémon has a plant bulb on its back!'
    },
    {
        name: 'charmander',
        image: 'charmander-silhouette.png',
        hint: 'The flame on its tail shows its life force!'
    },
    {
        name: 'squirtle',
        image: 'squirtle-silhouette.png',
        hint: 'This water-type Pokémon formed a gang with cool sunglasses!'
    },
    {
        name: 'jigglypuff',
        image: 'jigglypuff-silhouette.png',
        hint: 'This Pokémon puts everyone to sleep with its song!'
    }
];

let currentPokemon;

function initializeGame() {
    currentPokemon = pokemon[Math.floor(Math.random() * pokemon.length)];
    document.getElementById('pokemon-silhouette').src = currentPokemon.image;
    document.getElementById('result-message').textContent = '';
    document.getElementById('hint-text').textContent = '';
    document.getElementById('guess-input').value = '';
}

document.getElementById('submit-btn').addEventListener('click', () => {
    const guess = document.getElementById('guess-input').value.toLowerCase().trim();
    const resultMessage = document.getElementById('result-message');
    
    if (guess === currentPokemon.name) {
        resultMessage.textContent = 'You got it!';
        resultMessage.style.color = '#27ae60';
        setTimeout(initializeGame, 2000);
    } else {
        resultMessage.textContent = 'Nope, try again!';
        resultMessage.style.color = '#c0392b';
    }
});

document.getElementById('hint-btn').addEventListener('click', () => {
    document.getElementById('hint-text').textContent = currentPokemon.hint;
});

// Initialize the game when the page loads
window.addEventListener('load', initializeGame); 