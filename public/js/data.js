// ============================================================
//  Lucky Fresh Mart – Product & Offer Data
//  Edit this file to update products, prices, and offers
//  Admin panel also updates localStorage which overrides this
// ============================================================

const DEFAULT_PRODUCTS = [
  // LEAFY GREENS
  { id: 1,  name: "Spinach",          emoji: "🌿", unit: "per bunch",   price: 15,  cat: "leafy",  organic: true  },
  { id: 2,  name: "Coriander",        emoji: "🌱", unit: "per bunch",   price: 10,  cat: "leafy",  organic: true  },
  { id: 3,  name: "Methi (Fenugreek)",emoji: "🌿", unit: "per bunch",   price: 12,  cat: "leafy",  organic: false },
  { id: 4,  name: "Curry Leaves",     emoji: "🍃", unit: "per bunch",   price: 8,   cat: "leafy",  organic: true  },
  { id: 5,  name: "Palak",            emoji: "🥬", unit: "250g",        price: 18,  cat: "leafy",  organic: true  },
  { id: 6,  name: "Cabbage",          emoji: "🥬", unit: "per piece",   price: 30,  cat: "leafy",  organic: false },

  // ROOT VEGETABLES
  { id: 7,  name: "Onion",            emoji: "🧅", unit: "per kg",      price: 40,  cat: "root",   organic: false },
  { id: 8,  name: "Potato",           emoji: "🥔", unit: "per kg",      price: 35,  cat: "root",   organic: false },
  { id: 9,  name: "Carrot",           emoji: "🥕", unit: "per kg",      price: 55,  cat: "root",   organic: true  },
  { id: 10, name: "Beetroot",         emoji: "🫘", unit: "per kg",      price: 45,  cat: "root",   organic: true  },
  { id: 11, name: "Radish",           emoji: "🌰", unit: "per kg",      price: 30,  cat: "root",   organic: false },
  { id: 12, name: "Ginger",           emoji: "🫚", unit: "100g",        price: 20,  cat: "root",   organic: true  },
  { id: 13, name: "Garlic",           emoji: "🧄", unit: "100g",        price: 25,  cat: "root",   organic: false },

  // FRUITY VEGGIES
  { id: 14, name: "Tomato",           emoji: "🍅", unit: "per kg",      price: 30,  cat: "fruity", organic: true  },
  { id: 15, name: "Brinjal",          emoji: "🍆", unit: "per kg",      price: 40,  cat: "fruity", organic: false },
  { id: 16, name: "Green Capsicum",   emoji: "🫑", unit: "per kg",      price: 60,  cat: "fruity", organic: true  },
  { id: 17, name: "Cucumber",         emoji: "🥒", unit: "per piece",   price: 15,  cat: "fruity", organic: true  },
  { id: 18, name: "Bitter Gourd",     emoji: "🫛", unit: "per kg",      price: 50,  cat: "fruity", organic: false },
  { id: 19, name: "Lady's Finger",    emoji: "🌿", unit: "per kg",      price: 55,  cat: "fruity", organic: false },
  { id: 20, name: "Snake Gourd",      emoji: "🥒", unit: "per piece",   price: 25,  cat: "fruity", organic: false },
  { id: 21, name: "Pumpkin",          emoji: "🎃", unit: "per kg",      price: 25,  cat: "fruity", organic: false },
  { id: 22, name: "Ridge Gourd",      emoji: "🫛", unit: "per piece",   price: 20,  cat: "fruity", organic: false },

  // EXOTIC
  { id: 23, name: "Baby Corn",        emoji: "🌽", unit: "per pack",    price: 45,  cat: "exotic", organic: true  },
  { id: 24, name: "Broccoli",         emoji: "🥦", unit: "per piece",   price: 60,  cat: "exotic", organic: true  },
  { id: 25, name: "Zucchini",         emoji: "🥒", unit: "per kg",      price: 80,  cat: "exotic", organic: true  },
  { id: 26, name: "Cherry Tomato",    emoji: "🍅", unit: "per 250g",    price: 50,  cat: "exotic", organic: true  },
  { id: 27, name: "Red Capsicum",     emoji: "🫑", unit: "per piece",   price: 40,  cat: "exotic", organic: true  },
];

const DEFAULT_OFFERS = [
  {
    id: 1,
    emoji: "🍅",
    name: "Farm Tomatoes",
    originalPrice: 50,
    offerPrice: 30,
    discount: "40% OFF",
    label: "Today's Deal"
  },
  {
    id: 2,
    emoji: "🥕",
    name: "Fresh Carrots",
    originalPrice: 70,
    offerPrice: 45,
    discount: "35% OFF",
    label: "Flash Sale"
  },
  {
    id: 3,
    emoji: "🥦",
    name: "Broccoli",
    originalPrice: 90,
    offerPrice: 60,
    discount: "33% OFF",
    label: "Weekend Special"
  },
  {
    id: 4,
    emoji: "🌿",
    name: "Spinach Bunch",
    originalPrice: 25,
    offerPrice: 15,
    discount: "40% OFF",
    label: "Morning Fresh"
  }
];

// Merge with localStorage overrides (from admin panel)
function getProducts() {
  try {
    const saved = localStorage.getItem('lfm_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  } catch { return DEFAULT_PRODUCTS; }
}

function getOffers() {
  try {
    const saved = localStorage.getItem('lfm_offers');
    return saved ? JSON.parse(saved) : DEFAULT_OFFERS;
  } catch { return DEFAULT_OFFERS; }
}
