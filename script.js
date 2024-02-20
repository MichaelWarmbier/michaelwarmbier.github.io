/*/// Data *///

IMAGES = [
    'api_app.gif',
    'chance_for_Rain.gif',
    'conglom.png',
    'ImageProcess.gif',
    'jstetris.gif',
    'neotock.gif',
    'pacmangml.gif',
    'shellhacks.jpg',
    'smiteapi.gif',
    'smitebuildmaker.gif',
    'weatherdolphin.gif',
    'linework.gif'
];

TEXT = "Michael Wambe\b\b\brmbierX";
TEXT_INDEX = 0;

BLINK_STATE = 0;

IMAGE_INDEX = Rand(IMAGES.length);
POS_INDEX = 1;

/*/// Utility Functions ///*/

function Rand(max) { return Math.floor(Math.random() * max); }

/*/// Main ///*/

window.onload = () => {
    step();
    setInterval(() => { step(); }, 5000 + (1 - Rand(3)) * 1000);
}

function step() {
    if (IMAGE_INDEX >= IMAGES.length) IMAGE_INDEX = 0;
    if (POS_INDEX >= 3) POS_INDEX = 0;

    let tempElem = document.createElement('div');
    tempElem.classList.add('d_image');
    tempElem.style.backgroundImage = `URL("Previews/${IMAGES[IMAGE_INDEX]}")`;
    tempElem.style.backgroundSize = 'contain';
    tempElem.style.top = parseInt(-5 + POS_INDEX * 18 + (10 - Rand(20))) + 'vh';
    Showcase.appendChild(tempElem);

    setTimeout(() => { tempElem.remove(); }, 20_000);

    IMAGE_INDEX++;
    POS_INDEX++;
}

TEXT_INTERVAL = setInterval(() => {
    if (TEXT[TEXT_INDEX] === 'X') { 
        clearInterval(TEXT_INTERVAL); 
        return; 
    }
    else if (TEXT[TEXT_INDEX] === '\b') Title.value = (Title.value).slice(0, -1);
    else Title.value += TEXT[TEXT_INDEX];
    TEXT_INDEX++;
}, 175);