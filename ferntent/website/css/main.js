function insertHeader() {
    const headerContainer = document.getElementById('header');
    if (!headerContainer) {
        return;
    }

    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            headerContainer.innerHTML = html;
            updateCartBadge();
        })
        .catch(error => {
            console.error('Error fetching header:', error);
        });
}

function createScrollButtons() {
    const topButton = document.createElement('button');
    const bottomButton = document.createElement('button');

    topButton.setAttribute('type', 'button');
    bottomButton.setAttribute('type', 'button');
    topButton.id = 'scroll-top-btn';
    bottomButton.id = 'scroll-bottom-btn';
    topButton.className = 'scroll-btn scroll-btn-top';
    bottomButton.className = 'scroll-btn scroll-btn-bottom';
    topButton.innerText = '↑';
    bottomButton.innerText = '↓';
    document.body.appendChild(topButton);
    document.body.appendChild(bottomButton);

    function updateScrollButtons() {
        if (window.scrollY > 250) {
            topButton.classList.add('show');
            bottomButton.classList.add('show');
        } else {
            topButton.classList.remove('show');
            bottomButton.classList.remove('show');
        }
    }

    window.addEventListener('scroll', updateScrollButtons);
    updateScrollButtons();

    topButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    bottomButton.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

let cart = JSON.parse(localStorage.getItem('luxury_cart')) || [];

function saveCart() {
    localStorage.setItem('luxury_cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const cartLink = document.querySelector('a[href="cart.html"]');
    if (cartLink) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartLink.textContent = `Cart (${totalItems})`;
    }
}

function initAddCartButtons() {
    const addBtns = document.querySelectorAll('.btn-add-cart');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            const img = e.target.dataset.img;
            
            const existing = cart.find(i => i.name === name);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name, price, img, quantity: 1 });
            }
            
            saveCart();
            updateCartBadge();
            alert(`${name} added to cart!`);
        });
    });
}

function formatPrice(price) {
    if (price >= 10000000) {
        return `₹${(price / 10000000).toFixed(2)} Crore`;
    } else if (price >= 100000) {
        return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString()}`;
}

function renderCart() {
    const tbody = document.getElementById('cart-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const rowTotal = item.price * item.quantity;
        total += rowTotal;
        
        const tr = document.createElement('tr');
        tr.dataset.unitPrice = item.price;
        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${item.img}" alt="${item.name}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>${formatPrice(item.price)}</td>
            <td>
                <div class="quantity-control">
                    <button type="button" class="qty-btn" data-action="decrease" data-index="${index}">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button type="button" class="qty-btn" data-action="increase" data-index="${index}">+</button>
                </div>
            </td>
            <td>${formatPrice(rowTotal)}</td>
            <td>
                <button type="button" class="btn remove-btn" data-index="${index}">Remove</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    const totalEl = document.getElementById('cart-total');
    if (totalEl) {
        totalEl.textContent = formatPrice(total);
    }
    
    tbody.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.dataset.index;
            const action = e.target.dataset.action;
            if (action === 'increase') {
                cart[idx].quantity += 1;
            } else if (action === 'decrease' && cart[idx].quantity > 1) {
                cart[idx].quantity -= 1;
            }
            saveCart();
            updateCartBadge();
            renderCart();
        });
    });
    
    tbody.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.dataset.index;
            cart.splice(idx, 1);
            saveCart();
            updateCartBadge();
            renderCart();
        });
    });
}

function setupFaqLoadMore() {
    const loadMore = document.getElementById('faq-load-more');
    if (!loadMore) return;

    loadMore.addEventListener('click', () => {
        const hiddenItems = Array.from(document.querySelectorAll('.faq-hidden'));
        hiddenItems.slice(0, 3).forEach(item => item.classList.remove('faq-hidden'));

        if (!document.querySelector('.faq-hidden')) {
            loadMore.style.display = 'none';
        }
    });
}

function renderCheckoutSummary() {
    const container = document.getElementById('checkout-items-container');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const rowTotal = item.price * item.quantity;
        total += rowTotal;
        
        container.innerHTML += `
            <div class="summary-item">
                <span class="item-name">${item.quantity}x ${item.name}</span>
                <span class="item-price">${formatPrice(rowTotal)}</span>
            </div>
        `;
    });


    const fees = cart.length > 0 ? 10000 : 0; 
    const tax = total * 0.18; 
    const grandTotal = total + fees + tax;

    const feesEl = document.getElementById('checkout-fees');
    const taxEl = document.getElementById('checkout-tax');
    const grandTotalEl = document.getElementById('checkout-grand-total');

    if (feesEl) feesEl.textContent = formatPrice(fees);
    if (taxEl) taxEl.textContent = formatPrice(tax);
    if (grandTotalEl) grandTotalEl.textContent = formatPrice(grandTotal);
}

document.addEventListener('DOMContentLoaded', () => {
    insertHeader();
    createScrollButtons();
    initAddCartButtons();
    renderCart();
    renderCheckoutSummary();
    setupFaqLoadMore();
});
// Global State Tracking
let selectedVehicle = null;
const modificationsState = {
    engine: 'base',
    transmission: 'manual',
    tires: 'standard',
    paintColor: 'pearl-white',
    paintType: 'metallic',
    interior: 'fabric',
    tech: []
};

// Modification Prices Mapping
const priceMapping = {
    engine: { base: 0, sport: 250000, performance: 500000 },
    transmission: { manual: 0, auto: 150000 },
    tires: { standard: 0, premium: 100000, sport: 200000 },
    paintType: { metallic: 0, pearl: 75000, matte: 100000 },
    interior: { fabric: 0, leather: 300000, 'premium-leather': 500000 },
    tech: { nav: 150000, audio: 100000, sunroof: 200000, safety: 250000 }
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    populateVehicleDropdown();
    setupEventListeners();
});

// 1. Populate the Select Dropdown dynamically using the vehicleData array from HTML
function populateVehicleDropdown() {
    const selectEl = document.getElementById("car-select");
    if (!selectEl || typeof vehicleData === 'undefined') return;

    vehicleData.forEach(vehicle => {
        const option = document.createElement("option");
        option.value = vehicle.id;
        option.textContent = `${vehicle.title} (${vehicle.price})`;
        selectEl.appendChild(option);
    });
}

// 2. Set up event listeners for change tracking
function setupEventListeners() {
    document.getElementById("car-select").addEventListener("change", handleVehicleSelection);

    // Watch radio buttons & checkboxes
    const panel = document.getElementById("modifications-panel");
    panel.addEventListener("change", (e) => {
        const target = e.target;
        if (!target) return;

        if (target.name === 'tech') {
            // Handle checkboxes for tech packages
            const checkedTech = Array.from(panel.querySelectorAll('input[name="tech"]:checked'))
                                    .map(cb => cb.value);
            modificationsState.tech = checkedTech;
        } else if (target.name === 'paint') {
            modificationsState.paintColor = target.value;
            applyColorVisualEffect(target.value); // Triggers real-time CSS visual change
        } else if (target.name in modificationsState) {
            modificationsState[target.name] = target.value;
        }
        
        updateSummaryAndPrice();
    });
}

// 3. Handle Vehicle Switch-over and enforce Real-World Logic
function handleVehicleSelection(e) {
    const vehicleId = e.target.value;
    
    if (vehicleId === "") {
        document.getElementById("modifications-panel").style.display = "none";
        document.getElementById("no-car-selected").style.display = "block";
        document.getElementById("preview-content").style.display = "none";
        document.getElementById("preview-empty").style.display = "block";
        selectedVehicle = null;
        return;
    }

    selectedVehicle = vehicleData.find(v => v.id == vehicleId);
    
    // UI Layout Toggling
    document.getElementById("modifications-panel").style.display = "flex";
    document.getElementById("no-car-selected").style.display = "none";
    document.getElementById("preview-content").style.display = "block";
    document.getElementById("preview-empty").style.display = "none";

    // Enforce Real-world constraints depending on Category
    enforceRealWorldCriteria(selectedVehicle.category);
    
    // Reset selections to defaults when switching vehicles
    resetModifications(); 
}

// 4. Real-world Verification System (Locks segments depending on car vs bike)
function enforceRealWorldCriteria(category) {
    const interiorSection = document.getElementById("interior-section");
    const transmissionSection = document.getElementById("transmission-section");
    const sunroofOption = document.querySelector('input[value="sunroof"]');

    // Reset visibility rules
    interiorSection.classList.remove("disabled");
    transmissionSection.classList.remove("disabled");
    if(sunroofOption) sunroofOption.disabled = false;

    // Apply strict real-world filtering rules
    if (["Superbike", "Cruiser"].includes(category)) {
        // Real Bikes don't have leather car interiors, car automatic gearboxes, or sunroofs!
        interiorSection.classList.add("disabled");
        transmissionSection.classList.add("disabled");
        if(sunroofOption) {
            sunroofOption.checked = false;
            sunroofOption.disabled = true;
        }
    }
}

// 5. Dynamic Visual Color Modification Filter engine
function applyColorVisualEffect(colorKey) {
    const img = document.getElementById("preview-image");
    if (!img) return;

    // Maps color options to standard CSS blend filters to accurately tint the real-world base asset
    const colorFilters = {
        'pearl-white': 'brightness(1.1) contrast(0.95)',
        'midnight-black': 'brightness(0.2) contrast(1.2)',
        'sapphire-blue': 'hue-rotate(200deg) saturate(1.5) brightness(0.8)',
        'crimson-red': 'hue-rotate(330deg) saturate(1.8) brightness(0.8)',
        'silver-grey': 'grayscale(1) brightness(0.9) contrast(1.1)'
    };

    img.style.filter = colorFilters[colorKey] || 'none';
}

// 6. Dynamic Pricing Engine and Real-time Summary Generator
function updateSummaryAndPrice() {
    if (!selectedVehicle) return;

    let totalPrice = selectedVehicle.priceValue;
    let modCount = 0;
    const summaryList = document.getElementById("modification-list");
    const priceItemsContainer = document.getElementById("price-items-container");
    
    summaryList.innerHTML = "";
    priceItemsContainer.innerHTML = "";

    // Parse Base Text Metadata Fields safely
    document.getElementById("preview-image").src = selectedVehicle.images[0];
    document.getElementById("preview-name").textContent = selectedVehicle.title;
    document.getElementById("category-badge").textContent = selectedVehicle.category;
    document.getElementById("preview-description").textContent = selectedVehicle.desc;
    document.getElementById("price-base").textContent = `₹${selectedVehicle.priceValue.toLocaleString('en-IN')}`;

    // Render Specs List
    const specsContainer = document.getElementById("preview-specs");
    specsContainer.innerHTML = selectedVehicle.specs.map(s => `<div>• ${s}</div>`).join('');

    // helper closure to push extra costs inside invoice
    const addReceiptLineItem = (label, cost) => {
        if (cost > 0) {
            modCount++;
            totalPrice += cost;
            
            // Build dynamic pricing line item UI breakdown element
            const pItem = document.createElement("div");
            pItem.className = "price-item";
            pItem.innerHTML = `<span>${label}</span><span>+ ₹${cost.toLocaleString('en-IN')}</span>`;
            priceItemsContainer.appendChild(pItem);

            // Build Summary UI Tracker Item Element
            const sItem = document.createElement("div");
            sItem.className = "modification-summary-item";
            sItem.textContent = label;
            summaryList.appendChild(sItem);
        }
    };

    // Calculate engine upgrades if changed
    if (modificationsState.engine !== 'base') {
        const name = modificationsState.engine === 'sport' ? 'Sport Engine Upgrade' : 'Performance Engine Upgrade';
        addReceiptLineItem(name, priceMapping.engine[modificationsState.engine]);
    }

    // Skip interior & transmission components dynamically if superbike/cruiser blockades are active
    if (!["Superbike", "Cruiser"].includes(selectedVehicle.category)) {
        if (modificationsState.transmission !== 'manual') {
            addReceiptLineItem('Automatic Transmission conversion', priceMapping.transmission.auto);
        }
        if (modificationsState.interior !== 'fabric') {
            const name = modificationsState.interior === 'leather' ? 'Genuine Leather Upholstery' : 'Premium Heated Leather';
            addReceiptLineItem(name, priceMapping.interior[modificationsState.interior]);
        }
    }

    // Track Wheels modification
    if (modificationsState.tires !== 'standard') {
        const name = modificationsState.tires === 'premium' ? 'Premium Performance Tires' : 'Sport Wheels & Performance Compounds';
        addReceiptLineItem(name, priceMapping.tires[modificationsState.tires]);
    }

    // Paint options mapping tracking 
    if (modificationsState.paintColor !== 'pearl-white' || modificationsState.paintType !== 'metallic') {
        const paintLabel = `${modificationsState.paintColor.replace('-', ' ')} (${modificationsState.paintType} finish)`;
        addReceiptLineItem(`Custom Premium Paint: ${paintLabel}`, priceMapping.paintType[modificationsState.paintType]);
    }

    // Add optional checkboxes validation configurations array
    modificationsState.tech.forEach(techKey => {
        const techLabels = { nav: 'GPS Navigation System', audio: 'Premium Audio Upgrade', sunroof: 'Panoramic Sunroof', safety: 'Advanced Safety Suite' };
        addReceiptLineItem(techLabels[techKey], priceMapping.tech[techKey]);
    });

    // Update Dashboard Indicators numbers inside the panel component layout elements
    const badge = document.getElementById("mod-badge");
    const countSpan = document.getElementById("mod-count");
    const summaryContainer = document.getElementById("modification-summary");

    if (modCount > 0) {
        badge.style.display = "block";
        countSpan.textContent = modCount;
        summaryContainer.style.display = "block";
    } else {
        badge.style.display = "none";
        summaryContainer.style.display = "none";
    }

    document.getElementById("price-total").textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
}

// 7. Reset Dashboard Functionality
function resetModifications() {
    modificationsState.engine = 'base';
    modificationsState.transmission = 'manual';
    modificationsState.tires = 'standard';
    modificationsState.paintColor = 'pearl-white';
    modificationsState.paintType = 'metallic';
    modificationsState.interior = 'fabric';
    modificationsState.tech = [];

    // Force HTML input elements to align back with state variables
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (radio.value === 'base' || radio.value === 'manual' || radio.value === 'standard' || radio.value === 'pearl-white' || radio.value === 'metallic' || radio.value === 'fabric') {
            radio.checked = true;
        }
    });
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    applyColorVisualEffect('pearl-white');
    updateSummaryAndPrice();
}

// 8. Add Configured System To Cart Action handling callback
function addModifiedCarToCart() {
    if (!selectedVehicle) return;
    alert(`Success! Your custom configured ${selectedVehicle.title} has been added to your cart with all options saved.`);
}

        // All vehicles from showroom/details
        const vehicleData = [
            {
                id: 0,
                title: "Pagani Huayra Imola Roadster",
                price: "₹45.00 Crore",
                priceValue: 4500000000,
                desc: "The pinnacle of roadsters, balancing Indian aspiration with Italian speed.",
                category: "Hypercar",
                specs: ["Engine: 6.0L V12", "Power: 850 BHP", "0-100: 2.9s", "Transmission: 7-Speed", "Top Speed: 350 km/h"],
                images: ["pagani-imola-roadster.jpg"]
            },
            {
                id: 1,
                title: "Rolls-Royce La Rose Noire Droptail",
                price: "₹211.00 Crore",
                priceValue: 21100000000,
                desc: "An unmatched masterpiece of coachbuilding, the crown jewel of luxury.",
                category: "Ultra-Luxury",
                specs: ["Engine: 6.75L V12", "Power: 593 BHP", "Style: Coachbuilt", "Feature: AP Timepiece", "Top Speed: 250 km/h"],
                images: ["rolls-royce-un-yeni-eseri-la-rose-noire-droptail167958_0.jpg"]
            },
            {
                id: 2,
                title: "Pagani Zonda HP Barchetta",
                price: "₹140.00 Crore",
                priceValue: 14000000000,
                desc: "A collector's dream, purely mechanical and breathtakingly beautiful.",
                category: "Hypercar",
                specs: ["Engine: 7.3L V12", "Power: 789 BHP", "Weight: 1250 kg", "Gearbox: 6-Speed Manual", "Units: Limited 3"],
                images: ["pagani-zonda-hp-barchetta-1600-x-1172-wallpaper-2sytas7joiymww9x.jpg"]
            },
            {
                id: 3,
                title: "Ducati Superleggera V4",
                price: "₹1.15 Crore",
                priceValue: 115000000,
                desc: "The only street bike with a full carbon fibre chassis.",
                category: "Superbike",
                specs: ["Engine: 998cc V4", "Power: 234 BHP", "Weight: 152 kg", "Exhaust: Akrapovič", "Frame: Carbon Fibre"],
                images: ["2020_Ducati_Panigale_V4_Superleggera.jpg"]
            },
            {
                id: 4,
                title: "Kawasaki Ninja H2R",
                price: "₹80.00 Lakh",
                priceValue: 8000000,
                desc: "The supercharged king of the tracks, now available for Indian speedsters.",
                category: "Superbike",
                specs: ["Engine: 998cc Supercharged", "Power: 326 BHP", "Top Speed: 400+ km/h", "Paint: Silver-Mirror", "Wings: Carbon Aero"],
                images: ["Kawasaki_Ninja_H2.jpg"]
            },
            {
                id: 5,
                title: "Ducati Streetfighter V4 Lamborghini",
                price: "₹75.00 Lakh",
                priceValue: 7500000,
                desc: "A fusion of Ducati soul and Lamborghini Huracán STO design.",
                category: "Superbike",
                specs: ["Engine: 1103cc V4", "Power: 208 BHP", "Design: Huracán STO", "Rims: Forged", "Brakes: Brembo Stylema"],
                images: ["ducati-streetfighter-v4-right-side-view0.jpg"]
            },
            {
                id: 6,
                title: "2025 Nissan Titan",
                price: "₹42.00 Lakh",
                priceValue: 4200000,
                desc: "Dominate the Indian terrain with the ultimate heavy-duty hauler.",
                category: "Truck",
                specs: ["Engine: 3.0L Diesel", "Tow: 6500 kg", "Drive: 4x4 Lock", "Screen: 14-inch", "Ground Clearance: 245mm"],
                images: ["2021_Nissan_Titan_Crew_Cab_PRO-4X_in_Super_Black,_Front_Right,_2024-03-08.jpg"]
            },
            {
                id: 7,
                title: "Koenigsegg One:1",
                price: "₹40.00 Crore",
                priceValue: 4000000000,
                desc: "The world's first Megacar featuring an incredible 1:1 power-to-weight ratio.",
                category: "Hypercar",
                specs: ["Ratio: 1:1 Power/Weight", "Engine: 5.0L V8", "Power: 1360 BHP", "Top Speed: 440 km/h", "Units: Limited 6"],
                images: ["2015_Koenigsegg_Agera_N_(19886243212).jpg"]
            },
            {
                id: 8,
                title: "2025 Harley-Davidson Sportster S",
                price: "₹18.5 Lakh",
                priceValue: 1850000,
                desc: "A custom motorcycle that brings modern performance and aggressive styling.",
                category: "Cruiser",
                specs: ["Engine: 1252cc Revolution Max", "Power: 121 BHP", "Torque: 127 Nm", "Weight: 228 kg", "Seat Height: 753 mm"],
                images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"]
            },
            {
                id: 9,
                title: "2024 Volvo S60",
                price: "₹48.00 Lakh",
                priceValue: 4800000,
                desc: "Scandinavian elegance redefined in a dynamic and safe luxury sedan.",
                category: "Sedan",
                specs: ["Engine: 2.0L Turbo Mild-Hybrid", "Power: 250 BHP", "0-100: 6.5s", "Drivetrain: FWD/AWD", "Safety: Pilot Assist"],
                images: ["2024_Volvo_S60.jpg"]
            }
        ];

        let selectedCar = null;
        let currentModifications = {};

        function initializeCarSelector() {
            const selector = document.getElementById('car-select');
            
            vehicleData.forEach(car => {
                const option = document.createElement('option');
                option.value = car.id;
                option.textContent = `${car.title} (${car.price})`;
                selector.appendChild(option);
            });

            selector.addEventListener('change', (e) => {
                if (e.target.value !== '') {
                    selectCar(parseInt(e.target.value));
                } else {
                    clearSelection();
                }
            });
        }

        function selectCar(carId) {
            const car = vehicleData[carId];
            if (!car) return;

            selectedCar = car;
            currentModifications = {};
            
            // Show modification panel
            document.getElementById('modifications-panel').style.display = 'flex';
            document.getElementById('no-car-selected').style.display = 'none';
            
            // Show preview
            document.getElementById('preview-content').style.display = 'block';
            document.getElementById('preview-empty').style.display = 'none';
            
            // Update preview
            document.getElementById('preview-image').src = car.images[0];
            document.getElementById('preview-name').textContent = car.title;
            document.getElementById('preview-description').textContent = car.desc;
            document.getElementById('category-badge').textContent = car.category;
            document.getElementById('price-base').textContent = car.price;
            
            // Update specs
            const specsList = document.getElementById('preview-specs');
            specsList.innerHTML = car.specs.map(spec => `<div>${spec}</div>`).join('');
            
            // Reset all radio buttons
            document.querySelectorAll('input[type="radio"]').forEach(input => {
                if (input.value === 'base' || input.value === 'manual' || input.value === 'standard' || input.value === 'metallic' || input.value === 'fabric' || input.value === 'pearl-white') {
                    input.checked = true;
                } else {
                    input.checked = false;
                }
            });
            
            // Uncheck all checkboxes
            document.querySelectorAll('input[type="checkbox"]').forEach(input => {
                input.checked = false;
            });
            
            // Disable irrelevant sections based on vehicle category
            const isBike = car.category === 'Superbike' || car.category === 'Cruiser';
            const isTruck = car.category === 'Truck';
            
            if (isBike || isTruck) {
                document.getElementById('interior-section').classList.add('disabled');
                if (isBike) {
                    document.getElementById('transmission-section').classList.add('disabled');
                } else {
                    document.getElementById('transmission-section').classList.remove('disabled');
                }
            } else {
                document.getElementById('interior-section').classList.remove('disabled');
                document.getElementById('transmission-section').classList.remove('disabled');
            }
            
            updatePriceBreakdown();
        }

        function clearSelection() {
            selectedCar = null;
            currentModifications = {};
            
            document.getElementById('modifications-panel').style.display = 'none';
            document.getElementById('no-car-selected').style.display = 'block';
            document.getElementById('preview-content').style.display = 'none';
            document.getElementById('preview-empty').style.display = 'block';
        }

        function updateImagePreview() {
            if (!selectedCar) return;

            const img = document.getElementById('preview-image');
            const paintType = document.querySelector('input[name="paint-type"]:checked').value;
            const paint = document.querySelector('input[name="paint"]:checked').value;

            // Apply image filters based on modifications
            let filters = '';
            
            if (paintType === 'matte') {
                filters += 'saturate(0.9) contrast(1.1) ';
            } else if (paintType === 'pearl') {
                filters += 'saturate(1.15) brightness(1.05) ';
            }

            // Apply tire upgrades as brightness adjustment
            const tires = document.querySelector('input[name="tires"]:checked').value;
            if (tires === 'sport') {
                filters += 'contrast(1.1) ';
            } else if (tires === 'premium') {
                filters += 'contrast(1.05) ';
            }

            // Apply engine upgrade as saturation
            const engine = document.querySelector('input[name="engine"]:checked').value;
            if (engine === 'performance') {
                filters += 'saturate(1.2) hue-rotate(-5deg) ';
            } else if (engine === 'sport') {
                filters += 'saturate(1.1) ';
            }

            img.style.filter = filters.trim() || 'none';

            // Update modification count
            updateModificationBadge();
        }

        function updateModificationBadge() {
            const engine = document.querySelector('input[name="engine"]:checked').value;
            const transmission = document.querySelector('input[name="transmission"]:checked').value;
            const tires = document.querySelector('input[name="tires"]:checked').value;
            const paintType = document.querySelector('input[name="paint-type"]:checked').value;
            const interior = document.getElementById('interior-section').classList.contains('disabled') ? 'base' : document.querySelector('input[name="interior"]:checked').value;
            const selectedTechs = Array.from(document.querySelectorAll('input[name="tech"]:checked')).length;

            let count = 0;
            if (engine !== 'base') count++;
            if (transmission !== 'manual' && !document.getElementById('transmission-section').classList.contains('disabled')) count++;
            if (tires !== 'standard') count++;
            if (paintType !== 'metallic') count++;
            if (interior !== 'fabric' && !document.getElementById('interior-section').classList.contains('disabled')) count++;
            count += selectedTechs;

            const badge = document.getElementById('mod-badge');
            if (count > 0) {
                document.getElementById('mod-count').textContent = count;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }

        function updatePriceBreakdown() {
            if (!selectedCar) return;
            
            let total = selectedCar.priceValue;
            let modifications = [];
            
            const priceItemsContainer = document.getElementById('price-items-container');
            priceItemsContainer.innerHTML = '';
            
            // Engine
            const engine = document.querySelector('input[name="engine"]:checked').value;
            const enginePrices = { base: 0, sport: 250000, performance: 500000 };
            if (engine !== 'base') {
                const enginePrice = enginePrices[engine];
                total += enginePrice;
                modifications.push(`${engine.charAt(0).toUpperCase() + engine.slice(1)} Engine`);
                addPriceItem('Engine Upgrade', enginePrice, priceItemsContainer);
            }
            
            // Transmission
            if (!document.getElementById('transmission-section').classList.contains('disabled')) {
                const transmission = document.querySelector('input[name="transmission"]:checked').value;
                if (transmission !== 'manual') {
                    total += 150000;
                    modifications.push('Automatic Transmission');
                    addPriceItem('Automatic Transmission', 150000, priceItemsContainer);
                }
            }
            
            // Tires
            const tires = document.querySelector('input[name="tires"]:checked').value;
            const tiresPrices = { standard: 0, premium: 100000, sport: 200000 };
            if (tires !== 'standard') {
                const tiresPrice = tiresPrices[tires];
                total += tiresPrice;
                const tireNames = { premium: 'Premium Tires', sport: 'Sport Tires & Wheels' };
                modifications.push(tireNames[tires]);
                addPriceItem(tireNames[tires], tiresPrice, priceItemsContainer);
            }
            
            // Paint
            const paintType = document.querySelector('input[name="paint-type"]:checked').value;
            const paintPrices = { metallic: 0, pearl: 75000, matte: 100000 };
            if (paintType !== 'metallic') {
                const paintPrice = paintPrices[paintType];
                total += paintPrice;
                const paintNames = { pearl: 'Pearl Finish', matte: 'Matte Finish' };
                modifications.push(paintNames[paintType]);
                addPriceItem(paintNames[paintType], paintPrice, priceItemsContainer);
            }
            
            // Interior
            if (!document.getElementById('interior-section').classList.contains('disabled')) {
                const interior = document.querySelector('input[name="interior"]:checked').value;
                const interiorPrices = { fabric: 0, leather: 300000, 'premium-leather': 500000 };
                if (interior !== 'fabric') {
                    const interiorPrice = interiorPrices[interior];
                    total += interiorPrice;
                    const interiorNames = { leather: 'Leather Upholstery', 'premium-leather': 'Premium Leather with Heating' };
                    modifications.push(interiorNames[interior]);
                    addPriceItem(interiorNames[interior], interiorPrice, priceItemsContainer);
                }
            }
            
            // Technology
            const selectedTechs = document.querySelectorAll('input[name="tech"]:checked');
            const techPrices = { nav: 150000, audio: 100000, sunroof: 200000, safety: 250000 };
            const techNames = { nav: 'GPS Navigation', audio: 'Premium Audio', sunroof: 'Panoramic Sunroof', safety: 'Advanced Safety' };
            
            selectedTechs.forEach(tech => {
                const value = tech.value;
                const price = techPrices[value];
                total += price;
                modifications.push(techNames[value]);
                addPriceItem(techNames[value], price, priceItemsContainer);
            });
            
            // Update totals
            document.getElementById('price-total').textContent = formatPrice(total);
            
            // Update modification summary
            const modSummary = document.getElementById('modification-summary');
            const modList = document.getElementById('modification-list');
            
            if (modifications.length > 0) {
                modList.innerHTML = modifications.map(m => `<div class="modification-summary-item">${m}</div>`).join('');
                modSummary.style.display = 'block';
            } else {
                modSummary.style.display = 'none';
            }
            
            currentModifications = {
                engine,
                transmission: !document.getElementById('transmission-section').classList.contains('disabled') ? (document.querySelector('input[name="transmission"]:checked')?.value || 'manual') : 'manual',
                tires,
                paint: document.querySelector('input[name="paint"]:checked').value,
                paintType,
                interior: !document.getElementById('interior-section').classList.contains('disabled') ? (document.querySelector('input[name="interior"]:checked')?.value || 'fabric') : 'fabric',
                tech: Array.from(selectedTechs).map(t => t.value)
            };

            updateImagePreview();
        }

        function addPriceItem(label, price, container) {
            const item = document.createElement('div');
            item.className = 'price-item';
            item.innerHTML = `<span>${label}</span><span>+${formatPrice(price)}</span>`;
            container.appendChild(item);
        }

        function resetModifications() {
            if (!selectedCar) return;
            
            document.querySelectorAll('input[type="radio"]').forEach(input => {
                if (input.value === 'base' || input.value === 'manual' || input.value === 'standard' || input.value === 'metallic' || input.value === 'fabric' || input.value === 'pearl-white') {
                    input.checked = true;
                } else {
                    input.checked = false;
                }
            });
            
            document.querySelectorAll('input[type="checkbox"]').forEach(input => {
                input.checked = false;
            });
            
            updatePriceBreakdown();
        }

        function addModifiedCarToCart() {
            if (!selectedCar) return;
            
            let totalPrice = selectedCar.priceValue;
            
            // Calculate total with modifications
            const engine = document.querySelector('input[name="engine"]:checked').value;
            const transmission = document.querySelector('input[name="transmission"]:checked').value;
            const tires = document.querySelector('input[name="tires"]:checked').value;
            const paintType = document.querySelector('input[name="paint-type"]:checked').value;
            const interior = document.querySelector('input[name="interior"]:checked').value;
            const selectedTechs = Array.from(document.querySelectorAll('input[name="tech"]:checked')).map(t => t.value);
            
            const enginePrices = { base: 0, sport: 250000, performance: 500000 };
            const tiresPrices = { standard: 0, premium: 100000, sport: 200000 };
            const paintPrices = { metallic: 0, pearl: 75000, matte: 100000 };
            const interiorPrices = { fabric: 0, leather: 300000, 'premium-leather': 500000 };
            const techPrices = { nav: 150000, audio: 100000, sunroof: 200000, safety: 250000 };
            
            totalPrice += enginePrices[engine] || 0;
            
            if (!document.getElementById('transmission-section').classList.contains('disabled')) {
                totalPrice += (transmission !== 'manual' ? 150000 : 0);
            }
            
            totalPrice += tiresPrices[tires] || 0;
            totalPrice += paintPrices[paintType] || 0;
            
            if (!document.getElementById('interior-section').classList.contains('disabled')) {
                totalPrice += interiorPrices[interior] || 0;
            }
            
            selectedTechs.forEach(tech => {
                totalPrice += techPrices[tech] || 0;
            });
            
            // Create modified car name
            let modifiedName = selectedCar.title;
            if (engine !== 'base') {
                modifiedName += ` [${engine}]`;
            }
            if (transmission !== 'manual' && !document.getElementById('transmission-section').classList.contains('disabled')) {
                modifiedName += ' [Auto]';
            }
            if (selectedTechs.length > 0) {
                modifiedName += ` [+${selectedTechs.length}]`;
            }
            
            // Add to cart
            const existing = cart.find(i => i.name === modifiedName);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({
                    name: modifiedName,
                    price: totalPrice,
                    img: selectedCar.images[0],
                    quantity: 1,
                    modifications: currentModifications
                });
            }
            
            saveCart();
            updateCartBadge();
            alert(`Modified ${selectedCar.title} added to cart!\nTotal Price: ${formatPrice(totalPrice)}`);
            
            // Reset selection
            document.getElementById('car-select').value = '';
            clearSelection();
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            insertHeader();
            createScrollButtons();
            initializeCarSelector();
            
            // Add event listeners to modification inputs
            document.querySelectorAll('input[name="engine"], input[name="transmission"], input[name="tires"], input[name="paint"], input[name="paint-type"], input[name="interior"]').forEach(input => {
                input.addEventListener('change', updatePriceBreakdown);
            });
            
            document.querySelectorAll('input[name="tech"]').forEach(input => {
                input.addEventListener('change', updatePriceBreakdown);
            });
        });