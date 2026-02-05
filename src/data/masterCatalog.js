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

// --- 2. IMAGE LIBRARY (REAL PHOTOS) ---
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

const BASE_ITEMS = {
    dairy: [
        { name: 'Whole Milk', price: 60, unit: '1L', tags: ['milk'] },
        { name: 'Salted Butter', price: 55, unit: '100g', tags: ['butter', 'toast'] },
        { name: 'Cheese Slices', price: 120, unit: '200g', tags: ['cheese', 'burger'] },
        { name: 'Paneer Block', price: 90, unit: '200g', tags: ['paneer', 'curry'] },
        { name: 'Greek Yogurt', price: 70, unit: '100g', tags: ['yogurt'] },
        { name: 'Low Fat Curd', price: 40, unit: '400g', tags: ['curd'] }
    ],
    produce: [
        { name: 'Red Apples', price: 150, unit: '1kg', tags: ['fruit', 'apple'] },
        { name: 'Robusta Bananas', price: 40, unit: '1kg', tags: ['fruit', 'banana'] },
        { name: 'New Potatoes', price: 30, unit: '1kg', tags: ['veg', 'potato'] },
        { name: 'Red Onions', price: 35, unit: '1kg', tags: ['veg', 'onion'] },
        { name: 'Roma Tomatoes', price: 40, unit: '1kg', tags: ['veg', 'tomato'] },
        { name: 'Fresh Spinach', price: 25, unit: '1kg', tags: ['veg'] },
        { name: 'Green Cucumber', price: 30, unit: '1kg', tags: ['veg'] },
        { name: 'Ripe Avocados', price: 250, unit: '1pc', tags: ['fruit'] }
    ],
    pantry: [
        { name: 'Basmati Rice', price: 140, unit: '1kg', tags: ['rice'] },
        { name: 'Extra Virgin Olive Oil', price: 600, unit: '1L', tags: ['oil'] },
        { name: 'Tomato Ketchup', price: 90, unit: '500g', tags: ['sauce'] },
        { name: 'Pasta Penne', price: 120, unit: '500g', tags: ['pasta'] },
        { name: 'Turmeric Powder', price: 200, unit: '100g', tags: ['spice'] },
        { name: 'Red Kidney Beans', price: 110, unit: '1kg', tags: ['dal'] }
    ],
    bakery: [{ name: 'Sliced Bread', price: 40, unit: '1pc', tags: ['bread'] }],
    snacks: [{ name: 'Salted Chips', price: 20, unit: '100g', tags: ['chips'] }],
    beverages: [{ name: 'Fizz Drink', price: 40, unit: '750ml', tags: ['soda'] }],
    personal: [{ name: 'Soap Bar', price: 35, unit: '1pc', tags: ['soap'] }]
};

const FILLER_TYPES = {
    household: ['Detergent Powder', 'Dish Gel', 'Floor Cleaner', 'Toilet Cleaner', 'Paper Napkins'],
    frozen: ['French Fries', 'Aloo Tikki', 'Green Peas', 'Sweet Corn', 'Veg Nuggets'],
    meat: ['Chicken Curry Cut', 'Boneless Chicken', 'Mutton Chops', 'Fish Steaks', 'Prawns'],
    snacks: ['Masala Chips', 'Cream Cookies', 'Bhujia Sev', 'Salted Peanuts', 'Choco Bar'],
    beverages: ['Sparkling Water', 'Lemon Soda', 'Mango Drink', 'Apple Juice', 'Iced Tea'],
    personal: ['Hair Shampoo', 'Face Wash', 'Body Lotion', 'Hand Wash', 'Toothpaste']
};

export const generateCatalog = () => {
    let catalog = [];
    let idCounter = 1000;

    // Helper to get random image from category
    const getRandomImg = (cat) => {
        const pool = IMAGE_LIBRARY[cat] || IMAGE_LIBRARY['pantry'];
        return pool[Math.floor(Math.random() * pool.length)];
    };

    // A. Generate Core Items
    Object.keys(BASE_ITEMS).forEach(cat => {
        BASE_ITEMS[cat].forEach(item => {
            const brands = BRANDS[cat] || ['Generic'];
            brands.forEach(brand => {
                const useAdjective = Math.random() > 0.5;
                const adjective = useAdjective ? ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)] + ' ' : '';
                const finalName = `${brand} ${adjective}${item.name}`;
                const price = Math.floor(item.price * (Math.random() * 0.3 + 0.85));

                catalog.push({
                    id: idCounter++,
                    name: finalName,
                    baseName: item.name,
                    brand: brand,
                    category: cat,
                    price: price,
                    originalPrice: Math.floor(price * 1.2),
                    unit: item.unit,
                    image: getRandomImg(cat), // REAL IMAGE
                    isVeg: !['meat', 'fish', 'egg'].some(x => (item.tags || []).includes(x)),
                    tags: item.tags || [cat]
                });
            });
        });
    });

    // B. Generate Filler Items
    Object.keys(FILLER_TYPES).forEach(cat => {
        FILLER_TYPES[cat].forEach(typeName => {
            const brands = BRANDS[cat] || ['Generic'];
            brands.forEach(brand => {
                ['Small', 'Large'].forEach((variant, idx) => {
                    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
                    const finalName = `${brand} ${adjective} ${typeName} (${variant})`;
                    const basePrice = 50 + (idx * 40);
                    
                    catalog.push({
                        id: idCounter++,
                        name: finalName,
                        baseName: typeName,
                        brand: brand,
                        category: cat,
                        price: basePrice,
                        originalPrice: Math.floor(basePrice * 1.15),
                        unit: idx === 0 ? 'Small' : 'Large',
                        image: getRandomImg(cat), // REAL IMAGE
                        isVeg: cat !== 'meat',
                        tags: [cat, typeName.toLowerCase()]
                    });
                });
            });
        });
    });

    return catalog;
};