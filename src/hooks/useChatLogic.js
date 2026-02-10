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
                addMsg('bot', `Please check 'Order History' tab for details.`);
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

    // --- 6. NLP BRAIN (ASYNC READY) ---
    const processBotLogic = async (text) => {
        let lower = text.toLowerCase().trim();
        setIsTyping(true);

        // Handle Sub-Category Selection (Strict Database Split)
        if (text.startsWith('ShowSub ')) {
            const cmdData = text.replace('ShowSub ', '');
            const [parentCat, subLabel] = cmdData.split('|');

            setTimeout(async () => {
                setIsTyping(false);
                addMsg('user', subLabel);

                // 1. Fetch ALL products in the Parent Category from DB
                const allCategoryProducts = await api.getProductsByCategory(parentCat);
                console.log(`🔍 [Beverages Debug] Fetching category: "${parentCat}"`, {
                    totalProducts: allCategoryProducts.length,
                    subcategory: subLabel
                });

                // 2. Comprehensive Split Map
                const masterSplitRules = {
                    // Baby Care Section
                    "Diapers & Wipes": ["diaper", "wipe", "rash", "mat", "bags"],
                    "Bath, Skin & Hair Care": ["soap", "wash", "shampoo", "oil", "lotion", "powder", "sunscreen", "bath", "massage"],
                    "Grooming & Hygiene": ["grooming", "nail", "brush", "comb", "toothpaste", "finger", "pacifier", "soother", "aspirator"],
                    "Feeding & Nursing": ["feeding", "bottle", "nipple", "breast", "storage", "bib", "bowl", "plate", "spoon", "cup", "sterilizer"],
                    "Baby Food & Nutrition": ["formula", "cereal", "weaning", "snacks", "mix", "toddler", "nutrition", "food"],
                    "Toys & Learning": ["toy", "rattle", "teether", "play mat", "musical", "gym", "educational", "books"],
                    "Baby Clothing & Accessories": ["clothing", "onesie", "bodysuit", "socks", "booties", "caps", "mittens", "swaddle", "blanket"],
                    "Health & Safety": ["thermometer", "first aid", "teething", "mosquito", "guards", "locks", "monitor", "night light"],
                    "Travel & Outdoor": ["stroller", "pram", "car seat", "carrier", "sling", "diaper bag", "travel"],
                    "Organic & Eco-Friendly": ["organic", "natural", "eco", "biodegradable", "plant-based"],
                    "Gift Packs & Combos": ["gift", "combo", "starter kit", "pack", "gift set"],
                    "Essentials & Daily Needs": ["cotton", "buds", "tissue", "laundry", "detergent", "softener"],

                    // Produce Section
                    "Fresh Fruits": ["apple", "banana", "mango", "orange", "grapes", "pomegranate", "watermelon", "fruit", "pear", "plum"],
                    "Fresh Vegetables": ["potato", "onion", "tomato", "carrot", "cucumber", "beans", "capsicum", "vegetable", "ginger", "garlic"],
                    "Leafy Greens & Herbs": ["spinach", "coriander", "mint", "methi", "leafy", "greens", "palak", "dhaniya"],
                    "Exotic Fruits": ["avocado", "kiwi", "dragon", "berry", "straw berry", "blue berry", "exotic"],
                    "Exotic Vegetables": ["mushroom", "broccoli", "zucchini", "asparagus", "bell pepper", "purple cabbage"],
                    "Organic Fruits & Vegetables": ["organic"],
                    "Cut, Peeled & Sprouts": ["cut", "peeled", "sprout", "chopped"],
                    "Seasonal Produce": ["seasonal"],
                    "Frozen Fruits & Vegetables": ["frozen", "peas", "strawberry"],
                    "Juices, Purees & Pulps": ["juice", "puree", "pulp", "smoothie"],
                    "Dry Fruits & Nuts": ["almond", "cashew", "walnut", "raisin", "date", "apricot", "pistachio"],
                    "Combo Packs & Value Deals": ["combo", "pack", "deal", "value", "box"],

                    // Snacks & Branded Foods Section
                    "Chips & Crisps": ["chips", "crisps", "lays", "pringle", "kurkure", "dorito", "nacho", "potato stick"],
                    "Biscuits & Cookies": ["biscuit", "cookie", "oreo", "parle", "bourbon", "digestive", "marie", "hide & seek", "rusk"],
                    "Namkeen & Savoury Snacks": ["namkeen", "bhujia", "savoury", "mixture", "dal moth", "gathiya", "haldiram", "bikaji", "sev"],
                    "Chocolates & Candies": ["chocolate", "candy", "dairy milk", "kitkat", "munch", "5 star", "gems", "snickers", "mentos", "lollipop", "toblerone"],
                    "Cakes, Muffins & Brownies": ["cake", "muffin", "brownie", "cupcake", "britannia cake", "bar cake", "choco pie"],
                    "Wafers & Snack Bars": ["wafer", "snack bar", "granola", "energy bar", "chikki", "protein bar"],
                    "Breakfast Cereals & Muesli": ["cereal", "muesli", "flakes", "oats", "chocos", "kellogg"],
                    "Instant Noodles & Pasta": ["noodle", "pasta", "maggi", "yippee", "macaroni", "spaghetti", "indomie", "koka"],
                    "Ready-to-Eat Foods": ["ready to eat", "ready-to-eat", "upma", "poha", "meal", "instant mix", "heat and eat", "mtr"],
                    "Spreads, Dips & Sauces": ["spread", "dip", "sauce", "ketchup", "jam", "butter", "mayo", "honey", "nutella", "peanut butter"],
                    "Healthy & Diet Snacks": ["healthy", "diet", "roasted", "sugar free", "fat free", "multigrain", "quinoa", "makhana"],
                    "Kids Snacks": ["kids", "kinder", "toy", "gems", "milky bar", "fruit chew"],

                    // Kitchen, Garden & Pets Section
                    "Cookware & Bakeware": ["cookware", "pan", "pot", "kadai", "tawa", "pressure cooker", "cooker", "frying pan", "saucepan", "wok", "bakeware", "baking tray", "cake tin", "muffin tray", "oven", "non-stick", "steel", "aluminum"],
                    "Kitchen Tools & Gadgets": ["knife", "peeler", "grater", "chopper", "slicer", "masher", "whisk", "spatula", "ladle", "tongs", "opener", "scissors", "rolling pin", "measuring", "strainer", "colander", "funnel", "gadget"],
                    "Storage Containers & Jars": ["container", "jar", "storage", "airtight", "canister", "lunch box", "tiffin", "bottle", "flask", "casserole", "tupperware", "plastic container", "glass jar", "steel container"],
                    "Dinnerware & Serveware": ["plate", "bowl", "dish", "serving", "platter", "tray", "dinner set", "crockery", "ceramic", "melamine", "steel plate", "katori", "thali"],
                    "Drinkware & Bottles": ["glass", "cup", "mug", "tumbler", "water bottle", "sipper", "flask", "jug", "pitcher", "drinkware", "coffee mug", "tea cup"],
                    "Kitchen Cleaning Supplies": ["dishwash", "scrubber", "sponge", "cleaning", "detergent", "liquid", "soap", "brush", "wiper", "cloth", "towel", "gloves", "bin", "dustbin", "garbage bag"],
                    "Gardening Tools & Accessories": ["garden tool", "spade", "shovel", "rake", "hoe", "trowel", "pruner", "shears", "watering can", "hose", "sprinkler", "gloves", "fork", "cultivator"],
                    "Plants, Seeds & Fertilizers": ["plant", "seed", "fertilizer", "manure", "compost", "soil", "potting mix", "grow bag", "sapling", "herb", "vegetable seed", "flower seed", "indoor plant", "outdoor plant"],
                    "Pots, Planters & Garden Decor": ["pot", "planter", "vase", "garden decor", "ceramic pot", "plastic pot", "hanging planter", "decorative", "stand", "trellis", "garden ornament"],
                    "Pet Food & Treats": ["pet food", "dog food", "cat food", "bird food", "fish food", "treats", "biscuit", "kibble", "wet food", "dry food", "puppy food", "kitten food"],
                    "Pet Grooming & Hygiene": ["pet shampoo", "grooming", "brush", "comb", "nail clipper", "ear cleaner", "wipes", "deodorizer", "tick", "flea", "dental", "toothbrush"],
                    "Pet Accessories & Toys": ["pet toy", "leash", "collar", "harness", "bed", "mat", "bowl", "feeder", "carrier", "cage", "litter", "scratching post", "ball", "chew toy"],

                    // Eggs, Meat & Fish Section
                    "Eggs": ["egg", "anda"],
                    "Chicken": ["chicken", "murgi"],
                    "Mutton & Lamb": ["mutton", "lamb", "goat", "keema"],
                    "Pork": ["pork", "bacon", "ham", "sausage"],
                    "Fresh Fish": ["fish", "rohu", "catla", "surmai", "pomfret", "salmon", "tuna"],
                    "Seafood (Prawns, Crab, etc.)": ["prawn", "crab", "lobster", "shrimp", "squid", "seafood"],
                    "Marinated & Ready-to-Cook": ["marinated", "ready to cook", "tikka", "kebab", "ready-to-cook"],
                    "Processed & Cold Cuts": ["salami", "sausage", "ham", "bacon", "pepperoni", "cold cut", "processed"],
                    "Frozen Meat & Seafood": ["frozen", "nuggets", "finger", "patty"],
                    "Organic & Free-Range": ["organic", "free range", "free-range"],
                    "Cuts & Portions (Boneless, Curry Cut, Fillet)": ["boneless", "curry cut", "fillet", "portion", "cut"],
                    "Combo Packs & Value Deals": ["combo", "pack", "deal", "value"],

                    // Gourmet & World Food Section
                    "Imported Chocolates & Confectionery": ["luxury", "imported chocolate", "international chocolate", "gift", "confectionery", "chocolate", "truffle"],
                    "International Snacks & Chips": ["international snack", "chips", "nacho", "popcorn", "pretzel", "wafer", "pringle", "dorito"],
                    "World Sauces, Dips & Condiments": ["sauce", "dip", "condiment", "hummus", "pesto", "salsa", "mayo", "ketchup", "mustard", "spread", "dressing"],
                    "Pasta, Noodles & Italian Staples": ["pasta", "noodle", "spaghetti", "macaroni", "lasagna", "italian", "penne", "fusilli"],
                    "Asian Cuisine Essentials": ["asian", "thai", "japanese", "chinese", "soy sauce", "miso", "curry paste", "sushi", "ramen", "hakkka"],
                    "Middle Eastern & Mediterranean Foods": ["middle eastern", "mediterranean", "hummus", "falafel", "tahini", "couscous", "pita", "olive"],
                    "Mexican & Latin American Foods": ["mexican", "latin american", "taco", "tortilla", "nacho", "jalapeno", "salsa"],
                    "Cheese & Dairy Specialties": ["cheese", "international cheese", "dairy", "yogurt", "greek yogurt", "butter", "mozzarella", "cheddar", "paneer"],
                    "Olive Oils, Vinegars & Cooking Oils": ["olive oil", "vinegar", "balsamic", "canola oil", "cooking oil", "extra virgin"],
                    "Spices, Herbs & Seasonings (Global)": ["spice", "herb", "seasoning", "world spice", "basil", "oregano", "paprika", "thyme"],
                    "Gourmet Breakfast & Desserts": ["breakfast", "dessert", "muesli", "granola", "cereal bar", "ice cream", "cake", "pancake", "waffle"],
                    "Organic, Vegan & Specialty Foods": ["organic", "vegan", "specialty", "gluten free", "dairy free", "plant based"],

                    // Cleaning & Household Section
                    "Laundry Detergents & Softeners": ["laundry", "detergent", "softener", "comfort", "surf excel", "ariel", "tide", "liquid detergent", "fabric"],
                    "Dishwashing Supplies": ["dishwash", "vim", "exo", "pril", "scrubber", "sponge", "liquid dishwash", "bar bowl"],
                    "Floor & Surface Cleaners": ["floor cleaner", "surface cleaner", "lysol", "lizol", "phenyle", "domex", "colin", "glass cleaner"],
                    "Bathroom & Toilet Cleaners": ["bathroom cleaner", "toilet cleaner", "harpic", "domex", "tile cleaner"],
                    "Kitchen Cleaners & Degreasers": ["kitchen cleaner", "degreaser", "chimney cleaner", "oven cleaner", "colin kitchen"],
                    "Disinfectants & Sanitizers": ["disinfectant", "sanitizer", "savlon", "dettol", "alcohol", "spray"],
                    "Air Fresheners & Odour Control": ["air freshener", "odour", "godrej aer", "odonil", "spray", "diffuser", "camphor"],
                    "Pest Control & Repellents": ["pest control", "repellent", "hit", "mortein", "mosquito", "coil", "cockroach", "rat", "ant"],
                    "Cleaning Tools & Accessories": ["brush", "broom", "mop", "wiper", "bucket", "dustpan", "cloth", "gloves", "sponge"],
                    "Paper Products (Tissues, Towels, Foils)": ["tissue", "paper towel", "napkin", "toilet paper", "aluminum foil", "cling wrap", "kitchen roll"],
                    "Waste Management (Bins, Bags)": ["dustbin", "garbage bag", "trash bag", "bin", "waste"],
                    "Home Care & Miscellaneous": ["pooja", "agarbatti", "candle", "matchbox", "battery", "bulb", "shoe polish"],

                    // Beauty & Hygiene Section
                    "Bath & Shower": ["soap", "shower gel", "body wash", "bath", "loofah", "bathing bar", "hand wash", "sanitizer"],
                    "Hair Care": ["shampoo", "conditioner", "hair oil", "hair color", "hair serum", "hair gel", "scalp", "hair care"],
                    "Skin Care": ["face wash", "moisturiser", "lotion", "cream", "sunscreen", "toner", "serum", "face mask", "cleanser", "skin care", "body milk"],
                    "Oral Care": ["toothpaste", "toothbrush", "mouthwash", "floss", "tongue cleaner", "oral care"],
                    "Men’s Grooming": ["shaving cream", "foam", "razor", "aftershave", "beard oil", "beard wash", "men's face wash", "deo for men", "grooming men"],
                    "Women’s Hygiene": ["sanitary pad", "napkins", "tampon", "panty liner", "intimate wash", "menstrual cup", "women hygiene"],
                    "Deodorants & Fragrances": ["deodorant", "perfume", "body spray", "mist", "fragrance", "cologne", "roll-on", "deo"],
                    "Hand Wash & Sanitizers": ["hand wash", "sanitizer", "liquid hand wash", "hand rub"],
                    "Shaving & Hair Removal": ["razor", "blade", "shaving cream", "hair removal cream", "wax", "epilator", "aftershave"],
                    "Cosmetics & Makeup": ["lipstick", "kajal", "eyeliner", "foundation", "mascara", "nail polish", "compact", "blush", "makeup", "cosmetics"],
                    "Personal Care Appliances": ["hair dryer", "trimer", "shaver", "straightener", "electric toothbrush", "appliances"],
                    "Wellness & Daily Hygiene": ["cotton buds", "ear buds", "sanitizer", "mask", "adult diaper", "wellness", "antiseptic", "daily hygiene"],

                    // Bakery, Cakes & Dairy Section
                    "Bread & Buns": ["bread", "bun", "pav", "loaf", "burger bun", "pizza base", "brown bread", "white bread", "fruit bread", "rusk"],
                    "Cakes & Pastries": ["cake", "pastry", "muffin", "cupcake", "brownie", "slice cake", "lava cake", "doughnut", "tea cake"],
                    "Cookies & Rusks": ["cookie", "rusk", "biscuit", "marie", "digestive", "bourbon", "hide & seek", "oreo", "good day"],
                    "Bakery Snacks & Savouries": ["puff", "patisseries", "khari", "cream roll", "toast", "snack", "bakery snack", "savouries"],
                    "Fresh Milk": ["milk", "amul milk", "mother dairy", "toned milk", "full cream", "cow milk", "packet milk"],
                    "Curd, Yogurt & Lassi": ["curd", "dahi", "yogurt", "lassi", "mishti doi", "greek yogurt", "flavoured yogurt", "chaach"],
                    "Butter, Ghee & Cream": ["butter", "ghee", "cream", "cooking cream", "whipping cream", "amul butter", "table butter", "white butter"],
                    "Cheese & Paneer": ["cheese", "paneer", "mozzarella", "cheddar", "slice cheese", "cheese spread", "cubes", "cream cheese"],
                    "Ice Cream & Frozen Desserts": ["ice cream", "kulfi", "frozen dessert", "cone", "tub", "bar", "cassata", "sorbet"],
                    "Flavoured Milk & Milkshakes": ["flavoured milk", "milkshake", "badam milk", "chocolate milk", "smoothie", "milk drink"],
                    "Eggless & Specialty Bakery": ["eggless", "gluten free", "sugar free", "whole wheat", "multigrain", "specialty bakery", "baked"],
                    "Combo Packs & Party Packs": ["combo", "party pack", "multipack", "deal", "value pack", "family pack"],

                    // Foodgrains, Oil & Masala Section
                    "Rice & Rice Products": ["rice", "poha", "basmati", "kolam", "brown rice", "idli rice", "puffed rice", "murmura"],
                    "Wheat, Atta & Flours": ["atta", "wheat", "flour", "maida", "besan", "sooji", "rava", "ragi flour", "bajra flour", "corn flour"],
                    "Dals & Pulses": ["dal", "pulse", "tur dal", "moong dal", "urad dal", "chana dal", "masoor dal", "rajma", "chole", "kabuli chana"],
                    "Millets & Other Grains": ["millet", "jowar", "bajra", "ragi", "quinoa", "barley", "oats", "grain"],
                    "Cooking Oils & Ghee": ["oil", "ghee", "sunflower oil", "mustard oil", "groundnut oil", "olive oil", "rice bran oil", "soybean oil", "vanaspati"],
                    "Whole Spices": ["whole spice", "jeera", "mustard seed", "cardamom", "cloves", "cinnamon", "pepper", "methi", "coriander seed"],
                    "Powdered Spices & Masalas": ["powder", "turmeric", "chilli powder", "coriander powder", "hing", "black pepper powder"],
                    "Blended & Ready Masalas": ["masala", "garam masala", "chicken masala", "paneer masala", "sambar powder", "biryani masala"],
                    "Salt, Sugar & Sweeteners": ["salt", "sugar", "jaggery", "honey", "stevia", "sweetener"],
                    "Dry Fruits & Nuts": ["almond", "cashew", "walnut", "raisin", "pista", "date", "dry fruit", "nut"],
                    "Organic & Healthy Staples": ["organic", "healthy", "multigrain", "low carb", "diet"],
                    "Combo Packs & Value Deals": ["combo", "value", "deal", "pack", "save"],

                    // Beverages Section (Updated to match DB subcategories EXACTLY)
                    "Tea": [" tea", "chai", "green tea", "black tea", "tea bag", "leaf tea", "herbal tea", "masala tea"],
                    "Coffee": ["coffee", "instant coffee", "filter coffee", "bru", "nescafe", "ground coffee", "davidoff", "levista", "cappuccino", "espresso", "mocha", "decaf"],
                    "Health Drink, Supplement": ["health drink", "supplement", "horlicks", "boost", "bournvita", "complan", "pediasure", "nutrition", "protein drink", "ensure", "milo", "protinex"],
                    "Energy & Soft Drinks": ["soft drink", "soda", "cola", "pepsi", "coke", "thums up", "sprite", "fanta", "mirinda", "limca", "7up", "diet coke", "zero coke", "fizz", "carbonated", "energy", "red bull", "monster", "sting", "gatorade", "glucon", "sports drink", "electrolyte", "kamikaze", "detox"],
                    "Fruit Juices & Drinks": ["juice", "fruit drink", "tropicana", "real juice", "b natural", "maaza", "frooti", "slice", "paper boat", "pulpy", "nectar", "fruit"],
                    "Water": ["water", "mineral water", "bisleri", "kinley", "aquafina", "bailley", "himalayan water", "packaged water", "drinking water", "sparkling", "tonic", "perrier", "flavoured water"]
                };

                // 3. Filter and Classify
                const targetedProducts = allCategoryProducts.filter(product => {
                    const name = product.name.toLowerCase();
                    const subCat = (product.subCategory || '').toLowerCase();
                    const keywords = masterSplitRules[subLabel] || [];

                    // Logic: Match if any keyword matches name OR subCategory OR if subLabel itself matches
                    const isKeywordMatch = keywords.some(k => name.includes(k.toLowerCase()) || subCat.includes(k.toLowerCase()));
                    const isLabelMatch = name.includes(subLabel.toLowerCase()) || subCat.includes(subLabel.toLowerCase());

                    return (isKeywordMatch || isLabelMatch) && product.category === parentCat;
                });

                console.log(`🔍 [Beverages Debug] Filtering results for "${subLabel}":`, {
                    totalProductsInCategory: allCategoryProducts.length,
                    matchedProducts: targetedProducts.length,
                    keywords: masterSplitRules[subLabel]?.slice(0, 5) || [],
                    sampleMatches: targetedProducts.slice(0, 3).map(p => ({ name: p.name, subCategory: p.subCategory }))
                });

                if (targetedProducts.length > 0) {
                    addMsg('bot', `I've split the ${parentCat} inventory for ${subLabel}. Found ${targetedProducts.length} items:`, 'carousel', targetedProducts);
                } else {
                    addMsg('bot', `No matching items found for ${subLabel} in our ${parentCat} department. Try another section:`, 'sub_carousel', []);
                }
            }, 600);
            return;
        }

        setTimeout(async () => {
            setIsTyping(false);

            // A. IN-STORE NAVIGATION
            if (lower.includes('where is') || lower.includes('find') || lower.includes('locate') || lower.includes('map')) {
                const target = CATEGORIES.find(c => lower.includes(c.id) || lower.includes(c.label.toLowerCase().split(' ')[0]));
                if (target) {
                    addMsg('bot', `${target.label} is located in ${target.aisle}.`, 'map_view', { aisle: target.aisle, category: target.label });
                } else {
                    addMsg('bot', 'Here is the store directory:', 'map_view', { aisle: 'Entrance', category: 'You are here' });
                }
                return;
            }

            // B. COMPARISON
            if (lower.includes('compare')) {
                const tokens = lower.split(' ');
                // Simple search for first 2 tokens that return results
                const foundProducts = [];
                for (const t of tokens) {
                    if (t.length < 3) continue;
                    const matches = await api.searchProducts(t);
                    if (matches.length > 0) foundProducts.push(matches[0]);
                    if (foundProducts.length >= 2) break;
                }

                if (foundProducts.length === 2) {
                    addMsg('bot', `Comparison View: ${foundProducts[0].name} vs ${foundProducts[1].name}`, 'comparison_card', foundProducts);
                    return;
                }
            }

            // C. RECIPES
            if (lower.includes('recipe') || lower.includes('cook') || lower.includes('dinner') || lower.includes('meal')) {
                addMsg('bot', 'Here are some premium meal kits available:', 'recipe_list', RECIPES);
                return;
            }

            // D. CHECKOUT
            if (lower.includes('checkout') || lower.includes('proceed') || lower.includes('buy now')) {
                handleOptionSelect({ id: 'checkout_now', label: 'Checkout' });
                return;
            }

            // E. SUPPORT
            if (lower.includes('help') || lower.includes('support')) {
                addMsg('bot', 'How can we assist you?', 'options', [
                    { id: 'support_faq', label: 'View FAQs' },
                    { id: 'support_call', label: 'Call Customer Care' }
                ]);
                return;
            }

            // F. CATEGORY NAVIGATION
            const matchedCategory = activeCategories.find(c =>
                lower.includes(c.id) || lower.includes(c.label.toLowerCase())
            );

            if (matchedCategory) {
                const categoryName = matchedCategory.label.toLowerCase();

                if (categoryName === 'baby care' || categoryName === 'fruits & vegetables' || categoryName === 'snacks & branded foods' || categoryName === 'kitchen, garden & pets' || categoryName === 'eggs, meat & fish' || categoryName === 'gourmet & world food' || categoryName === 'cleaning & household' || categoryName === 'beauty & hygiene' || categoryName === 'bakery, cakes & dairy' || categoryName === 'foodgrains, oil & masala' || categoryName === 'beverages') {
                    let subCats = [];
                    let welcomeMsg = '';

                    if (categoryName === 'baby care') {
                        welcomeMsg = 'Select a Baby Care department:';
                        subCats = [
                            { label: "Diapers & Wipes", icon: "🍼", query: "diaper wipes rash cream changing mat" },
                            { label: "Bath, Skin & Hair Care", icon: "🛁", query: "baby soap wash shampoo oil lotion powder" },
                            { label: "Grooming & Hygiene", icon: "🧴", query: "grooming nail clipper brush comb toothpaste" },
                            { label: "Feeding & Nursing", icon: "🍼", query: "feeding bottle nipple breast pump sippy cup" },
                            { label: "Baby Food & Nutrition", icon: "🍚", query: "formula cereal baby food weaning nutrition" },
                            { label: "Toys & Learning", icon: "🧸", query: "rattle teether toys play mat books" },
                            { label: "Baby Clothing & Accessories", icon: "👕", query: "onesie bodysuit socks booties swaddle" },
                            { label: "Health & Safety", icon: "🚼", query: "thermometer first aid mosquito safety monitor" },
                            { label: "Travel & Outdoor", icon: "🎒", query: "stroller pram car seat carrier sling" },
                            { label: "Organic & Eco-Friendly", icon: "🌿", query: "organic natural eco biodegradable" },
                            { label: "Gift Packs & Combos", icon: "🎁", query: "gift combo starter pack shower" },
                            { label: "Essentials & Daily Needs", icon: "📦", query: "cotton pad buds tissue laundry detergent" }
                        ];
                    } else if (categoryName === 'beverages') {
                        welcomeMsg = 'Select a Beverages section:';
                        subCats = [
                            { label: "Tea", icon: "☕", query: "tea chai" },
                            { label: "Coffee", icon: "☕", query: "coffee nescafe bru" },
                            { label: "Health Drink, Supplement", icon: "💪", query: "health drink horlicks boost bournvita complan nutrition" },
                            { label: "Energy & Soft Drinks", icon: "🥤", query: "soft drink soda cola pepsi coke energy red bull monster" },
                            { label: "Fruit Juices & Drinks", icon: "🧃", query: "juice fruit drink tropicana real maaza" },
                            { label: "Water", icon: "💧", query: "water mineral bisleri kinley" }
                        ];
                    } else if (categoryName === 'bakery, cakes & dairy') {
                        welcomeMsg = 'Select a Bakery, Cakes & Dairy section:';
                        subCats = [
                            { label: "Bread & Buns", icon: "🍞", query: "bread buns pav loaf" },
                            { label: "Cakes & Pastries", icon: "🍰", query: "cakes pastries muffins brownies" },
                            { label: "Cookies & Rusks", icon: "🍪", query: "cookies rusks biscuits" },
                            { label: "Bakery Snacks & Savouries", icon: "🥐", query: "khari puff cream roll" },
                            { label: "Fresh Milk", icon: "🥛", query: "milk packet cows" },
                            { label: "Curd, Yogurt & Lassi", icon: "🥣", query: "curd yogurt lassi dahi" },
                            { label: "Butter, Ghee & Cream", icon: "🧈", query: "butter ghee cream" },
                            { label: "Cheese & Paneer", icon: "🧀", query: "cheese paneer cubes slices" },
                            { label: "Ice Cream & Frozen Desserts", icon: "🍦", query: "ice cream kulfi frozen dessert" },
                            { label: "Flavoured Milk & Milkshakes", icon: "🥤", query: "flavoured milk milkshakes" },
                            { label: "Eggless & Specialty Bakery", icon: "🧁", query: "eggless specialty bakery" },
                            { label: "Combo Packs & Party Packs", icon: "📦", query: "combo packs party packs" }
                        ];
                    } else if (categoryName === 'cleaning & household') {
                        welcomeMsg = 'Select a Cleaning & Household section:';
                        subCats = [
                            { label: "Laundry Detergents & Softeners", icon: "🧺", query: "laundry detergent softener comfort" },
                            { label: "Dishwashing Supplies", icon: "🧽", query: "dishwash scrubber sponge liquid" },
                            { label: "Floor & Surface Cleaners", icon: "🧹", query: "floor surface lizol lysol cleaner" },
                            { label: "Bathroom & Toilet Cleaners", icon: "🚽", query: "bathroom toilet harpic domex" },
                            { label: "Kitchen Cleaners & Degreasers", icon: "🍳", query: "kitchen degreaser chimney" },
                            { label: "Disinfectants & Sanitizers", icon: "🧴", query: "disinfectant sanitizer dettol savlon" },
                            { label: "Air Fresheners & Odour Control", icon: "🌬️", query: "air freshener odonil aer" },
                            { label: "Pest Control & Repellents", icon: "🦟", query: "pest repellent hit mortein mosquito" },
                            { label: "Cleaning Tools & Accessories", icon: "🪣", query: "brush mop broom bucket cloth" },
                            { label: "Paper Products (Tissues, Towels, Foils)", icon: "🧻", query: "tissue towel napkin foil" },
                            { label: "Waste Management (Bins, Bags)", icon: "🗑️", query: "dustbin garbage bag bin" },
                            { label: "Home Care & Miscellaneous", icon: "🏠", query: "pooja incense matches battery" }
                        ];
                    } else if (categoryName === 'foodgrains, oil & masala') {
                        welcomeMsg = 'Select a Foodgrains, Oil & Masala section:';
                        subCats = [
                            { label: "Rice & Rice Products", icon: "🍚", query: "rice poha puffed murmura" },
                            { label: "Wheat, Atta & Flours", icon: "🌾", query: "atta wheat flour maida besan sooji" },
                            { label: "Dals & Pulses", icon: "🥣", query: "dal pulse tur moong urad chana masoor rajma chole" },
                            { label: "Millets & Other Grains", icon: "🌾", query: "millet jowar bajra ragi quinoa barley" },
                            { label: "Cooking Oils & Ghee", icon: "🛢️", query: "oil ghee sunflower mustard groundnut olive" },
                            { label: "Whole Spices", icon: "🌶️", query: "whole spice jeera mustard cardamom clove cinnamon pepper" },
                            { label: "Powdered Spices & Masalas", icon: "🧂", query: "powder turmeric chilli coriander hing" },
                            { label: "Blended & Ready Masalas", icon: "🥘", query: "masala garam samber biryani" },
                            { label: "Salt, Sugar & Sweeteners", icon: "🧂", query: "salt sugar jaggery honey" },
                            { label: "Dry Fruits & Nuts", icon: "🥜", query: "dry fruit nut almond cashew walnut raisin" },
                            { label: "Organic & Healthy Staples", icon: "🌿", query: "organic healthy multigrain" },
                            { label: "Combo Packs & Value Deals", icon: "📦", query: "combo value deal" }
                        ];
                    } else if (categoryName === 'fruits & vegetables') {
                        welcomeMsg = 'Select a Fruits & Vegetables section:';
                        subCats = [
                            { label: "Fresh Fruits", icon: "🍎", query: "apple banana mango orange grapes pomegranate watermelon" },
                            { label: "Fresh Vegetables", icon: "🥦", query: "potato onion tomato carrot cucumber beans capsicum" },
                            { label: "Leafy Greens & Herbs", icon: "🥬", query: "spinach coriander mint methi leafy" },
                            { label: "Exotic Fruits", icon: "🥑", query: "avocado kiwi dragon fruit blue berry straw berry" },
                            { label: "Exotic Vegetables", icon: "🍄", query: "mushroom broccoli zucchini asparagus" },
                            { label: "Organic Fruits & Vegetables", icon: "🌿", query: "organic" },
                            { label: "Cut, Peeled & Sprouts", icon: "🥗", query: "cut peeled sprout" },
                            { label: "Seasonal Produce", icon: "📅", query: "seasonal" },
                            { label: "Frozen Fruits & Vegetables", icon: "❄️", query: "frozen" },
                            { label: "Juices, Purees & Pulps", icon: "🧃", query: "juice puree pulp smoothie" },
                            { label: "Dry Fruits & Nuts", icon: "🥜", query: "almond cashew walnut raisin" },
                            { label: "Combo Packs & Value Deals", icon: "📦", query: "combo pack deal value" }
                        ];
                    } else if (categoryName === 'snacks & branded foods') {
                        welcomeMsg = 'Select a Snacks department:';
                        subCats = [
                            { label: "Chips & Crisps", icon: "🍟", query: "chips crisps lays" },
                            { label: "Biscuits & Cookies", icon: "🍪", query: "biscuit cookie oreo" },
                            { label: "Namkeen & Savoury Snacks", icon: "🥨", query: "namkeen savoury mixture haldiram" },
                            { label: "Chocolates & Candies", icon: "🍫", query: "chocolate candy dairy milk kitkat" },
                            { label: "Cakes, Muffins & Brownies", icon: "🍰", query: "cake muffin brownie" },
                            { label: "Wafers & Snack Bars", icon: "🧇", query: "wafer snack bar energy bar" },
                            { label: "Breakfast Cereals & Muesli", icon: "🥣", query: "cereal muesli flakes oats" },
                            { label: "Instant Noodles & Pasta", icon: "🍜", query: "noodle pasta maggi" },
                            { label: "Ready-to-Eat Foods", icon: "🍱", query: "ready to eat meal instant mix" },
                            { label: "Spreads, Dips & Sauces", icon: "🥫", query: "spread dip sauce ketchup jam" },
                            { label: "Healthy & Diet Snacks", icon: "🥗", query: "healthy diet roasted sugar free" },
                            { label: "Kids Snacks", icon: "🧸", query: "kids gems milky bar" }
                        ];
                    } else if (categoryName === 'beauty & hygiene') {
                        welcomeMsg = 'Select a Beauty & Hygiene section:';
                        subCats = [
                            { label: "Bath & Shower", icon: "🧼", query: "bath shower soap body wash" },
                            { label: "Hair Care", icon: "💇", query: "shampoo conditioner hair oil color" },
                            { label: "Skin Care", icon: "🧴", query: "skin care face wash moisturizer lotion" },
                            { label: "Oral Care", icon: "🪥", query: "toothpaste toothbrush mouthwash" },
                            { label: "Men’s Grooming", icon: "🧔", query: "men grooming shaving beard" },
                            { label: "Women’s Hygiene", icon: "🧖‍♀️", query: "women hygiene sanitary pads" },
                            { label: "Deodorants & Fragrances", icon: "✨", query: "deodorant perfume fragrance spray" },
                            { label: "Hand Wash & Sanitizers", icon: "🧼", query: "hand wash sanitizer" },
                            { label: "Shaving & Hair Removal", icon: "🪒", query: "shaving hair removal razor" },
                            { label: "Cosmetics & Makeup", icon: "💄", query: "cosmetics makeup lipstick kajal" },
                            { label: "Personal Care Appliances", icon: "🔌", query: "dryer trimmer shaver appliance" },
                            { label: "Wellness & Daily Hygiene", icon: "🏥", query: "wellness hygiene health pads" }
                        ];
                    } else if (categoryName === 'gourmet & world food') {
                        welcomeMsg = 'Select a Gourmet & World Food section:';
                        subCats = [
                            { label: "Imported Chocolates & Confectionery", icon: "🍫", query: "luxury imported international chocolate gift confectionery" },
                            { label: "International Snacks & Chips", icon: "🍟", query: "international snacks chips nachos popcorn pretzels" },
                            { label: "World Sauces, Dips & Condiments", icon: "🥫", query: "sauce dip condiment hummus pesto salsa" },
                            { label: "Pasta, Noodles & Italian Staples", icon: "🍝", query: "pasta noodles spaghetti macaroni lasagna italian" },
                            { label: "Asian Cuisine Essentials", icon: "🥢", query: "asian thai japanese chinese soy miso curry sushi" },
                            { label: "Middle Eastern & Mediterranean Foods", icon: "🥙", query: "middle eastern mediterranean hummus falafel tahini" },
                            { label: "Mexican & Latin American Foods", icon: "🌮", query: "mexican latin american taco tortilla nacho jalapeno" },
                            { label: "Cheese & Dairy Specialties", icon: "🧀", query: "cheese international dairy yogurt greek butter" },
                            { label: "Olive Oils, Vinegars & Cooking Oils", icon: "🫒", query: "olive oil vinegar balsamic canola" },
                            { label: "Spices, Herbs & Seasonings (Global)", icon: "🧂", query: "spice herb seasoning world spice basil oregano" },
                            { label: "Gourmet Breakfast & Desserts", icon: "🥐", query: "breakfast dessert muesli granola ice cream" },
                            { label: "Organic, Vegan & Specialty Foods", icon: "🌱", query: "organic vegan specialty gluten dairy free" }
                        ];
                    } else if (categoryName === 'kitchen, garden & pets') {
                        welcomeMsg = 'Select a Kitchen, Garden & Pets department:';
                        subCats = [
                            { label: "Cookware & Bakeware", icon: "🍳", query: "cookware pan pot kadai tawa pressure cooker bakeware" },
                            { label: "Kitchen Tools & Gadgets", icon: "🔪", query: "knife peeler grater chopper slicer whisk spatula" },
                            { label: "Storage Containers & Jars", icon: "🫙", query: "container jar storage airtight lunch box tiffin" },
                            { label: "Dinnerware & Serveware", icon: "🍽️", query: "plate bowl dish serving platter dinner set" },
                            { label: "Drinkware & Bottles", icon: "🥤", query: "glass cup mug tumbler water bottle flask" },
                            { label: "Kitchen Cleaning Supplies", icon: "🧽", query: "dishwash scrubber sponge cleaning detergent" },
                            { label: "Gardening Tools & Accessories", icon: "🌱", query: "garden tool spade shovel rake watering can" },
                            { label: "Plants, Seeds & Fertilizers", icon: "🌿", query: "plant seed fertilizer soil potting mix" },
                            { label: "Pots, Planters & Garden Decor", icon: "🪴", query: "pot planter vase garden decor ceramic" },
                            { label: "Pet Food & Treats", icon: "🐕", query: "pet food dog food cat food treats" },
                            { label: "Pet Grooming & Hygiene", icon: "🛁", query: "pet shampoo grooming brush nail clipper" },
                            { label: "Pet Accessories & Toys", icon: "🐾", query: "pet toy leash collar bed bowl feeder" }
                        ];
                    } else if (categoryName === 'eggs, meat & fish') {
                        welcomeMsg = 'Select an Eggs, Meat & Fish section:';
                        subCats = [
                            { label: "Eggs", icon: "🥚", query: "egg" },
                            { label: "Chicken", icon: "🍗", query: "chicken" },
                            { label: "Mutton & Lamb", icon: "🍖", query: "mutton lamb" },
                            { label: "Pork", icon: "🥓", query: "pork" },
                            { label: "Fresh Fish", icon: "🐟", query: "fish" },
                            { label: "Seafood (Prawns, Crab, etc.)", icon: "🍤", query: "prawn crab" },
                            { label: "Marinated & Ready-to-Cook", icon: "🍢", query: "marinated" },
                            { label: "Processed & Cold Cuts", icon: "🥪", query: "salami sausage" },
                            { label: "Frozen Meat & Seafood", icon: "❄️", query: "frozen" },
                            { label: "Organic & Free-Range", icon: "🌿", query: "organic" },
                            { label: "Cuts & Portions (Boneless, Curry Cut, Fillet)", icon: "🔪", query: "cut boneless" },
                            { label: "Combo Packs & Value Deals", icon: "📦", query: "combo" }
                        ];
                    }

                    const formattedSubCats = subCats.map(item => ({
                        id: item.label.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_'),
                        label: `${item.icon} ${item.label}`,
                        command: `ShowSub ${matchedCategory.label}|${item.label}`,
                        img: `https://placehold.co/400?text=${encodeURIComponent(item.label)}`
                    }));

                    addMsg('bot', welcomeMsg, 'sub_carousel', formattedSubCats);
                    return;
                }
                const productsInCategory = await api.getProductsByCategory(matchedCategory.label);
                addMsg('bot', `Browsing ${matchedCategory.label}:`, 'carousel', productsInCategory);
                return;
            }

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
        }, 600);
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

    return { messages, isTyping, isListening, startListening, handleUserMessage, addMsg, initializeChat, handleOptionSelect, handleTableConfirm, handleRecipeAdd };
};