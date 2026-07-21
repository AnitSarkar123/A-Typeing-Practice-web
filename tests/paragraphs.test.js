const fs = require('fs');
const path = require('path');

test('Paragraphs array should not be empty', () => {
    const code = fs.readFileSync(path.join(__dirname, '../js/paragraphs.js'), 'utf8');
    eval(code);
    expect(paragraphs).toBeDefined();
    expect(Array.isArray(paragraphs)).toBe(true);
    expect(paragraphs.length).toBeGreaterThan(0);
});
