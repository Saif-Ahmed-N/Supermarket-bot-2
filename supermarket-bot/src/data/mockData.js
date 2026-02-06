// src/data/mockData.js
import { generateCatalog } from './masterCatalog';

// --- 1. GENERATE MASSIVE DB ---
export const PRODUCT_DB = generateCatalog();

// --- 2. FIX HISTORY (Ensure Variety) ---
// We purposely pick 1 item from each distinct category to force variety in the "Reorder" widget
// This prevents the "only milk" issue by scanning the whole DB for unique categories.
const distinctCategories = [...new Set(PRODUCT_DB.map(p => p.category))].slice(0, 8);

export const SARAH_HISTORY = distinctCategories.map(cat => {
    // Find the first product in this category
    const product = PRODUCT_DB.find(p => p.category === cat);
    // Return it with a quantity of 1, defaulting to a safety object if undefined
    return product ? { ...product, quantity: 1 } : null;
}).filter(item => item !== null); // Filter out any nulls if categories < 8

// --- 3. DAILY ESSENTIALS (Curated List) ---
// Picks specific high-frequency items for the top widget
export const DAILY_ESSENTIALS = PRODUCT_DB.filter(p => 
    (p.category === 'dairy' && p.baseName.includes('Milk')) || 
    (p.category === 'produce' && p.baseName.includes('Banana')) ||
    (p.category === 'bakery' && p.baseName.includes('Bread'))
).slice(0, 5);

// --- 4. SMART RECIPES (With Serving Logic) ---
export const RECIPES = [
    {
        id: 'pasta_kit',
        name: 'Creamy Pesto Pasta',
        time: '20 mins',
        calories: '450 kcal',
        baseServings: 2, 
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80',
        ingredients: [
            { searchTerm: 'Pasta Penne', qtyPerServing: 0.5 },
            { searchTerm: 'Olive Oil', qtyPerServing: 0.05 },
            { searchTerm: 'Cheese Slice', qtyPerServing: 0.5 },
            { searchTerm: 'Tomato Sauce', qtyPerServing: 0.2 }
        ]
    },
    {
        id: 'healthy_salad',
        name: 'Green Goddess Salad',
        time: '10 mins',
        calories: '180 kcal',
        baseServings: 2,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80',
        ingredients: [
            { searchTerm: 'Spinach', qtyPerServing: 0.3 },
            { searchTerm: 'Tomatoes', qtyPerServing: 0.2 },
            { searchTerm: 'Cucumber', qtyPerServing: 0.2 },
            { searchTerm: 'Onions', qtyPerServing: 0.1 },
            { searchTerm: 'Olive Oil', qtyPerServing: 0.05 }
        ]
    },
    {
        id: 'paneer_masala',
        name: 'Paneer Butter Masala',
        time: '40 mins',
        calories: '550 kcal',
        baseServings: 4,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=500&q=80',
        ingredients: [
            { searchTerm: 'Paneer', qtyPerServing: 0.2 },
            { searchTerm: 'Butter', qtyPerServing: 0.1 },
            { searchTerm: 'Tomatoes', qtyPerServing: 0.2 },
            { searchTerm: 'Onions', qtyPerServing: 0.1 },
            { searchTerm: 'Indian Spices', qtyPerServing: 0.05 }
        ]
    },
    {
        id: 'breakfast_combo',
        name: 'English Breakfast',
        time: '15 mins',
        calories: '400 kcal',
        baseServings: 1,
        image: 'https://images.unsplash.com/photo-1533089862017-5f267494224c?auto=format&fit=crop&w=500&q=80',
        ingredients: [
            { searchTerm: 'Whole Wheat', qtyPerServing: 1 },
            { searchTerm: 'Butter', qtyPerServing: 0.1 },
            { searchTerm: 'Farm Eggs', qtyPerServing: 2 },
            { searchTerm: 'Orange Juice', qtyPerServing: 0.5 }
        ]
    },
    {
        id: 'mexican_nachos',
        name: 'Loaded Nachos',
        time: '20 mins',
        calories: '600 kcal',
        baseServings: 3,
        image: 'https://images.unsplash.com/photo-1513456852971-30cfa2839c92?auto=format&fit=crop&w=500&q=80',
        ingredients: [
            { searchTerm: 'Tortilla Chips', qtyPerServing: 0.5 },
            { searchTerm: 'Salsa Dip', qtyPerServing: 0.3 },
            { searchTerm: 'Cheese Slice', qtyPerServing: 0.5 },
            { searchTerm: 'Avocados', qtyPerServing: 0.5 }
        ]
    },
    {
        id: 'rajma_chawal',
        name: 'Rajma Chawal Bowl',
        time: '45 mins',
        calories: '350 kcal',
        baseServings: 4,
        image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=500&q=80',
        ingredients: [
            { searchTerm: 'Basmati Rice', qtyPerServing: 0.2 },
            { searchTerm: 'Kidney Beans', qtyPerServing: 0.2 },
            { searchTerm: 'Onions', qtyPerServing: 0.1 },
            { searchTerm: 'Indian Spices', qtyPerServing: 0.05 }
        ]
    },
    {
        id: 'avocado_toast',
        name: 'Avocado Toast',
        time: '5 mins',
        calories: '220 kcal',
        baseServings: 1,
        image: 'https://images.unsplash.com/photo-1588137372309-8b6f913b93f6?auto=format&fit=crop&w=500&q=80',
        ingredients: [
            { searchTerm: 'Sourdough Bread', qtyPerServing: 1 },
            { searchTerm: 'Avocados', qtyPerServing: 1 },
            { searchTerm: 'Olive Oil', qtyPerServing: 0.05 },
            { searchTerm: 'Farm Eggs', qtyPerServing: 1 }
        ]
    },
    {
        id: 'smoothie_bowl',
        name: 'Berry Blast Smoothie',
        time: '5 mins',
        calories: '250 kcal',
        baseServings: 1,
        image: 'https://images.unsplash.com/photo-1623596710450-42c22294247f?auto=format&fit=crop&w=500&q=80',
        ingredients: [
            { searchTerm: 'Bananas', qtyPerServing: 2 },
            { searchTerm: 'Whole Milk', qtyPerServing: 0.2 },
            { searchTerm: 'Red Apples', qtyPerServing: 1 }
        ]
    }
];

// --- 5. CATEGORY METADATA (Expanded to 10 Categories) ---

export const CATEGORIES = [
  { id: 'dairy', label: 'Fresh Dairy', img: 'https://images.unsplash.com/photo-1628191010210-a59de33e5941?auto=format&fit=crop&w=500&q=80', aisle: 'Aisle 1' },
  { id: 'produce', label: 'Fresh Produce', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80', aisle: 'Aisle 2' },
  { id: 'bakery', label: 'Bakery', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80', aisle: 'Aisle 3' },
  { id: 'pantry', label: 'Pantry Staples', img: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=500&q=80', aisle: 'Aisle 4' },
  { id: 'snacks', label: 'Snacks', img: 'https://images.unsplash.com/photo-1621939514649-28b12e81658e?auto=format&fit=crop&w=500&q=80', aisle: 'Aisle 5' },
  { id: 'beverages', label: 'Beverages', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80', aisle: 'Aisle 6' },
  { id: 'meat', label: 'Meat & Seafood', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80', aisle: 'Aisle 8' },
  { id: 'frozen', label: 'Frozen Foods', img: 'https://images.unsplash.com/photo-1584948839077-4c281358e221?auto=format&fit=crop&w=500&q=80', aisle: 'Aisle 9' },
  { id: 'household', label: 'Household', img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=500&q=80', aisle: 'Aisle 10' },
  { id: 'personal', label: 'Personal Care', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=500&q=80', aisle: 'Aisle 11' },
];