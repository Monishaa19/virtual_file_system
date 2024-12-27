const cmdInput = document.getElementById('cmd-input');
const cmdOutput = document.getElementById('cmd-output');
const cardsContainer = document.getElementById('cards-container');

let openCards = {};

cmdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCommand(cmdInput.value);
        cmdInput.value = ''; // clear input field
    }
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

    openCards[filename].card.style.display = 'block';
    displayOutput(`Card ${filename} opened.`);
}

function writeToCard(filename, content) {
    if (!openCards[filename]) {
        displayOutput(`Card ${filename} is not open.`);
        return;
    }

    openCards[filename].content.textContent += content + '\n';
    displayOutput(`Written to card ${filename}.`);
}

function truncateCard(filename) {
    if (!openCards[filename]) {
        displayOutput(`Card ${filename} does not exist.`);
        return;
    }

    openCards[filename].content.textContent = '';
    displayOutput(`Card ${filename} content truncated.`);
}

function closeCard(filename) {
    if (!openCards[filename]) {
        displayOutput(`Card ${filename} is not open.`);
        return;
    }

    openCards[filename].card.style.display = 'none';
    displayOutput(`Card ${filename} closed.`);
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
