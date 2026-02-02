import { describe, it, expect } from 'vitest';
import {
  assessPetFoodQuality,
  checkIfPetFood,
  detectSpecies,
  detectLifeStage,
  detectAllergens,
  parseIngredients,
  getPositionWeight,
} from './scoring.js';

describe('parseIngredients', () => {
  it('should parse comma-separated ingredients', () => {
    const result = parseIngredients('Chicken, Rice, Peas');
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ text: 'chicken', position: 1 });
    expect(result[1]).toEqual({ text: 'rice', position: 2 });
  });

  it('should handle semicolon separators', () => {
    const result = parseIngredients('Beef; Barley; Carrots');
    expect(result).toHaveLength(3);
  });

  it('should return empty array for null/undefined', () => {
    expect(parseIngredients(null)).toEqual([]);
    expect(parseIngredients(undefined)).toEqual([]);
    expect(parseIngredients('')).toEqual([]);
  });
});

describe('getPositionWeight', () => {
  it('should return higher weight for first ingredients', () => {
    expect(getPositionWeight(1, 20)).toBe(1.5);
    expect(getPositionWeight(3, 20)).toBe(1.5);
  });

  it('should return medium weight for middle ingredients', () => {
    expect(getPositionWeight(5, 20)).toBe(1.2);
    expect(getPositionWeight(8, 20)).toBe(1.0);
  });

  it('should return lower weight for later ingredients', () => {
    expect(getPositionWeight(15, 20)).toBe(0.7);
  });
});

describe('detectSpecies', () => {
  it('should detect cat food', () => {
    expect(detectSpecies({ categories: 'Cat food', product_name: 'Premium Cat Food' })).toBe('cat');
    expect(detectSpecies({ product_name: 'Kitten Formula' })).toBe('cat');
    expect(detectSpecies({ categories: 'Feline nutrition' })).toBe('cat');
  });

  it('should detect dog food', () => {
    expect(detectSpecies({ categories: 'Dog food', product_name: 'Premium Dog Food' })).toBe('dog');
    expect(detectSpecies({ product_name: 'Puppy Chow' })).toBe('dog');
    expect(detectSpecies({ categories: 'Canine nutrition' })).toBe('dog');
  });

  it('should return null for unknown species', () => {
    expect(detectSpecies({ product_name: 'Pet Food' })).toBe(null);
    expect(detectSpecies({})).toBe(null);
  });
});

describe('detectAllergens', () => {
  it('should detect common allergens', () => {
    const allergens = detectAllergens('Chicken, wheat, corn, soy protein');
    expect(allergens).toContain('chicken');
    expect(allergens).toContain('wheat');
    expect(allergens).toContain('corn');
    expect(allergens).toContain('soy');
  });

  it('should detect dairy allergens', () => {
    const allergens = detectAllergens('Beef, milk powder, cheese');
    expect(allergens).toContain('dairy');
    expect(allergens).toContain('beef');
  });

  it('should return empty array when no allergens', () => {
    const allergens = detectAllergens('Sweet potato, pumpkin, duck');
    expect(allergens).not.toContain('chicken');
    expect(allergens).not.toContain('wheat');
  });
});

describe('checkIfPetFood', () => {
  it('should identify cat food', () => {
    expect(checkIfPetFood({ categories: 'Cat food' })).toBe(true);
    expect(checkIfPetFood({ product_name: 'Whiskas Cat Food' })).toBe(true);
  });

  it('should identify dog food', () => {
    expect(checkIfPetFood({ categories: 'Dog food' })).toBe(true);
    expect(checkIfPetFood({ product_name: 'Pedigree Dog Food' })).toBe(true);
  });

  it('should reject non-pet food', () => {
    expect(checkIfPetFood({ categories: 'Breakfast cereals' })).toBe(false);
    expect(checkIfPetFood({ product_name: 'Cheerios' })).toBe(false);
  });
});

describe('assessPetFoodQuality', () => {
  describe('basic scoring', () => {
    it('should return base score of 50 for minimal product', () => {
      const result = assessPetFoodQuality({ ingredients_text: '' });
      expect(result.score).toBe(50);
      expect(result.rating).toBe('Average');
    });

    it('should increase score for quality meat', () => {
      const result = assessPetFoodQuality({
        ingredients_text: 'Fresh chicken, brown rice, peas',
      });
      expect(result.score).toBeGreaterThan(50);
      expect(result.positives).toContain('✓ Contains quality meat protein');
    });

    it('should decrease score for harmful ingredients', () => {
      const result = assessPetFoodQuality({
        ingredients_text: 'Meat by-products, corn syrup, BHA',
      });
      expect(result.score).toBeLessThan(50);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('harmful ingredient detection', () => {
    it('should detect BHA/BHT preservatives', () => {
      const result = assessPetFoodQuality({
        ingredients_text: 'Chicken, rice, BHA, BHT',
      });
      expect(result.warnings).toContain('⚠️ Contains potentially harmful preservatives');
    });

    it('should detect ethoxyquin', () => {
      const result = assessPetFoodQuality({
        ingredients_text: 'Fish meal (preserved with ethoxyquin)',
      });
      expect(result.warnings).toContain('⚠️ Contains potentially harmful preservatives');
    });

    it('should detect artificial colors', () => {
      const result = assessPetFoodQuality({
        ingredients_text: 'Chicken, rice, Red 40, Yellow 5',
      });
      expect(result.warnings).toContain('✗ Contains artificial colors');
    });

    it('should detect cheap fillers', () => {
      const result = assessPetFoodQuality({
        ingredients_text: 'Corn gluten meal, wheat gluten, soy protein',
      });
      expect(result.warnings).toContain('✗ Contains cheap fillers');
    });
  });

  describe('quality ingredient detection', () => {
    it('should detect whole grains', () => {
      const result = assessPetFoodQuality({
        ingredients_text: 'Chicken, brown rice, oatmeal, barley',
      });
      expect(result.positives).toContain('✓ Contains whole grains');
    });

    it('should detect healthy fats', () => {
      const result = assessPetFoodQuality({
        ingredients_text: 'Salmon, salmon oil, flaxseed',
      });
      expect(result.positives).toContain('✓ Contains healthy fats');
    });

    it('should detect probiotics', () => {
      const result = assessPetFoodQuality({
        ingredients_text: 'Chicken, rice, dried Lactobacillus fermentation product',
      });
      expect(result.positives).toContain('✓ Contains probiotics for digestive health');
    });

    it('should detect vegetables', () => {
      const result = assessPetFoodQuality({
        ingredients_text: 'Chicken, sweet potato, pumpkin, carrots, blueberries',
      });
      expect(result.positives).toContain('✓ Contains vegetables/fruits');
    });
  });

  describe('species-specific scoring', () => {
    it('should check for taurine in cat food', () => {
      const withTaurine = assessPetFoodQuality(
        {
          categories: 'Cat food',
          ingredients_text: 'Chicken, rice, taurine',
        },
        { species: 'cat' }
      );
      expect(withTaurine.positives).toContain('✓ Contains taurine (essential for cats)');

      const withoutTaurine = assessPetFoodQuality(
        {
          categories: 'Cat food',
          ingredients_text: 'Chicken, rice',
        },
        { species: 'cat' }
      );
      expect(withoutTaurine.warnings).toContain('⚠️ No taurine listed (essential for cats)');
    });

    it('should warn about propylene glycol for cats', () => {
      const result = assessPetFoodQuality(
        {
          categories: 'Cat food',
          ingredients_text: 'Chicken, propylene glycol',
        },
        { species: 'cat' }
      );
      expect(result.warnings).toContain('⚠️ Contains propylene glycol (toxic to cats)');
    });

    it('should warn about xylitol for dogs', () => {
      const result = assessPetFoodQuality(
        {
          categories: 'Dog food',
          ingredients_text: 'Chicken, xylitol',
        },
        { species: 'dog' }
      );
      expect(result.warnings).toContain('☠️ Contains xylitol (extremely toxic to dogs)');
    });

    it('should warn about grapes for dogs', () => {
      const result = assessPetFoodQuality(
        {
          categories: 'Dog food',
          ingredients_text: 'Chicken, raisins',
        },
        { species: 'dog' }
      );
      expect(result.warnings).toContain('☠️ Contains grapes/raisins (toxic to dogs)');
    });

    it('should warn about onion for cats', () => {
      const result = assessPetFoodQuality(
        {
          categories: 'Cat food',
          ingredients_text: 'Chicken, onion powder',
        },
        { species: 'cat' }
      );
      expect(result.warnings).toContain('☠️ Contains onion (toxic to cats)');
    });
  });

  describe('allergen flagging', () => {
    it('should flag user-specified allergens', () => {
      const result = assessPetFoodQuality(
        {
          ingredients_text: 'Chicken, wheat, corn',
        },
        { allergies: ['chicken', 'wheat'] }
      );
      expect(result.allergyWarnings).toContain('⚠️ Contains chicken (flagged allergen)');
      expect(result.allergyWarnings).toContain('⚠️ Contains wheat (flagged allergen)');
    });

    it('should return detected allergens', () => {
      const result = assessPetFoodQuality({
        ingredients_text: 'Beef, dairy, eggs, soy',
      });
      expect(result.detectedAllergens).toContain('beef');
      expect(result.detectedAllergens).toContain('dairy');
      expect(result.detectedAllergens).toContain('eggs');
      expect(result.detectedAllergens).toContain('soy');
    });
  });

  describe('position-based weighting', () => {
    it('should weight first ingredient higher', () => {
      // Same ingredient (chicken only), different position
      const meatFirst = assessPetFoodQuality({
        ingredients_text: 'Fresh chicken, water, salt',
      });
      const meatLast = assessPetFoodQuality({
        ingredients_text:
          'Water, salt, minerals, vitamins, stabilizer, emulsifier, gums, acids, colors, preservatives, fillers, chicken',
      });
      // Meat as first ingredient (position 1, weight 1.5) vs position 12 (weight 0.7)
      // 15 * 1.5 = 22.5 → 23 vs 15 * 0.7 = 10.5 → 11
      // So meatFirst should score higher
      expect(meatFirst.score).toBeGreaterThan(meatLast.score);
    });
  });

  describe('rating thresholds', () => {
    it('should rate 80+ as Excellent', () => {
      const result = assessPetFoodQuality({
        categories: 'Cat food',
        ingredients_text:
          'Fresh salmon, salmon oil, sweet potato, pumpkin, taurine, probiotics, organic spinach',
      });
      expect(result.rating).toBe('Excellent');
    });

    it('should rate 60-79 as Good', () => {
      // Simple meat + basic ingredients = Good but not Excellent
      const result = assessPetFoodQuality({
        ingredients_text: 'Chicken, water, rice, natural flavors',
      });
      expect(result.score).toBeGreaterThanOrEqual(60);
      expect(result.score).toBeLessThan(80);
      expect(result.rating).toBe('Good');
    });

    it('should rate below 40 as Poor', () => {
      const result = assessPetFoodQuality({
        ingredients_text:
          'Meat by-products, corn syrup, BHA, corn gluten, artificial colors, Red 40',
      });
      expect(result.score).toBeLessThan(40);
      expect(result.rating).toBe('Poor');
    });
  });

  describe('score bounds', () => {
    it('should never exceed 100', () => {
      const result = assessPetFoodQuality({
        categories: 'Cat food',
        ingredients_text:
          'Organic fresh chicken, salmon oil, brown rice, sweet potato, pumpkin, carrots, blueberries, taurine, probiotics, flaxseed',
      });
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should never go below 0', () => {
      const result = assessPetFoodQuality({
        categories: 'Cat food',
        ingredients_text:
          'Meat by-products, BHA, BHT, ethoxyquin, corn syrup, Red 40, propylene glycol, corn gluten, onion, garlic',
      });
      expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('life-stage detection and scoring', () => {
    it('should detect puppy food', () => {
      expect(detectLifeStage({ product_name: 'Premium Puppy Food' })).toBe('puppy');
      expect(detectLifeStage({ categories: 'Dog food, Puppy food' })).toBe('puppy');
      expect(detectLifeStage({ product_name: 'Junior Dog Formula' })).toBe('puppy');
    });

    it('should detect kitten food', () => {
      expect(detectLifeStage({ product_name: 'Kitten Formula' })).toBe('kitten');
      expect(detectLifeStage({ categories: 'Cat food, Kitten food' })).toBe('kitten');
    });

    it('should detect senior food', () => {
      expect(detectLifeStage({ product_name: 'Senior Dog Food 7+' })).toBe('senior');
      expect(detectLifeStage({ categories: 'Mature cat food' })).toBe('senior');
      expect(detectLifeStage({ product_name: 'Dog Food for Older Dogs' })).toBe('senior');
    });

    it('should default to adult for unspecified', () => {
      expect(detectLifeStage({ product_name: 'Premium Dog Food' })).toBe('adult');
      expect(detectLifeStage({ product_name: 'Cat Food' })).toBe('adult');
      expect(detectLifeStage({})).toBe('adult');
    });

    it('should return life stage in assessment', () => {
      const puppyResult = assessPetFoodQuality({
        product_name: 'Puppy Food',
        ingredients_text: 'Chicken, rice',
      });
      expect(puppyResult.lifeStage).toBe('puppy');

      const seniorResult = assessPetFoodQuality({
        product_name: 'Senior Cat Food',
        ingredients_text: 'Chicken, rice',
      });
      expect(seniorResult.lifeStage).toBe('senior');
    });

    it('should boost score for DHA in puppy/kitten food', () => {
      const withDHA = assessPetFoodQuality({
        product_name: 'Puppy Food',
        ingredients_text: 'Chicken, rice, DHA, fish oil',
      });
      const withoutDHA = assessPetFoodQuality({
        product_name: 'Puppy Food',
        ingredients_text: 'Chicken, rice',
      });
      expect(withDHA.score).toBeGreaterThan(withoutDHA.score);
      expect(withDHA.positives).toContain('✓ Contains DHA for brain development');
    });

    it('should boost score for joint support in senior food', () => {
      const withJoint = assessPetFoodQuality({
        product_name: 'Senior Dog Food',
        ingredients_text: 'Chicken, rice, glucosamine, chondroitin',
      });
      const withoutJoint = assessPetFoodQuality({
        product_name: 'Senior Dog Food',
        ingredients_text: 'Chicken, rice',
      });
      expect(withJoint.score).toBeGreaterThan(withoutJoint.score);
      expect(withJoint.positives).toContain('✓ Contains joint support ingredients');
    });

    it('should warn about low-calorie food for puppies', () => {
      const result = assessPetFoodQuality({
        product_name: 'Puppy Light Food',
        ingredients_text: 'Chicken, rice, low calorie formula',
      });
      expect(result.warnings).toContain('⚠️ Low-calorie formulas not ideal for growing puppies');
    });

    it('should allow overriding life stage via options', () => {
      const result = assessPetFoodQuality(
        {
          product_name: 'Dog Food', // No life stage in name
          ingredients_text: 'Chicken, glucosamine',
        },
        { lifeStage: 'senior' }
      );
      expect(result.lifeStage).toBe('senior');
      expect(result.positives).toContain('✓ Contains joint support ingredients');
    });
  });

  describe('Nutri-Score integration', () => {
    it('should boost score for good Nutri-Score (A)', () => {
      const withA = assessPetFoodQuality({
        ingredients_text: 'Chicken, rice',
        nutriscore_grade: 'a',
      });
      const withoutScore = assessPetFoodQuality({
        ingredients_text: 'Chicken, rice',
      });
      expect(withA.score).toBeGreaterThan(withoutScore.score);
      expect(withA.nutriScore).toBe('a');
      expect(withA.positives).toContain('✓ Good Nutri-Score (A)');
    });

    it('should boost score for Nutri-Score B', () => {
      const result = assessPetFoodQuality({
        ingredients_text: 'Chicken, rice',
        nutriscore_grade: 'b',
      });
      expect(result.positives).toContain('✓ Good Nutri-Score (B)');
    });

    it('should penalize for poor Nutri-Score (D/E)', () => {
      const withE = assessPetFoodQuality({
        ingredients_text: 'Chicken, rice',
        nutriscore_grade: 'e',
      });
      const withoutScore = assessPetFoodQuality({
        ingredients_text: 'Chicken, rice',
      });
      expect(withE.score).toBeLessThan(withoutScore.score);
      expect(withE.warnings).toContain('⚠️ Poor Nutri-Score (E)');
    });

    it('should handle nutriscore_data.grade format', () => {
      const result = assessPetFoodQuality({
        ingredients_text: 'Chicken, rice',
        nutriscore_data: { grade: 'A' },
      });
      expect(result.nutriScore).toBe('a');
      expect(result.positives).toContain('✓ Good Nutri-Score (A)');
    });

    it('should not affect score for neutral Nutri-Score (C)', () => {
      const withC = assessPetFoodQuality({
        ingredients_text: 'Chicken, rice',
        nutriscore_grade: 'c',
      });
      const withoutScore = assessPetFoodQuality({
        ingredients_text: 'Chicken, rice',
      });
      expect(withC.score).toBe(withoutScore.score);
      expect(withC.nutriScore).toBe('c');
    });
  });
});
