# NicheFood 🐾

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourusername/nichefood/pulls)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-blueviolet)

A Progressive Web App (PWA) that scans pet food barcodes, analyzes ingredients, and assesses quality using OpenFoodFacts API. Works offline and installable on any device!

**🌍 Bilingual Friendly (TODO)** | **📱 Mobile Optimized** | **🔍 Privacy-Focused**

👉 [Live Demo](https://ndreno.github.io/nichefood)  
📸 *Screenshot below!*

---

## Features

- **Barcode Scanner**: Camera-based scanning powered by ZXing
- **Pet Food Detection**: Identifies cat/dog food products automatically
- **Quality Algorithm**: Scores food based on ingredients and nutritional data
- **Offline Mode**: Works without internet after first load (PWA)
- **Lightweight**: No backend required (runs entirely in the browser)

---

## How It Works

1. **Scan** a pet food barcode
2. **Fetch** product data from [OpenFoodFacts](https://world.openfoodfacts.org/)
3. **Analyze** ingredients/nutrition with customizable rules
4. **Display** a quality score (0-100) and detailed breakdown

---

## Screenshots

| Scanner                                                                      | Results                                                                          | Offline                                                                          |
|------------------------------------------------------------------------------|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| ![Scanner](https://via.placeholder.com/300x500/4A6FA5/FFFFFF?text=Scan+Mode) | ![Results](https://via.placeholder.com/300x500/6ECCAF/000000?text=Quality+86%25) | ![Offline](https://via.placeholder.com/300x500/FF9F1C/FFFFFF?text=Offline+Ready) |

---

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Libraries**: [ZXing](https://github.com/zxing-js/library) (barcode scanning)
- **API**: [OpenFoodFacts](https://world.openfoodfacts.org/data)
- **PWA**: Service Workers, Web Manifest

---

## Getting Started

### Prerequisites
- Modern browser (Chrome/Firefox/Safari)
- GitHub Pages (for deployment)

### Installation
```bash
git clone https://github.com/ndreno/nichefood.git
cd nichefood
# Open index.html in your browser!
```

### Customizing Rules
Edit the `assessPetFoodQuality()` function in [`script.js`](script.js) to tweak scoring logic:
```javascript
// Example: Add points for organic ingredients
if (product.labels.includes('organic')) {
  score += 10;
  details.push('✓ Certified organic');
}
```

---

## Contributing

1. Fork the project
2. Create a branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a **Pull Request**

*See [CONTRIBUTING.md](CONTRIBUTING.md) for details.*

---

## License

Distributed under the **MIT License**.  
See [LICENSE](LICENSE) for more information.

---

## Acknowledgments

- [OpenFoodFacts](https://world.openfoodfacts.org/) for their open database
- [ZXing](https://github.com/zxing-js/library) for barcode scanning
- Icons from [Font Awesome](https://fontawesome.com/)

## Project structure

```text
├── index.html          # Main app HTML
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── styles.css          # CSS styles
└── script.js           # Main application logic
```
