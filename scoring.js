/**
 * Pet Food Quality Scoring Module
 * Analyzes pet food ingredients and provides quality assessments
 */

// ===== Harmful Ingredients Database =====
const HARMFUL_INGREDIENTS = {
  preservatives: {
    pattern: /\b(bha|bht|ethoxyquin|tbhq|propyl gallate)\b/i,
    score: -20,
    message: '⚠️ Contains potentially harmful preservatives',
    severity: 'high',
  },
  propyleneGlycol: {
    pattern: /\bpropylene glycol\b/i,
    score: -15,
    message: '⚠️ Contains propylene glycol (toxic to cats)',
    severity: 'high',
    species: ['cat'],
  },
  artificialColors: {
    pattern: /\b(red 40|yellow 5|yellow 6|blue 2|caramel color)\b/i,
    score: -10,
    message: '✗ Contains artificial colors',
    severity: 'medium',
  },
  addedSugars: {
    pattern: /\b(corn syrup|sugar|fructose|sucrose|dextrose|molasses)\b/i,
    score: -10,
    message: '✗ Contains added sugars',
    severity: 'medium',
  },
  cheapFillers: {
    pattern: /\b(corn gluten|wheat gluten|soy protein|cellulose)\b/i,
    score: -8,
    message: '✗ Contains cheap fillers',
    severity: 'low',
  },
  meatByProducts: {
    pattern: /\b(by-?products?|meat meal|bone meal|animal digest)\b/i,
    score: -15,
    message: '✗ Contains meat by-products or low-quality protein',
    severity: 'medium',
  },
};

// ===== Quality Ingredients Database =====
const QUALITY_INGREDIENTS = {
  freshMeat: {
    pattern: /\b(fresh |deboned |raw )?(chicken|turkey|beef|lamb|salmon|duck|venison|rabbit)\b/i,
    score: 15,
    message: '✓ Contains quality meat protein',
    priority: 1,
  },
  namedMeatMeal: {
    pattern: /\b(chicken|turkey|beef|lamb|salmon|duck|fish) meal\b/i,
    score: 8,
    message: '✓ Contains named meat meal',
    priority: 2,
  },
  wholeGrains: {
    pattern: /\b(whole grain|brown rice|oatmeal|barley|quinoa)\b/i,
    score: 8,
    message: '✓ Contains whole grains',
    priority: 3,
  },
  healthyFats: {
    pattern: /\b(salmon oil|fish oil|flaxseed|coconut oil|chicken fat)\b/i,
    score: 8,
    message: '✓ Contains healthy fats',
    priority: 3,
  },
  vegetables: {
    pattern: /\b(sweet potato|pumpkin|carrots?|peas|spinach|blueberr)/i,
    score: 6,
    message: '✓ Contains vegetables/fruits',
    priority: 4,
  },
  probiotics: {
    pattern: /\b(probiotics?|lactobacillus|bifidobacterium|dried fermentation)\b/i,
    score: 6,
    message: '✓ Contains probiotics for digestive health',
    priority: 4,
  },
  organic: {
    pattern: /\borganics?\b/i,
    score: 5,
    message: '✓ Contains organic ingredients',
    priority: 5,
  },
  grainFree: {
    pattern: /\bgrain.?free\b/i,
    score: 0, // Neutral - can be positive or negative depending on pet
    message: 'ℹ️ Grain-free formula',
    priority: 5,
    info: true,
  },
};

// ===== Common Allergens =====
const ALLERGENS = {
  chicken: /\bchicken\b/i,
  beef: /\bbeef\b/i,
  dairy: /\b(dairy|milk|cheese|lactose|whey)\b/i,
  wheat: /\bwheat\b/i,
  soy: /\bsoy\b/i,
  corn: /\bcorn\b/i,
  eggs: /\beggs?\b/i,
  fish: /\b(fish|salmon|tuna)\b/i,
};

// ===== Life Stage Requirements =====
const LIFE_STAGE_REQUIREMENTS = {
  puppy: {
    keywords: ['puppy', 'puppies', 'junior', 'growth', 'starter'],
    quality: {
      dha: {
        pattern: /\b(dha|docosahexaenoic)\b/i,
        score: 8,
        message: '✓ Contains DHA for brain development',
      },
      calcium: {
        pattern: /\bcalcium\b/i,
        score: 5,
        message: '✓ Contains calcium for bone growth',
      },
      highProtein: {
        pattern: /\b(high protein|protein.rich)\b/i,
        score: 5,
        message: '✓ High protein formula for growth',
      },
    },
    warnings: {
      lowCalorie: {
        pattern: /\b(low calorie|diet|weight management|light)\b/i,
        score: -10,
        message: '⚠️ Low-calorie formulas not ideal for growing puppies',
      },
    },
  },
  kitten: {
    keywords: ['kitten', 'kittens', 'junior', 'growth', 'starter'],
    quality: {
      dha: {
        pattern: /\b(dha|docosahexaenoic)\b/i,
        score: 8,
        message: '✓ Contains DHA for brain development',
      },
      highProtein: {
        pattern: /\b(high protein|protein.rich)\b/i,
        score: 5,
        message: '✓ High protein formula for growth',
      },
    },
    warnings: {
      lowCalorie: {
        pattern: /\b(low calorie|diet|weight management|light)\b/i,
        score: -10,
        message: '⚠️ Low-calorie formulas not ideal for growing kittens',
      },
    },
  },
  senior: {
    keywords: ['senior', 'mature', 'aged', '7+', '8+', '10+', '11+', 'older'],
    quality: {
      glucosamine: {
        pattern: /\b(glucosamine|chondroitin|joint)\b/i,
        score: 8,
        message: '✓ Contains joint support ingredients',
      },
      antioxidants: {
        pattern: /\b(antioxidant|vitamin e|vitamin c|selenium)\b/i,
        score: 5,
        message: '✓ Contains antioxidants for immune support',
      },
      easyDigest: {
        pattern: /\b(easy digest|sensitive|gentle)\b/i,
        score: 5,
        message: '✓ Easy-to-digest formula',
      },
    },
    warnings: {
      highFat: {
        pattern: /\b(high fat|extra energy)\b/i,
        score: -5,
        message: 'ℹ️ High-fat content may not be ideal for less active seniors',
      },
    },
  },
  adult: {
    keywords: ['adult', 'maintenance'],
    quality: {},
    warnings: {},
  },
};

// ===== Species-Specific Requirements =====
const SPECIES_REQUIREMENTS = {
  cat: {
    required: {
      taurine: {
        pattern: /\btaurine\b/i,
        score: 10,
        message: '✓ Contains taurine (essential for cats)',
        missingMessage: '⚠️ No taurine listed (essential for cats)',
        missingScore: -15,
      },
      animalProtein: {
        pattern: /\b(chicken|turkey|beef|lamb|salmon|duck|fish|meat)\b/i,
        score: 0,
        message: '',
        missingMessage: '⚠️ Cats require animal protein as primary ingredient',
        missingScore: -20,
      },
    },
    harmful: {
      onion: { pattern: /\bonions?\b/i, score: -25, message: '☠️ Contains onion (toxic to cats)' },
      garlic: {
        pattern: /\bgarlic\b/i,
        score: -15,
        message: '⚠️ Contains garlic (harmful to cats)',
      },
    },
  },
  dog: {
    required: {},
    harmful: {
      xylitol: {
        pattern: /\bxylitol\b/i,
        score: -30,
        message: '☠️ Contains xylitol (extremely toxic to dogs)',
      },
      grapes: {
        pattern: /\b(grapes?|raisins?)\b/i,
        score: -25,
        message: '☠️ Contains grapes/raisins (toxic to dogs)',
      },
      onion: {
        pattern: /\bonions?\b/i,
        score: -20,
        message: '⚠️ Contains onion (harmful to dogs)',
      },
      garlic: {
        pattern: /\bgarlic\b/i,
        score: -5,
        message: 'ℹ️ Contains garlic (small amounts may be okay for dogs)',
      },
    },
  },
};

// ===== Helper Functions =====

/**
 * Parse ingredients and determine their positions
 */
function parseIngredients(ingredientsText) {
  if (!ingredientsText) {
    return [];
  }
  return ingredientsText
    .toLowerCase()
    .split(/[,;]/)
    .map((ing, index) => ({
      text: ing.trim(),
      position: index + 1,
    }));
}

/**
 * Get position weight - first ingredients are more important
 */
function getPositionWeight(position, _totalIngredients) {
  if (position <= 3) {
    return 1.5; // First 3 ingredients are most important
  }
  if (position <= 5) {
    return 1.2;
  }
  if (position <= 10) {
    return 1.0;
  }
  return 0.7; // Later ingredients have less impact
}

/**
 * Detect species from product info
 */
function detectSpecies(product) {
  const text = [product.categories || '', product.product_name || '', product.generic_name || '']
    .join(' ')
    .toLowerCase();

  if (text.includes('cat') || text.includes('kitten') || text.includes('feline')) {
    return 'cat';
  }
  if (text.includes('dog') || text.includes('puppy') || text.includes('canine')) {
    return 'dog';
  }
  return null;
}

/**
 * Detect life stage from product info
 */
function detectLifeStage(product) {
  const text = [product.categories || '', product.product_name || '', product.generic_name || '']
    .join(' ')
    .toLowerCase();

  // Check each life stage's keywords
  for (const [stage, config] of Object.entries(LIFE_STAGE_REQUIREMENTS)) {
    if (config.keywords.some((keyword) => text.includes(keyword))) {
      return stage;
    }
  }

  return 'adult'; // Default to adult if not specified
}

/**
 * Detect allergens in ingredients
 */
function detectAllergens(ingredientsText) {
  const detected = [];
  const text = (ingredientsText || '').toLowerCase();

  for (const [allergen, pattern] of Object.entries(ALLERGENS)) {
    if (pattern.test(text)) {
      detected.push(allergen);
    }
  }

  return detected;
}

/**
 * Check if product is pet food
 */
function checkIfPetFood(product) {
  const petKeywords = ['cat', 'dog', 'pet', 'animal', 'kitten', 'puppy', 'feline', 'canine'];
  const textToCheck = [
    product.categories || '',
    product.product_name || '',
    product.generic_name || '',
  ]
    .join(' ')
    .toLowerCase();

  return petKeywords.some((keyword) => textToCheck.includes(keyword));
}

// ===== Main Scoring Function =====

/**
 * Assess pet food quality with comprehensive analysis
 * @param {Object} product - Product data from OpenFoodFacts
 * @param {Object} options - Optional settings
 * @param {string} options.species - 'cat' or 'dog' (auto-detected if not provided)
 * @param {string} options.lifeStage - 'puppy', 'kitten', 'adult', 'senior' (auto-detected if not provided)
 * @param {string[]} options.allergies - List of allergens to flag
 * @returns {Object} Assessment result
 */
function assessPetFoodQuality(product, options = {}) {
  let score = 50; // Base score
  const details = [];
  const warnings = [];
  const positives = [];
  const ingredientsText = product.ingredients_text || '';
  const ingredients = parseIngredients(ingredientsText);
  const totalIngredients = ingredients.length;

  // Detect or use provided species
  const species = options.species || detectSpecies(product);

  // Detect or use provided life stage
  const lifeStage = options.lifeStage || detectLifeStage(product);

  // Detect allergens
  const detectedAllergens = detectAllergens(ingredientsText);
  const userAllergies = options.allergies || [];

  // Check for harmful ingredients
  for (const [, rule] of Object.entries(HARMFUL_INGREDIENTS)) {
    if (rule.pattern.test(ingredientsText)) {
      // Check if species-specific
      if (rule.species && species && !rule.species.includes(species)) {
        continue;
      }

      // Find position for weight
      const matchedIng = ingredients.find((ing) => rule.pattern.test(ing.text));
      const weight = matchedIng ? getPositionWeight(matchedIng.position, totalIngredients) : 1;

      score += Math.round(rule.score * weight);
      warnings.push(rule.message);
    }
  }

  // Check for quality ingredients
  for (const [, rule] of Object.entries(QUALITY_INGREDIENTS)) {
    if (rule.pattern.test(ingredientsText)) {
      const matchedIng = ingredients.find((ing) => rule.pattern.test(ing.text));
      const weight = matchedIng ? getPositionWeight(matchedIng.position, totalIngredients) : 1;

      if (!rule.info) {
        score += Math.round(rule.score * weight);
      }
      if (rule.message) {
        positives.push(rule.message);
      }
    }
  }

  // Species-specific checks
  if (species && SPECIES_REQUIREMENTS[species]) {
    const speciesReqs = SPECIES_REQUIREMENTS[species];

    // Check required nutrients
    for (const [, rule] of Object.entries(speciesReqs.required)) {
      if (rule.pattern.test(ingredientsText)) {
        if (rule.message) {
          positives.push(rule.message);
        }
        score += rule.score;
      } else {
        warnings.push(rule.missingMessage);
        score += rule.missingScore;
      }
    }

    // Check harmful for species
    for (const [, rule] of Object.entries(speciesReqs.harmful)) {
      if (rule.pattern.test(ingredientsText)) {
        warnings.push(rule.message);
        score += rule.score;
      }
    }
  }

  // Life-stage specific checks
  if (lifeStage && LIFE_STAGE_REQUIREMENTS[lifeStage]) {
    const stageReqs = LIFE_STAGE_REQUIREMENTS[lifeStage];

    // Check quality ingredients for life stage
    if (stageReqs.quality) {
      for (const [, rule] of Object.entries(stageReqs.quality)) {
        if (rule.pattern.test(ingredientsText)) {
          positives.push(rule.message);
          score += rule.score;
        }
      }
    }

    // Check warnings for life stage
    if (stageReqs.warnings) {
      for (const [, rule] of Object.entries(stageReqs.warnings)) {
        if (rule.pattern.test(ingredientsText)) {
          warnings.push(rule.message);
          score += rule.score;
        }
      }
    }
  }

  // Integrate Nutri-Score if available
  let nutriScore = null;
  const rawNutriScore =
    product.nutriscore_grade || (product.nutriscore_data && product.nutriscore_data.grade);
  if (rawNutriScore) {
    nutriScore = rawNutriScore.toLowerCase();
    const nutriScoreBonus = {
      a: 10,
      b: 5,
      c: 0,
      d: -5,
      e: -10,
    };
    if (nutriScoreBonus[nutriScore] !== undefined) {
      score += nutriScoreBonus[nutriScore];
      if (nutriScore === 'a' || nutriScore === 'b') {
        positives.push(`✓ Good Nutri-Score (${nutriScore.toUpperCase()})`);
      } else if (nutriScore === 'd' || nutriScore === 'e') {
        warnings.push(`⚠️ Poor Nutri-Score (${nutriScore.toUpperCase()})`);
      }
    }
  }

  // Check user's allergy list
  const allergyWarnings = [];
  for (const allergy of userAllergies) {
    if (detectedAllergens.includes(allergy.toLowerCase())) {
      allergyWarnings.push(`⚠️ Contains ${allergy} (flagged allergen)`);
    }
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Determine rating
  let rating;
  if (score >= 80) {
    rating = 'Excellent';
  } else if (score >= 60) {
    rating = 'Good';
  } else if (score >= 40) {
    rating = 'Average';
  } else {
    rating = 'Poor';
  }

  // Combine details
  details.push(...positives, ...warnings, ...allergyWarnings);

  return {
    score,
    rating,
    details,
    warnings,
    positives,
    species,
    lifeStage,
    nutriScore,
    detectedAllergens,
    allergyWarnings,
    ingredientCount: totalIngredients,
  };
}

// ===== Exports =====
// For ES modules (testing with Vitest)
export {
  assessPetFoodQuality,
  checkIfPetFood,
  detectSpecies,
  detectLifeStage,
  detectAllergens,
  parseIngredients,
  getPositionWeight,
  HARMFUL_INGREDIENTS,
  QUALITY_INGREDIENTS,
  ALLERGENS,
  SPECIES_REQUIREMENTS,
  LIFE_STAGE_REQUIREMENTS,
};

// For browser global access (when loaded as regular script)
if (typeof window !== 'undefined') {
  window.PetFoodScoring = {
    assessPetFoodQuality,
    checkIfPetFood,
    detectSpecies,
    detectLifeStage,
    detectAllergens,
    HARMFUL_INGREDIENTS,
    QUALITY_INGREDIENTS,
    ALLERGENS,
    SPECIES_REQUIREMENTS,
    LIFE_STAGE_REQUIREMENTS,
  };
}
