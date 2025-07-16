import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Barcode from 'react-barcode';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print'; 
import './FinalBill.css'; 

const FinalBill = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderDetails } = location.state || {}; 
    const componentRef = useRef();

    if (!orderDetails) {
        toast.error("No order details found for final bill.");
        navigate('/order-status'); 
        return null;
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Order_Bill_${orderDetails.id}`,
        onAfterPrint: () => toast.success("Bill printed successfully!"),
    });

    return (
        <div className="final-bill-container">
            <h2>Final Delivery Bill</h2>

            <div className="bill-content" ref={componentRef}>
                <div className="bill-header">
                    <h1>Invoice</h1>
                    <p><strong>Order ID:</strong> {orderDetails.id}</p>
                    <p><strong>Order Date:</strong> {orderDetails.orderDate}</p>
                </div>

                <div className="bill-section customer-info">
                    <h3>Customer Details</h3>
                    <p><strong>Username:</strong> {JSON.parse(localStorage.getItem('currentUser'))?.username || 'N/A'}</p>
                    <p><strong>Email:</strong> {JSON.parse(localStorage.getItem('currentUser'))?.email || 'N/A'}</p>
                    <p><strong>Mobile:</strong> {JSON.parse(localStorage.getItem('currentUser'))?.mobile || 'N/A'}</p>
                </div>

                <div className="bill-section item-details">
                    <h3>Item Details</h3>
                    <div className="bill-item">
                        <p><strong>Item:</strong> {orderDetails.item?.publication || 'N/A'}</p>
                        <p><strong>Category:</strong> {orderDetails.item?.category || 'N/A'}</p>
                        <p><strong>Seller:</strong> {orderDetails.item?.sellerName || 'N/A'}</p>
                        <p><strong>Price:</strong> ₹{orderDetails.totalAmount?.toFixed(2) || '0.00'}</p>
                        {orderDetails.item?.image && orderDetails.item.image !== 'placeholder-image.jpg' && (
                            <img src={orderDetails.item.image} alt={orderDetails.item.publication} className="bill-item-image" />
                        )}
                    </div>
                </div>

                <div className="bill-section delivery-info">
                    <h3>Delivery Information</h3>
                    <p><strong>Tracking ID:</strong> {orderDetails.trackingId || 'N/A'}</p>
                    <p><strong>Final Status:</strong> {orderDetails.currentOrderStatus || 'N/A'}</p>
                    <p><strong>Delivery Message:</strong> {orderDetails.deliveryStatus || 'N/A'}</p>
                    <p><strong>Delivery Date:</strong> {new Date().toLocaleDateString('en-IN', {
                        year: 'numeric', month: '2-digit', day: '2-digit'
                    })}</p>
                    {/* You might want to store actual delivery completion date in orderDetails */}
                </div>

                <div className="bill-section total-summary">
                    <h3>Summary</h3>
                    <p><strong>Item Price:</strong> ₹{orderDetails.totalAmount?.toFixed(2) || '0.00'}</p>
                    <p><strong>Tax (GST @ 18%):</strong> ₹{(orderDetails.totalAmount * 0.18)?.toFixed(2) || '0.00'}</p>
                    <p className="grand-total"><strong>Grand Total:</strong> ₹{(orderDetails.totalAmount * 1.18)?.toFixed(2) || '0.00'}</p>
                </div>

                <div className="bill-barcode">
                    {/* Use order.id or trackingId for barcode data */}
                    {orderDetails.trackingId ? (
                        <Barcode value={orderDetails.trackingId} displayValue={true} />
                    ) : (
                        <p>No Tracking ID for Barcode</p>
                    )}
                </div>

                <div className="bill-footer">
                    <p>Thank you for your purchase!</p>
                </div>
            </div>

            <div className="bill-actions">
                <button onClick={handlePrint} className="print-bill-button">Print Bill</button>
                <button onClick={() => navigate('/order-status')} className="back-button">Back to Orders</button>
            </div>
        </div>
    );
};

export default FinalBill;