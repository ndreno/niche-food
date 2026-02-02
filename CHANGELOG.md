# Changelog

All notable changes to NicheFood will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- MIT LICENSE file
- CONTRIBUTING.md with contributor guidelines
- MILESTONES.md roadmap for future development
- ESLint and Prettier configuration for code quality
- package.json with development scripts
- .gitignore for cleaner repository
- Comprehensive unit tests for scoring algorithm (39 tests)
- GitHub Actions CI/CD pipeline

### Enhanced

- **Scoring Algorithm Overhaul** - Complete rewrite with modular architecture
  - Harmful ingredient detection: BHA, BHT, ethoxyquin, TBHQ, propylene glycol
  - Artificial color detection: Red 40, Yellow 5/6, Blue 2
  - Cheap filler detection: corn gluten, wheat gluten, soy protein
  - Quality ingredient recognition: fresh meat, named meat meals, whole grains
  - Healthy fats detection: salmon oil, fish oil, flaxseed, coconut oil
  - Vegetable/fruit recognition: sweet potato, pumpkin, carrots, blueberries
  - Probiotic detection for digestive health ingredients
- **Species-specific scoring** - Different rules for cats vs dogs
  - Cat food: taurine requirement check, propylene glycol warning, onion/garlic toxicity
  - Dog food: xylitol detection, grape/raisin toxicity warnings
- **Allergen detection** - Identifies common allergens (chicken, beef, dairy, wheat, soy, corn, eggs, fish)
- **Position-based weighting** - First ingredients impact score more than later ones
- **Enhanced UI** - Separated positive findings, warnings, and allergen alerts in results
- **Life-stage detection** - Automatic detection of puppy/kitten, adult, and senior formulas
  - DHA bonus for puppy/kitten foods
  - Joint support detection for senior foods
  - Warnings for inappropriate life-stage formulas
- **Nutri-Score integration** - Uses OpenFoodFacts Nutri-Score when available
- **Tab-based navigation** - Scan, History, and Settings tabs
- **Scan history** - Saves scanned products with timestamps
  - Favorite marking
  - Relative time display
- **Pet profiles** - Create profiles for your pets
  - Species and allergy tracking
  - Active pet selection for scoring
- **Dark mode** - Toggle dark theme in settings
- **Data export/import** - Backup and restore your data
- **Storage module** - Comprehensive localStorage persistence

## [1.0.0] - 2025-04-18

### Added

- Initial release of NicheFood PWA
- Barcode scanning with ZXing library (EAN-13, UPC-A, QR codes)
- Camera switching (front/back)
- Product lookup via OpenFoodFacts API
- Pet food quality scoring algorithm (0-100 scale)
- Quality factors: real meat detection, grain analysis, organic certification
- Negative scoring for by-products, sugars, artificial additives
- Service Worker for offline support
- PWA manifest for mobile installation
- Responsive mobile-first design
- Vibration feedback on successful scans
- Error handling for camera permissions and API failures

### Technical

- Vanilla JavaScript implementation (no frameworks)
- Progressive Web App architecture
- GitHub Pages deployment
