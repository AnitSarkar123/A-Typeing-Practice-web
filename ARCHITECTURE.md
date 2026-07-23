# Architecture

This project is a simple, browser-based typing speed test application built with core web technologies.

## Technology Stack

- **HTML**: Provides the semantic structure and layout of the application.
- **CSS**: Handles styling and layout, ensuring a responsive and visually appealing user interface.
- **JavaScript (Vanilla)**: Powers the application logic, including timer countdowns, typing accuracy calculations, and text generation. No external frameworks or libraries are used for the core functionality.

## Core Components

1. **User Interface (`index.html` & `style.css`)**: Contains the typing area, timer, stats display (WPM, CPM, mistakes), and control buttons.
2. **Typing Logic (`js/script.js`)**: Manages the state of the typing test. It listens to user keyboard input, tracks the current position, calculates mistakes, and updates the timer and stats in real time.
3. **Content Data (`js/paragraphs.js`)**: A static array of paragraphs used as the source text for the typing tests.

## Data Flow

1. Upon initialization, a random paragraph is selected from `paragraphs.js` and rendered into the typing area.
2. As the user types, event listeners in `script.js` capture keystrokes.
3. The keystrokes are compared against the expected characters in the paragraph.
4. Correct strokes highlight the text, while mistakes increment the error counter and trigger visual feedback.
5. The timer runs continuously until time is up, at which point typing is disabled and final scores are displayed.
