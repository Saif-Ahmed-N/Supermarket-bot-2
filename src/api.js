const BASE_URL = 'http://localhost:8000';

// Helper to map Backend DB structure to Frontend structure
const mapProduct = (p) => ({
    id: p.index,
    name: p.product,
    baseName: p.product, // Simplified
    category: p.category,
    price: p.sale_price,
    originalPrice: p.market_price,
    image: p.image_url || ('https://placehold.co/400?text=' + encodeURIComponent(p.category)),
    isVeg: p.is_veg !== false, // Default to true if null/undefined
    rating: p.rating,
    description: p.description,
    brand: p.brand
});

export const api = {
    // 1. Search Products
    searchProducts: async (query) => {
        try {
            const res = await fetch(`${BASE_URL}/products?search=${encodeURIComponent(query)}&limit=10`);
            const data = await res.json();
            return data.map(mapProduct);
        } catch (e) {
            console.error("Search failed:", e);
            return [];
        }
    },

    // 2. Get by Category
    getProductsByCategory: async (category) => {
        try {
            const res = await fetch(`${BASE_URL}/products?category=${encodeURIComponent(category)}&limit=20`);
            const data = await res.json();
            return data.map(mapProduct);
        } catch (e) {
            console.error("Category fetch failed:", e);
            return [];
        }
    },

    // 3. Get All Categories (for mapping logic if needed)
    getCategories: async () => {
        try {
            const res = await fetch(`${BASE_URL}/categories`);
            return await res.json();
        } catch (e) {
            return [];
        }
    },

    async createOrder(orderData) {
        try {
            const res = await fetch(`${BASE_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            if (!res.ok) throw new Error('Failed to create order');
            return await res.json();
        } catch (error) {
            console.error("Order Error:", error);
            return null;
        }
    },

    async getOrders(userId) {
        try {
            const res = await fetch(`${BASE_URL}/orders/${userId}`);
            if (!res.ok) throw new Error('Failed to fetch history');
            return await res.json();
        } catch (error) {
            console.log("History fetch failed:", error);
            return [];
        }
    }
};
