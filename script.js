// ===== Imports =====
import { assessPetFoodQuality, checkIfPetFood, detectSpecies, detectLifeStage } from './scoring.js';
import {
  addScanToHistory,
  getActivePet,
  getScanHistory,
  getSettings,
  isOnboardingComplete,
  completeOnboarding,
} from './storage.js';
import { t, setLanguage, getCurrentLanguage, initI18n } from './i18n.js';

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
const scanAnimation = document.querySelector('.scan-animation');
const videoWrapper = document.querySelector('.video-wrapper');

// ===== Utility Functions =====
function escapeHtml(str) {
  if (!str) {
    return '';
  }
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== Global Variables =====
let currentDeviceId = null;
let facingMode = 'environment'; // Default to rear camera
let videoDevices = [];
let scannerActive = false;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);
const codeReader = new ZXing.BrowserMultiFormatReader();

// ===== Scanner Configuration =====
const SCANNER_CONFIG = {
  formats: [ZXing.BarcodeFormat.EAN_13, ZXing.BarcodeFormat.UPC_A, ZXing.BarcodeFormat.QR_CODE],
  hints: new Map([
    [ZXing.DecodeHintType.TRY_HARDER, true],
    [
      ZXing.DecodeHintType.POSSIBLE_FORMATS,
      [ZXing.BarcodeFormat.EAN_13, ZXing.BarcodeFormat.UPC_A],
    ],
  ]),
  constraints: {
    video: {
      width: { ideal: isMobile ? 1920 : 1280 },
      height: { ideal: isMobile ? 1080 : 720 },
      facingMode: { ideal: 'environment' },
    },
  },
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

    // Show video area and resume scan animation
    if (videoWrapper) {
      videoWrapper.style.display = 'inline-block';
    }
    if (scanAnimation) {
      scanAnimation.classList.remove('paused');
    }

    // Get and select camera
    videoDevices = await codeReader.listVideoInputDevices();
    currentDeviceId = findPreferredCamera();

    // Apply mobile-specific constraints
    const constraints = getOptimalConstraints();

    await codeReader.decodeFromVideoDevice(currentDeviceId, scannerElement, handleScanResult, {
      ...SCANNER_CONFIG,
      constraints: constraints,
    });

    console.log('Scanner started with device:', currentDeviceId);
  } catch (error) {
    console.error('Scanner error:', error);
    handleScannerError(error);
  }
}

function stopScanner() {
  if (!scannerActive) {
    return;
  }

  scannerActive = false;
  codeReader.reset();
  toggleUIState(false);

  // Pause scan animation
  if (scanAnimation) {
    scanAnimation.classList.add('paused');
  }

  console.log('Scanner stopped');
}

async function switchCamera() {
  if (!scannerActive || videoDevices.length < 2) {
    return;
  }

  try {
    stopScanner();

    // Cycle to next camera
    const currentIndex = videoDevices.findIndex((device) => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    currentDeviceId = videoDevices[nextIndex].deviceId;
    facingMode = facingMode === 'environment' ? 'user' : 'environment';

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
  const rearCamera = videoDevices.find(
    (device) =>
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
        exposureMode: 'continuous',
      }),
    },
  };
}

function toggleUIState(scanning) {
  startButton.disabled = scanning;
  stopButton.disabled = !scanning;
  switchCameraBtn.disabled = !scanning || videoDevices.length < 2;
}

function handleScanResult(result, error) {
  if (result && scannerActive) {
    // Hide camera area
    if (videoWrapper) {
      videoWrapper.style.display = 'none';
    }
    if (scanAnimation) {
      scanAnimation.classList.add('paused');
    }

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

  let errorType = 'camera';
  let title = 'Camera Error';
  let message = error.message;
  let suggestions = [];

  if (error.message.includes('Permission') || error.message.includes('denied')) {
    errorType = 'permission';
    title = 'Camera Access Denied';
    message = 'NicheFood needs camera access to scan barcodes.';
    suggestions = [
      'Click the camera icon in your browser address bar',
      'Go to browser Settings → Privacy → Camera',
      'Allow camera access for this site, then refresh',
    ];
  } else if (error.message.includes('NotFound') || error.message.includes('no video')) {
    errorType = 'no-camera';
    title = 'No Camera Found';
    message = 'Could not detect a camera on this device.';
    suggestions = [
      'Make sure your device has a camera',
      'Check if another app is using the camera',
      'Try using a different browser',
    ];
  } else if (error.message.includes('NotReadable') || error.message.includes('in use')) {
    errorType = 'in-use';
    title = 'Camera In Use';
    message = 'The camera is being used by another application.';
    suggestions = [
      'Close other apps that might be using the camera',
      'Close other browser tabs with camera access',
      'Restart your browser and try again',
    ];
  } else {
    suggestions = [
      'Refresh the page and try again',
      'Try a different browser',
      'Check if your camera is working in other apps',
    ];
  }

  showErrorWithSuggestions(title, message, suggestions, errorType);
}

// ===== Product Data Functions =====
async function fetchProductData(barcode) {
  try {
    loadingElement.style.display = 'block';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await response.json();

    if (data.status === 0) {
      throw new Error('Product not found in database');
    }

    displayProductInfo(data.product);

    if (!checkIfPetFood(data.product)) {
      showNotPetFoodMessage();
      return;
    }

    // Get active pet's allergies for scoring
    const activePet = getActivePet();
    const assessmentOptions = {};
    if (activePet) {
      assessmentOptions.allergies = activePet.allergies || [];
      assessmentOptions.species = activePet.species;
    }

    const assessment = assessPetFoodQuality(data.product, assessmentOptions);
    displayQualityAssessment(assessment);

    // Save to scan history
    try {
      addScanToHistory({
        barcode,
        product: data.product,
        assessment,
        petId: activePet?.id || null,
      });
    } catch (historyError) {
      console.warn('Could not save to history:', historyError);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    showError(error.name === 'AbortError' ? 'Request timed out' : error.message);
  } finally {
    loadingElement.style.display = 'none';
    resultContainer.style.display = 'block';
  }
}

function displayProductInfo(product) {
  const species = detectSpecies(product);
  const lifeStage = detectLifeStage(product);

  const speciesEmoji = species === 'cat' ? '🐱' : species === 'dog' ? '🐕' : '';
  const lifeStageLabel =
    {
      puppy: '🐶 Puppy',
      kitten: '🐱 Kitten',
      senior: '👴 Senior',
      adult: '🐾 Adult',
    }[lifeStage] || '';

  const labelParts = [speciesEmoji, lifeStageLabel].filter(Boolean);
  const productLabel = labelParts.length > 0 ? ` (${labelParts.join(' ')})` : '';

  productInfoElement.innerHTML = `
    <div class="product-header">
      <h3>${escapeHtml(product.product_name) || 'Unknown Product'}${escapeHtml(productLabel)}</h3>
      ${product.image_url ? `<img src="${escapeHtml(product.image_url)}" alt="Product" loading="lazy">` : ''}
    </div>
    <p><strong>Brand:</strong> ${escapeHtml(product.brands) || 'Unknown'}</p>
    <p><strong>Category:</strong> ${escapeHtml(product.categories) || 'Unknown'}</p>
    <p><strong>Ingredients:</strong> ${escapeHtml(product.ingredients_text) || 'Not available'}</p>
    ${product.nutriscore_data ? `<p><strong>Nutri-Score:</strong> ${escapeHtml(product.nutriscore_data.grade) || 'N/A'}</p>` : ''}
  `;
}

// ===== Quality Assessment Display =====
function displayQualityAssessment(assessment) {
  const color = assessment.score >= 80 ? '#27ae60' : assessment.score >= 60 ? '#f39c12' : '#e74c3c';

  // Build score display
  qualityScoreElement.innerHTML = `
    <div class="score-main">
      Quality Score: <span style="color: ${color}; font-size: 1.5em;">${assessment.score}/100</span>
    </div>
    <div class="score-rating">
      Rating: <span style="color: ${color}; font-weight: bold;">${assessment.rating}</span>
    </div>
    ${assessment.species ? `<div class="score-species">Analyzed for: ${assessment.species === 'cat' ? '🐱 Cats' : '🐕 Dogs'}${assessment.lifeStage && assessment.lifeStage !== 'adult' ? ` (${assessment.lifeStage})` : ''}</div>` : ''}
  `;

  // Build details with sections
  let detailsHtml = '';

  // Positives
  if (assessment.positives && assessment.positives.length > 0) {
    detailsHtml += `
      <div class="assessment-section positives">
        <h4>✓ Good</h4>
        <ul>${assessment.positives.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
    `;
  }

  // Warnings
  if (assessment.warnings && assessment.warnings.length > 0) {
    detailsHtml += `
      <div class="assessment-section warnings">
        <h4>⚠️ Concerns</h4>
        <ul>${assessment.warnings.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
    `;
  }

  // Allergy warnings
  if (assessment.allergyWarnings && assessment.allergyWarnings.length > 0) {
    detailsHtml += `
      <div class="assessment-section allergies">
        <h4>🚨 Allergy Alert</h4>
        <ul>${assessment.allergyWarnings.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
    `;
  }

  // Detected allergens info
  if (assessment.detectedAllergens && assessment.detectedAllergens.length > 0) {
    detailsHtml += `
      <div class="assessment-section allergens-info">
        <h4>ℹ️ Contains Common Allergens</h4>
        <p>${assessment.detectedAllergens.join(', ')}</p>
      </div>
    `;
  }

  // Fallback if no details
  if (!detailsHtml) {
    detailsHtml = '<p>No specific quality indicators found in ingredients list.</p>';
  }

  qualityDetailsElement.innerHTML = detailsHtml;
}

function showNotPetFoodMessage() {
  qualityScoreElement.innerHTML = '<span style="color: #e74c3c;">Not a pet food product</span>';
  qualityDetailsElement.textContent = 'This product does not appear to be cat or dog food.';
}

function showError(message) {
  let title = 'Something Went Wrong';
  let suggestions = [];
  let errorType = 'generic';

  if (message.includes('not found') || message.includes('Product not found')) {
    errorType = 'not-found';
    title = 'Product Not Found';
    message = 'This product is not in the OpenFoodFacts database.';
    suggestions = [
      'Double-check the barcode and try scanning again',
      'The product may be new or region-specific',
      'Consider adding it to OpenFoodFacts.org',
    ];
  } else if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('Failed to fetch')
  ) {
    errorType = 'network';
    title = 'Connection Error';
    message = 'Could not connect to the product database.';
    suggestions = [
      'Check your internet connection',
      'Try again in a few moments',
      'The service may be temporarily unavailable',
    ];
  } else if (message.includes('timeout')) {
    errorType = 'timeout';
    title = 'Request Timed Out';
    message = 'The server took too long to respond.';
    suggestions = [
      'Check your internet connection',
      'Try scanning again',
      'The server may be experiencing high traffic',
    ];
  } else {
    suggestions = [
      'Try scanning the barcode again',
      'Refresh the page and retry',
      'Check if the barcode is clearly visible',
    ];
  }

  showErrorWithSuggestions(title, message, suggestions, errorType);
}

function showErrorWithSuggestions(title, message, suggestions, errorType) {
  const icons = {
    permission: '🔒',
    'no-camera': '📷',
    'in-use': '⚠️',
    'not-found': '🔍',
    network: '📡',
    timeout: '⏱️',
    camera: '📷',
    generic: '❌',
  };

  const icon = icons[errorType] || icons.generic;

  productInfoElement.innerHTML = `
    <div class="error-container">
      <div class="error-icon">${icon}</div>
      <div class="error-title">${title}</div>
      <div class="error-message">${message}</div>
      <div class="error-suggestion">
        <div class="error-suggestion-title">What you can try:</div>
        <ul class="error-suggestion-list">
          ${suggestions.map((s) => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      <div class="error-actions">
        <button class="btn" onclick="location.reload()">Refresh Page</button>
        ${errorType === 'not-found' ? '<a href="https://world.openfoodfacts.org/cgi/product.pl" target="_blank" rel="noopener" class="btn btn-secondary">Add to Database</a>' : ''}
      </div>
    </div>
  `;

  qualityScoreElement.innerHTML = '';
  qualityDetailsElement.innerHTML = '';
}

// ===== Tab Navigation =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;

    // Update buttons
    tabButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    // Update content
    tabContents.forEach((content) => {
      content.classList.remove('active');
      if (content.id === `${targetTab}Tab`) {
        content.classList.add('active');
        // Load content when tab is shown
        if (targetTab === 'history') {
          renderHistory();
        } else if (targetTab === 'settings') {
          renderSettings();
        }
      }
    });
  });
});

// ===== History Display =====
function renderHistory() {
  const historyList = document.getElementById('historyList');
  const history = getScanHistory();

  if (history.length === 0) {
    historyList.innerHTML = `<p class="empty-state">${t('noScansYet')}</p>`;
    return;
  }

  historyList.innerHTML = history
    .map(
      (item) => `
    <div class="history-item" data-id="${escapeHtml(item.id)}">
      ${item.productImage ? `<img src="${escapeHtml(item.productImage)}" alt="${escapeHtml(item.productName)}">` : '<div class="history-item-img-placeholder"></div>'}
      <div class="history-item-info">
        <div class="history-item-name">${escapeHtml(item.productName)}</div>
        <div class="history-item-meta">
          ${item.productBrand ? escapeHtml(item.productBrand) + ' • ' : ''}${formatDate(item.scannedAt)}
        </div>
      </div>
      ${item.score !== null ? `<div class="history-item-score ${escapeHtml(item.rating?.toLowerCase()) || ''}">${item.score}</div>` : ''}
      <button class="favorite-btn ${item.isFavorite ? 'active' : ''}" data-id="${escapeHtml(item.id)}">
        ${item.isFavorite ? '⭐' : '☆'}
      </button>
    </div>
  `
    )
    .join('');

  // Add favorite button handlers
  historyList.querySelectorAll('.favorite-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const scanId = btn.dataset.id;
      import('./storage.js').then((storage) => {
        storage.toggleFavorite(scanId);
        renderHistory();
      });
    });
  });
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return t('justNow');
  }
  if (diffMins < 60) {
    return t('minutesAgo', { n: diffMins });
  }
  if (diffHours < 24) {
    return t('hoursAgo', { n: diffHours });
  }
  if (diffDays < 7) {
    return t('daysAgo', { n: diffDays });
  }
  return date.toLocaleDateString(getCurrentLanguage());
}

// ===== Settings Display =====
function renderSettings() {
  const settings = getSettings();

  // Language selector
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.value = getCurrentLanguage();
    languageSelect.onchange = () => {
      import('./storage.js').then((storage) => {
        storage.updateSettings({ language: languageSelect.value });
        setLanguage(languageSelect.value);
        updateUITranslations();
      });
    };
  }

  // Dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.checked = settings.darkMode;
    darkModeToggle.onchange = () => {
      import('./storage.js').then((storage) => {
        storage.updateSettings({ darkMode: darkModeToggle.checked });
        applyDarkMode(darkModeToggle.checked);
      });
    };
  }

  // Vibration toggle
  const vibrationToggle = document.getElementById('vibrationToggle');
  if (vibrationToggle) {
    vibrationToggle.checked = settings.vibrationEnabled !== false;
    vibrationToggle.onchange = () => {
      import('./storage.js').then((storage) => {
        storage.updateSettings({ vibrationEnabled: vibrationToggle.checked });
      });
    };
  }

  // Clear history button
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  if (clearHistoryBtn) {
    clearHistoryBtn.onclick = () => {
      if (confirm(t('clearHistoryConfirm'))) {
        import('./storage.js').then((storage) => {
          storage.clearHistory();
          alert(t('historyCleared'));
        });
      }
    };
  }

  // Export data button
  const exportDataBtn = document.getElementById('exportDataBtn');
  if (exportDataBtn) {
    exportDataBtn.onclick = () => {
      import('./storage.js').then((storage) => {
        const data = storage.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nichefood-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    };
  }

  // Render pets list
  renderPetsList();
}

function renderPetsList() {
  import('./storage.js').then((storage) => {
    const petsList = document.getElementById('petsList');
    const pets = storage.getPets();
    const activePet = storage.getActivePet();

    if (pets.length === 0) {
      petsList.innerHTML = `<p class="empty-state">${t('noPetsYet')}</p>`;
      return;
    }

    petsList.innerHTML = pets
      .map(
        (pet) => `
      <div class="pet-item ${activePet?.id === pet.id ? 'active' : ''}" data-id="${escapeHtml(pet.id)}">
        <span class="pet-item-icon">${pet.species === 'cat' ? '🐱' : '🐕'}</span>
        <div class="pet-item-info">
          <div class="pet-item-name">${escapeHtml(pet.name)}</div>
          <div class="pet-item-details">
            ${escapeHtml(pet.breed || pet.species)}
            ${pet.allergies?.length ? ' • ' + pet.allergies.length + ' allergies' : ''}
          </div>
        </div>
      </div>
    `
      )
      .join('');

    // Add click to set active
    petsList.querySelectorAll('.pet-item').forEach((item) => {
      item.addEventListener('click', () => {
        storage.setActivePet(item.dataset.id);
        renderPetsList();
      });
    });
  });
}

function applyDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// ===== Add Pet Button =====
const addPetBtn = document.getElementById('addPetBtn');
if (addPetBtn) {
  addPetBtn.addEventListener('click', () => {
    const name = prompt('Pet name:');
    if (!name) {
      return;
    }

    const species = confirm('Is this a cat? (OK = Cat, Cancel = Dog)') ? 'cat' : 'dog';

    import('./storage.js').then((storage) => {
      storage.addPet({ name, species });
      renderPetsList();
    });
  });
}

// ===== Initialize =====
function initApp() {
  // Apply saved settings
  const settings = getSettings();
  applyDarkMode(settings.darkMode);

  // Initialize i18n with saved language or browser detection
  initI18n(settings.language);
  updateUITranslations();

  // Listen for language changes
  window.addEventListener('languagechange', () => {
    updateUITranslations();
  });

  // Show onboarding for first-time users
  if (!isOnboardingComplete()) {
    showOnboarding();
  }
}

// ===== UI Translation =====
function updateUITranslations() {
  // Update elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update specific static elements
  const tagline = document.querySelector('.tagline');
  if (tagline) {
    tagline.textContent = t('tagline');
  }

  // Update tab buttons
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach((btn) => {
    const tab = btn.dataset.tab;
    if (tab === 'scanner') {
      btn.innerHTML = `📷 ${t('navScan')}`;
    } else if (tab === 'history') {
      btn.innerHTML = `📋 ${t('navHistory')}`;
    } else if (tab === 'settings') {
      btn.innerHTML = `⚙️ ${t('navSettings')}`;
    }
  });

  // Update scanner buttons
  if (startButton) {
    startButton.innerHTML = `📷 ${t('startScanner')}`;
  }
  if (stopButton) {
    stopButton.innerHTML = `⏹️ ${t('stopScanner')}`;
  }
  if (switchCameraBtn) {
    switchCameraBtn.innerHTML = `🔄 ${t('switchCamera')}`;
  }

  // Update section headers
  const productInfoHeader = document.querySelector('#resultContainer section:first-child h2');
  if (productInfoHeader) {
    productInfoHeader.textContent = t('productInfo');
  }
  const qualityHeader = document.querySelector('.quality-assessment h2');
  if (qualityHeader) {
    qualityHeader.textContent = t('qualityAssessment');
  }

  // Update loading text
  const loadingText = document.querySelector('.loading-text');
  if (loadingText) {
    loadingText.textContent = t('analyzingProduct');
  }

  // Update history section
  const historyHeader = document.querySelector('.history-section h2');
  if (historyHeader) {
    historyHeader.textContent = t('scanHistory');
  }

  // Update settings section
  const settingsHeader = document.querySelector('.settings-section > h2');
  if (settingsHeader) {
    settingsHeader.textContent = t('settings');
  }

  // Update settings groups
  const settingsGroups = document.querySelectorAll('.settings-group h3');
  settingsGroups.forEach((h3) => {
    const text = h3.textContent.toLowerCase();
    if (text.includes('pet')) {
      h3.textContent = t('myPets');
    } else if (text.includes('data')) {
      h3.textContent = t('data');
    }
  });

  // Update add pet button
  const addPetBtn = document.getElementById('addPetBtn');
  if (addPetBtn) {
    addPetBtn.textContent = t('addPet');
  }

  // Update data buttons
  const exportBtn = document.getElementById('exportDataBtn');
  if (exportBtn) {
    exportBtn.textContent = t('exportData');
  }
  const clearBtn = document.getElementById('clearHistoryBtn');
  if (clearBtn) {
    clearBtn.textContent = t('clearHistory');
  }

  // Update footer
  const footer = document.querySelector('.app-footer p');
  if (footer) {
    footer.innerHTML = `${t('dataProvidedBy')} <a href="https://world.openfoodfacts.org/" target="_blank" rel="noopener">OpenFoodFacts</a>`;
  }

  // Update language selector to current language
  const langSelect = document.getElementById('languageSelect');
  if (langSelect) {
    langSelect.value = getCurrentLanguage();
  }
}

// ===== Onboarding =====
function showOnboarding() {
  const modal = document.getElementById('onboardingModal');
  if (!modal) {
    return;
  }

  modal.hidden = false;

  const slides = modal.querySelectorAll('.onboarding-slide');
  const dots = modal.querySelectorAll('.dot');
  const nextBtn = document.getElementById('onboardingNext');
  const skipBtn = document.getElementById('onboardingSkip');
  let currentSlide = 0;

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;

    // Update button text on last slide
    if (currentSlide === slides.length - 1) {
      nextBtn.textContent = 'Get Started';
      skipBtn.style.display = 'none';
    } else {
      nextBtn.textContent = 'Next';
      skipBtn.style.display = 'inline-block';
    }
  }

  function closeOnboarding() {
    modal.hidden = true;
    completeOnboarding();
  }

  nextBtn.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      closeOnboarding();
    }
  });

  skipBtn.addEventListener('click', closeOnboarding);

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.dataset.slide, 10);
      goToSlide(slideIndex);
    });
  });
}

initApp();

// ===== PWA Initialization =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch((err) => console.error('Service Worker registration failed:', err));
  });
}
