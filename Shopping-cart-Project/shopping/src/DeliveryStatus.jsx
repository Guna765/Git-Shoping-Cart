import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './DeliveryStatus.css'; 

const DeliveryStatus = () => {
    const navigate = useNavigate();
    const [userOrders, setUserOrders] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const loadCurrentUser = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(user);
        if (!user) {
            toast.error("Please log in to view delivery status.");
            navigate('/customerlogin');
        }
        return user;
    };

    const loadUserOrders = useCallback((user) => {
        if (user) {
            const userOrdersKey = `orders_${user.username}`;
            const storedOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];
            setUserOrders(storedOrders);
        }
    }, []);

    useEffect(() => {
        const user = loadCurrentUser();
        if (user) {
            loadUserOrders(user);
        }

        const interval = setInterval(() => {
            setUserOrders(prevOrders => {
                let changed = false;
                const updatedOrders = prevOrders.map(order => {
                    if (!order) return order;

                    let updatedOrder = { ...order };

                    if (updatedOrder.currentOrderStatus === 'Processing' && Math.random() > 0.7) {
                        updatedOrder.currentOrderStatus = 'Shipped';
                        updatedOrder.deliveryStatus = 'Your item has been shipped!';
                        changed = true;
                    } else if (updatedOrder.currentOrderStatus === 'Shipped' && Math.random() > 0.7) {
                        updatedOrder.currentOrderStatus = 'Out for Delivery';
                        updatedOrder.deliveryStatus = 'Out for delivery, expected today.';
                        changed = true;
                    } else if (updatedOrder.currentOrderStatus === 'Out for Delivery' && Math.random() > 0.7) {
                        updatedOrder.currentOrderStatus = 'Delivered';
                        updatedOrder.deliveryStatus = 'Delivered successfully.';
                        changed = true;
                    }
                    return updatedOrder;
                });
                if (changed && user) {
                    localStorage.setItem(`orders_${user.username}`, JSON.stringify(updatedOrders));
                }
                return updatedOrders;
            });
        }, 5000); 

        return () => clearInterval(interval);
    }, [loadUserOrders, navigate]);

    return (
        <div className="delivery-status-container">
            <h2>Your Delivery Status</h2>
            {currentUser && userOrders.length > 0 ? (
                <div className="delivery-items-row">
                    {userOrders.map(order => (
                        order ? (
                            <div key={order.id} className="delivery-card">
                                <h3>Order ID: {order.id}</h3>
                                <p><strong>Item:</strong> {order.item?.publication || 'N/A'}</p>
                                <p><strong>Current Status:</strong> <span className={`status-${order.currentOrderStatus?.toLowerCase().replace(/\s/g, '-') || 'Delivered'}`} style={{color:"green", fontWeight:"bold"}}>{order.currentOrderStatus || 'Delivered'}</span></p>
                                <p style={{color:"green",fontWeight:"bold"}}><strong>Delivery Update:</strong> {order.deliveryStatus || 'No update available.'}</p>
                                <p><strong>Tracking ID:</strong> {order.trackingId || 'N/A'}</p>
                                {order.item?.image && order.item.image !== 'placeholder-image.jpg' && (
                                    <img src={order.item.image} alt={order.item.publication} className="delivery-item-image" />
                                )}
                                {order.currentOrderStatus === 'Delivered' && (
                                    
                                    <button
                                        onClick={() => navigate('/final-bill', { state: { orderDetails: order } })}
                                    >
                                        View Final Details
                                    </button>
                                )}
                            </div>
                        ) : null
                    ))}
                </div>
            ) : (
                <p className="no-deliveries-message">No active deliveries found or you are not logged in.</p>
            )}
            <button className="back-button" onClick={() => navigate('/customer')}>Back to Shopping</button>
        </div>
    );
};

export default DeliveryStatus;