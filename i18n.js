/**
 * Internationalization (i18n) Module for NicheFood
 * Handles translations and language switching
 */

// ===== Translations =====
const translations = {
  en: {
    // App
    appName: 'NicheFood',
    tagline: 'Smart scans for healthier pets',

    // Navigation
    navScan: 'Scan',
    navHistory: 'History',
    navSettings: 'Settings',

    // Scanner
    startScanner: 'Start Scanner',
    stopScanner: 'Stop',
    switchCamera: 'Switch',
    analyzingProduct: 'Analyzing product...',

    // Results
    productInfo: 'Product Information',
    qualityAssessment: 'Quality Assessment',
    qualityScore: 'Quality Score',
    rating: 'Rating',
    analyzedFor: 'Analyzed for',
    cats: 'Cats',
    dogs: 'Dogs',
    brand: 'Brand',
    category: 'Category',
    ingredients: 'Ingredients',
    notAvailable: 'Not available',
    unknown: 'Unknown',
    nutriScore: 'Nutri-Score',

    // Quality ratings
    ratingExcellent: 'Excellent',
    ratingGood: 'Good',
    ratingAverage: 'Average',
    ratingPoor: 'Poor',

    // Assessment sections
    sectionGood: 'Good',
    sectionConcerns: 'Concerns',
    sectionAllergyAlert: 'Allergy Alert',
    sectionContainsAllergens: 'Contains Common Allergens',
    noQualityIndicators: 'No specific quality indicators found in ingredients list.',

    // Life stages
    lifeStagePuppy: 'Puppy',
    lifeStageKitten: 'Kitten',
    lifeStageSenior: 'Senior',
    lifeStageAdult: 'Adult',

    // History
    scanHistory: 'Scan History',
    noScansYet: 'No scans yet. Start scanning to build your history!',
    justNow: 'Just now',
    minutesAgo: '{n}m ago',
    hoursAgo: '{n}h ago',
    daysAgo: '{n}d ago',

    // Settings
    settings: 'Settings',
    myPets: 'My Pets',
    noPetsYet: 'No pets added yet.',
    addPet: '+ Add Pet',
    preferences: 'Preferences',
    darkMode: 'Dark Mode',
    vibrationFeedback: 'Vibration Feedback',
    language: 'Language',
    data: 'Data',
    exportData: 'Export Data',
    clearHistory: 'Clear History',
    clearHistoryConfirm: 'Are you sure you want to clear all scan history?',
    historyCleared: 'History cleared!',

    // Pet dialog
    petName: 'Pet name:',
    isCat: 'Is this a cat? (OK = Cat, Cancel = Dog)',

    // Onboarding
    onboardingWelcomeTitle: 'Welcome to NicheFood!',
    onboardingWelcomeText: 'Your smart companion for choosing the best food for your pets.',
    onboardingScanTitle: 'Scan Any Pet Food',
    onboardingScanText:
      'Point your camera at a barcode to instantly analyze ingredients and get a quality score.',
    onboardingPetsTitle: 'Add Your Pets',
    onboardingPetsText:
      'Create profiles for your pets to get personalized allergen warnings and species-specific analysis.',
    onboardingReadyTitle: "You're All Set!",
    onboardingReadyText: "Start scanning to discover what's really in your pet's food.",
    skip: 'Skip',
    next: 'Next',
    getStarted: 'Get Started',

    // Errors
    errorCameraTitle: 'Camera Error',
    errorPermissionTitle: 'Camera Access Denied',
    errorPermissionMessage: 'NicheFood needs camera access to scan barcodes.',
    errorNoCameraTitle: 'No Camera Found',
    errorNoCameraMessage: 'Could not detect a camera on this device.',
    errorInUseTitle: 'Camera In Use',
    errorInUseMessage: 'The camera is being used by another application.',
    errorNotFoundTitle: 'Product Not Found',
    errorNotFoundMessage: 'This product is not in the OpenFoodFacts database.',
    errorNetworkTitle: 'Connection Error',
    errorNetworkMessage: 'Could not connect to the product database.',
    errorTimeoutTitle: 'Request Timed Out',
    errorTimeoutMessage: 'The server took too long to respond.',
    errorGenericTitle: 'Something Went Wrong',
    whatYouCanTry: 'What you can try:',
    refreshPage: 'Refresh Page',
    addToDatabase: 'Add to Database',

    // Error suggestions
    suggestionCameraIcon: 'Click the camera icon in your browser address bar',
    suggestionBrowserSettings: 'Go to browser Settings → Privacy → Camera',
    suggestionAllowCamera: 'Allow camera access for this site, then refresh',
    suggestionCheckCamera: 'Make sure your device has a camera',
    suggestionOtherApp: 'Check if another app is using the camera',
    suggestionDifferentBrowser: 'Try using a different browser',
    suggestionCloseApps: 'Close other apps that might be using the camera',
    suggestionCloseTabs: 'Close other browser tabs with camera access',
    suggestionRestartBrowser: 'Restart your browser and try again',
    suggestionCheckBarcode: 'Double-check the barcode and try scanning again',
    suggestionNewProduct: 'The product may be new or region-specific',
    suggestionAddProduct: 'Consider adding it to OpenFoodFacts.org',
    suggestionCheckInternet: 'Check your internet connection',
    suggestionTryAgain: 'Try again in a few moments',
    suggestionServiceUnavailable: 'The service may be temporarily unavailable',
    suggestionScanAgain: 'Try scanning the barcode again',
    suggestionRefresh: 'Refresh the page and retry',
    suggestionBarcodeVisible: 'Check if the barcode is clearly visible',

    // Not pet food
    notPetFood: 'Not a pet food product',
    notPetFoodMessage: 'This product does not appear to be cat or dog food.',

    // Footer
    dataProvidedBy: 'Data provided by',
  },

  fr: {
    // App
    appName: 'NicheFood',
    tagline: 'Scans intelligents pour des animaux en meilleure santé',

    // Navigation
    navScan: 'Scanner',
    navHistory: 'Historique',
    navSettings: 'Paramètres',

    // Scanner
    startScanner: 'Démarrer le scan',
    stopScanner: 'Arrêter',
    switchCamera: 'Changer',
    analyzingProduct: 'Analyse du produit...',

    // Results
    productInfo: 'Informations produit',
    qualityAssessment: 'Évaluation qualité',
    qualityScore: 'Score qualité',
    rating: 'Note',
    analyzedFor: 'Analysé pour',
    cats: 'Chats',
    dogs: 'Chiens',
    brand: 'Marque',
    category: 'Catégorie',
    ingredients: 'Ingrédients',
    notAvailable: 'Non disponible',
    unknown: 'Inconnu',
    nutriScore: 'Nutri-Score',

    // Quality ratings
    ratingExcellent: 'Excellent',
    ratingGood: 'Bon',
    ratingAverage: 'Moyen',
    ratingPoor: 'Médiocre',

    // Assessment sections
    sectionGood: 'Points positifs',
    sectionConcerns: 'Points de vigilance',
    sectionAllergyAlert: 'Alerte allergie',
    sectionContainsAllergens: 'Contient des allergènes courants',
    noQualityIndicators:
      'Aucun indicateur de qualité spécifique trouvé dans la liste des ingrédients.',

    // Life stages
    lifeStagePuppy: 'Chiot',
    lifeStageKitten: 'Chaton',
    lifeStageSenior: 'Senior',
    lifeStageAdult: 'Adulte',

    // History
    scanHistory: 'Historique des scans',
    noScansYet: 'Aucun scan pour le moment. Commencez à scanner !',
    justNow: "À l'instant",
    minutesAgo: 'il y a {n}min',
    hoursAgo: 'il y a {n}h',
    daysAgo: 'il y a {n}j',

    // Settings
    settings: 'Paramètres',
    myPets: 'Mes animaux',
    noPetsYet: 'Aucun animal ajouté.',
    addPet: '+ Ajouter un animal',
    preferences: 'Préférences',
    darkMode: 'Mode sombre',
    vibrationFeedback: 'Vibration',
    language: 'Langue',
    data: 'Données',
    exportData: 'Exporter les données',
    clearHistory: "Effacer l'historique",
    clearHistoryConfirm: "Êtes-vous sûr de vouloir effacer tout l'historique ?",
    historyCleared: 'Historique effacé !',

    // Pet dialog
    petName: "Nom de l'animal :",
    isCat: 'Est-ce un chat ? (OK = Chat, Annuler = Chien)',

    // Onboarding
    onboardingWelcomeTitle: 'Bienvenue sur NicheFood !',
    onboardingWelcomeText:
      'Votre compagnon intelligent pour choisir la meilleure nourriture pour vos animaux.',
    onboardingScanTitle: 'Scannez toute nourriture',
    onboardingScanText:
      'Pointez votre caméra vers un code-barres pour analyser instantanément les ingrédients et obtenir un score de qualité.',
    onboardingPetsTitle: 'Ajoutez vos animaux',
    onboardingPetsText:
      "Créez des profils pour vos animaux afin d'obtenir des alertes allergènes personnalisées.",
    onboardingReadyTitle: 'Vous êtes prêt !',
    onboardingReadyText:
      'Commencez à scanner pour découvrir ce que contient vraiment la nourriture de votre animal.',
    skip: 'Passer',
    next: 'Suivant',
    getStarted: 'Commencer',

    // Errors
    errorCameraTitle: 'Erreur caméra',
    errorPermissionTitle: 'Accès caméra refusé',
    errorPermissionMessage:
      "NicheFood a besoin d'accéder à la caméra pour scanner les codes-barres.",
    errorNoCameraTitle: 'Aucune caméra trouvée',
    errorNoCameraMessage: 'Impossible de détecter une caméra sur cet appareil.',
    errorInUseTitle: "Caméra en cours d'utilisation",
    errorInUseMessage: 'La caméra est utilisée par une autre application.',
    errorNotFoundTitle: 'Produit non trouvé',
    errorNotFoundMessage: "Ce produit n'est pas dans la base de données OpenFoodFacts.",
    errorNetworkTitle: 'Erreur de connexion',
    errorNetworkMessage: 'Impossible de se connecter à la base de données.',
    errorTimeoutTitle: 'Délai dépassé',
    errorTimeoutMessage: 'Le serveur a mis trop de temps à répondre.',
    errorGenericTitle: "Une erreur s'est produite",
    whatYouCanTry: 'Ce que vous pouvez essayer :',
    refreshPage: 'Actualiser la page',
    addToDatabase: 'Ajouter à la base',

    // Error suggestions
    suggestionCameraIcon: "Cliquez sur l'icône caméra dans la barre d'adresse",
    suggestionBrowserSettings: 'Allez dans Paramètres → Confidentialité → Caméra',
    suggestionAllowCamera: "Autorisez l'accès caméra pour ce site, puis actualisez",
    suggestionCheckCamera: 'Vérifiez que votre appareil a une caméra',
    suggestionOtherApp: 'Vérifiez si une autre application utilise la caméra',
    suggestionDifferentBrowser: 'Essayez un autre navigateur',
    suggestionCloseApps: 'Fermez les autres applications utilisant la caméra',
    suggestionCloseTabs: 'Fermez les autres onglets avec accès caméra',
    suggestionRestartBrowser: 'Redémarrez votre navigateur et réessayez',
    suggestionCheckBarcode: 'Vérifiez le code-barres et réessayez',
    suggestionNewProduct: 'Le produit est peut-être nouveau ou régional',
    suggestionAddProduct: "Pensez à l'ajouter sur OpenFoodFacts.org",
    suggestionCheckInternet: 'Vérifiez votre connexion internet',
    suggestionTryAgain: 'Réessayez dans quelques instants',
    suggestionServiceUnavailable: 'Le service est peut-être temporairement indisponible',
    suggestionScanAgain: 'Essayez de rescanner le code-barres',
    suggestionRefresh: 'Actualisez la page et réessayez',
    suggestionBarcodeVisible: 'Vérifiez que le code-barres est bien visible',

    // Not pet food
    notPetFood: "Ce n'est pas de la nourriture pour animaux",
    notPetFoodMessage: 'Ce produit ne semble pas être de la nourriture pour chats ou chiens.',

    // Footer
    dataProvidedBy: 'Données fournies par',
  },

  es: {
    // App
    appName: 'NicheFood',
    tagline: 'Escaneos inteligentes para mascotas más sanas',

    // Navigation
    navScan: 'Escanear',
    navHistory: 'Historial',
    navSettings: 'Ajustes',

    // Scanner
    startScanner: 'Iniciar escáner',
    stopScanner: 'Detener',
    switchCamera: 'Cambiar',
    analyzingProduct: 'Analizando producto...',

    // Results
    productInfo: 'Información del producto',
    qualityAssessment: 'Evaluación de calidad',
    qualityScore: 'Puntuación',
    rating: 'Calificación',
    analyzedFor: 'Analizado para',
    cats: 'Gatos',
    dogs: 'Perros',
    brand: 'Marca',
    category: 'Categoría',
    ingredients: 'Ingredientes',
    notAvailable: 'No disponible',
    unknown: 'Desconocido',
    nutriScore: 'Nutri-Score',

    // Quality ratings
    ratingExcellent: 'Excelente',
    ratingGood: 'Bueno',
    ratingAverage: 'Regular',
    ratingPoor: 'Malo',

    // Assessment sections
    sectionGood: 'Positivo',
    sectionConcerns: 'Preocupaciones',
    sectionAllergyAlert: 'Alerta de alergia',
    sectionContainsAllergens: 'Contiene alérgenos comunes',
    noQualityIndicators:
      'No se encontraron indicadores de calidad específicos en la lista de ingredientes.',

    // Life stages
    lifeStagePuppy: 'Cachorro',
    lifeStageKitten: 'Gatito',
    lifeStageSenior: 'Senior',
    lifeStageAdult: 'Adulto',

    // History
    scanHistory: 'Historial de escaneos',
    noScansYet: '¡Aún no hay escaneos. Empieza a escanear!',
    justNow: 'Ahora mismo',
    minutesAgo: 'hace {n}min',
    hoursAgo: 'hace {n}h',
    daysAgo: 'hace {n}d',

    // Settings
    settings: 'Ajustes',
    myPets: 'Mis mascotas',
    noPetsYet: 'Aún no hay mascotas.',
    addPet: '+ Añadir mascota',
    preferences: 'Preferencias',
    darkMode: 'Modo oscuro',
    vibrationFeedback: 'Vibración',
    language: 'Idioma',
    data: 'Datos',
    exportData: 'Exportar datos',
    clearHistory: 'Borrar historial',
    clearHistoryConfirm: '¿Seguro que quieres borrar todo el historial?',
    historyCleared: '¡Historial borrado!',

    // Pet dialog
    petName: 'Nombre de la mascota:',
    isCat: '¿Es un gato? (OK = Gato, Cancelar = Perro)',

    // Onboarding
    onboardingWelcomeTitle: '¡Bienvenido a NicheFood!',
    onboardingWelcomeText:
      'Tu compañero inteligente para elegir la mejor comida para tus mascotas.',
    onboardingScanTitle: 'Escanea cualquier alimento',
    onboardingScanText:
      'Apunta tu cámara a un código de barras para analizar ingredientes y obtener una puntuación.',
    onboardingPetsTitle: 'Añade tus mascotas',
    onboardingPetsText:
      'Crea perfiles para tus mascotas para recibir alertas de alérgenos personalizadas.',
    onboardingReadyTitle: '¡Todo listo!',
    onboardingReadyText:
      'Empieza a escanear para descubrir qué contiene realmente la comida de tu mascota.',
    skip: 'Saltar',
    next: 'Siguiente',
    getStarted: 'Empezar',

    // Errors
    errorCameraTitle: 'Error de cámara',
    errorPermissionTitle: 'Acceso a cámara denegado',
    errorPermissionMessage:
      'NicheFood necesita acceso a la cámara para escanear códigos de barras.',
    errorNoCameraTitle: 'No se encontró cámara',
    errorNoCameraMessage: 'No se pudo detectar una cámara en este dispositivo.',
    errorInUseTitle: 'Cámara en uso',
    errorInUseMessage: 'La cámara está siendo usada por otra aplicación.',
    errorNotFoundTitle: 'Producto no encontrado',
    errorNotFoundMessage: 'Este producto no está en la base de datos de OpenFoodFacts.',
    errorNetworkTitle: 'Error de conexión',
    errorNetworkMessage: 'No se pudo conectar a la base de datos.',
    errorTimeoutTitle: 'Tiempo agotado',
    errorTimeoutMessage: 'El servidor tardó demasiado en responder.',
    errorGenericTitle: 'Algo salió mal',
    whatYouCanTry: 'Lo que puedes intentar:',
    refreshPage: 'Actualizar página',
    addToDatabase: 'Añadir a la base',

    // Error suggestions
    suggestionCameraIcon: 'Haz clic en el icono de cámara en la barra de direcciones',
    suggestionBrowserSettings: 'Ve a Ajustes → Privacidad → Cámara',
    suggestionAllowCamera: 'Permite el acceso a la cámara para este sitio y actualiza',
    suggestionCheckCamera: 'Asegúrate de que tu dispositivo tiene cámara',
    suggestionOtherApp: 'Comprueba si otra app está usando la cámara',
    suggestionDifferentBrowser: 'Prueba con otro navegador',
    suggestionCloseApps: 'Cierra otras apps que puedan usar la cámara',
    suggestionCloseTabs: 'Cierra otras pestañas con acceso a cámara',
    suggestionRestartBrowser: 'Reinicia el navegador e intenta de nuevo',
    suggestionCheckBarcode: 'Verifica el código de barras e intenta de nuevo',
    suggestionNewProduct: 'El producto puede ser nuevo o regional',
    suggestionAddProduct: 'Considera añadirlo a OpenFoodFacts.org',
    suggestionCheckInternet: 'Comprueba tu conexión a internet',
    suggestionTryAgain: 'Intenta de nuevo en unos momentos',
    suggestionServiceUnavailable: 'El servicio puede estar temporalmente no disponible',
    suggestionScanAgain: 'Intenta escanear el código de barras de nuevo',
    suggestionRefresh: 'Actualiza la página e intenta de nuevo',
    suggestionBarcodeVisible: 'Comprueba que el código de barras sea visible',

    // Not pet food
    notPetFood: 'No es comida para mascotas',
    notPetFoodMessage: 'Este producto no parece ser comida para gatos o perros.',

    // Footer
    dataProvidedBy: 'Datos proporcionados por',
  },

  de: {
    // App
    appName: 'NicheFood',
    tagline: 'Intelligente Scans für gesündere Haustiere',

    // Navigation
    navScan: 'Scannen',
    navHistory: 'Verlauf',
    navSettings: 'Einstellungen',

    // Scanner
    startScanner: 'Scanner starten',
    stopScanner: 'Stopp',
    switchCamera: 'Wechseln',
    analyzingProduct: 'Produkt wird analysiert...',

    // Results
    productInfo: 'Produktinformation',
    qualityAssessment: 'Qualitätsbewertung',
    qualityScore: 'Qualitätspunktzahl',
    rating: 'Bewertung',
    analyzedFor: 'Analysiert für',
    cats: 'Katzen',
    dogs: 'Hunde',
    brand: 'Marke',
    category: 'Kategorie',
    ingredients: 'Zutaten',
    notAvailable: 'Nicht verfügbar',
    unknown: 'Unbekannt',
    nutriScore: 'Nutri-Score',

    // Quality ratings
    ratingExcellent: 'Ausgezeichnet',
    ratingGood: 'Gut',
    ratingAverage: 'Durchschnittlich',
    ratingPoor: 'Schlecht',

    // Assessment sections
    sectionGood: 'Positiv',
    sectionConcerns: 'Bedenken',
    sectionAllergyAlert: 'Allergie-Warnung',
    sectionContainsAllergens: 'Enthält häufige Allergene',
    noQualityIndicators: 'Keine spezifischen Qualitätsindikatoren in der Zutatenliste gefunden.',

    // Life stages
    lifeStagePuppy: 'Welpe',
    lifeStageKitten: 'Kätzchen',
    lifeStageSenior: 'Senior',
    lifeStageAdult: 'Erwachsen',

    // History
    scanHistory: 'Scan-Verlauf',
    noScansYet: 'Noch keine Scans. Starten Sie jetzt!',
    justNow: 'Gerade eben',
    minutesAgo: 'vor {n}min',
    hoursAgo: 'vor {n}h',
    daysAgo: 'vor {n}T',

    // Settings
    settings: 'Einstellungen',
    myPets: 'Meine Haustiere',
    noPetsYet: 'Noch keine Haustiere hinzugefügt.',
    addPet: '+ Haustier hinzufügen',
    preferences: 'Einstellungen',
    darkMode: 'Dunkelmodus',
    vibrationFeedback: 'Vibration',
    language: 'Sprache',
    data: 'Daten',
    exportData: 'Daten exportieren',
    clearHistory: 'Verlauf löschen',
    clearHistoryConfirm: 'Möchten Sie wirklich den gesamten Verlauf löschen?',
    historyCleared: 'Verlauf gelöscht!',

    // Pet dialog
    petName: 'Name des Haustieres:',
    isCat: 'Ist es eine Katze? (OK = Katze, Abbrechen = Hund)',

    // Onboarding
    onboardingWelcomeTitle: 'Willkommen bei NicheFood!',
    onboardingWelcomeText: 'Ihr intelligenter Begleiter für die beste Tiernahrung.',
    onboardingScanTitle: 'Scannen Sie jedes Tierfutter',
    onboardingScanText:
      'Richten Sie Ihre Kamera auf einen Barcode, um Zutaten zu analysieren und eine Bewertung zu erhalten.',
    onboardingPetsTitle: 'Fügen Sie Ihre Haustiere hinzu',
    onboardingPetsText:
      'Erstellen Sie Profile für Ihre Haustiere für personalisierte Allergen-Warnungen.',
    onboardingReadyTitle: 'Alles bereit!',
    onboardingReadyText:
      'Beginnen Sie mit dem Scannen, um zu entdecken, was wirklich im Futter Ihres Haustieres steckt.',
    skip: 'Überspringen',
    next: 'Weiter',
    getStarted: 'Loslegen',

    // Errors
    errorCameraTitle: 'Kamerafehler',
    errorPermissionTitle: 'Kamerazugriff verweigert',
    errorPermissionMessage: 'NicheFood benötigt Kamerazugriff zum Scannen von Barcodes.',
    errorNoCameraTitle: 'Keine Kamera gefunden',
    errorNoCameraMessage: 'Auf diesem Gerät konnte keine Kamera erkannt werden.',
    errorInUseTitle: 'Kamera wird verwendet',
    errorInUseMessage: 'Die Kamera wird von einer anderen Anwendung verwendet.',
    errorNotFoundTitle: 'Produkt nicht gefunden',
    errorNotFoundMessage: 'Dieses Produkt ist nicht in der OpenFoodFacts-Datenbank.',
    errorNetworkTitle: 'Verbindungsfehler',
    errorNetworkMessage: 'Verbindung zur Datenbank konnte nicht hergestellt werden.',
    errorTimeoutTitle: 'Zeitüberschreitung',
    errorTimeoutMessage: 'Der Server hat zu lange gebraucht.',
    errorGenericTitle: 'Etwas ist schiefgelaufen',
    whatYouCanTry: 'Was Sie versuchen können:',
    refreshPage: 'Seite aktualisieren',
    addToDatabase: 'Zur Datenbank hinzufügen',

    // Error suggestions
    suggestionCameraIcon: 'Klicken Sie auf das Kamera-Symbol in der Adressleiste',
    suggestionBrowserSettings: 'Gehen Sie zu Einstellungen → Datenschutz → Kamera',
    suggestionAllowCamera: 'Erlauben Sie den Kamerazugriff für diese Seite und aktualisieren Sie',
    suggestionCheckCamera: 'Stellen Sie sicher, dass Ihr Gerät eine Kamera hat',
    suggestionOtherApp: 'Prüfen Sie, ob eine andere App die Kamera verwendet',
    suggestionDifferentBrowser: 'Versuchen Sie einen anderen Browser',
    suggestionCloseApps: 'Schließen Sie andere Apps, die die Kamera verwenden könnten',
    suggestionCloseTabs: 'Schließen Sie andere Tabs mit Kamerazugriff',
    suggestionRestartBrowser: 'Starten Sie Ihren Browser neu und versuchen Sie es erneut',
    suggestionCheckBarcode: 'Überprüfen Sie den Barcode und versuchen Sie es erneut',
    suggestionNewProduct: 'Das Produkt ist möglicherweise neu oder regional',
    suggestionAddProduct: 'Erwägen Sie, es auf OpenFoodFacts.org hinzuzufügen',
    suggestionCheckInternet: 'Überprüfen Sie Ihre Internetverbindung',
    suggestionTryAgain: 'Versuchen Sie es in ein paar Momenten erneut',
    suggestionServiceUnavailable: 'Der Dienst ist möglicherweise vorübergehend nicht verfügbar',
    suggestionScanAgain: 'Versuchen Sie, den Barcode erneut zu scannen',
    suggestionRefresh: 'Aktualisieren Sie die Seite und versuchen Sie es erneut',
    suggestionBarcodeVisible: 'Stellen Sie sicher, dass der Barcode gut sichtbar ist',

    // Not pet food
    notPetFood: 'Kein Tierfutter',
    notPetFoodMessage: 'Dieses Produkt scheint kein Katzen- oder Hundefutter zu sein.',

    // Footer
    dataProvidedBy: 'Daten bereitgestellt von',
  },
};

// ===== Supported Languages =====
const SUPPORTED_LANGUAGES = {
  en: { name: 'English', nativeName: 'English', dir: 'ltr' },
  fr: { name: 'French', nativeName: 'Français', dir: 'ltr' },
  es: { name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  de: { name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
};

// RTL languages (for future support)
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// ===== State =====
let currentLanguage = 'en';

// ===== Core Functions =====

/**
 * Detect browser language
 * @returns {string} Language code (en, fr, es, de)
 */
function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage || 'en';
  const langCode = browserLang.split('-')[0].toLowerCase();
  return SUPPORTED_LANGUAGES[langCode] ? langCode : 'en';
}

/**
 * Get current language
 * @returns {string} Current language code
 */
function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Set language
 * @param {string} lang - Language code
 */
function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES[lang]) {
    console.warn(`Language "${lang}" not supported, falling back to English`);
    lang = 'en';
  }

  currentLanguage = lang;

  // Update document direction for RTL languages
  const dir = SUPPORTED_LANGUAGES[lang]?.dir || 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;

  // Dispatch event for UI updates
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
}

/**
 * Translate a key
 * @param {string} key - Translation key
 * @param {Object} params - Optional parameters for interpolation
 * @returns {string} Translated string
 */
function t(key, params = {}) {
  const langTranslations = translations[currentLanguage] || translations.en;
  let text = langTranslations[key] || translations.en[key] || key;

  // Handle interpolation (e.g., {n} for numbers)
  for (const [param, value] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
  }

  return text;
}

/**
 * Get all supported languages
 * @returns {Object} Supported languages info
 */
function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES;
}

/**
 * Check if language is RTL
 * @param {string} lang - Language code
 * @returns {boolean} True if RTL
 */
function isRTL(lang) {
  return RTL_LANGUAGES.includes(lang);
}

/**
 * Initialize i18n with saved or detected language
 * @param {string} savedLanguage - Previously saved language preference
 */
function initI18n(savedLanguage) {
  const lang = savedLanguage || detectBrowserLanguage();
  setLanguage(lang);
}

// ===== Exports =====
export {
  t,
  setLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
  detectBrowserLanguage,
  isRTL,
  initI18n,
  SUPPORTED_LANGUAGES,
  RTL_LANGUAGES,
};

// For browser global access
if (typeof window !== 'undefined') {
  window.NicheFoodI18n = {
    t,
    setLanguage,
    getCurrentLanguage,
    getSupportedLanguages,
    detectBrowserLanguage,
    isRTL,
    initI18n,
    SUPPORTED_LANGUAGES,
  };
}
