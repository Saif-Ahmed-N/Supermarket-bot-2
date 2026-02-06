// src/data/masterCatalog.js

// --- 1. CONFIGURATION ---
const BRANDS = {
    dairy: ['Amul', 'Nestle', 'Mother Dairy', 'Britannia', 'Go Cheese', 'Gowardhan', 'Milky Mist', 'Prabhat'],
    produce: ['Fresh Farm', 'Organic Life', 'Simply Fresh', 'Nature\'s Best', 'Green Pick', 'Farm To Fork'],
    bakery: ['Modern', 'Harvest Gold', 'English Oven', 'Britannia', 'Elite', 'Perfect Bread'],
    pantry: ['India Gate', 'Fortune', 'Tata Sampann', 'Aashirvaad', 'Everest', 'MDH', 'Dhara', 'Saffola', '24 Mantra'],
    snacks: ['Lays', 'Kurkure', 'Bingo', 'Haldirams', 'Bikano', 'Cadbury', 'KitKat', 'Oreo', 'Parle'],
    beverages: ['Coca-Cola', 'Pepsi', 'Tropicana', 'Real', 'Nescafe', 'Red Label', 'Taj Mahal', 'Kinley', 'Bisleri'],
    meat: ['Licious', 'FreshToHome', 'Venky\'s', 'Real Good', 'Zorabian', 'Nandu\'s'],
    frozen: ['McCain', 'Sumeru', 'Amul Frozen', 'Safal', 'Kwality Wall\'s', 'Yummiez'],
    household: ['Surf Excel', 'Vim', 'Lizol', 'Harpic', 'Ariel', 'Domex', 'Colin', 'Comfort'],
    personal: ['Dove', 'Nivea', 'Colgate', 'Sensodyne', 'Pantene', 'Head & Shoulders', 'Dettol', 'Lifebuoy'],
};

const ADJECTIVES = ['Premium', 'Classic', 'Fresh', 'Pure', 'Natural', 'Organic', 'Creamy', 'Homestyle', 'Original', 'Rich', 'Healthy', 'Tasty'];

// --- 2. IMAGE LIBRARY ---
const IMAGE_LIBRARY = {
    dairy: [
        'https://images.unsplash.com/photo-1635436322965-48296b5a8c29?w=500&q=80', // Milk
        'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80', // Butter
        'https://images.unsplash.com/photo-1486297678749-173660d0d49c?w=500&q=80', // Cheese
        'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80', // Yogurt
    ],
    produce: [
        'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80', // Veggies
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80', // Potatoes
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80', // Tomato
        'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500&q=80', // Strawberry
    ],
    pantry: [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80', // Rice
        'https://images.unsplash.com/photo-1474979266404-7eaacbcdccef?w=500&q=80', // Oil
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80', // Spices
    ],
    bakery: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80', // Bread
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80', // Croissant
    ],
    snacks: [
        'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&q=80', // Chips
        'https://images.unsplash.com/photo-1621939514649-28b12e81658e?w=500&q=80', // Burger/Snack
    ],
    beverages: [
        'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80', // Cola
        'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80', // Juice
    ],
    meat: [
        'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&q=80', // Meat
    ],
    household: [
        'https://images.unsplash.com/photo-1585421514738-01798e14806c?w=500&q=80', // Cleaning
    ],
    personal: [
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80', // Shampoo
    ],
    frozen: [
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80', // Frozen
    ]
};

// --- 3. UNIT VARIANTS ---
// This defines how we split items into weights
const VARIANTS = {
    // For Fruit, Veg, Rice, Dal, etc.
    WEIGHT: [
        { label: '250g', multiplier: 0.25 },
        { label: '500g', multiplier: 0.5 },
        { label: '1kg', multiplier: 1.0 }
    ],
    // For Milk, Juice, Oil, Shampoo, etc.
    VOLUME: [
        { label: '250ml', multiplier: 0.25 },
        { label: '500ml', multiplier: 0.5 },
        { label: '1L', multiplier: 1.0 }
    ],
    // For Bread, Eggs, Soap (Single units)
    UNIT: [
        { label: '1 Pack', multiplier: 1.0 }
    ]
};

// --- 4. CORE ITEMS (With Variant Types) ---
const BASE_ITEMS = {
    dairy: [
        { name: 'Whole Milk', price: 60, type: 'VOLUME', tags: ['milk'] }, // Price is per 1L
        { name: 'Salted Butter', price: 550, type: 'WEIGHT', tags: ['butter', 'toast'] }, // Price is per 1kg
        { name: 'Cheese Block', price: 600, type: 'WEIGHT', tags: ['cheese', 'burger'] },
        { name: 'Paneer Block', price: 450, type: 'WEIGHT', tags: ['paneer', 'curry'] },
        { name: 'Greek Yogurt', price: 300, type: 'WEIGHT', tags: ['yogurt'] },
    ],
    produce: [
        { name: 'Red Apples', price: 150, type: 'WEIGHT', tags: ['fruit', 'apple'] },
        { name: 'Robusta Bananas', price: 60, type: 'WEIGHT', tags: ['fruit', 'banana'] },
        { name: 'New Potatoes', price: 40, type: 'WEIGHT', tags: ['veg', 'potato'] },
        { name: 'Red Onions', price: 50, type: 'WEIGHT', tags: ['veg', 'onion'] },
        { name: 'Roma Tomatoes', price: 60, type: 'WEIGHT', tags: ['veg', 'tomato'] },
        { name: 'Fresh Spinach', price: 80, type: 'WEIGHT', tags: ['veg'] },
    ],
    pantry: [
        { name: 'Basmati Rice', price: 140, type: 'WEIGHT', tags: ['rice'] },
        { name: 'Olive Oil', price: 900, type: 'VOLUME', tags: ['oil'] }, // Price per 1L
        { name: 'Ketchup', price: 200, type: 'WEIGHT', tags: ['sauce'] },
        { name: 'Pasta Penne', price: 300, type: 'WEIGHT', tags: ['pasta'] },
        { name: 'Red Kidney Beans', price: 120, type: 'WEIGHT', tags: ['dal'] }
    ],
    bakery: [
        { name: 'Sliced Bread', price: 45, type: 'UNIT', tags: ['bread'] },
        { name: 'Burger Buns', price: 40, type: 'UNIT', tags: ['bread'] }
    ],
    beverages: [
        { name: 'Cola', price: 60, type: 'VOLUME', tags: ['soda'] }, // Price per 1L
        { name: 'Orange Juice', price: 120, type: 'VOLUME', tags: ['juice'] },
    ],
    personal: [
        { name: 'Shampoo', price: 400, type: 'VOLUME', tags: ['hair'] }, // Price per 1L
        { name: 'Body Wash', price: 350, type: 'VOLUME', tags: ['body'] }
    ]
};

// --- 5. GENERATOR FUNCTION ---
export const generateCatalog = () => {
    let catalog = [];
    let idCounter = 1000;

    const getRandomImg = (cat) => {
        const pool = IMAGE_LIBRARY[cat] || IMAGE_LIBRARY['pantry'];
        return pool[Math.floor(Math.random() * pool.length)];
    };

    Object.keys(BASE_ITEMS).forEach(cat => {
        BASE_ITEMS[cat].forEach(item => {
            const brands = BRANDS[cat] || ['Generic'];
            brands.forEach(brand => {
                
                // Determine which set of variants to use (Weight vs Volume vs Unit)
                const variantList = VARIANTS[item.type] || VARIANTS.UNIT;

                // Create a product SKU for EACH variant (250g, 500g, etc.)
                variantList.forEach(variant => {
                    const useAdjective = Math.random() > 0.5;
                    const adjective = useAdjective ? ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)] + ' ' : '';
                    
                    // Final Name: "Amul Fresh Whole Milk (500ml)"
                    const finalName = `${brand} ${adjective}${item.name} (${variant.label})`;
                    
                    // Calculate price based on the base price (usually per kg/L) * multiplier
                    // e.g., 60 rs/L * 0.5 = 30 rs for 500ml
                    let calculatedPrice = Math.floor(item.price * variant.multiplier);
                    
                    // Add slight randomization per brand
                    calculatedPrice = Math.floor(calculatedPrice * (Math.random() * 0.2 + 0.9));

                    catalog.push({
                        id: idCounter++,
                        name: finalName,
                        baseName: item.name,
                        brand: brand,
                        category: cat,
                        price: calculatedPrice,
                        originalPrice: Math.floor(calculatedPrice * 1.2),
                        unit: variant.label, // Storing "250g", "1L", etc.
                        image: getRandomImg(cat),
                        isVeg: !['meat', 'fish', 'egg'].some(x => (item.tags || []).includes(x)),
                        tags: item.tags || [cat]
                    });
                });
            });
        });
    });

    return catalog;
};