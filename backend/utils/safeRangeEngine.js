const SAFE_RANGES = {
  // ==========================================
  // ROOT & BULB VEGETABLES
  // ==========================================
  onion: {
    "cold": { temp: [0, 5], humidity: [65, 75] },       
    "dry": { temp: [10, 25], humidity: [55, 65] },      
    "general": { temp: [15, 35], humidity: [50, 70] },  
    "open-air": { temp: [15, 40], humidity: [40, 75] }  
  },
  potato: {
    "cold": { temp: [4, 8], humidity: [90, 95] },       
    "dry": { temp: [10, 20], humidity: [80, 90] },      
    "general": { temp: [15, 30], humidity: [70, 85] },
    "open-air": { temp: [15, 35], humidity: [60, 85] }
  },
  garlic: {
    "cold": { temp: [-1, 0], humidity: [60, 70] },
    "dry": { temp: [10, 20], humidity: [55, 65] },
    "general": { temp: [15, 30], humidity: [50, 65] },
    "open-air": { temp: [15, 35], humidity: [40, 65] }
  },
  carrot: {
    "cold": { temp: [0, 2], humidity: [95, 100] },
    "dry": { temp: [10, 15], humidity: [80, 90] },
    "general": { temp: [10, 25], humidity: [70, 85] },
    "open-air": { temp: [15, 30], humidity: [60, 80] }
  },
  sweet_potato: {
    "cold": { temp: [13, 15], humidity: [85, 90] }, // Chill sensitive!
    "dry": { temp: [15, 25], humidity: [70, 80] },
    "general": { temp: [18, 30], humidity: [60, 80] },
    "open-air": { temp: [20, 35], humidity: [60, 85] }
  },
  ginger: {
    "cold": { temp: [12, 14], humidity: [85, 90] }, // Chill sensitive
    "dry": { temp: [15, 25], humidity: [70, 80] },
    "general": { temp: [18, 30], humidity: [65, 80] },
    "open-air": { temp: [20, 35], humidity: [60, 85] }
  },
  radish: {
    "cold": { temp: [0, 2], humidity: [95, 100] },
    "dry": { temp: [10, 18], humidity: [80, 90] },
    "general": { temp: [15, 25], humidity: [70, 85] },
    "open-air": { temp: [15, 30], humidity: [60, 80] }
  },

  // ==========================================
  // FRUITS
  // ==========================================
  apple: {
    "cold": { temp: [0, 4], humidity: [90, 95] },
    "dry": { temp: [10, 20], humidity: [80, 85] },
    "general": { temp: [15, 25], humidity: [70, 85] },
    "open-air": { temp: [15, 30], humidity: [60, 85] }
  },
  banana: {
    "cold": { temp: [13, 15], humidity: [85, 90] }, // Turns black below 13°C
    "dry": { temp: [15, 20], humidity: [70, 80] },
    "general": { temp: [18, 28], humidity: [60, 80] },
    "open-air": { temp: [20, 35], humidity: [60, 85] }
  },
  mango: {
    "cold": { temp: [10, 13], humidity: [85, 90] },
    "dry": { temp: [15, 25], humidity: [70, 80] },
    "general": { temp: [20, 30], humidity: [60, 80] },
    "open-air": { temp: [25, 35], humidity: [60, 85] }
  },
  orange: {
    "cold": { temp: [3, 8], humidity: [85, 90] },
    "dry": { temp: [10, 20], humidity: [75, 85] },
    "general": { temp: [15, 28], humidity: [65, 80] },
    "open-air": { temp: [15, 35], humidity: [60, 85] }
  },
  lemon: {
    "cold": { temp: [10, 13], humidity: [85, 90] },
    "dry": { temp: [15, 20], humidity: [75, 85] },
    "general": { temp: [18, 28], humidity: [65, 80] },
    "open-air": { temp: [18, 35], humidity: [60, 85] }
  },
  grape: {
    "cold": { temp: [-1, 0], humidity: [90, 95] },
    "dry": { temp: [10, 18], humidity: [75, 85] },
    "general": { temp: [15, 25], humidity: [65, 80] },
    "open-air": { temp: [15, 30], humidity: [60, 80] }
  },
  strawberry: {
    "cold": { temp: [0, 2], humidity: [90, 95] }, // Highly perishable
    "dry": { temp: [10, 15], humidity: [80, 90] },
    "general": { temp: [15, 22], humidity: [70, 85] },
    "open-air": { temp: [15, 28], humidity: [60, 80] }
  },
  watermelon: {
    "cold": { temp: [10, 15], humidity: [85, 90] },
    "dry": { temp: [15, 25], humidity: [70, 80] },
    "general": { temp: [20, 30], humidity: [60, 80] },
    "open-air": { temp: [20, 35], humidity: [60, 85] }
  },
  pineapple: {
    "cold": { temp: [10, 13], humidity: [85, 90] },
    "dry": { temp: [15, 25], humidity: [70, 80] },
    "general": { temp: [20, 30], humidity: [60, 80] },
    "open-air": { temp: [20, 35], humidity: [60, 85] }
  },
  avocado: {
    "cold": { temp: [5, 12], humidity: [85, 90] }, // Varies heavily by ripeness
    "dry": { temp: [15, 22], humidity: [70, 80] },
    "general": { temp: [18, 28], humidity: [60, 80] },
    "open-air": { temp: [18, 32], humidity: [60, 80] }
  },
  papaya: {
    "cold": { temp: [10, 13], humidity: [85, 90] },
    "dry": { temp: [15, 25], humidity: [70, 80] },
    "general": { temp: [20, 30], humidity: [60, 80] },
    "open-air": { temp: [22, 35], humidity: [60, 85] }
  },

  // ==========================================
  // LEAFY GREENS & CRUCIFEROUS
  // ==========================================
  // Note: These wilt extremely fast in open-air/general environments.
  cabbage: {
    "cold": { temp: [0, 2], humidity: [95, 100] },
    "dry": { temp: [10, 15], humidity: [80, 90] },
    "general": { temp: [10, 22], humidity: [70, 85] },
    "open-air": { temp: [15, 28], humidity: [60, 80] }
  },
  lettuce: {
    "cold": { temp: [0, 2], humidity: [95, 100] },
    "dry": { temp: [10, 15], humidity: [85, 95] },
    "general": { temp: [15, 22], humidity: [70, 85] },
    "open-air": { temp: [15, 25], humidity: [60, 80] }
  },
  spinach: {
    "cold": { temp: [0, 2], humidity: [95, 100] },
    "dry": { temp: [10, 15], humidity: [85, 95] },
    "general": { temp: [15, 20], humidity: [70, 85] },
    "open-air": { temp: [15, 25], humidity: [60, 80] }
  },
  broccoli: {
    "cold": { temp: [0, 2], humidity: [95, 100] },
    "dry": { temp: [10, 15], humidity: [85, 90] },
    "general": { temp: [15, 22], humidity: [70, 85] },
    "open-air": { temp: [15, 28], humidity: [60, 80] }
  },

  // ==========================================
  // FRUITING VEGETABLES & OTHERS
  // ==========================================
  tomato: {
    "cold": { temp: [10, 15], humidity: [85, 90] },     
    "dry": { temp: [15, 25], humidity: [60, 70] },
    "general": { temp: [18, 30], humidity: [60, 80] },
    "open-air": { temp: [20, 35], humidity: [60, 85] }
  },
  bell_pepper: {
    "cold": { temp: [7, 10], humidity: [90, 95] },
    "dry": { temp: [12, 20], humidity: [75, 85] },
    "general": { temp: [15, 28], humidity: [65, 80] },
    "open-air": { temp: [18, 32], humidity: [60, 80] }
  },
  cucumber: {
    "cold": { temp: [10, 12], humidity: [90, 95] }, // Chill sensitive
    "dry": { temp: [15, 22], humidity: [75, 85] },
    "general": { temp: [18, 28], humidity: [65, 80] },
    "open-air": { temp: [20, 35], humidity: [60, 80] }
  },
  eggplant: {
    "cold": { temp: [10, 12], humidity: [90, 95] },
    "dry": { temp: [15, 22], humidity: [75, 85] },
    "general": { temp: [18, 28], humidity: [65, 80] },
    "open-air": { temp: [20, 35], humidity: [60, 80] }
  },
  pumpkin: {
    "cold": { temp: [10, 13], humidity: [50, 70] }, // Likes it dry!
    "dry": { temp: [15, 25], humidity: [50, 65] },
    "general": { temp: [18, 30], humidity: [50, 70] },
    "open-air": { temp: [20, 35], humidity: [50, 75] }
  },
  zucchini: {
    "cold": { temp: [5, 10], humidity: [95, 100] },
    "dry": { temp: [12, 18], humidity: [80, 90] },
    "general": { temp: [15, 25], humidity: [70, 85] },
    "open-air": { temp: [18, 30], humidity: [60, 80] }
  }
};

export const getSafeRange = (crop, warehouseType = "general") => {
  if (!crop || !warehouseType) return null;
  
  const normalizedCrop = crop.toLowerCase().trim().replace(/\s+/g, '_');
  const cropData = SAFE_RANGES[normalizedCrop];
  
  if (!cropData || !cropData[warehouseType]) return null;
  
  return cropData[warehouseType];
};