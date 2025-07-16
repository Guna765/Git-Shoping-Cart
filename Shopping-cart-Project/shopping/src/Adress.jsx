// src/components/AddressForm.js
import React, { useState, useEffect } from 'react';
import './Adress.css'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Address = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { itemToBuy, paymentMethod } = location.state || {};

    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        pin: '',
        country: 'India' // Default country
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // If no item or payment method is passed, redirect back
        if (!itemToBuy || !paymentMethod) {
            toast.error("Invalid access. Please select an item and payment method.");
            navigate('/customer');
        }
    }, [itemToBuy, paymentMethod, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prevAddress => ({
            ...prevAddress,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Basic validation
        if (!address.street || !address.city || !address.state || !address.pin) {
            toast.error("Please fill in all address fields.");
            return;
        }

        setIsSubmitting(true);
        toast.info("Saving address and confirming order...", { autoClose: false });

        setTimeout(() => {
            toast.dismiss(); // Dismiss the info toast

            // Generate unique Order ID and Tracking ID for the new order
            const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            const trackingId = `TRACK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            const orderDate = new Date().toLocaleString('en-IN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            });

            // Determine initial status based on payment method
            let initialOrderStatus = 'Processing';
            let initialDeliveryMessage = 'Item packed and ready for dispatch.';

            // For COD, the delivery success will be simulated later
            // For UPI, it's already "paid"
            if (paymentMethod === 'cod') {
                initialOrderStatus = 'Pending Payment'; // Or 'Processing'
                initialDeliveryMessage = 'Item packed and ready for dispatch (COD).';
            }


            // Prepare the new order details object
            const newOrder = {
                id: orderId,
                item: itemToBuy,
                totalAmount: itemToBuy.price,
                orderDate: orderDate,
                currentOrderStatus: initialOrderStatus,
                deliveryStatus: initialDeliveryMessage,
                trackingId: trackingId,
                deliveryAddress: address, // Save the full address
                paymentMethod: paymentMethod // Save the payment method
            };

            // Save order to localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                const userOrdersKey = `orders_${currentUser.username}`;
                const storedOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];
                const updatedOrders = [...storedOrders, newOrder];
                localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));
                toast.success("Order placed successfully!", { autoClose: 3000 });
            } else {
                toast.error("User not logged in. Order could not be saved.");
                navigate('/customerlogin');
                setIsSubmitting(false);
                return;
            }

            setIsSubmitting(false);
            // Navigate to Order Status, passing the order details and payment method
            navigate('/order-status', { state: { newOrderDetails: newOrder } });

        }, 1500); // Simulate address saving delay
    };

    return (
        <div className="address-form-container">
            <h2>Enter Delivery Address</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="street">Street Address:</label>
                    <input
                        type="text"
                        id="street"
                        name="street"
                        value={address.street}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City:</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="state">State:</label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pin">Pin Code:</label>
                    <input
                        type="text"
                        id="pin"
                        name="pin"
                        value={address.pin}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="country">Country:</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={address.country}
                        onChange={handleChange}
                        readOnly // Country can be read-only if it's always India
                        disabled={isSubmitting}
                    />
                </div>
                <button type="submit" className="submit-address-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Confirm Order & Deliver'}
                </button>
            </form>
            <button className="back-button" onClick={() => navigate(-1)} disabled={isSubmitting}>Back</button>
        </div>
    );
};

export default Address;