const cmdInput = document.getElementById('cmd-input');
const cmdOutput = document.getElementById('cmd-output');
const cardsContainer = document.getElementById('cards-container');
const overlay = document.getElementById('overlay');
const cardFullContent = document.getElementById('card-full-content');
const closeCardBtn = document.getElementById('close-card-btn');

let openCards = {};
let currentCard = null;

cmdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCommand(cmdInput.value);
        cmdInput.value = ''; // clear input field
    }
});

closeCardBtn.addEventListener('click', () => {
    closeOverlay();
});

function handleCommand(command) {
    const cmdParts = command.split(' ');
    const action = cmdParts[0];
    const filename = cmdParts[1];

    switch (action) {
        case 'create':
            createCard(filename);
            break;
        case 'open':
            openCard(filename);
            break;
        case 'write':
            writeToCard(filename, cmdParts.slice(2).join(' '));
            break;
        case 'truncate':
            truncateCard(filename);
            break;
        case 'close':
            closeCard(filename);
            break;
        case 'rm':
            removeCard(filename);
            break;
        default:
            displayOutput(`Unknown command: ${action}`);
            break;
    }
}

function displayOutput(message) {
    cmdOutput.textContent = message;
}

function createCard(filename) {
    if (openCards[filename]) {
        displayOutput(`Card ${filename} already exists.`);
        return;
    }

    const card = document.createElement('div');
    card.classList.add('card');
    card.id = filename;
    card.onclick = () => openCard(filename); // open on click

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = filename;

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
    cardContent.textContent = ''; // initially empty

    card.appendChild(cardTitle);
    card.appendChild(cardContent);
    cardsContainer.appendChild(card);

    openCards[filename] = { card, content: cardContent };
    displayOutput(`Card ${filename} created.`);
}

function openCard(filename) {
    if (!openCards[filename]) {
        displayOutput(`Card ${filename} does not exist.`);
        return;
    }

    // Hide homepage cards and show the overlay with the card content
    cardsContainer.style.display = 'none';
    overlay.style.display = 'flex';
    currentCard = openCards[filename];
    cardFullContent.textContent = currentCard.content.textContent;
}

function writeToCard(filename, content) {
    if (!openCards[filename]) {
        displayOutput(`Card ${filename} is not open.`);
        return;
    }

    currentCard.content.textContent += content + '\n';
    cardFullContent.textContent = currentCard.content.textContent;
    displayOutput(`Written to card ${filename}.`);
}

function truncateCard(filename) {
    if (!openCards[filename]) {
        displayOutput(`Card ${filename} does not exist.`);
        return;
    }

    currentCard.content.textContent = '';
    cardFullContent.textContent = '';
    displayOutput(`Card ${filename} content truncated.`);
}

function closeCard(filename) {
    if (!openCards[filename]) {
        displayOutput(`Card ${filename} is not open.`);
        return;
    }

    // Return to homepage with cards visible
    closeOverlay();
}

function closeOverlay() {
    overlay.style.display = 'none';
    cardsContainer.style.display = 'flex';
    cardFullContent.textContent = '';
}

function removeCard(filename) {
    if (!openCards[filename]) {
        displayOutput(`Card ${filename} does not exist.`);
        return;
    }

    openCards[filename].card.remove();
    delete openCards[filename];
    displayOutput(`Card ${filename} deleted.`);
}
