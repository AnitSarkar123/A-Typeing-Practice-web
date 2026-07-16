const typingText = document.querySelector(".typing-text p"),
    modeSelect = document.getElementById("mode-select"),
    keySelector = document.getElementById("key-selector"),
    keySelect = document.getElementById("key-select"),
    inpField = document.querySelector(".wrapper .input-field"),
    tryAgainBtn = document.querySelector(".content button"),
    timeTag = document.querySelector(".time span b"),
    mistakeTag = document.querySelector(".mistake span"),
    wpmTag = document.querySelector(".wpm span"),
    cpmTag = document.querySelector(".cpm span"),
    progressTag = document.querySelector(".progress span"),
    accuracyTag = document.querySelector(".accuracy span"),
    keysPressedTag = document.querySelector(".charCount span");

const lastWpmTag = document.getElementById("last-wpm"),
    lastCpmTag = document.getElementById("last-cpm"),
    lastAccuracyTag = document.getElementById("last-accuracy"),
    lastMistakeTag = document.getElementById("last-mistakes"),
    lastKeysPressedTag = document.getElementById("last-keys-pressed");

const DEFAULT_TIME = 300;
const CHARS_PER_WORD = 5;
const SECONDS_PER_MINUTE = 60;
const TIMER_INTERVAL = 1000;

const STORAGE_KEY = "typing-last-session";
let sessionSaved = false;
const typingModes = {
    paragraphs,
    words,
    sentences
};

let timer,
    maxTime = DEFAULT_TIME,
    timeLeft = maxTime,
    charIndex = mistakes = isTyping = 0,
    keysPressedCount = 0;

function calculateWPM() {
    let wpm = Math.round(
        ((charIndex - mistakes) / CHARS_PER_WORD) /
        (maxTime - timeLeft) *
        SECONDS_PER_MINUTE
    );

    return wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
}

function calculateProgress(totalCharacters) {
    return Math.round((charIndex / totalCharacters) * 100);
}

function calculateAccuracy() {
    if (charIndex === 0) {
        return 100;
    }

    return Math.round(((charIndex - mistakes) / charIndex) * 100);
}

document.addEventListener('keypress',(e) => {
    keysPressedCount++;
})

function calculateKeyspressed(){
    return keysPressedCount;
}

function saveLastSession() {
    if (sessionSaved) return;

    const session = {
        wpm: calculateWPM(),
        cpm: charIndex - mistakes,
        accuracy: calculateAccuracy(),
        mistakes: mistakes,
        keysPressed: keysPressedCount
    };
    console.log(keysPressedCount);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        loadLastSession();
        sessionSaved = true;
    } catch (error) {
        console.error("Failed to save your typing session:", error);
    }
}

function loadLastSession() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return;
    }

    try {
        const session = JSON.parse(stored);
        lastWpmTag.innerText = session.wpm;
        lastCpmTag.innerText = session.cpm;
        lastAccuracyTag.innerText = `${session.accuracy}%`;
        lastMistakeTag.innerText = session.mistakes;
        lastKeysPressedTag.innerText = session.keysPressed ?? 0;
    } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
    }
}

function generateKeyPractice() {
    return keySets[keySelect.value][
        Math.floor(Math.random() * keySets[keySelect.value].length)
    ];
}

function loadTypingContent() {
    let text = "";

    if (modeSelect.value === "specificKey") {
        text = generateKeyPractice();
    } else {
        const dataset = typingModes[modeSelect.value];
        const randomIndex = Math.floor(Math.random() * dataset.length);
        text = dataset[randomIndex];
    }

    typingText.innerHTML = "";

    text.split("").forEach(char => {
        typingText.innerHTML += `<span>${char}</span>`;
    });

    typingText.querySelector("span").classList.add("active");
}

function endTypingTest() {
    clearInterval(timer);
    timer = null;
    isTyping = false;

    saveLastSession();

    inpField.value = "";
    inpField.blur();
}

function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];

    if (charIndex < characters.length - 1 && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, TIMER_INTERVAL);
            isTyping = true;
        }

        if (typedChar == null) {
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if (characters[charIndex].innerText == typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
            
            if (charIndex >= characters.length) {
                wpmTag.innerText = calculateWPM();
                mistakeTag.innerText = mistakes;
                cpmTag.innerText = charIndex - mistakes;
                progressTag.innerText = "100%";
                accuracyTag.innerText = `${calculateAccuracy()}%`;
                
                endTypingTest();
                return;
            }
        }

        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        wpmTag.innerText = calculateWPM();
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
        progressTag.innerText = `${calculateProgress(characters.length)}%`;
        accuracyTag.innerText = `${calculateAccuracy()}%`;
        keysPressedTag.innerText = `${calculateKeyspressed()}`;
    } else {
        saveLastSession();
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        wpmTag.innerText = calculateWPM();
    } else {
        saveLastSession();
    }
}

function resetGame() {
    clearInterval(timer);
    loadTypingContent();
    timer = null;
    sessionSaved = false;
    isTyping = false;
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    keysPressedCount = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
    progressTag.innerText = "0%";
    accuracyTag.innerText = "100%";
    keysPressedTag.innerText = 0;
}

function themeToggler() {
    const body = document.body;
    const themeButton = document.querySelector(".theme-toggler-button");
    const themeIcon = themeButton.querySelector("i");

    body.classList.toggle("dark-mode");
    body.classList.toggle("light-mode");

    if (body.classList.contains("dark-mode")) {
        themeIcon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("theme", "dark");
    } else {
        themeIcon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("theme", "light");
    }
}

keySelector.hidden = modeSelect.value !== "specificKey";
loadTypingContent();
loadLastSession();

document.addEventListener("keydown", () => inpField.focus());
typingText.addEventListener("click", () => inpField.focus());

modeSelect.addEventListener("change", () => {
    keySelector.hidden = modeSelect.value !== "specificKey";
    resetGame();
});

keySelect.addEventListener("change", resetGame);
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
