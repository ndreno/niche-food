# NicheFood - Milestones & Roadmap

A roadmap for improving the pet food scanner PWA.

---

## Milestone 1: Enhanced Scoring Algorithm

Improve the quality assessment to provide more nuanced and useful analysis.

- [x] Add detection for specific harmful ingredients (BHA, BHT, ethoxyquin, propylene glycol)
- [x] Implement protein source quality ranking (fresh meat > meat meal > by-products)
- [x] Add grain-free diet detection and scoring option
- [x] Create species-specific scoring rules (cats vs dogs have different nutritional needs)
- [x] Add life-stage considerations (puppy/kitten, adult, senior)
- [x] Integrate Nutri-Score data when available from OpenFoodFacts
- [x] Add allergen detection and warnings (common allergens: chicken, beef, dairy, wheat)
- [x] Weight scoring factors based on ingredient list position

---

## Milestone 2: User Preferences & Profiles

Allow users to personalize the app for their pets.

- [x] Implement localStorage for persisting user data
- [x] Create pet profile system (name, species, breed, age, weight)
- [x] Add dietary restriction settings (grain-free, limited ingredient, allergies)
- [x] Save scan history with timestamps
- [x] Add favorites/watchlist for products
- [ ] Implement product comparison feature
- [x] Add notes functionality for scanned products
- [x] Create export/import for user data backup

---

## Milestone 3: Internationalization (i18n)

Add multi-language support for broader reach.

- [x] Extract all UI strings to a translation file
- [x] Implement language detection from browser settings
- [x] Add French translation (fr)
- [x] Add Spanish translation (es)
- [x] Add German translation (de)
- [x] Create language switcher in UI
- [x] Translate quality assessment explanations
- [x] Handle RTL languages support structure

---

## Milestone 4: UX Improvements

Enhance the user experience and interface.

- [x] Add scan history view with recent products
- [ ] Implement product detail modal with full ingredient breakdown
- [x] Add loading skeleton/animations during API calls
- [x] Improve error messages with actionable suggestions
- [ ] Add haptic feedback patterns for different scan results
- [x] Create onboarding flow for first-time users
- [ ] Add share functionality for product results
- [x] Implement dark mode support
- [ ] Add sound feedback option for successful scans
- [ ] Create visual ingredient breakdown (charts/graphs)

---

## Milestone 5: Technical Debt & Quality

Improve code quality, documentation, and maintainability.

- [x] Add MIT LICENSE file
- [x] Create CONTRIBUTING.md with guidelines
- [ ] Add actual app screenshots to README
- [x] Set up basic unit tests for scoring algorithm
- [ ] Add integration tests for API calls
- [ ] Implement error tracking/logging
- [ ] Add performance monitoring
- [ ] Create JSDoc comments for main functions
- [x] Set up linting (ESLint) and formatting (Prettier)
- [x] Add GitHub Actions for CI/CD
- [x] Create CHANGELOG.md for version tracking

---

## Milestone 6: Advanced Features (Future)

Long-term improvements and new capabilities.

- [ ] Add manual barcode entry for damaged labels
- [ ] Implement offline product database for common items
- [ ] Add price tracking integration
- [ ] Create community ratings/reviews system
- [ ] Add veterinarian-approved badges for products
- [ ] Implement recall alerts integration
- [ ] Add store locator for recommended products
- [ ] Create browser extension for online shopping

---

## Priority Legend

When working on tasks, consider this priority:

1. **High Impact, Low Effort** - Technical debt basics (LICENSE, tests)
2. **High Impact, Medium Effort** - Enhanced scoring, UX improvements
3. **Medium Impact, Medium Effort** - User preferences, i18n
4. **Future Consideration** - Advanced features

---

_Last updated: February 2026_
