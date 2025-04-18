// ===== DOM Elements =====
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const switchCameraBtn = document.getElementById('switchCamera');
const scannerElement = document.getElementById('scanner');
const resultContainer = document.getElementById('resultContainer');
const productInfoElement = document.getElementById('productInfo');
const qualityScoreElement = document.getElementById('qualityScore');
const qualityDetailsElement = document.getElementById('qualityDetails');
const loadingElement = document.getElementById('loading');

// ===== Global Variables =====
let currentDeviceId = null;
let facingMode = "environment"; // Default to rear camera
let videoDevices = [];
let scannerActive = false;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const codeReader = new ZXing.BrowserMultiFormatReader();

// ===== Scanner Configuration =====
const SCANNER_CONFIG = {
    formats: [
        ZXing.BarcodeFormat.EAN_13,
        ZXing.BarcodeFormat.UPC_A,
        ZXing.BarcodeFormat.QR_CODE
    ],
    hints: new Map([
        [ZXing.DecodeHintType.TRY_HARDER, true],
        [ZXing.DecodeHintType.POSSIBLE_FORMATS, [
            ZXing.BarcodeFormat.EAN_13,
            ZXing.BarcodeFormat.UPC_A
        ]]
    ]),
    constraints: {
        video: {
            width: { ideal: isMobile ? 1920 : 1280 },
            height: { ideal: isMobile ? 1080 : 720 },
            facingMode: { ideal: 'environment' }
        }
    }
};

// ===== Event Listeners =====
startButton.addEventListener('click', startScanner);
stopButton.addEventListener('click', stopScanner);
switchCameraBtn.addEventListener('click', switchCamera);

// ===== Core Scanner Functions =====
async function startScanner() {
    try {
        scannerActive = true;
        toggleUIState(true);
        resultContainer.style.display = 'none';
        loadingElement.style.display = 'none';

        // Get and select camera
        videoDevices = await codeReader.listVideoInputDevices();
        currentDeviceId = findPreferredCamera();

        // Apply mobile-specific constraints
        const constraints = getOptimalConstraints();

        await codeReader.decodeFromVideoDevice(
            currentDeviceId,
            scannerElement,
            handleScanResult,
            {
                ...SCANNER_CONFIG,
                constraints: constraints
            }
        );

        console.log('Scanner started with device:', currentDeviceId);
    } catch (error) {
        console.error('Scanner error:', error);
        handleScannerError(error);
    }
}

function stopScanner() {
    if (!scannerActive) return;

    scannerActive = false;
    codeReader.reset();
    toggleUIState(false);
    console.log('Scanner stopped');
}

async function switchCamera() {
    if (!scannerActive || videoDevices.length < 2) return;

    try {
        stopScanner();

        // Cycle to next camera
        const currentIndex = videoDevices.findIndex(device => device.deviceId === currentDeviceId);
        const nextIndex = (currentIndex + 1) % videoDevices.length;
        currentDeviceId = videoDevices[nextIndex].deviceId;
        facingMode = facingMode === "environment" ? "user" : "environment";

        // Update camera class
        scannerElement.className = facingMode;

        await startScanner();
    } catch (error) {
        console.error('Camera switch error:', error);
        alert('Failed to switch camera: ' + error.message);
    }
}

// ===== Helper Functions =====
function findPreferredCamera() {
    // Prefer rear-facing camera
    const rearCamera = videoDevices.find(device =>
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('rear') ||
        (device.getCapabilities && device.getCapabilities().facingMode === 'environment')
    );

    return rearCamera?.deviceId || videoDevices[0]?.deviceId;
}

function getOptimalConstraints() {
    return {
        video: {
            width: { ideal: isMobile ? 1920 : 1280 },
            height: { ideal: isMobile ? 1080 : 720 },
            facingMode: { ideal: facingMode },
            ...(isMobile && {
                focusMode: 'continuous',
                exposureMode: 'continuous'
            })
        }
    };
}

function toggleUIState(scanning) {
    startButton.disabled = scanning;
    stopButton.disabled = !scanning;
    switchCameraBtn.disabled = !scanning || videoDevices.length < 2;
}

function handleScanResult(result, error) {
    if (result && scannerActive) {
        if (isMobile && navigator.vibrate) {
            navigator.vibrate(100); // Tactile feedback
        }
        stopScanner();
        fetchProductData(result.text);
    }

    if (error && !(error instanceof ZXing.NotFoundException)) {
        console.error('Scan error:', error);
    }
}

function handleScannerError(error) {
    stopScanner();

    // User-friendly error messages
    const message = error.message.includes('Permission')
        ? 'Camera access was denied. Please enable camera permissions.'
        : error.message.includes('NotFound')
            ? 'No camera devices found.'
            : 'Camera error: ' + error.message;

    alert(message);
}

// ===== Product Data Functions =====
async function fetchProductData(barcode) {
    try {
        loadingElement.style.display = 'block';

        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();

        if (data.status === 0) {
            throw new Error('Product not found in database');
        }

        displayProductInfo(data.product);

        if (!checkIfPetFood(data.product)) {
            showNotPetFoodMessage();
            return;
        }

        const assessment = assessPetFoodQuality(data.product);
        displayQualityAssessment(assessment);

    } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message);
    } finally {
        loadingElement.style.display = 'none';
        resultContainer.style.display = 'block';
    }
}

function displayProductInfo(product) {
    productInfoElement.innerHTML = `
    <div class="product-header">
      <h3>${product.product_name || 'Unknown Product'}</h3>
      ${product.image_url ? `<img src="${product.image_url}" alt="Product" loading="lazy">` : ''}
    </div>
    <p><strong>Brand:</strong> ${product.brands || 'Unknown'}</p>
    <p><strong>Category:</strong> ${product.categories || 'Unknown'}</p>
    <p><strong>Ingredients:</strong> ${product.ingredients_text || 'Not available'}</p>
    ${product.nutriscore_data ? `<p><strong>Nutri-Score:</strong> ${product.nutriscore_data.grade || 'N/A'}</p>` : ''}
  `;
}

// ===== Quality Assessment Functions =====
function checkIfPetFood(product) {
    const petKeywords = ['cat', 'dog', 'pet', 'animal', 'kitten', 'puppy', 'feline', 'canine'];
    const textToCheck = [
        product.categories || '',
        product.product_name || '',
        product.generic_name || ''
    ].join(' ').toLowerCase();

    return petKeywords.some(keyword => textToCheck.includes(keyword));
}

function assessPetFoodQuality(product) {
    let score = 50;
    let details = [];
    const ingredients = (product.ingredients_text || '').toLowerCase();

    // Quality rules (expand as needed)
    const qualityRules = [
        { test: /(meat|chicken|fish|beef|lamb)/, score: +15, message: '✓ Contains real meat' },
        { test: /(whole grain|brown rice|oat)/, score: +10, message: '✓ Contains whole grains' },
        { test: /organic/, score: +10, message: '✓ Certified organic' },
        { test: /(by.?product|meal)/, score: -15, message: '✗ Contains meat by-products' },
        { test: /(corn syrup|sugar|fructose)/, score: -10, message: '✗ Contains added sugars' },
        { test: /(artificial|preservative)/, score: -10, message: '✗ Contains artificial additives' }
    ];

    qualityRules.forEach(rule => {
        if (rule.test.test(ingredients)) {
            score += rule.score;
            details.push(rule.message);
        }
    });

    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));

    // Determine rating
    let rating;
    if (score >= 80) rating = 'Excellent';
    else if (score >= 60) rating = 'Good';
    else if (score >= 40) rating = 'Average';
    else rating = 'Poor';

    return { score, rating, details };
}

function displayQualityAssessment(assessment) {
    const color = assessment.score >= 80 ? '#27ae60' :
        assessment.score >= 60 ? '#f39c12' : '#e74c3c';

    qualityScoreElement.innerHTML = `
    Quality Score: <span style="color: ${color};">${assessment.score}/100</span><br>
    Rating: <span style="color: ${color};">${assessment.rating}</span>
  `;

    qualityDetailsElement.innerHTML = `
    <h4>Assessment Details:</h4>
    <ul>${assessment.details.map(detail => `<li>${detail}</li>`).join('')}</ul>
  `;
}

function showNotPetFoodMessage() {
    qualityScoreElement.innerHTML = '<span style="color: #e74c3c;">Not a pet food product</span>';
    qualityDetailsElement.textContent = 'This product does not appear to be cat or dog food.';
}

function showError(message) {
    productInfoElement.innerHTML = `<p class="error">Error: ${message}</p>`;
}

// ===== PWA Initialization =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}