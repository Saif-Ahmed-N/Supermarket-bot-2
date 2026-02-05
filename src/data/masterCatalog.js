// src/data/masterCatalog.js

// --- 1. IMAGE VAULT (Preserved from your code) ---
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

// --- 2. CONFIGURATION ---
const BRANDS = {
    dairy: ['Amul', 'Nestle', 'Mother Dairy', 'Britannia', 'Go Cheese', 'Gowardhan', 'Milky Mist'],
    produce: ['Fresh Farm', 'Organic Life', 'Simply Fresh', 'Nature\'s Best', 'Green Pick'],
    bakery: ['Modern', 'Harvest Gold', 'English Oven', 'Britannia', 'Elite'],
    pantry: ['India Gate', 'Fortune', 'Tata Sampann', 'Aashirvaad', 'Everest', 'MDH', 'Dhara', 'Saffola'],
    snacks: ['Lays', 'Kurkure', 'Bingo', 'Haldirams', 'Bikano', 'Cadbury', 'KitKat', 'Oreo'],
    beverages: ['Coca-Cola', 'Pepsi', 'Tropicana', 'Real', 'Nescafe', 'Red Label', 'Taj Mahal', 'Kinley'],
    meat: ['Licious', 'FreshToHome', 'Venky\'s', 'Real Good', 'Zorabian'],
    frozen: ['McCain', 'Sumeru', 'Amul Frozen', 'Safal', 'Kwality Wall\'s'],
    household: ['Surf Excel', 'Vim', 'Lizol', 'Harpic', 'Ariel', 'Domex', 'Colin'],
    personal: ['Dove', 'Nivea', 'Colgate', 'Sensodyne', 'Pantene', 'Head & Shoulders', 'Dettol'],
    baby: ['Pampers', 'Huggies', 'MamyPoko', 'Johnson\'s Baby', 'Himalaya Baby'],
    pet: ['Pedigree', 'Whiskas', 'Royal Canin', 'Drools']
};

// Core Items (Matches your original list + expanded categories)
const BASE_ITEMS = {
    dairy: [
        { name: 'Whole Milk', price: 60, unit: '1L', tags: ['milk'] },
        { name: 'Butter', price: 55, unit: '100g', tags: ['butter', 'toast'] },
        { name: 'Cheese Slice', price: 120, unit: '200g', tags: ['cheese', 'burger'] },
        { name: 'Farm Eggs', price: 80, unit: '6pc', tags: ['eggs'] },
        { name: 'Paneer', price: 90, unit: '200g', tags: ['paneer', 'curry'] },
        { name: 'Greek Yogurt', price: 70, unit: '100g', tags: ['yogurt'] }
    ],
    produce: [
        { name: 'Red Apples', price: 150, unit: '1kg', tags: ['fruit', 'apple'] },
        { name: 'Bananas', price: 40, unit: '1kg', tags: ['fruit', 'banana'] },
        { name: 'Potatoes', price: 30, unit: '1kg', tags: ['veg', 'potato'] },
        { name: 'Onions', price: 35, unit: '1kg', tags: ['veg', 'onion'] },
        { name: 'Tomatoes', price: 40, unit: '1kg', tags: ['veg', 'tomato'] },
        { name: 'Spinach', price: 25, unit: '1kg', tags: ['veg'] },
        { name: 'Cucumber', price: 30, unit: '1kg', tags: ['veg'] },
        { name: 'Avocados', price: 250, unit: '1pc', tags: ['fruit'] },
        { name: 'Bell Peppers', price: 80, unit: '1kg', tags: ['veg'] },
        { name: 'Garlic', price: 120, unit: '250g', tags: ['veg'] },
        { name: 'Ginger', price: 80, unit: '250g', tags: ['veg'] }
    ],
    pantry: [
        { name: 'Basmati Rice', price: 140, unit: '1kg', tags: ['rice'] },
        { name: 'Olive Oil', price: 600, unit: '1L', tags: ['oil'] },
        { name: 'Ketchup', price: 90, unit: '500g', tags: ['sauce'] },
        { name: 'Pasta Penne', price: 120, unit: '500g', tags: ['pasta'] },
        { name: 'Tomato Sauce', price: 95, unit: '500g', tags: ['sauce'] },
        { name: 'Indian Spices', price: 200, unit: '100g', tags: ['spice'] },
        { name: 'Kidney Beans', price: 110, unit: '1kg', tags: ['dal'] }
    ],
    bakery: [
        { name: 'Sourdough Bread', price: 85, unit: '1pc', tags: ['bread'] },
        { name: 'Whole Wheat', price: 50, unit: '1pc', tags: ['bread'] },
        { name: 'Burger Buns', price: 40, unit: '4pc', tags: ['bread'] }
    ],
    snacks: [
        { name: 'Potato Chips', price: 20, unit: '100g', tags: ['chips'] },
        { name: 'Chocolate Bar', price: 60, unit: '50g', tags: ['choco'] },
        { name: 'Popcorn', price: 85, unit: '150g', tags: ['corn'] },
        { name: 'Tortilla Chips', price: 150, unit: '200g', tags: ['nachos'] },
        { name: 'Salsa Dip', price: 180, unit: '300g', tags: ['dip'] }
    ],
    beverages: [
        { name: 'Cola', price: 40, unit: '750ml', tags: ['soda'] },
        { name: 'Orange Juice', price: 110, unit: '1L', tags: ['juice'] },
        { name: 'Iced Coffee', price: 140, unit: '250ml', tags: ['coffee'] }
    ],
    personal: [
        { name: 'Shampoo', price: 350, unit: '500ml', tags: ['hair'] },
        { name: 'Toothpaste', price: 95, unit: '150g', tags: ['teeth'] },
        { name: 'Body Wash', price: 280, unit: '500ml', tags: ['body'] }
    ]
};

// Filler items to ensure volume
const FILLER_TYPES = {
    household: ['Detergent', 'Dish Wash', 'Floor Cleaner', 'Toilet Cleaner', 'Tissues'],
    frozen: ['French Fries', 'Aloo Tikki', 'Green Peas', 'Corn', 'Nuggets'],
    meat: ['Chicken Curry Cut', 'Chicken Breast', 'Mutton Chops', 'Fish Fillet', 'Prawns']
};

// --- 3. GENERATOR FUNCTION ---
export const generateCatalog = () => {
    let catalog = [];
    let idCounter = 1000;

    // 1. Generate High-Quality Defined Items (Using your IMAGE_MAP)
    Object.keys(BASE_ITEMS).forEach(cat => {
        BASE_ITEMS[cat].forEach(item => {
            const brands = BRANDS[cat] || ['Generic'];
            brands.forEach(brand => {
                // Randomize price slightly for realism
                const price = Math.floor(item.price * (Math.random() * 0.4 + 0.8)); 
                
                catalog.push({
                    id: idCounter++,
                    name: `${brand} ${item.name}`,
                    baseName: item.name,
                    brand: brand,
                    category: cat,
                    price: price,
                    originalPrice: Math.floor(price * 1.2),
                    unit: item.unit,
                    // Use your high-quality image if available, else a placeholder
                    image: IMAGE_MAP[item.name] || `https://placehold.co/400?text=${item.name}`,
                    isVeg: !['meat', 'fish', 'egg'].some(x => item.tags.includes(x)),
                    tags: item.tags || [cat]
                });
            });
        });
    });

    // 2. Generate Volume Filler (To reach ~9000 SKUs)
    Object.keys(FILLER_TYPES).forEach(cat => {
        FILLER_TYPES[cat].forEach(typeName => {
            const brands = BRANDS[cat] || ['Generic'];
            brands.forEach(brand => {
                // Generate multiple sizes per brand per item
                ['Small', 'Medium', 'Large', 'Family Pack'].forEach((size, idx) => {
                    const basePrice = 50 + (idx * 50);
                    catalog.push({
                        id: idCounter++,
                        name: `${brand} ${typeName} (${size})`,
                        baseName: typeName,
                        brand: brand,
                        category: cat,
                        price: basePrice,
                        originalPrice: Math.floor(basePrice * 1.15),
                        unit: size,
                        image: `https://placehold.co/400?text=${typeName}`,
                        isVeg: cat !== 'meat',
                        tags: [cat, typeName.toLowerCase()]
                    });
                });
            });
        });
    });

    return catalog;
};