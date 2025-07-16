import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Customer.css';

const Customer = () => {
    const [customerItems, setCustomerItems] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // State for item description modal
    const navigate = useNavigate();
    const profileRef = useRef(null);

    // --- Data Loading Functions ---
    const loadCustomerItems = () => {
        // In a real app, this would fetch from a database/API
        const storedItems = JSON.parse(localStorage.getItem('items')) || [];
        // Simulate some available items for demonstration if localStorage is empty
        const initialItems = storedItems.length > 0 ? storedItems : [
            {
                id: 'item1',
                category: 'Electronics',
                publication: 'Realme GT Neo 2 5G (8GB RAM and 128GB internal storage)',
                price: 39999.00,
                sellerName: 'CHANDRABHANU BEHERA',
                itemAvailable: true,
                image: 'https://rukminim2.flixcart.com/image/312/312/kzfv0bk0/mobile/a/r/b/gt-neo-2-5g-rmx3377-realme-original-imagbgcwtgfz64ph.jpeg?q=70',
                description: 'Powerful smartphone with AMOLED display and fast charging.'
            },
            {
                id: 'item2',
                category: 'Electronics',
                publication: 'Oppo Reno5 (8GB RAM and 128GB internal storage)',
                price: 34990.00,
                sellerName: 'CHANDRABHANU BEHERA',
                itemAvailable: true,
                image: 'https://rukminim2.flixcart.com/image/312/312/kpwybgw0/mobile/c/x/k/reno5-5g-cph2145-oppo-original-imag28r5x8zgnv5c.jpeg?q=70',
                description: 'Sleek design, great camera, and smooth performance.'
            },
            {
                id: 'item3',
                category: 'Electronics',
                publication: 'Oppo Reno3 (Type C Charger)',
                price: 499.00,
                sellerName: 'MITRABHANU BEHERA',
                itemAvailable: true,
                image: 'https://rukminim2.flixcart.com/image/416/416/kdt50nk0/charger/w/w/c/oppo-reno3-pro-type-c-charger-original-imafumf7gfht6zhr.jpeg?q=70',
                description: 'Fast charging adapter for Oppo devices.'
            },
            {
                id: 'item4',
                category: 'Clothing',
                publication: 'Ben Martin Men\'s Slim Fit Stretchable 37 Size Dark Blue Cotton Denim Jeans Pant for Men',
                price: 634.00,
                sellerName: 'CHANDRABHANU BEHERA',
                itemAvailable: true,
                image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/jean/v/c/p/30-ud-jeans-m-ultradry-original-imagnbfyzzgq2a8z.jpeg?q=70',
                description: 'Comfortable and stylish denim jeans.'
            },
            {
                id: 'item5',
                category: 'Home Appliances',
                publication: 'Whirlpool 1.5 Ton 3 Star, Magicoool Inverter Split AC (IMAGICOOL INV 3S INV CNV 5S02PPO, Copper, Convertible 4-in-1 Cooling Mode, HD Filter) White',
                price: 39758.00,
                sellerName: 'RITANJALI BEHERA',
                itemAvailable: true,
                image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/air-conditioner-new/r/k/t/-original-imagxhyu5v4gzzgh.jpeg?q=70',
                description: 'Energy efficient inverter AC with multiple cooling modes.'
            },
            {
                id: 'item6',
                category: 'Electronics',
                publication: 'V Guard WC 1.0 EL Induction Cooktop | 1900 Watt Electric Induction Stove with 7 Power Levels (Temperature Control) | Push button Auto-cutOff | Elegant Crystal Glass',
                price: 2199.00,
                sellerName: 'RITANJALI ROUT',
                itemAvailable: true,
                image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/induction-cook-top/w/o/y/-original-imaghf2hyv8sxhg4.jpeg?q=70',
                description: 'High-power induction cooktop for quick cooking.'
            },
            {
                id: 'item7',
                category: 'Home & Living',
                publication: 'Wakefit Orthopedic Memory Foam Mattress, 5 Inch Queen Size (78x60x5 inch)',
                price: 12500.00,
                sellerName: 'SleepComfort Inc.',
                itemAvailable: true,
                image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/bed/c/b/u/-original-imagsy434ggj6z9a.jpeg?q=70',
                description: 'Comfortable orthopedic mattress for sound sleep.'
            },
            {
                id: 'item8',
                category: 'Home Appliances',
                publication: 'Portable Power Generator, 2000W',
                price: 15000.00,
                sellerName: 'PowerGen Solutions',
                itemAvailable: true,
                image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/generator/k/s/u/portable-inverter-generator-2000-watts-silent-gasoline-generator-original-imagx69rz67f4ghg.jpeg?q=70',
                description: 'Reliable portable generator for outdoor or emergency use.'
            },
            {
                id: 'item9',
                category: 'Groceries',
                publication: 'Tide Plus Detergent Powder, 1.5 kg',
                price: 250.00,
                sellerName: 'Daily Needs Store',
                itemAvailable: true,
                image: 'https://rukminim2.flixcart.com/image/832/832/k3dc7bs0/washing-powder/k/t/t/1-5-plus-tide-original-imafm9f8zchggm7c.jpeg?q=70',
                description: 'Advanced detergent powder for bright clothes.'
            },
            {
                id: 'item10',
                category: 'Personal Care',
                publication: 'Himalaya Herbals Purifying Neem Face Wash, 200ml',
                price: 180.00,
                sellerName: 'Wellness Essentials',
                itemAvailable: true,
                image: 'https://rukminim2.flixcart.com/image/832/832/ktd9mzk0/face-wash/f/e/d/200-purifying-neem-face-wash-himalaya-original-imag6q7gghqazcag.jpeg?q=70',
                description: 'Herbal face wash for clear and healthy skin.'
            },
            {
                id: 'item11',
                category: 'Toys & Games',
                publication: 'Kids Play Ring Toss Game Set',
                price: 450.00,
                sellerName: 'Fun Toys World',
                itemAvailable: true,
                image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/game/h/2/g/ring-toss-game-set-for-kids-plastic-outdoor-indoor-games-with-original-imaghh8y6yh346zg.jpeg?q=70',
                description: 'Classic ring toss game for outdoor and indoor fun.'
            },
            // Added item from your screenshot for demonstration
            {
                id: 'item12',
                category: 'Electronics',
                publication: 'realme NARZO 80x 5G',
                price: 44000.00,
                sellerName: 'Some Seller',
                itemAvailable: true,
                image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/g/g/v/-original-imagpffyrqgrz47m.jpeg?q=70',
                description: 'Latest 5G smartphone with advanced features.'
            },
            {
                id: 'item13',
                category: 'Books',
                publication: 'BUSINESS STATISTICS AND MATHEMATICS',
                price: 499.00,
                sellerName: 'CHANDRABHANU BEHERA',
                itemAvailable: true,
                image: 'https://rukminim2.flixcart.com/image/416/416/kpwybgw0/book/q/u/y/business-statistics-and-mathematics-original-imag28r5x8zgnv5c.jpeg?q=70',
                description: 'Comprehensive textbook on business statistics and mathematics.'
            }
        ];
        if (storedItems.length === 0) {
            localStorage.setItem('items', JSON.stringify(initialItems));
        }
        setCustomerItems(initialItems.filter(item => item.itemAvailable));
    };

    const loadCurrentUser = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(user);
    };

    // --- Effects ---
    useEffect(() => {
        loadCustomerItems();
        loadCurrentUser();

        // Event listener for changes in localStorage (e.g., admin updates items)
        const handleStorageChange = () => {
            loadCustomerItems();
            loadCurrentUser();
        };
        window.addEventListener('storage', handleStorageChange);

        // Click outside handler for profile dropdown and item description modal
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
            if (selectedItem && !event.target.closest('.item-description-content')) {
                setSelectedItem(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup function for event listeners
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedItem]);

    // --- Event Handlers ---
    const handleAddToCartCustomer = (item) => {
        if (!currentUser) {
            toast.error("Please log in to add items to your cart.");
            navigate('/customerlogin');
            return;
        }

        const userCart = JSON.parse(localStorage.getItem(`cart_${currentUser.username}`)) || [];
        const existingItemIndex = userCart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex > -1) {
            userCart[existingItemIndex].quantity = (userCart[existingItemIndex].quantity || 1) + 1;
        } else {
            userCart.push({ ...item, quantity: 1 });
        }
        localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(userCart));
        toast.success(`${item.publication} added to your cart!`);
    };

    const handleBuyNowCustomer = (item) => {
        if (!currentUser) {
            toast.error("Please log in to proceed with your purchase.");
            navigate('/customerlogin');
        } else {
            navigate('/paymentpage', { state: { itemToBuy: item } });
        }
    };

    const handleLoginClick = () => {
        navigate('/customerlogin');
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        setIsProfileDropdownOpen(false);
        navigate('/customerlogin');
        toast.info("You have been logged out.");
    };

    const handleDropdownNavigation = (path) => {
        setIsProfileDropdownOpen(false);
        navigate(path);
    };

    const handleImageClick = (item) => {
        setSelectedItem(item);
    };

    const handleCloseDescription = () => {
        setSelectedItem(null);
    };

    return (
        <div className="customer-page-container">
            <div className="top-bar">
                <div className="left-spacer"></div>
                <div className="user-profile-section">
                    {currentUser ? (
                        <div
                            className="profile-dropdown-container"
                            ref={profileRef}
                            onMouseEnter={() => setIsProfileDropdownOpen(true)}
                            onMouseLeave={() => setIsProfileDropdownOpen(false)}
                        >
                            <div className="profile-trigger" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} title={currentUser.username}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="profile-icon"
                                >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                                <span className="username-display">{currentUser.username}</span>
                            </div>
                            {isProfileDropdownOpen && (
                                <div className="profile-dropdown-content">
                                    <button onClick={() => handleDropdownNavigation('/customer-cart')}>Your Cart</button>
                                    <button onClick={() => handleDropdownNavigation('/order-status')}>Order Status</button>
                                    <button onClick={() => handleDropdownNavigation('/delivery-status')}>Delivery Status</button>
                                    <button onClick={() => handleDropdownNavigation('/change-password')}>Change Password</button>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="login-section">
                            <div className="login-icon-container" onClick={handleLoginClick} title="Login">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="login-icon"
                                >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                                <span className="username-display">Login</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="content-area">
                {currentUser ? (
                    <>
                        <h2 style={{ fontWeight: "bold" }}>Welcome, Valued Customer!</h2>
                        <p style={{ fontWeight: "bold" }}>Explore the latest products available:</p>
                    </>
                ) : (
                    <h2 style={{fontWeight:"bold", textAlign: "center", marginBottom: "20px"}}>Welcome to Our Store! Please log in to explore and shop.</h2>
                )}

                {customerItems.length === 0 ? (
                    <p className="no-items-message">No items are currently available for purchase. Please check back later!</p>
                ) : (
                    <div className="customer-items-grid">
                        {customerItems.map((item) => (
                            <div key={item.id} className="customer-item-card">
                                {item.image && item.image !== 'placeholder-image.jpg' ? (
                                    <img
                                        src={item.image}
                                        alt={item.publication}
                                        className="customer-item-image"
                                        onClick={() => handleImageClick(item)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ) : (
                                    <div
                                        className="customer-item-image-placeholder"
                                        onClick={() => handleImageClick(item)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        No Image
                                    </div>
                                )}
                                <div className="customer-item-details">
                                    <p><strong>Category:</strong> {item.category}</p>
                                    <p ><strong>Publication:</strong> {item.publication}</p>
                                    <p style={{ fontWeight: "bold" , fontSize:"18px"}}><strong>Price:</strong> ₹{item.price.toFixed(2)}</p>
                                    <p><strong>Seller:</strong> {item.sellerName}</p>
                                    <p className={`item-availability ${item.itemAvailable ? 'available' : 'not-available'}`}>
                                        <strong>Availability: </strong> {item.itemAvailable ? 'Active' : 'Not Available'}
                                    </p>
                                    {item.itemAvailable && (
                                        <div className="customer-purchase-actions">
                                            <button
                                                className="customer-add-to-cart-button"
                                                onClick={() => handleAddToCartCustomer(item)}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                className="customer-buy-now-button"
                                                onClick={() => handleBuyNowCustomer(item)}
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Item Description Overlay/Modal */}
            {selectedItem && (
                <div className="item-description-overlay" onClick={handleCloseDescription}>
                    <div className="item-description-content" onClick={e => e.stopPropagation()}>
                        <button className="close-description-button" onClick={handleCloseDescription}>&times;</button>
                        <h3>{selectedItem.publication}</h3>
                        <p><strong>Category:</strong> {selectedItem.category}</p>
                        <p><strong>Price:</strong> ₹{selectedItem.price.toFixed(2)}</p>
                        <p><strong>Seller:</strong> {selectedItem.sellerName}</p>
                        <p><strong>Availability:</strong> {selectedItem.itemAvailable ? 'Active' : 'Not Available'}</p>
                        <p><strong>Description:</strong> {selectedItem.description || 'No description available.'}</p>
                        {selectedItem.image && selectedItem.image !== 'placeholder-image.jpg' && (
                            <img src={selectedItem.image} alt={selectedItem.publication} className="description-image" />
                        )}
                        <div className="description-actions">
                            <button onClick={() => handleAddToCartCustomer(selectedItem)}>Add to Cart</button>
                            <button onClick={() => handleBuyNowCustomer(selectedItem)}>Buy Now</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customer;