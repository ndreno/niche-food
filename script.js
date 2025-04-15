// DOM Elements
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const scannerElement = document.getElementById('scanner');
const canvasElement = document.getElementById('canvas');
const resultContainer = document.getElementById('resultContainer');
const productInfoElement = document.getElementById('productInfo');
const qualityScoreElement = document.getElementById('qualityScore');
const qualityDetailsElement = document.getElementById('qualityDetails');
const loadingElement = document.getElementById('loading');
let currentDeviceId = null;
let facingMode = "environment"; // Default to rear camera
let videoDevices = [];

// Initialize barcode scanner
const codeReader = new ZXing.BrowserMultiFormatReader();
let scannerActive = false;

// Start scanner
startButton.addEventListener('click', () => {
    startScanner();
});

// Stop scanner
stopButton.addEventListener('click', () => {
    stopScanner();
});

document.getElementById('switchCamera').addEventListener('click', switchCamera);

async function switchCamera() {
    if (!scannerActive || videoDevices.length < 2) return;

    // Stop current stream
    codeReader.reset();

    // Toggle facing mode
    facingMode = facingMode === "environment" ? "user" : "environment";

    // Find next camera
    const currentIndex = videoDevices.findIndex(device => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    currentDeviceId = videoDevices[nextIndex].deviceId;

    // Update video class
    if (facingMode === "environment") {
        scannerElement.classList.remove('user');
        scannerElement.classList.add('environment');
    } else {
        scannerElement.classList.remove('environment');
        scannerElement.classList.add('user');
    }

    await startScanner();
}

async function startScanner() {
    try {
        scannerActive = true;
        startButton.disabled = true;
        stopButton.disabled = false;
        switchCamera.disabled = false;
        resultContainer.style.display = 'none';

        // Get all video devices
        videoDevices = await codeReader.listVideoInputDevices();

        // Try to find rear camera first
        currentDeviceId = findPreferredCamera();

        await codeReader.decodeFromVideoDevice(
            currentDeviceId,
            scannerElement,
            (result, error) => {
                if (result && scannerActive) {
                    stopScanner();
                    fetchProductData(result.text);
                }
                if (error && !(error instanceof ZXing.NotFoundException)) {
                    console.error(error);
                }
            }
        );

    } catch (error) {
        console.error(error);
        alert('Camera error: ' + error.message);
        stopScanner();
    }
}

function findPreferredCamera() {
    // Try to find rear camera (environment-facing)
    const rearCamera = videoDevices.find(device =>
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('rear') ||
        (device.getCapabilities && device.getCapabilities().facingMode === 'environment')
    );

    return rearCamera?.deviceId || videoDevices[0]?.deviceId;
}

function stopScanner() {
    scannerActive = false;
    codeReader.reset();
    startButton.disabled = false;
    stopButton.disabled = true;
    console.log('Scanner stopped');
}

async function fetchProductData(barcode) {
    try {
        loadingElement.style.display = 'block';

        // Fetch product data from OpenFoodFacts
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();

        if (data.status === 0) {
            throw new Error('Product not found in OpenFoodFacts database');
        }

        console.log('Product data:', data);
        displayProductInfo(data.product);

        // Check if it's pet food
        const isPetFood = checkIfPetFood(data.product);

        if (!isPetFood) {
            qualityScoreElement.innerHTML = '<span style="color: #e74c3c;">Not a pet food product</span>';
            qualityDetailsElement.textContent = 'This product does not appear to be cat or dog food.';
            return;
        }

        // Assess quality
        const assessment = assessPetFoodQuality(data.product);
        displayQualityAssessment(assessment);

    } catch (error) {
        console.error('Error fetching product data:', error);
        productInfoElement.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
        loadingElement.style.display = 'none';
        resultContainer.style.display = 'block';
    }
}

function displayProductInfo(product) {
    productInfoElement.innerHTML = `
        <div class="product-header">
            <h3>${product.product_name || 'Unknown Product'}</h3>
            <img src="${product.image_url || ''}" alt="Product image" style="max-width: 200px; max-height: 200px;">
        </div>
        <p><strong>Brand:</strong> ${product.brands || 'Unknown'}</p>
        <p><strong>Category:</strong> ${product.categories || 'Unknown'}</p>
        <p><strong>Ingredients:</strong> ${product.ingredients_text || 'Not available'}</p>
        ${product.nutriscore_data ? `<p><strong>Nutri-Score:</strong> ${product.nutriscore_data.grade || 'Not available'}</p>` : ''}
    `;
}

function checkIfPetFood(product) {
    // Check categories and product name for pet food indicators
    const petKeywords = ['cat', 'dog', 'pet', 'animal', 'kitten', 'puppy', 'feline', 'canine'];
    const category = (product.categories || '').toLowerCase();
    const productName = (product.product_name || '').toLowerCase();

    return petKeywords.some(keyword =>
        category.includes(keyword) || productName.includes(keyword)
    );
}

function assessPetFoodQuality(product) {
    // Basic quality assessment algorithm
    // You can expand this with more sophisticated rules

    let score = 50; // Base score
    let details = [];

    // Check ingredients
    const ingredients = (product.ingredients_text || '').toLowerCase();

    // Positive factors
    if (ingredients.includes('meat') || ingredients.includes('chicken') || ingredients.includes('fish')) {
        score += 15;
        details.push('✓ Contains real meat');
    }

    if (ingredients.includes('whole grain') || ingredients.includes('brown rice')) {
        score += 10;
        details.push('✓ Contains whole grains');
    }

    if (!ingredients.includes('artificial') && !ingredients.includes('preservative')) {
        score += 10;
        details.push('✓ No artificial preservatives');
    }

    // Negative factors
    if (ingredients.includes('by-product')) {
        score -= 15;
        details.push('✗ Contains meat by-products');
    }

    if (ingredients.includes('corn syrup') || ingredients.includes('sugar')) {
        score -= 10;
        details.push('✗ Contains added sugars');
    }

    if (ingredients.includes('artificial color') || ingredients.includes('dye')) {
        score -= 10;
        details.push('✗ Contains artificial colors');
    }

    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));

    // Determine quality rating
    let rating;
    if (score >= 80) rating = 'Excellent';
    else if (score >= 60) rating = 'Good';
    else if (score >= 40) rating = 'Average';
    else rating = 'Poor';

    return {
        score,
        rating,
        details
    };
}

function displayQualityAssessment(assessment) {
    // Set color based on score
    let color;
    if (assessment.score >= 80) color = '#27ae60';
    else if (assessment.score >= 60) color = '#f39c12';
    else color = '#e74c3c';

    qualityScoreElement.innerHTML = `
        Quality Score: <span style="color: ${color};">${assessment.score}/100</span><br>
        Rating: <span style="color: ${color};">${assessment.rating}</span>
    `;

    qualityDetailsElement.innerHTML = `
        <h4>Assessment Details:</h4>
        <ul>${assessment.details.map(detail => `<li>${detail}</li>`).join('')}</ul>
    `;
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}