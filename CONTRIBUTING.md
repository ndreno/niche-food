# Contributing to NicheFood

Thank you for your interest in contributing to NicheFood! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server for development (e.g., `python -m http.server` or VS Code Live Server)
- Git for version control

### Local Development

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/niche-food.git
   cd niche-food
   ```

2. Start a local server:

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Or using Node.js
   npx serve
   ```

3. Open `http://localhost:8000` in your browser

### Testing on Mobile

For camera/barcode scanning features, you'll need HTTPS. Options:

- Use `ngrok` to create a secure tunnel
- Test on GitHub Pages after pushing to a branch
- Use Chrome DevTools device emulation for basic UI testing

## Project Structure

```
niche-food/
├── index.html      # Main HTML structure
├── script.js       # Application logic (scanner, API, scoring)
├── styles.css      # Responsive styles
├── sw.js           # Service Worker for offline support
├── manifest.json   # PWA manifest
└── MILESTONES.md   # Roadmap and task tracking
```

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Create a new issue with:
   - Clear title describing the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Device/browser information
   - Screenshots if applicable

### Suggesting Features

1. Check [MILESTONES.md](MILESTONES.md) for planned features
2. Open an issue to discuss new ideas before implementing
3. Reference relevant milestone if applicable

### Submitting Code

1. Create a branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our code style

3. Test thoroughly:
   - Test on mobile devices (camera features)
   - Verify offline functionality
   - Check responsive design

4. Commit with clear messages:

   ```bash
   git commit -m "Add: brief description of feature"
   git commit -m "Fix: brief description of bug fix"
   ```

5. Push and create a Pull Request

## Code Style

### JavaScript

- Use vanilla JavaScript (no frameworks)
- Use `const` by default, `let` when reassignment needed
- Use descriptive function and variable names
- Add comments for complex logic
- Keep functions focused and small

### CSS

- Mobile-first responsive design
- Use CSS custom properties for theming
- Follow existing naming conventions
- Keep specificity low

### HTML

- Semantic HTML5 elements
- Accessible markup (ARIA labels where needed)
- Keep structure clean and readable

## Scoring Algorithm

When modifying the pet food scoring system in `script.js`:

- Document the reasoning for score adjustments
- Consider both cats and dogs dietary needs
- Reference nutritional sources when possible
- Test with various real products from OpenFoodFacts

## Questions?

Feel free to open an issue for any questions about contributing.

---

Thank you for helping make NicheFood better for pet owners everywhere!
