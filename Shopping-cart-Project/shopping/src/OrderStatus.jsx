import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './OrderStatus.css';

const OrderStatus = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { newOrderDetails } = location.state || {};

    const [order, setOrder] = useState(null);
    const [deliveryStatusMessage, setDeliveryStatusMessage] = useState('Checking delivery status...');
    const pollingIntervalRef = useRef(null);
    const deliveryTimerRef = useRef(0);

    // Using a ref to hold the current order state for use inside setInterval
    // This prevents `order` from being a dependency of useEffect, avoiding the loop
    const currentOrderRef = useRef(order);
    useEffect(() => {
        currentOrderRef.current = order;
    }, [order]); // Update ref whenever order state changes

    useEffect(() => {
        let orderToLoad = null;

        // Determine which order details to use (newly placed or loaded from localStorage)
        if (newOrderDetails) {
            orderToLoad = newOrderDetails;
            toast.success(`Order ${newOrderDetails.id} Placed Successfully!`, { autoClose: 5000 });
        } else {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                const userOrdersKey = `orders_${currentUser.username}`;
                const storedOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];
                if (storedOrders.length > 0) {
                    orderToLoad = storedOrders[storedOrders.length - 1];
                } else {
                    toast.info("No active orders found. Redirecting to shopping page.");
                    navigate('/customer');
                    return;
                }
            } else {
                toast.error("You are not logged in. Redirecting to login page.");
                navigate('/customerlogin');
                return;
            }
        }

        // Initialize order state and delivery message
        if (orderToLoad) {
            if (!orderToLoad.currentOrderStatus || orderToLoad.currentOrderStatus === 'Unknown' || orderToLoad.currentOrderStatus === 'Pending Payment') {
                orderToLoad.currentOrderStatus = 'Processing';
            }
            if (!orderToLoad.deliveryStatus || orderToLoad.deliveryStatus === 'Unknown') {
                orderToLoad.deliveryStatus = 'Item packed and ready for dispatch.';
            }

            setOrder(orderToLoad);
            setDeliveryStatusMessage(orderToLoad.deliveryStatus);
        }

        // Clear any existing interval before setting a new one
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null; // Ensure it's nullified
        }
        deliveryTimerRef.current = 0; // Reset timer for new interval

        // Set up the interval for delivery status updates
        pollingIntervalRef.current = setInterval(() => {
            setDeliveryStatusMessage(prevStatus => {
                const currentOrder = currentOrderRef.current; // Get the latest order from ref
                if (!currentOrder || currentOrder.currentOrderStatus === 'Delivered') {
                    // If order is null or already delivered, clear interval and keep status
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                    }
                    return prevStatus; 
                }

                deliveryTimerRef.current += 5; 

                const UPI_DELIVERY_TIME = 20; 
                const COD_DELIVERY_TIME = 10; 

                const targetDeliveryTime = (currentOrder.paymentMethod === 'cod') ? COD_DELIVERY_TIME : UPI_DELIVERY_TIME;

                let newStatus = prevStatus;

                if (deliveryTimerRef.current >= targetDeliveryTime) {
                    newStatus = 'Delivered successfully.';
                    // Update order status in React state and localStorage
                    setOrder(prevOrder => {
                        const updatedOrder = { ...prevOrder, currentOrderStatus: 'Delivered', deliveryStatus: newStatus };
                        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                        if (currentUser) {
                            const userOrdersKey = `orders_${currentUser.username}`;
                            const storedOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];
                            const updatedOrdersArray = storedOrders.map(ord =>
                                ord.id === updatedOrder.id ? updatedOrder : ord
                            );
                            localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrdersArray));
                        }
                        return updatedOrder;
                    });
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current); // Stop polling once delivered
                        pollingIntervalRef.current = null;
                    }
                } else {
                    // Gradual status updates
                    if (prevStatus.includes('packed') || prevStatus.includes('dispatch.') || prevStatus === 'Checking delivery status...') {
                        newStatus = 'Item dispatched from warehouse.';
                    } else if (prevStatus.includes('dispatched')) {
                        newStatus = 'Out for delivery.';
                    }
                    // For COD specific faster transition:
                    if (currentOrder.paymentMethod === 'cod' && deliveryTimerRef.current >= (COD_DELIVERY_TIME / 2) && newStatus === 'Item dispatched from warehouse.') {
                         newStatus = 'Out for delivery.';
                    }
                }
                return newStatus;
            });
        }, 5000); // Poll every 5 seconds

        // Cleanup function: Clear interval when component unmounts or dependencies change
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
    }, [newOrderDetails, navigate]); // Removed 'order' from dependencies. currentOrderRef handles latest state.

    const handleViewFinalDelivery = () => {
        if (order) {
            navigate('/final-bill', { state: { orderDetails: order } });
        } else {
            toast.error("Order details not available to view final delivery.");
        }
    };

    const handleContinueShopping = () => {
        navigate('/customer');
    };

    if (!order) {
        return (
            <div className="order-status-container">
                <p>Loading order status or no order found...</p>
            </div>
        );
    }

    return (
        <div className="order-status-container">
            <h2>Your Order Status</h2>
            <div className="order-card">
                <p className="order-id">Order ID: {order.id}</p>
                {order.item && (
                    <>
                        <p><strong>Item:</strong> {order.item.publication}</p>
                        {order.item.image && order.item.image !== 'placeholder-image.jpg' && (
                            <img src={order.item.image} alt={order.item.publication} className="order-item-image" />
                        )}
                        <p><strong>Category:</strong> {order.item.category}</p>
                        <p><strong>Seller:</strong> {order.item.sellerName}</p>
                    </>
                )}
                <p><strong>Total Amount:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
                <p><strong>Order Date:</strong> {order.orderDate}</p>

                <p>
                    <strong>Current Order Status:</strong>{' '}
                    <span className={`status-${order.currentOrderStatus?.toLowerCase().replace(/\s/g, '-') || 'default-status'}`}>
                        {order.currentOrderStatus || 'Processing'}
                    </span>
                </p>

                <p><strong>Tracking ID:</strong> {order.trackingId}</p>
                {order.deliveryAddress && (
                    <div className="delivery-address-details">
                        <h4>Delivery Address:</h4>
                        <p>{order.deliveryAddress.street}</p>
                        <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zip}</p>
                        <p>{order.deliveryAddress.country}</p>
                    </div>
                )}
                 {order.paymentMethod && (
                    <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
                )}


                <div className="delivery-tracking">
                    <h4>Delivery Tracking</h4>
                    <p className="delivery-message">{deliveryStatusMessage}</p>
                    <p className="delivery-info">
                        (This delivery status is simulated and updates every 5 seconds.
                        {order.paymentMethod === 'cod' ? ' COD orders will be marked delivered after approximately 10 seconds.' : ' UPI/other orders will be marked delivered after approximately 20 seconds.'})
                    </p>
                </div>

                <button onClick={handleViewFinalDelivery} className="view-details-button">
                    View Final Delivery Details
                </button>
                <button onClick={handleContinueShopping} className="continue-shopping-button">
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderStatus;