import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import './PaymentPage.css'; 
const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { itemToBuy } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState(''); 
    const [upiId, setUpiId] = useState('');
    const [isUpiVerified, setIsUpiVerified] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    useEffect(() => {
        if (!itemToBuy) {
            toast.error("No item selected for purchase. Redirecting to shopping page.");
            navigate('/customer');
        }
    }, [itemToBuy, navigate]);

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
       
        if (e.target.value === 'cod') {
            setUpiId('');
            setIsUpiVerified(false);
        }
    };

    const handleUpiIdChange = (e) => {
        setUpiId(e.target.value);
        setIsUpiVerified(false);
    };

    const handleVerifyUpi = () => {
        if (upiId.trim() === '') {
            toast.error('Please enter a UPI ID.');
            return;
        }
        if (!upiId.includes('@')) {
            toast.error('Invalid UPI ID format. Must contain "@" symbol.');
            return;
        }

        toast.info('Verifying UPI ID...', { autoClose: 1500 });
        setTimeout(() => {
            setIsUpiVerified(true);
            toast.success('UPI ID Verified!', { autoClose: 2000 });
        }, 1500);
    };

    const handlePayNow = (method) => {
        if (!itemToBuy) {
            toast.error("No item selected for payment. Please go back to shopping.");
            return;
        }

        if (paymentProcessing) {
            return; 
        }

        setPaymentProcessing(true); 

        if (method === 'upi') {
            if (!isUpiVerified) {
                toast.error('Please verify your UPI ID first.');
                setPaymentProcessing(false);
                return;
            }
            toast.info('Processing your UPI payment...', { autoClose: false, toastId: 'processingToast' });
            setTimeout(() => {
                toast.dismiss('processingToast');

                navigate('/address', { state: { itemToBuy: itemToBuy, paymentMethod: 'upi' } });

                setTimeout(() => {
                    toast.success("Payment Successful!"); 
                }, 100); 

                setPaymentProcessing(false); 
            }, 3000); 
        } else if (method === 'cod') {
            toast.info('Proceeding with Cash on Delivery. Enter address details.');
            setTimeout(() => {
               
                navigate('/address', { state: { itemToBuy: itemToBuy, paymentMethod: 'cod' } });
                setPaymentProcessing(false); 
            }, 1000); 
        } else {
            toast.error('Please select a payment method.');
            setPaymentProcessing(false);
        }
    };

    return (
        <div className="payment-page-container">
            <h2>Payment Details</h2>
            {itemToBuy ? (
                <div className="item-details-for-payment">
                    {itemToBuy.image && itemToBuy.image !== 'placeholder-image.jpg' && (
                        <img src={itemToBuy.image} alt={itemToBuy.publication} className="payment-item-image" />
                    )}
                    <h3>{itemToBuy.publication}</h3>
                    <p>Category: {itemToBuy.category}</p>
                    <p>Seller: {itemToBuy.sellerName}</p>
                    <p className="payment-item-price">Price: ₹{itemToBuy.price?.toFixed(2)}</p>
                </div>
            ) : (
                <p className="no-item-message">No item selected for payment. Please go back to the shopping page.</p>
            )}

            <div className="payment-method-selection">
                <h4>Select Payment Method</h4>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="upi"
                            checked={paymentMethod === 'upi'}
                            onChange={handlePaymentMethodChange}
                            disabled={paymentProcessing}
                        />{' '}
                        UPI
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={handlePaymentMethodChange}
                            disabled={paymentProcessing}
                        />{' '}
                        Cash on Delivery
                    </label>
                </div>

                {paymentMethod === 'upi' && (
                    <div className="upi-details">
                        <h4>Enter UPI Information</h4>
                        <div className="upi-input-group">
                            <input
                                type="text"
                                id="upiId"
                                placeholder="Enter your UPI ID (e.g., yourname@bank)"
                                value={upiId}
                                onChange={handleUpiIdChange}
                                className="upi-input"
                                disabled={paymentProcessing || isUpiVerified}
                            />
                            <button
                                onClick={handleVerifyUpi}
                                className="verify-button"
                                disabled={isUpiVerified || paymentProcessing}
                            >
                                Verify
                            </button>
                            {isUpiVerified && <span className="verified-status">Verified!</span>}
                        </div>
                    </div>
                )}

                {paymentMethod === 'cod' && (
                    <div className="cod-details">
                        <p>You will pay ₹{itemToBuy?.price?.toFixed(2) || '0.00'} at the time of delivery.</p>
                    </div>
                )}

                <button
                    onClick={() => handlePayNow(paymentMethod)}
                    className="pay-button"
                    disabled={
                        paymentProcessing ||
                        !paymentMethod ||
                        (paymentMethod === 'upi' && !isUpiVerified)
                    }
                >
                    {paymentProcessing
                        ? 'Processing...'
                        : paymentMethod === 'cod'
                            ? 'Proceed to Address'
                            : `Pay ₹${itemToBuy ? itemToBuy.price?.toFixed(2) : '0.00'}`}
                </button>
            </div>
            <button className="back-to-customer-button" onClick={() => navigate('/customer')}>Back to Shopping</button>
        </div>
    );
};

export default PaymentPage;