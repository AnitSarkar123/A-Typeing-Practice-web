## 📝 Pull Request Summary

Adds a Jest unit testing setup and tests the core typing utility functions (`calculateWPM`, `calculateProgress`, `calculateAccuracy`) to ensure reliability.

---

## 🔗 Related Issue

Closes #40

---

## 🔄 Type of Change

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [x] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 📚 Documentation update
- [ ] ♿ Accessibility improvement
- [ ] ⚡ Performance improvement
- [ ] 🔒 Security fix
- [x] 🔧 CI/Tooling change

---

## 📋 Changes Made

- Setup Jest with `jest-environment-jsdom` to allow testing code requiring the DOM.
- Refactored `calculateWPM`, `calculateProgress`, and `calculateAccuracy` to be pure functions that take in variables rather than relying on global scope, ensuring easier testability.
- Wrote initial unit tests for the utility functions in `tests/logic.test.js`.
- Configured the `test` command in `package.json` to run Jest.

---

## 🧪 Testing

- [x] Opened the affected pages in a browser — no visual regressions
- [x] Opened browser DevTools console — no new errors or warnings
- [x] Tested on mobile viewport (DevTools responsive mode at 375px width)
- [x] Verified accessibility with keyboard-only navigation
- [x] Tested on multiple browsers (Chrome, Firefox) if applicable

---

## 📸 Screenshots

| Before | After |
| ------ | ----- |
|        |       |

---

## ⚠️ Notes for Reviewers

---

## ✅ Contributor Checklist

- [x] My branch is up-to-date with `main`
- [x] I have tested my changes locally
- [x] My changes do not introduce console errors or warnings
- [x] I have not included unrelated changes
- [x] No secrets, API keys, or credentials are committed
- [x] My commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) format
