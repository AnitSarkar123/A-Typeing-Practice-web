const typingText = document.querySelector(".typing-text p"),
    inpField = document.querySelector(".wrapper .input-field"),
    tryAgainBtn = document.querySelector(".content button"),
    timeTag = document.querySelector(".time span b"),
    mistakeTag = document.querySelector(".mistake span"),
    wpmTag = document.querySelector(".wpm span"),
    cpmTag = document.querySelector(".cpm span"),
    progressTag = document.querySelector(".progress span"),
    accuracyTag = document.querySelector(".accuracy span");

const DEFAULT_TIME = 300;
const CHARS_PER_WORD = 5;
const SECONDS_PER_MINUTE = 60;
const TIMER_INTERVAL = 1000;

let timer,
    maxTime = DEFAULT_TIME,
    timeLeft = maxTime,
    charIndex = mistakes = isTyping = 0;

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

function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";
    paragraphs[ranIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`;
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
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
        }

        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        wpmTag.innerText = calculateWPM();
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
        progressTag.innerText = `${calculateProgress(characters.length)}%`;
        accuracyTag.innerText = `${calculateAccuracy()}%`;
    } else {
        clearInterval(timer);
        inpField.value = "";
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        wpmTag.innerText = calculateWPM();
    } else {
        clearInterval(timer);
    }
}

function resetGame() {
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
    progressTag.innerText = "0%";
    accuracyTag.innerText = "100%";
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

loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
