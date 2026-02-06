// Static content for the application (Recipes, etc.)
// This replaces mockData dependencies for static app content

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

// Placeholder for store aisle map if needed (currently dynamic in backend but UI might need fallback)
export const STORE_MAP_FALLBACK = {
    'entrance': 'Entrance',
    'you_are_here': 'You are here'
};
