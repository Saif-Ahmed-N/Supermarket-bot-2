import { useState, useRef } from 'react';
import { RECIPES } from '../data/staticContent'; // New Static Content
// import { SARAH_HISTORY, CATEGORIES } from '../data/mockData'; // DELETED
import { api } from '../api';
import { useCart } from '../context/CartContext';

export const useChatLogic = (user, dynamicCategories = []) => {
    // Dynamic Categories or empty array (User must rely on API now)
    const activeCategories = dynamicCategories;
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const { updateQuantity, setIsCartOpen, cartTotal, cart, showToast, clearCart, dietMode, checkForMissedItems } = useCart();
    const hasInitialized = useRef(false);

    const addMsg = (sender, content, type = 'text', data = null) => {
        setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender, content, type, data }]);
    };

    // --- HELPER: WORD TO NUMBER CONVERTER ---
    const convertWordsToNumbers = (text) => {
        const numberMap = {
            'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
            'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
            'a': 1, 'an': 1 // "Add a milk" -> "Add 1 milk"
        };

        // Replace whole words only
        return text.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|a|an)\b/gi, (match) => {
            return numberMap[match.toLowerCase()] || match;
        });
    };

    // --- 1. CORE: SINGLE ITEM ADD LOGIC (ASYNC READY) ---
    const processSingleItemAdd = async (rawCommandStr) => {
        // 1. Pre-process: Convert "two" -> "2"
        let processingStr = convertWordsToNumbers(rawCommandStr.trim());

        // 2. Extract Quantity
        let quantityToAdd = 1;
        const qtyMatch = processingStr.match(/\b(\d+)\b/);
        if (qtyMatch) {
            const lookAhead = processingStr.substring(qtyMatch.index + qtyMatch[0].length).trim();
            // Ensure it's not a weight number (like 500 in 500g)
            if (!/^(ml|g|kg|l|litre|liter|gm|grm|gms|gram|grams)/i.test(lookAhead)) {
                quantityToAdd = parseInt(qtyMatch[1], 10);
                processingStr = processingStr.replace(qtyMatch[0], '');
            }
        }

        // 3. Extract Weight
        let detectedWeight = null;
        const weightRegex = /(\d+(?:\.\d+)?)\s*(kilograms?|kgs?|grams?|grms?|gms?|gm?|g|liters?|litres?|ml|l|packets?|packs?|pcs?)\b/i;
        const weightMatch = processingStr.match(weightRegex);

        if (weightMatch) {
            let rawVal = weightMatch[1];
            let rawUnit = weightMatch[2].toLowerCase();

            if (rawUnit.startsWith('k')) rawUnit = 'kg';
            else if (rawUnit.startsWith('g')) rawUnit = 'g';
            else if (rawUnit.startsWith('m')) rawUnit = 'ml';
            else if (rawUnit === 'l' || rawUnit.startsWith('lit')) rawUnit = 'l';

            const standardKey = rawVal + rawUnit;

            if (standardKey === '1000g') detectedWeight = '1kg';
            else if (standardKey === '1000ml') detectedWeight = '1L';
            else if (standardKey.toLowerCase() === '1l') detectedWeight = '1L';
            else detectedWeight = standardKey;

            processingStr = processingStr.replace(weightMatch[0], '');
        }

        // 4. Clean Query
        const cleanQuery = processingStr
            .replace(/\b(add|buy|get|i want|need|quantity|qty|of|packets?|packs?|items?|pieces?|pcs?|and|please)\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();

        // 5. Search Database (Async via Backend)
        const apiMatches = await api.searchProducts(cleanQuery);
        const matches = dietMode === 'veg' ? apiMatches.filter(p => p.isVeg) : apiMatches;

        if (matches.length >= 1) {
            let product = matches[0];
            const brandMatch = matches.find(p => p.brand && cleanQuery.toLowerCase().includes(p.brand.toLowerCase()));
            if (brandMatch) product = brandMatch;

            if (detectedWeight && (product.unitType === 'kg' || product.unitType === 'l')) {
                product.selectedWeight = detectedWeight;
                let multiplier = 1;
                if (detectedWeight.includes('500')) multiplier = 0.55;
                if (detectedWeight.includes('250')) multiplier = 0.30;
                product.price = Math.floor(product.perUnitSellingPrice * multiplier);
            }

            const variantId = `${product.id}-${product.selectedWeight}`;
            const existingItem = cart.find(c => `${c.id}-${c.selectedWeight}` === variantId);
            updateQuantity(product, (existingItem ? existingItem.quantity : 0) + quantityToAdd);

            return { success: true, name: product.name, qty: quantityToAdd, weight: product.selectedWeight };
        }

        return { success: false, query: cleanQuery };
    };

    // --- 2. VOICE RECOGNITION ---
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice input is not supported in this browser environment.");
            return;
        }
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            handleUserMessage(transcript);
        };
        recognition.start();
    };

    // --- 3. RECIPE HANDLER (Updated for Dynamic Servings) ---
    const handleRecipeAdd = async (recipe, servings = 2) => {
        let count = 0;
        let addedNames = [];

        for (const ing of recipe.ingredients) {
            const matches = await api.searchProducts(ing.searchTerm);
            const product = matches.length > 0 ? matches[0] : null;

            if (product) {
                const requiredQty = Math.ceil(ing.qtyPerServing * servings);
                const variantId = `${product.id}-${product.selectedWeight || 'std'}`;
                const existing = cart.find(c => `${c.id}-${c.selectedWeight || 'std'}` === variantId);
                const currentQty = existing ? existing.quantity : 0;

                updateQuantity(product, currentQty + requiredQty);
                count += requiredQty;
                addedNames.push(product.baseName);
            }
        }

        const uniqueNames = [...new Set(addedNames)].slice(0, 3).join(', ');

        showToast(`Added ingredients for ${servings} people`, 'success');
        addMsg('bot', `I've added items for ${servings} servings of ${recipe.name} (${uniqueNames}...).`, 'text');

        setTimeout(() => {
            addMsg('bot', 'Would you like to customize the quantities or proceed?', 'options', [
                { id: 'view_cart', label: 'Review Cart', action: 'View Cart' },
                { id: 'fresh_start', label: 'Shop More' }
            ]);
        }, 600);
    };

    // --- 4. TABLE CONFIRMATION ---
    const handleTableConfirm = (selectedItems) => {
        selectedItems.forEach(item => {
            updateQuantity(item, item.quantity);
        });

        addMsg('user', `Confirmed ${selectedItems.length} items.`);
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            addMsg('bot', `Your selection has been updated in the cart.`, 'text');

            setTimeout(() => {
                addMsg('bot', 'Please select an option to continue:', 'options', [
                    { id: 'checkout_now', label: 'Checkout Now' },
                    { id: 'fresh_start', label: 'Browse More Categories' }
                ]);
            }, 600);
        }, 600);
    };

    // --- 5. OPTION SELECTION ---
    const handleOptionSelect = (option) => {
        if (option.id !== 'confirm_order') addMsg('user', option.label);
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);

            // A. RECIPES
            if (option.action === 'Show Recipes') {
                addMsg('bot', 'Here are some premium meal kits available today:', 'recipe_list', RECIPES);
            }

            // B. ADD ALL & SHOP MORE (Fixed Flow) - DISABLED (No History Yet)
            else if (option.id === 'reorder_shop') {
                // TODO: Fetch Real History
                addMsg('bot', 'Select a department to browse items:', 'grid');
            }

            // C. NAVIGATION
            else if (option.id === 'fresh_start' || option.action === 'Show Categories') {
                addMsg('bot', 'Please select a department:', 'grid');
            }
            else if (option.action === 'Show Last Order') {
                addMsg('bot', 'How would you like to view your history?', 'options', [
                    { id: 'view_last_order', label: 'View Last Order' },
                    { id: 'view_all_orders', label: 'Previous Orders' }
                ]);
            }
            else if (option.id === 'view_last_order') {
                if (!user || !user.id) {
                    addMsg('bot', 'Please log in to view your order history.');
                    return;
                }
                (async () => {
                    try {
                        const orders = await api.getOrders(user.id);
                        if (orders && orders.length > 0) {
                            const lastOrder = orders[0];
                            const historyItems = lastOrder.items.map(i => ({
                                id: i.product_id,
                                name: i.product_name,
                                price: i.price,
                                image: i.image_url,
                                quantity: i.quantity
                            }));
                            const essentials = await api.searchProducts('milk') || [];
                            addMsg('bot', `Here is your last order from ${new Date(lastOrder.created_at).toLocaleDateString()}:`, 'dashboard', {
                                history: historyItems,
                                essentials: essentials.slice(0, 5)
                            });
                        } else {
                            addMsg('bot', `You haven't placed any orders yet.`);
                        }
                    } catch (err) {
                        addMsg('bot', "I couldn't fetch your order history.");
                    }
                })();
            }
            else if (option.id === 'view_all_orders') {
                if (!user || !user.id) {
                    addMsg('bot', 'Please log in to view your order history.');
                    return;
                }
                (async () => {
                    try {
                        const orders = await api.getOrders(user.id);
                        if (orders && orders.length > 0) {
                            addMsg('bot', `I found ${orders.length} previous orders for you:`, 'order_history', orders);
                        } else {
                            addMsg('bot', 'You have no order history yet.');
                        }
                    } catch (err) {
                        addMsg('bot', "Error loading order history.");
                    }
                })();
            }
            else if (option.action === 'View Cart') {
                setIsCartOpen(true);
            }
            else if (option.action === 'Help') {
                addMsg('bot', 'Support Services:', 'options', [
                    { id: 'support_faq', label: 'View FAQs' },
                    { id: 'support_call', label: 'Call Customer Support' }
                ]);
            }

            // D. CHECKOUT FLOW
            else if (option.id === 'checkout_now' || option.id === 'proceed') {
                if (cart.length === 0) {
                    addMsg('bot', 'Your cart is currently empty. Please add items to proceed.', 'text');
                } else {
                    // Smart Check before checkout
                    const missedItems = checkForMissedItems(cart);
                    if (missedItems.length > 0) {
                        addMsg('bot', `Based on your cart, you might be missing these essentials:`, 'carousel', missedItems);
                        addMsg('bot', 'Would you like to add them?', 'options', [
                            { id: 'force_checkout', label: 'No, Proceed to Payment' }
                        ]);
                    } else {
                        addMsg('bot', `Total Amount: ₹${cartTotal.toLocaleString()}.`, 'text');
                        setTimeout(() => {
                            addMsg('bot', 'Select your preferred fulfillment method:', 'options', [
                                { id: 'pickup', label: 'Store Pickup' },
                                { id: 'delivery', label: 'Home Delivery' }
                            ]);
                        }, 1000);
                    }
                }
            }

            else if (option.id === 'force_checkout') {
                addMsg('bot', `Total Amount: ₹${cartTotal.toLocaleString()}.`, 'text');
                setTimeout(() => {
                    addMsg('bot', 'Select your preferred fulfillment method:', 'options', [
                        { id: 'pickup', label: 'Store Pickup' },
                        { id: 'delivery', label: 'Home Delivery' }
                    ]);
                }, 1000);
            }

            // E. MANIFEST REVIEW
            else if (option.id === 'pickup') {
                setIsCartOpen(false);
                const mode = 'Store Pickup';
                const details = 'Counter 4';
                addMsg('bot', 'Please review your final order manifest:', 'order_summary', { mode, details, items: cart, total: cartTotal });
            }
            else if (option.id === 'delivery') {
                setIsCartOpen(false);
                addMsg('bot', 'Please provide your delivery details:', 'delivery_form', { name: user.name || '', address: '', mobile: '', altMobile: '' });
            }
            else if (option.id === 'submit_delivery') {
                const { name, address, mobile, altMobile } = option.data;
                const mode = 'Home Delivery';
                const details = `${name} | M: ${mobile} | Alt: ${altMobile} | ${address}`;
                addMsg('bot', 'Excellent! Here is your final order manifest:', 'order_summary', { mode, details, items: cart, total: cartTotal });
            }

            // F. FINAL CONFIRMATION
            // F. FINAL CONFIRMATION
            else if (option.id === 'confirm_order') {
                // CREATE REAL ORDER
                const orderPayload = {
                    user_id: user.id || 'guest',
                    user_name: user.name || 'Guest',
                    total_amount: cartTotal,
                    payment_method: option.payment_method || 'online',
                    items: cart.map(item => ({
                        product_id: item.id || item.index,
                        product_name: item.name || item.product,
                        quantity: item.quantity,
                        price: item.price || item.sale_price,
                        weight: item.selectedWeight || 'std',
                        image_url: item.image
                    }))
                };

                api.createOrder(orderPayload).then(order => {
                    if (order) {
                        addMsg('bot', `🎉 Order Placed Successfully!`, 'text');
                        addMsg('bot', `Your Order ID is #${order.id}. Thank you for shopping with CosmoCart Mart.`, 'text');
                        clearCart();
                    } else {
                        addMsg('bot', `Payment failed. Please try again.`, 'error');
                    }
                });
            }

            // G. ABORT/EDIT
            else if (option.id === 'abort_order') {
                addMsg('bot', 'Checkout paused. Your cart is open for adjustments.', 'text');
                setIsCartOpen(true);
            }

            // H. SUPPORT
            else if (option.id === 'support_faq') {
                addMsg('bot', 'Standard Policy:\n• Delivery: Complimentary above ₹500.\n• Returns: Instant processing at doorstep.', 'text');
                setTimeout(() => addMsg('bot', 'How would you like to continue?', 'options', [{ id: 'fresh_start', label: 'Back to Shopping' }]), 1000);
            }
            else if (option.id === 'support_call') {
                addMsg('bot', '📞 Support Line: 1800-COSMO-MART (Available 9 AM - 9 PM)', 'text');
            }

        }, 600);
    };

    // --- 6. NLP BRAIN (LLM INTEGRATED) ---
    const processBotLogic = async (text) => {
        setIsTyping(true);

        // Handle Sub-Category Selection (Dynamic Database Split)
        if (text.startsWith('ShowSub ')) {
            const cmdData = text.replace('ShowSub ', '');
            const [parentCat, subLabel] = cmdData.split('|');

            setTimeout(async () => {
                setIsTyping(false);
                addMsg('user', subLabel);

                try {
                    // 1. Fetch filtered products from Backend
                    const targetedProducts = await api.getProductsBySubCategory(parentCat, subLabel);

                    if (targetedProducts.length > 0) {
                        const mapped = targetedProducts.map(p => ({
                            ...p,
                            baseName: p.name,
                            image: p.image || ('https://placehold.co/400?text=' + encodeURIComponent(p.category))
                        }));

                        addMsg('bot', `Found ${mapped.length} items for ${subLabel}:`, 'product_grid', mapped);
                    } else {
                        addMsg('bot', `No matching items found for ${subLabel} in our ${parentCat} department.`, 'text');
                    }
                } catch (err) {
                    console.error("Error fetching subcategory products", err);
                    addMsg('bot', "I had trouble finding those products. Please try again.");
                }
            }, 600);
            return;
        }

        const lower = text.toLowerCase();

        // MANUAL OVERRIDE: Checkout
        if (lower.includes('checkout') || lower.includes('place order')) {
            setIsTyping(false);
            handleOptionSelect({ id: 'checkout_now', label: 'Checkout' });
            return;
        }

        // F. CATEGORY NAVIGATION (Manual Override)
        const matchedCategory = activeCategories.find(c =>
            lower.includes(c.id) || lower.includes(c.label.toLowerCase())
        );

        if (matchedCategory) {
            const categoryName = matchedCategory.label;

            try {
                const subCats = await api.getSubCategories(categoryName);

                if (subCats && subCats.length > 0) {
                    const formattedSubCats = subCats.map(sub => ({
                        id: sub.name.toLowerCase().replace(/ /g, '_'),
                        label: `🔹 ${sub.name}`,
                        command: `ShowSub ${categoryName}|${sub.name}`,
                        img: sub.image || `https://placehold.co/400?text=${encodeURIComponent(sub.name)}`
                    }));

                    addMsg('bot', `Select a ${categoryName} section:`, 'sub_carousel', formattedSubCats);

                    return;
                }
            } catch (err) {
                console.error("Error fetching subcategories:", err);
            }

            // Fallback: Show all products
            const productsInCategory = await api.getProductsByCategory(matchedCategory.label);
            addMsg('bot', `Browsing ${matchedCategory.label}:`, 'carousel', productsInCategory);
            return;
        }

        try {
            // Call Backend LLM Service
            const response = await api.chat(text);
            setIsTyping(false);

            if (!response.success && response.query_type === 'UNKNOWN') {
                addMsg('bot', response.message);
                if (response.suggestions) {
                    addMsg('bot', "Try asking:", 'options', response.suggestions.map(s => ({ id: s, label: s })));
                }
                return;
            }

            // A. PRICE QUERY
            if (response.query_type === 'PRICE_QUERY') {
                const p = response.product;
                const mappedProduct = {
                    ...p,
                    price: p.sale_price,
                    image: p.image_url || ('https://placehold.co/400?text=' + encodeURIComponent(p.category))
                };
                addMsg('bot', response.message);
                addMsg('bot', '', 'product_card', mappedProduct);
            }

            // B. CART ADD
            else if (response.query_type === 'CART_ADD') {
                const qtyToAdd = response.quantity || 1;

                // Backend already resolved the product — use it directly if available
                if (response.success && response.product) {
                    const p = response.product;
                    const product = {
                        ...p,
                        id: p.id,
                        name: p.name,
                        baseName: p.name,
                        price: p.sale_price,
                        perUnitSellingPrice: p.sale_price,
                        perUnitOriginalPrice: p.market_price,
                        brand: p.brand,
                        isVeg: p.is_veg,
                        unitType: p.unit_type,
                        rating: p.rating,
                        image: p.image_url || ('https://placehold.co/400?text=' + encodeURIComponent(p.category || 'Product'))
                    };

                    // Handle weight logic if returned by LLM
                    if (response.weight && (product.unitType === 'kg' || product.unitType === 'l')) {
                        product.selectedWeight = response.weight;
                    }

                    // Update Cart
                    const variantId = `${product.id}-${product.selectedWeight || 'std'}`;
                    const existingItem = cart.find(c => `${c.id}-${c.selectedWeight}` === variantId);
                    updateQuantity(product, (existingItem ? existingItem.quantity : 0) + qtyToAdd);

                    addMsg('bot', `Added ${qtyToAdd}x ${product.name} to your cart.`, 'success');
                } else {
                    // Fallback: search by product name from response
                    const queryName = response.product?.name || response.product_name || 'the item';
                    const matches = await api.searchProducts(queryName);
                    const validMatches = dietMode === 'veg' ? matches.filter(p => p.isVeg) : matches;

                    if (validMatches.length > 0) {
                        const product = validMatches[0];
                        if (response.weight && (product.unitType === 'kg' || product.unitType === 'l')) {
                            product.selectedWeight = response.weight;
                        }

                        const variantId = `${product.id}-${product.selectedWeight || 'std'}`;
                        const existingItem = cart.find(c => `${c.id}-${c.selectedWeight}` === variantId);
                        updateQuantity(product, (existingItem ? existingItem.quantity : 0) + qtyToAdd);

                        addMsg('bot', `Added ${qtyToAdd}x ${product.name} to your cart.`, 'success');
                    } else {
                        addMsg('bot', `I understood you want ${queryName}, but I couldn't find it in stock.`, 'error');
                    }
                }
            }

            // C. CATEGORY FILTER
            else if (response.query_type === 'CATEGORY_FILTER') {
                const products = response.products.map(p => ({
                    ...p,
                    id: p.id,
                    name: p.name,
                    baseName: p.name, // CRITICAL: ProductCard expects baseName
                    price: p.sale_price,
                    perUnitSellingPrice: p.sale_price,
                    perUnitOriginalPrice: p.market_price,
                    brand: p.brand,
                    isVeg: p.is_veg,
                    unitType: p.unit_type,
                    rating: p.rating,
                    image: p.image_url || ('https://placehold.co/400?text=' + encodeURIComponent(p.category))
                }));
                addMsg('bot', response.message);
                addMsg('bot', '', 'carousel', products);
            }

            // C2. PRODUCT SEARCH (show all brands of a specific product)
            else if (response.query_type === 'PRODUCT_SEARCH') {
                if (response.products && response.products.length > 0) {
                    const products = response.products.map(p => ({
                        ...p,
                        id: p.id,
                        name: p.name,
                        baseName: p.name,
                        price: p.sale_price,
                        perUnitSellingPrice: p.sale_price,
                        perUnitOriginalPrice: p.market_price,
                        brand: p.brand,
                        isVeg: p.is_veg,
                        unitType: p.unit_type,
                        rating: p.rating,
                        image: p.image_url || ('https://placehold.co/400?text=' + encodeURIComponent(p.category || 'Product'))
                    }));
                    addMsg('bot', response.message);
                    addMsg('bot', '', 'carousel', products);
                } else {
                    addMsg('bot', response.message || "No products found matching your search.");
                }
            }

            // C3. PRICE FILTER (show products above/below a price)
            else if (response.query_type === 'PRICE_FILTER') {
                if (response.products && response.products.length > 0) {
                    const products = response.products.map(p => ({
                        ...p,
                        id: p.id,
                        name: p.name,
                        baseName: p.name,
                        price: p.sale_price,
                        perUnitSellingPrice: p.sale_price,
                        perUnitOriginalPrice: p.market_price,
                        brand: p.brand,
                        isVeg: p.is_veg,
                        unitType: p.unit_type,
                        rating: p.rating,
                        image: p.image_url || ('https://placehold.co/400?text=' + encodeURIComponent(p.category || 'Product'))
                    }));
                    addMsg('bot', response.message);
                    addMsg('bot', '', 'carousel', products);
                } else {
                    addMsg('bot', response.message || "No products found in the specified price range.");
                }
            }

            // D. CHECKOUT
            else if (response.query_type === 'CHECKOUT') {
                addMsg('bot', response.message);
                // Simulate selecting the 'checkout_now' option to trigger existing flow
                setTimeout(() => handleOptionSelect({ id: 'checkout_now', label: 'Checkout' }), 500);
            }

            // D. FALLBACK / UNKNOWN handled above
            else {
                addMsg('bot', response.message || "I'm not sure how to help with that.");
            }

            // --- LLM Success Check ---
            if (response.success && response.query_type !== 'UNKNOWN') {
                return; // Already handled by LLM logic above
            }

            // --- Fallback to Manual Logic (F. through J.) ---
            // F. CATEGORY NAVIGATION - MOVED UP


            // G. GENERIC BROWSE
            if (lower.includes('category') || lower.includes('aisle') || lower.includes('shop') || lower === 'browse') {
                addMsg('bot', 'Select a department to begin:', 'grid');
                return;
            }

            // H. SMART ADD COMMAND (Advanced "AND" + Weight logic)
            if (lower.startsWith('add ') || lower.startsWith('buy ') || lower.startsWith('get ') || lower.includes('want')) {

                // Split complex orders (e.g. "Add milk and eggs")
                const commands = lower.split(/,| and /);
                let successCount = 0;
                let failedQueries = [];

                // Use for...of loop to handle async sequential processing
                for (let subCommand of commands) {
                    if (!subCommand.includes('add') && !subCommand.includes('buy') && !subCommand.includes('get')) subCommand = "add " + subCommand;

                    const result = await processSingleItemAdd(subCommand);
                    if (result.success) {
                        successCount++;
                        showToast(`Added ${result.qty}x ${result.name}`, 'success');
                    } else {
                        if (result.query.length > 2) failedQueries.push(result.query);
                    }
                }

                if (successCount > 0) {
                    addMsg('bot', `✅ ${successCount} item(s) have been added to your cart.`, 'text');
                    if (failedQueries.length === 0) {
                        setTimeout(() => addMsg('bot', 'How would you like to proceed?', 'options', [{ id: 'checkout_now', label: 'Checkout' }, { id: 'fresh_start', label: 'Add More' }]), 500);
                    }
                }

                if (failedQueries.length > 0) {
                    addMsg('bot', `⚠️ I could not locate: "${failedQueries.join(', ')}". Please try browsing our departments.`, 'grid');
                }
                return;
            }

            // I. HISTORY
            if (lower.includes('history') || lower.includes('last order')) {
                const history = await api.getOrders(user.id || 'guest');
                if (history.length > 0) {
                    addMsg('bot', `Retrieved your previous order details:`);
                    addMsg('bot', '', 'order_preview', history[0].items.map(i => ({ ...i, name: i.product_name, image: i.image_url })));
                } else {
                    addMsg('bot', `No previous orders found.`);
                }
                return;
            }

            // J. SEARCH FALLBACK
            const keywords = lower.split(' ').filter(w => w.length > 2);
            let results = [];
            for (const k of keywords) {
                const m = await api.searchProducts(k);
                results.push(...m);
            }
            results = [...new Map(results.map(i => [i.id, i])).values()].slice(0, 15);
            if (dietMode === 'veg') results = results.filter(p => p.isVeg);

            if (results.length > 0) {
                addMsg('bot', `Found these matching items:`, 'carousel', results);
            } else {
                addMsg('bot', "I couldn't find that item. Please try a department:", 'grid');
            }
        } catch (err) {
            console.error(err);
            setIsTyping(false);
            addMsg('bot', "Sorry, I'm having trouble connecting to my brain right now.");
        }
    };

    const handleUserMessage = (text) => {
        if (!text) return;
        if (text.toLowerCase() === 'view cart') { setIsCartOpen(true); return; }
        addMsg('user', text);
        processBotLogic(text);
    };

    const initializeChat = () => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        setTimeout(() => {
            addMsg('bot', `Welcome, ${user.name}. How can I assist you today?`);
            setTimeout(async () => {
                if (user.id) {
                    // FETCH REAL HISTORY
                    const history = await api.getOrders(user.id);

                    if (history && history.length > 0) {
                        // Extract items from last order for reorder
                        const lastOrderItems = history[0].items.map(i => ({
                            id: i.product_id,
                            name: i.product_name,
                            baseName: i.product_name, // Fallback
                            price: i.price,
                            quantity: i.quantity,
                            image: i.image_url
                        }));

                        addMsg('bot', `Welcome back, ${user.name}! I found your recent order.`);
                        setTimeout(() => {
                            // Show "Smart Reorder" with actual past items
                            addMsg('bot', '', 'order_preview', lastOrderItems);
                            setTimeout(() => {
                                addMsg('bot', 'Would you like to reorder these or start fresh?', 'options', [
                                    { id: 'reorder_shop', label: 'Add All & Shop More' },
                                    { id: 'fresh_start', label: 'Start Fresh' }
                                ]);
                            }, 800);
                        }, 600);
                    } else {
                        // New User / No History
                        addMsg('bot', `Welcome, ${user.name}. Please select a department to begin:`, 'grid');
                    }
                } else {
                    addMsg('bot', `Please select a department to begin:`, 'grid');
                }
            }, 500);
        }, 400);
    };

    // --- 7. HANDLE REORDER ---
    const handleReorder = (order) => {
        order.items.forEach(item => {
            const product = {
                id: item.product_id,
                name: item.product_name,
                baseName: item.product_name, // fallback
                price: item.price,
                image: item.image_url,
                selectedWeight: item.weight || 'std',
                unitType: item.weight && (item.weight.includes('kg') || item.weight.includes('g')) ? 'kg' : 'other', // guesstimate
            };
            // Find if it exists to get current quantity
            const variantId = `${product.id}-${product.selectedWeight}`;
            const existing = cart.find(c => `${c.id}-${c.selectedWeight}` === variantId);
            updateQuantity(product, (existing ? existing.quantity : 0) + item.quantity);
        });
        showToast(`Added ${order.items.length} items from Order #${order.id}`, 'success');
        setIsCartOpen(true);
    };

    return { messages, isTyping, isListening, startListening, handleUserMessage, addMsg, initializeChat, handleOptionSelect, handleTableConfirm, handleRecipeAdd, handleReorder };
};