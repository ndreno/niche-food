/**
 * Storage Module for NicheFood
 * Handles localStorage persistence for user preferences, pet profiles, and scan history
 */

const STORAGE_KEYS = {
  PETS: 'nichefood_pets',
  SCAN_HISTORY: 'nichefood_history',
  SETTINGS: 'nichefood_settings',
};

const MAX_HISTORY_ITEMS = 50;

// ===== Helper Functions =====

/**
 * Safely get data from localStorage
 */
function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Safely set data in localStorage
 */
function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    return false;
  }
}

/**
 * Generate unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===== Pet Profiles =====

/**
 * Get all pet profiles
 * @returns {Array} Array of pet profiles
 */
function getPets() {
  return getStorageItem(STORAGE_KEYS.PETS, []);
}

/**
 * Get a specific pet by ID
 * @param {string} petId - Pet ID
 * @returns {Object|null} Pet profile or null
 */
function getPetById(petId) {
  const pets = getPets();
  return pets.find((pet) => pet.id === petId) || null;
}

/**
 * Add a new pet profile
 * @param {Object} petData - Pet data (name, species, breed, birthDate, allergies)
 * @returns {Object} Created pet profile with ID
 */
function addPet(petData) {
  const pets = getPets();
  const newPet = {
    id: generateId(),
    name: petData.name || 'My Pet',
    species: petData.species || 'dog', // 'dog' or 'cat'
    breed: petData.breed || '',
    birthDate: petData.birthDate || null,
    weight: petData.weight || null,
    allergies: petData.allergies || [],
    dietaryRestrictions: petData.dietaryRestrictions || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  pets.push(newPet);
  setStorageItem(STORAGE_KEYS.PETS, pets);
  return newPet;
}

/**
 * Update a pet profile
 * @param {string} petId - Pet ID to update
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated pet or null if not found
 */
function updatePet(petId, updates) {
  const pets = getPets();
  const index = pets.findIndex((pet) => pet.id === petId);

  if (index === -1) {
    return null;
  }

  pets[index] = {
    ...pets[index],
    ...updates,
    id: petId, // Prevent ID override
    updatedAt: new Date().toISOString(),
  };

  setStorageItem(STORAGE_KEYS.PETS, pets);
  return pets[index];
}

/**
 * Delete a pet profile
 * @param {string} petId - Pet ID to delete
 * @returns {boolean} Success status
 */
function deletePet(petId) {
  const pets = getPets();
  const filtered = pets.filter((pet) => pet.id !== petId);

  if (filtered.length === pets.length) {
    return false; // Not found
  }

  setStorageItem(STORAGE_KEYS.PETS, filtered);
  return true;
}

/**
 * Get the active/selected pet
 * @returns {Object|null} Active pet or first pet or null
 */
function getActivePet() {
  const settings = getSettings();
  const pets = getPets();

  if (settings.activePetId) {
    const activePet = pets.find((pet) => pet.id === settings.activePetId);
    if (activePet) {
      return activePet;
    }
  }

  return pets[0] || null;
}

/**
 * Set the active pet
 * @param {string} petId - Pet ID to set as active
 */
function setActivePet(petId) {
  updateSettings({ activePetId: petId });
}

// ===== Scan History =====

/**
 * Get scan history
 * @param {number} limit - Max items to return (default: all)
 * @returns {Array} Array of scan history items
 */
function getScanHistory(limit = MAX_HISTORY_ITEMS) {
  const history = getStorageItem(STORAGE_KEYS.SCAN_HISTORY, []);
  return history.slice(0, limit);
}

/**
 * Add a scan to history
 * @param {Object} scanData - Scan data (barcode, product, assessment)
 * @returns {Object} Created history item
 */
function addScanToHistory(scanData) {
  const history = getStorageItem(STORAGE_KEYS.SCAN_HISTORY, []);

  const historyItem = {
    id: generateId(),
    barcode: scanData.barcode,
    productName: scanData.product?.product_name || 'Unknown Product',
    productBrand: scanData.product?.brands || '',
    productImage: scanData.product?.image_small_url || scanData.product?.image_url || null,
    score: scanData.assessment?.score || null,
    rating: scanData.assessment?.rating || null,
    species: scanData.assessment?.species || null,
    lifeStage: scanData.assessment?.lifeStage || null,
    petId: scanData.petId || null,
    isFavorite: false,
    notes: '',
    scannedAt: new Date().toISOString(),
  };

  // Add to beginning (most recent first)
  history.unshift(historyItem);

  // Limit history size
  const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
  setStorageItem(STORAGE_KEYS.SCAN_HISTORY, trimmedHistory);

  return historyItem;
}

/**
 * Toggle favorite status of a scan
 * @param {string} scanId - Scan history ID
 * @returns {boolean|null} New favorite status or null if not found
 */
function toggleFavorite(scanId) {
  const history = getStorageItem(STORAGE_KEYS.SCAN_HISTORY, []);
  const index = history.findIndex((item) => item.id === scanId);

  if (index === -1) {
    return null;
  }

  history[index].isFavorite = !history[index].isFavorite;
  setStorageItem(STORAGE_KEYS.SCAN_HISTORY, history);
  return history[index].isFavorite;
}

/**
 * Add notes to a scan
 * @param {string} scanId - Scan history ID
 * @param {string} notes - Notes text
 * @returns {boolean} Success status
 */
function updateScanNotes(scanId, notes) {
  const history = getStorageItem(STORAGE_KEYS.SCAN_HISTORY, []);
  const index = history.findIndex((item) => item.id === scanId);

  if (index === -1) {
    return false;
  }

  history[index].notes = notes;
  setStorageItem(STORAGE_KEYS.SCAN_HISTORY, history);
  return true;
}

/**
 * Delete a scan from history
 * @param {string} scanId - Scan history ID
 * @returns {boolean} Success status
 */
function deleteScan(scanId) {
  const history = getStorageItem(STORAGE_KEYS.SCAN_HISTORY, []);
  const filtered = history.filter((item) => item.id !== scanId);

  if (filtered.length === history.length) {
    return false;
  }

  setStorageItem(STORAGE_KEYS.SCAN_HISTORY, filtered);
  return true;
}

/**
 * Get favorite scans only
 * @returns {Array} Array of favorite scan items
 */
function getFavorites() {
  const history = getStorageItem(STORAGE_KEYS.SCAN_HISTORY, []);
  return history.filter((item) => item.isFavorite);
}

/**
 * Clear all scan history
 * @returns {boolean} Success status
 */
function clearHistory() {
  return setStorageItem(STORAGE_KEYS.SCAN_HISTORY, []);
}

// ===== Settings =====

/**
 * Get user settings
 * @returns {Object} Settings object
 */
function getSettings() {
  return getStorageItem(STORAGE_KEYS.SETTINGS, {
    activePetId: null,
    darkMode: false,
    soundEnabled: false,
    vibrationEnabled: true,
    onboardingComplete: false,
    language: null, // null = auto-detect from browser
  });
}

/**
 * Check if onboarding is complete
 * @returns {boolean} Whether onboarding has been completed
 */
function isOnboardingComplete() {
  const settings = getSettings();
  return settings.onboardingComplete === true;
}

/**
 * Mark onboarding as complete
 */
function completeOnboarding() {
  updateSettings({ onboardingComplete: true });
}

/**
 * Update settings
 * @param {Object} updates - Settings to update
 * @returns {Object} Updated settings
 */
function updateSettings(updates) {
  const settings = getSettings();
  const newSettings = { ...settings, ...updates };
  setStorageItem(STORAGE_KEYS.SETTINGS, newSettings);
  return newSettings;
}

// ===== Data Export/Import =====

/**
 * Export all user data
 * @returns {Object} All stored data
 */
function exportData() {
  return {
    pets: getPets(),
    scanHistory: getScanHistory(MAX_HISTORY_ITEMS),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };
}

/**
 * Import user data
 * @param {Object} data - Data to import
 * @returns {boolean} Success status
 */
function importData(data) {
  try {
    if (data.pets) {
      setStorageItem(STORAGE_KEYS.PETS, data.pets);
    }
    if (data.scanHistory) {
      setStorageItem(STORAGE_KEYS.SCAN_HISTORY, data.scanHistory);
    }
    if (data.settings) {
      setStorageItem(STORAGE_KEYS.SETTINGS, data.settings);
    }
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

/**
 * Clear all stored data
 * @returns {boolean} Success status
 */
function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.PETS);
    localStorage.removeItem(STORAGE_KEYS.SCAN_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
}

// ===== Exports =====
export {
  // Pet Profiles
  getPets,
  getPetById,
  addPet,
  updatePet,
  deletePet,
  getActivePet,
  setActivePet,
  // Scan History
  getScanHistory,
  addScanToHistory,
  toggleFavorite,
  updateScanNotes,
  deleteScan,
  getFavorites,
  clearHistory,
  // Settings
  getSettings,
  updateSettings,
  isOnboardingComplete,
  completeOnboarding,
  // Data Management
  exportData,
  importData,
  clearAllData,
  // Constants
  STORAGE_KEYS,
  MAX_HISTORY_ITEMS,
};

// For browser global access
if (typeof window !== 'undefined') {
  window.NicheFoodStorage = {
    getPets,
    getPetById,
    addPet,
    updatePet,
    deletePet,
    getActivePet,
    setActivePet,
    getScanHistory,
    addScanToHistory,
    toggleFavorite,
    updateScanNotes,
    deleteScan,
    getFavorites,
    clearHistory,
    getSettings,
    updateSettings,
    isOnboardingComplete,
    completeOnboarding,
    exportData,
    importData,
    clearAllData,
  };
}
