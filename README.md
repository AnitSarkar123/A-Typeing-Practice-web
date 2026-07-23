# Typing Speed Test

A simple browser-based typing speed test that measures typing performance in real time. Users can practice typing with randomly selected paragraphs while tracking metrics such as Words Per Minute (WPM), Characters Per Minute (CPM), mistakes and remaining time.

## Features

- Randomized typing paragraphs
- Real-time WPM calculation
- CPM (Characters Per Minute) tracking
- Mistake counting
- Countdown timer
- Instant visual feedback for typed characters
- Restart test functionality

## Live Demo

[Open the typing test](https://a-typeing-practice-web.vercel.app/)

## Project Structure

```text
├── index.html
├── style.css
└── js
    ├── paragraphs.js
    └── script.js
```

## Getting Started

1. Clone your fork repository:

```bash
git clone https://github.com/AnitSarkar123/A-Typeing-Practice-web.git
```

2. Navigate to the project directory:

```bash
cd A-Typeing-Practice-web
```

3. Open `index.html` in your browser.

No additional dependencies or build steps are required.

## How It Works

- A random paragraph is selected when the page loads.
- Each typed character is validated against the target text.
- WPM, CPM, mistakes and remaining time are updated in real time.
- The test can be restarted at any time using the **Try Again** button.

## Metrics Notes

- **Timer:** starts on the user’s first input (`input` event).
- **Finish:** when time reaches 0 or the text ends, the input is cleared and the test stops.
- **WPM formula:** `((charIndex - mistakes) / 5) / elapsedMinutes`, rounded.
- **CPM formula:** `charIndex - mistakes`.
- **Mistakes:** increments when a typed character doesn’t match; decrements if the user backspaces into a previously incorrect character.

## Technologies Used

- HTML
- CSS
- JavaScript
