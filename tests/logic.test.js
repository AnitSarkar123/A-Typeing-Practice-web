const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

let calculateWPM, calculateProgress, calculateAccuracy, calculateKeyspressed;

beforeAll(() => {
    // Set up DOM
    document.documentElement.innerHTML = html.toString();
    
    // Set up global variables used by script.js
    global.paragraphs = ["test"];
    global.words = ["test"];
    global.sentences = ["test"];
    global.keySets = { homeRow: ["asdf"] };
    
    // Require script after DOM is ready
    const script = require('../js/script.js');
    calculateWPM = script.calculateWPM;
    calculateProgress = script.calculateProgress;
    calculateAccuracy = script.calculateAccuracy;
    calculateKeyspressed = script.calculateKeyspressed;
});

describe('Typing Utility Functions', () => {
    describe('calculateWPM', () => {
        test('calculates correct WPM', () => {
            // totalCorrectChars = 50, maxTime = 60, timeLeft = 50
            // (50 / 5) / (60 - 50) * 60 = 10 / 10 * 60 = 60
            expect(calculateWPM(50, 60, 50)).toBe(60);
        });

        test('returns 0 if wpm is less than 0', () => {
            expect(calculateWPM(-10, 60, 50)).toBe(0);
        });

        test('returns 0 if time taken is 0 (prevents Infinity)', () => {
            // (10 / 5) / (60 - 60) * 60 = Infinity
            expect(calculateWPM(10, 60, 60)).toBe(0);
        });
    });

    describe('calculateProgress', () => {
        test('calculates progress percentage correctly', () => {
            expect(calculateProgress(25, 100)).toBe(25);
            expect(calculateProgress(0, 100)).toBe(0);
            expect(calculateProgress(100, 100)).toBe(100);
            expect(calculateProgress(33, 100)).toBe(33);
        });
    });

    describe('calculateAccuracy', () => {
        test('calculates accuracy percentage correctly', () => {
            // totalCorrectChars = 90, mistakes = 10 -> 90%
            expect(calculateAccuracy(90, 10)).toBe(90);
            // totalCorrectChars = 100, mistakes = 0 -> 100%
            expect(calculateAccuracy(100, 0)).toBe(100);
            // totalCorrectChars = 50, mistakes = 50 -> 50%
            expect(calculateAccuracy(50, 50)).toBe(50);
        });

        test('returns 100 when total typed is 0', () => {
            expect(calculateAccuracy(0, 0)).toBe(100);
        });
    });
});
