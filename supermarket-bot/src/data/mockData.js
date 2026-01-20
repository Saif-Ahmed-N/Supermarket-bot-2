// src/data/mockData.js

// --- 1. IMAGE VAULT (Premium High-Res Imagery) ---
const IMAGE_MAP = {
    // DAIRY
    'Whole Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80',
    'Butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80',
    'Cheese Slice': 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=500&q=80',
    'Farm Eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=500&q=80',
    'Paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=500&q=80',
    'Greek Yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80',

    // PRODUCE
    'Red Apples': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80',
    'Bananas': 'https://images.unsplash.com/photo-1571771896627-037d6b4f8d28?auto=format&fit=crop&w=500&q=80',
    'Potatoes': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80',
    'Onions': 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=500&q=80',
    'Tomatoes': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80',
    'Spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=80',
    'Cucumber': 'https://images.unsplash.com/photo-1604977042946-1eecc6a22662?auto=format&fit=crop&w=500&q=80',
    'Avocados': 'https://images.unsplash.com/photo-1523049673856-42848c56a649?auto=format&fit=crop&w=500&q=80',
    'Bell Peppers': 'https://images.unsplash.com/photo-1563565375-f3fdf5dbc240?auto=format&fit=crop&w=500&q=80',
    'Garlic': 'https://images.unsplash.com/photo-1615477005452-bb19624126c1?auto=format&fit=crop&w=500&q=80',
    'Ginger': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80',

    // BAKERY
    'Sourdough Bread': 'https://images.unsplash.com/photo-1585476644391-ab12ea774682?auto=format&fit=crop&w=500&q=80',
    'Whole Wheat': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
    'Burger Buns': 'https://images.unsplash.com/photo-1533230680956-6dd8a245593e?auto=format&fit=crop&w=500&q=80',

    // PANTRY
    'Basmati Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
    'Olive Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcdccef?auto=format&fit=crop&w=500&q=80',
    'Ketchup': 'https://images.unsplash.com/photo-1604543788737-14227847c23a?auto=format&fit=crop&w=500&q=80',
    'Pasta Penne': 'https://images.unsplash.com/photo-1608605096185-3e287a909167?auto=format&fit=crop&w=500&q=80',
    'Tomato Sauce': 'https://images.unsplash.com/photo-1604543788737-14227847c23a?auto=format&fit=crop&w=500&q=80',
    'Indian Spices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80',
    'Kidney Beans': 'https://images.unsplash.com/photo-1593365922336-d7a8c886888c?auto=format&fit=crop&w=500&q=80',

    // SNACKS
    'Potato Chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80',
    'Chocolate Bar': 'https://images.unsplash.com/photo-1606312619070-d48b706521bf?auto=format&fit=crop&w=500&q=80',
    'Popcorn': 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=500&q=80',
    'Tortilla Chips': 'https://images.unsplash.com/photo-1605253255776-621184c8a221?auto=format&fit=crop&w=500&q=80',
    'Salsa Dip': 'https://images.unsplash.com/photo-1599346571587-c37618991462?auto=format&fit=crop&w=500&q=80',

    // BEVERAGES
    'Cola': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80',
    'Orange Juice': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80',
    'Iced Coffee': 'https://images.unsplash.com/photo-1517701604599-bb29b5c7355c?auto=format&fit=crop&w=500&q=80',

    // PERSONAL
    'Shampoo': 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=500&q=80',
    'Toothpaste': 'https://images.unsplash.com/photo-1559591937-e17e6948589c?auto=format&fit=crop&w=500&q=80',
    'Body Wash': 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&w=500&q=80',
};

// --- 2. CATEGORY METADATA ---
export const CATEGORIES = [
  { id: 'dairy', label: 'Fresh Dairy', img: IMAGE_MAP['Whole Milk'], aisle: 'Aisle 1' },
  { id: 'produce', label: 'Farm Produce', img: IMAGE_MAP['Red Apples'], aisle: 'Aisle 2' },
  { id: 'bakery', label: 'Oven Bakery', img: IMAGE_MAP['Sourdough Bread'], aisle: 'Aisle 3' },
  { id: 'pantry', label: 'Pantry Staples', img: IMAGE_MAP['Basmati Rice'], aisle: 'Aisle 4' },
  { id: 'snacks', label: 'Snack Corner', img: IMAGE_MAP['Potato Chips'], aisle: 'Aisle 5' },
  { id: 'beverages', label: 'Cold Drinks', img: IMAGE_MAP['Cola'], aisle: 'Aisle 6' },
  { id: 'personal', label: 'Self Care', img: IMAGE_MAP['Shampoo'], aisle: 'Aisle 7' },
];

const BRANDS = {
    dairy: ['Amul', 'Nestle', 'Mother Dairy'],
    produce: ['Fresh Farm', 'Organic Life', 'Green Pick'],
    bakery: ['Modern', 'Britannia', 'Harvest Gold'],
    pantry: ['India Gate', 'Fortune', 'Tata', 'Everest'],
    snacks: ['Lays', 'Doritos', 'Cadbury', 'Pringles'],
    beverages: ['Coca-Cola', 'Pepsi', 'Tropicana', 'Davidoff'],
    personal: ['Dove', 'Colgate', 'Nivea', 'Listerine']
};

// --- 3. BASE PRODUCTS (COMPREHENSIVE) ---
const BASE_PRODUCTS = [
    // DAIRY
    { name: 'Whole Milk', cat: 'dairy', basePrice: 60, veg: true, unitType: 'l', nutrition: { cal: 150, fat: '8g', sugar: '12g' }, pairingTags: ['cereal', 'cookies'] },
    { name: 'Butter', cat: 'dairy', basePrice: 55, veg: true, unitType: 'pc', nutrition: { cal: 100, fat: '11g', sugar: '0g' }, pairingTags: ['bread', 'toast'] },
    { name: 'Cheese Slice', cat: 'dairy', basePrice: 120, veg: true, unitType: 'pc', nutrition: { cal: 110, fat: '9g', sugar: '1g' }, pairingTags: ['bread', 'burger'] },
    { name: 'Farm Eggs', cat: 'dairy', basePrice: 80, veg: false, unitType: 'pc', nutrition: { cal: 70, fat: '5g', sugar: '0g' }, pairingTags: ['bread', 'bacon'] },
    { name: 'Paneer', cat: 'dairy', basePrice: 90, veg: true, unitType: 'kg', nutrition: { cal: 265, fat: '20g', sugar: '3g' }, pairingTags: ['spinach', 'spices'] },
    { name: 'Greek Yogurt', cat: 'dairy', basePrice: 70, veg: true, unitType: 'pc', nutrition: { cal: 120, fat: '0g', sugar: '6g' }, pairingTags: ['berries'] },

    // PRODUCE
    { name: 'Red Apples', cat: 'produce', basePrice: 150, veg: true, unitType: 'kg', nutrition: { cal: 95, fat: '0g', sugar: '19g' }, pairingTags: [] },
    { name: 'Bananas', cat: 'produce', basePrice: 40, veg: true, unitType: 'kg', nutrition: { cal: 105, fat: '0g', sugar: '14g' }, pairingTags: ['milk', 'oats'] },
    { name: 'Potatoes', cat: 'produce', basePrice: 30, veg: true, unitType: 'kg', nutrition: { cal: 160, fat: '0g', sugar: '2g' }, pairingTags: ['onion'] },
    { name: 'Onions', cat: 'produce', basePrice: 35, veg: true, unitType: 'kg', nutrition: { cal: 40, fat: '0g', sugar: '4g' }, pairingTags: ['potatoes', 'tomato'] },
    { name: 'Tomatoes', cat: 'produce', basePrice: 40, veg: true, unitType: 'kg', nutrition: { cal: 22, fat: '0g', sugar: '3g' }, pairingTags: ['onion', 'pasta'] },
    { name: 'Spinach', cat: 'produce', basePrice: 25, veg: true, unitType: 'kg', nutrition: { cal: 23, fat: '0g', sugar: '0g' }, pairingTags: ['paneer'] },
    { name: 'Cucumber', cat: 'produce', basePrice: 30, veg: true, unitType: 'kg', nutrition: { cal: 16, fat: '0g', sugar: '2g' }, pairingTags: ['tomato'] },
    { name: 'Avocados', cat: 'produce', basePrice: 250, veg: true, unitType: 'pc', nutrition: { cal: 160, fat: '15g', sugar: '0g' }, pairingTags: ['toast'] },
    { name: 'Bell Peppers', cat: 'produce', basePrice: 80, veg: true, unitType: 'kg', nutrition: { cal: 30, fat: '0g', sugar: '4g' }, pairingTags: ['pasta'] },
    { name: 'Garlic', cat: 'produce', basePrice: 120, veg: true, unitType: 'kg', nutrition: { cal: 149, fat: '0.5g', sugar: '1g' }, pairingTags: ['ginger'] },
    { name: 'Ginger', cat: 'produce', basePrice: 80, veg: true, unitType: 'kg', nutrition: { cal: 80, fat: '0.7g', sugar: '1.7g' }, pairingTags: ['garlic'] },

    // BAKERY
    { name: 'Sourdough Bread', cat: 'bakery', basePrice: 85, veg: true, unitType: 'pc', nutrition: { cal: 120, fat: '1g', sugar: '2g' }, pairingTags: ['butter', 'jam', 'cheese'] },
    { name: 'Whole Wheat', cat: 'bakery', basePrice: 50, veg: true, unitType: 'pc', nutrition: { cal: 80, fat: '1g', sugar: '1g' }, pairingTags: ['butter'] },
    { name: 'Burger Buns', cat: 'bakery', basePrice: 40, veg: true, unitType: 'pc', nutrition: { cal: 150, fat: '2g', sugar: '4g' }, pairingTags: ['cheese'] },

    // PANTRY
    { name: 'Basmati Rice', cat: 'pantry', basePrice: 140, veg: true, unitType: 'kg', nutrition: { cal: 160, fat: '0g', sugar: '0g' }, pairingTags: ['dal'] },
    { name: 'Olive Oil', cat: 'pantry', basePrice: 600, veg: true, unitType: 'l', nutrition: { cal: 120, fat: '14g', sugar: '0g' }, pairingTags: ['pasta', 'salad'] },
    { name: 'Ketchup', cat: 'pantry', basePrice: 90, veg: true, unitType: 'kg', nutrition: { cal: 20, fat: '0g', sugar: '4g' }, pairingTags: ['fries'] },
    { name: 'Pasta Penne', cat: 'pantry', basePrice: 120, veg: true, unitType: 'kg', nutrition: { cal: 200, fat: '1g', sugar: '1g' }, pairingTags: ['sauce', 'cheese'] },
    { name: 'Tomato Sauce', cat: 'pantry', basePrice: 95, veg: true, unitType: 'kg', nutrition: { cal: 30, fat: '0g', sugar: '5g' }, pairingTags: ['pasta'] },
    { name: 'Indian Spices', cat: 'pantry', basePrice: 200, veg: true, unitType: 'pc', nutrition: { cal: 10, fat: '0g', sugar: '0g' }, pairingTags: ['rice'] },
    { name: 'Kidney Beans', cat: 'pantry', basePrice: 110, veg: true, unitType: 'kg', nutrition: { cal: 333, fat: '0.8g', sugar: '2g' }, pairingTags: ['rice'] },

    // SNACKS
    { name: 'Potato Chips', cat: 'snacks', basePrice: 20, veg: true, unitType: 'pc', nutrition: { cal: 160, fat: '10g', sugar: '1g' }, pairingTags: ['cola'] },
    { name: 'Chocolate Bar', cat: 'snacks', basePrice: 60, veg: true, unitType: 'pc', nutrition: { cal: 220, fat: '13g', sugar: '20g' }, pairingTags: [] },
    { name: 'Popcorn', cat: 'snacks', basePrice: 85, veg: true, unitType: 'pc', nutrition: { cal: 100, fat: '4g', sugar: '0g' }, pairingTags: ['cola'] },
    { name: 'Tortilla Chips', cat: 'snacks', basePrice: 150, veg: true, unitType: 'pc', nutrition: { cal: 290, fat: '14g', sugar: '1g' }, pairingTags: ['salsa'] },
    { name: 'Salsa Dip', cat: 'snacks', basePrice: 180, veg: true, unitType: 'pc', nutrition: { cal: 70, fat: '0g', sugar: '8g' }, pairingTags: ['tortilla'] },

    // BEVERAGES
    { name: 'Cola', cat: 'beverages', basePrice: 40, veg: true, unitType: 'l', nutrition: { cal: 140, fat: '0g', sugar: '39g' }, pairingTags: ['chips', 'popcorn'] },
    { name: 'Orange Juice', cat: 'beverages', basePrice: 110, veg: true, unitType: 'l', nutrition: { cal: 110, fat: '0g', sugar: '20g' }, pairingTags: [] },
    { name: 'Iced Coffee', cat: 'beverages', basePrice: 140, veg: true, unitType: 'l', nutrition: { cal: 90, fat: '2g', sugar: '15g' }, pairingTags: ['cookies'] },

    // PERSONAL
    { name: 'Shampoo', cat: 'personal', basePrice: 350, veg: true, unitType: 'l', nutrition: null, pairingTags: [] },
    { name: 'Toothpaste', cat: 'personal', basePrice: 95, veg: true, unitType: 'pc', nutrition: null, pairingTags: ['toothbrush'] },
    { name: 'Body Wash', cat: 'personal', basePrice: 280, veg: true, unitType: 'l', nutrition: null, pairingTags: [] },
];

const generateProducts = () => {
    const products = [];
    let idCounter = 1;

    BASE_PRODUCTS.forEach(template => {
        const categoryBrands = BRANDS[template.cat] || ['Generic'];
        categoryBrands.forEach(brand => {
            const isDiscounted = Math.random() > 0.6; 
            const discountPercent = isDiscounted ? Math.floor(Math.random() * (25 - 5) + 5) : 0;
            const originalPrice = Math.floor(template.basePrice * (Math.random() * (1.1 - 0.95) + 0.95));
            const sellingPrice = Math.floor(originalPrice * ((100 - discountPercent) / 100));

            products.push({
                id: idCounter++,
                name: `${brand} ${template.name}`,
                baseName: template.name,
                brand: brand,
                category: template.cat,
                image: IMAGE_MAP[template.name] || 'https://placehold.co/400',
                perUnitOriginalPrice: originalPrice, 
                perUnitSellingPrice: sellingPrice,
                originalPrice: originalPrice,
                price: sellingPrice,
                discount: discountPercent,
                isVeg: template.veg,
                unitType: template.unitType, 
                selectedWeight: template.unitType === 'kg' ? '1kg' : (template.unitType === 'l' ? '1L' : 'Pack'),
                nutrition: template.nutrition,
                pairingTags: template.pairingTags,
                aisle: CATEGORIES.find(c => c.id === template.cat)?.aisle || 'Aisle 1'
            });
        });
    });
    return products;
};

export const PRODUCT_DB = generateProducts();

export const SARAH_HISTORY = PRODUCT_DB.sort(() => 0.5 - Math.random()).slice(0, 8).map(item => ({
    ...item,
    quantity: 1
}));

export const DAILY_ESSENTIALS = PRODUCT_DB.filter(p => p.brand === 'Amul' || p.brand === 'Fresh Farm').slice(0,4);

// --- 5. EXPANDED RECIPE DATABASE (8 MEAL IDEAS) ---
export const RECIPES = [
    {
        id: 'pasta_kit',
        name: 'Creamy Pesto Pasta',
        time: '20 mins',
        calories: '450 kcal',
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80',
        ingredients: ['Pasta Penne', 'Olive Oil', 'Cheese Slice', 'Tomato Sauce'] 
    },
    {
        id: 'healthy_salad',
        name: 'Green Goddess Salad',
        time: '10 mins',
        calories: '180 kcal',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80',
        ingredients: ['Spinach', 'Tomatoes', 'Cucumber', 'Onions', 'Olive Oil']
    },
    {
        id: 'paneer_masala',
        name: 'Paneer Butter Masala',
        time: '40 mins',
        calories: '550 kcal',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=500&q=80',
        ingredients: ['Paneer', 'Butter', 'Tomatoes', 'Onions', 'Indian Spices']
    },
    {
        id: 'breakfast_combo',
        name: 'English Breakfast',
        time: '15 mins',
        calories: '400 kcal',
        image: 'https://images.unsplash.com/photo-1533089862017-5f267494224c?auto=format&fit=crop&w=500&q=80',
        ingredients: ['Whole Wheat', 'Butter', 'Farm Eggs', 'Orange Juice']
    },
    {
        id: 'mexican_nachos',
        name: 'Loaded Nachos',
        time: '20 mins',
        calories: '600 kcal',
        image: 'https://images.unsplash.com/photo-1513456852971-30cfa2839c92?auto=format&fit=crop&w=500&q=80',
        ingredients: ['Tortilla Chips', 'Salsa Dip', 'Cheese Slice', 'Avocados']
    },
    {
        id: 'rajma_chawal',
        name: 'Rajma Chawal Bowl',
        time: '45 mins',
        calories: '350 kcal',
        image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=500&q=80', // Using kidney beans visual
        ingredients: ['Basmati Rice', 'Kidney Beans', 'Onions', 'Indian Spices']
    },
    {
        id: 'avocado_toast',
        name: 'Avocado Toast',
        time: '5 mins',
        calories: '220 kcal',
        image: 'https://images.unsplash.com/photo-1588137372309-8b6f913b93f6?auto=format&fit=crop&w=500&q=80',
        ingredients: ['Sourdough Bread', 'Avocados', 'Olive Oil', 'Farm Eggs']
    },
    {
        id: 'smoothie_bowl',
        name: 'Berry Blast Smoothie',
        time: '5 mins',
        calories: '250 kcal',
        image: 'https://images.unsplash.com/photo-1623596710450-42c22294247f?auto=format&fit=crop&w=500&q=80',
        ingredients: ['Bananas', 'Whole Milk', 'Red Apples'] 
    }
];