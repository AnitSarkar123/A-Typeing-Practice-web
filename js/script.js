const typingText = document.querySelector('.typing-text p'),
  modeSelect = document.getElementById('mode-select'),
  keySelector = document.getElementById('key-selector'),
  keySelect = document.getElementById('key-select'),
  timeSelect = document.getElementById('time-select'),
  inpField = document.querySelector('.wrapper .input-field'),
  tryAgainBtn = document.querySelector('.content button'),
  timeTag = document.querySelector('.time span b'),
  mistakeTag = document.querySelector('.mistake span'),
  wpmTag = document.querySelector('.wpm span'),
  cpmTag = document.querySelector('.cpm span'),
  progressTag = document.querySelector('.progress span'),
  accuracyTag = document.querySelector('.accuracy span'),
  keysPressedTag = document.querySelector('.charCount span');

const lastWpmTag = document.getElementById('last-wpm'),
  lastCpmTag = document.getElementById('last-cpm'),
  lastAccuracyTag = document.getElementById('last-accuracy'),
  lastMistakeTag = document.getElementById('last-mistakes'),
  lastKeysPressedTag = document.getElementById('last-keys-pressed');

const customTextContainer = document.getElementById("custom-text-container"),
    customTextInput = document.getElementById("custom-text"),
    loadCustomTextBtn = document.getElementById("load-custom-text");

const CHARS_PER_WORD = 5;
const SECONDS_PER_MINUTE = 60;
const TIMER_INTERVAL = 1000;

const STORAGE_KEY = 'typing-last-session';
let sessionSaved = false;
const typingModes = {
  paragraphs,
  words,
  sentences,
};

let timer,
  maxTime = Number(timeSelect.value),
  timeLeft = maxTime,
  charIndex = (mistakes = isTyping = 0),
  keysPressedCount = 0,
  totalCorrectChars = 0;

function calculateWPM(totalCorrectChars, maxTime, timeLeft) {
  let wpm = Math.round(
    (totalCorrectChars / CHARS_PER_WORD / (maxTime - timeLeft)) * SECONDS_PER_MINUTE,
  );

  return wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
}

function calculateProgress(charIndex, totalCharacters) {
  return Math.round((charIndex / totalCharacters) * 100);
}

function calculateAccuracy(totalCorrectChars, mistakes) {
  const totalTyped = totalCorrectChars + mistakes;
  if (totalTyped === 0) {
    return 100;
  }

  return Math.round((totalCorrectChars / totalTyped) * 100);
}

timeSelect.addEventListener('change', () => {
  maxTime = Number(timeSelect.value);
  resetGame();
});

document.addEventListener('keypress', (e) => {
  keysPressedCount++;
});

function calculateKeyspressed() {
  return keysPressedCount;
}

function saveLastSession() {
  if (sessionSaved) return;

  const session = {
    wpm: calculateWPM(totalCorrectChars, maxTime, timeLeft),
    cpm: totalCorrectChars,
    accuracy: calculateAccuracy(totalCorrectChars, mistakes),
    mistakes: mistakes,
    keysPressed: keysPressedCount,
  };
  console.log(keysPressedCount);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    loadLastSession();
    sessionSaved = true;
  } catch (error) {
    console.error('Failed to save your typing session:', error);
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
  return keySets[keySelect.value][Math.floor(Math.random() * keySets[keySelect.value].length)];
}

function loadCustomText() {
    if (!customTextInput.value.trim()) {
        alert("Please enter some text first.");
        return;
    }
    resetGame();
}

function loadTypingContent() {
  let text = "";

if (modeSelect.value === "custom") {
    text = customTextInput.value.trim();

    if (!text) {
        typingText.replaceChildren();
        return;
    }
}
else if (modeSelect.value === "specificKey") {
    text = generateKeyPractice();
}
else {
    const dataset = typingModes[modeSelect.value];
    const randomIndex = Math.floor(Math.random() * dataset.length);
    text = dataset[randomIndex];
}

  const fragment = document.createDocumentFragment();

  text.split('').forEach((char) => {
    const span = document.createElement('span');
    span.textContent = char;
    fragment.appendChild(span);
  });

  typingText.replaceChildren(fragment);

  const firstSpan = typingText.querySelector('span');
  if (firstSpan) {
    firstSpan.classList.add('active');
  }
}

function initTyping() {
  let characters = typingText.querySelectorAll('span');
  let typedChar = inpField.value.split('')[charIndex];

  if (timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(initTimer, TIMER_INTERVAL);
      isTyping = true;
    }

    if (typedChar == null) {
      if (
        charIndex > 0 ||
        (characters[charIndex] && characters[charIndex].classList.contains('incorrect'))
      ) {
        if (characters[charIndex] && characters[charIndex].classList.contains('incorrect')) {
          characters[charIndex].classList.remove('incorrect');
        } else if (charIndex > 0) {
          charIndex--;
          if (characters[charIndex].classList.contains('correct')) {
            totalCorrectChars--;
          }
          characters[charIndex].classList.remove('correct', 'incorrect');
        }
      }
    } else {
      if (
        modeSelect.value === 'words' &&
        characters[charIndex] &&
        characters[charIndex].classList.contains('incorrect')
      ) {
        inpField.value = inpField.value.slice(0, -1);
        return;
      }

      if (characters[charIndex].innerText === typedChar) {
        characters[charIndex].classList.add('correct');
        charIndex++;
        totalCorrectChars++;
      } else {
        mistakes++;
        characters[charIndex].classList.add('incorrect');
        if (modeSelect.value !== 'words') {
          charIndex++;
        }
      }
    }

    if (charIndex >= characters.length) {
      if (modeSelect.value === 'words') {
        charIndex = 0;
        inpField.value = '';
        loadTypingContent();
        return;
      } else {
        wpmTag.innerText = calculateWPM(totalCorrectChars, maxTime, timeLeft);
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = totalCorrectChars;
        progressTag.innerText = '100%';
        accuracyTag.innerText = `${calculateAccuracy(totalCorrectChars, mistakes)}%`;

        endTypingTest();
        return;
      }
    }

    characters.forEach((span) => span.classList.remove('active'));
    if (characters[charIndex]) {
      characters[charIndex].classList.add('active');
    }

    wpmTag.innerText = calculateWPM(totalCorrectChars, maxTime, timeLeft);
    mistakeTag.innerText = mistakes;
    cpmTag.innerText = totalCorrectChars;
    progressTag.innerText = `${calculateProgress(charIndex, characters.length)}%`;
    accuracyTag.innerText = `${calculateAccuracy(totalCorrectChars, mistakes)}%`;
    keysPressedTag.innerText = `${calculateKeyspressed()}`;
  } else {
    saveLastSession();
  }
}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;
    wpmTag.innerText = calculateWPM(totalCorrectChars, maxTime, timeLeft);
  } else {
    endTypingTest();
  }
}

function endTypingTest() {
  clearInterval(timer);
  saveLastSession();
  inpField.value = '';
  isTyping = false;
}

function resetGame() {
  clearInterval(timer);
  loadTypingContent();
  timer = null;
  sessionSaved = false;
  isTyping = false;
  maxTime = Number(timeSelect.value);
  timeLeft = maxTime;
  charIndex = 0;
  mistakes = 0;
  keysPressedCount = 0;
  totalCorrectChars = 0;
  inpField.value = '';
  timeTag.innerText = timeLeft;
  wpmTag.innerText = 0;
  mistakeTag.innerText = 0;
  cpmTag.innerText = 0;
  progressTag.innerText = '0%';
  accuracyTag.innerText = '100%';
  keysPressedTag.innerText = 0;
}

function themeToggler() {
  const body = document.body;
  const themeButton = document.querySelector('.theme-toggler-button');
  const themeIcon = themeButton.querySelector('i');

  body.classList.toggle('dark-mode');
  body.classList.toggle('light-mode');

  if (body.classList.contains('dark-mode')) {
    themeIcon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    themeIcon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
}

function handleKeyboardShortcuts(event) {
  if (document.activeElement === inpField && event.ctrlKey && event.key.toLowerCase() === 'r') {
    event.preventDefault();
    resetGame();
  }
}

keySelector.hidden = modeSelect.value !== 'specificKey';
loadTypingContent();
loadLastSession();

document.addEventListener('keydown', () => inpField.focus());
document.addEventListener('keydown', handleKeyboardShortcuts);
typingText.addEventListener('click', () => inpField.focus());

modeSelect.addEventListener("change", () => {
    keySelector.hidden = modeSelect.value !== "specificKey";
    customTextContainer.hidden = modeSelect.value !== "custom";

    if (modeSelect.value === "custom") {
        typingText.replaceChildren();
        inpField.value = "";
        return;
    }
    resetGame();
});

keySelect.addEventListener('change', resetGame);
inpField.addEventListener('input', initTyping);
tryAgainBtn.addEventListener('click', resetGame);
loadCustomTextBtn.addEventListener("click", loadCustomText);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateWPM,
    calculateProgress,
    calculateAccuracy,
    calculateKeyspressed,
  };
}
