import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaShoppingCart, FaCreditCard } from 'react-icons/fa'; // Import new icons
import { toast } from 'react-toastify';
import './ViewItems.css';


function ViewItems({ actionMode, onEditItem, onDeleteItem }) {
    const [items, setItems] = useState([]);
    const [itemToDelete, setItemToDelete] = useState(null);

    const loadItems = () => {
        const storedItems = JSON.parse(localStorage.getItem('items')) || [];
        setItems(storedItems);
    };

    useEffect(() => {
        loadItems();

        window.addEventListener('storage', loadItems);
        return () => window.removeEventListener('storage', loadItems);
    }, [actionMode]);


    const handleEditClick = (item) => {
        if (onEditItem) {
            onEditItem(item);
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
    };

    const confirmDeletion = () => {
        if (itemToDelete && onDeleteItem) {
            onDeleteItem(itemToDelete.id);
            setItemToDelete(null);
            toast.success(`"${itemToDelete.publication}" has been deleted.`); 
        }
    };

    const cancelDeletion = () => {
        setItemToDelete(null);
        toast.info("Deletion cancelled.");
    };

   
    const handleAddToCart = (item) => {
        toast.success(`"${item.publication}" added to cart!`);
       
    };

    const handleBuyNow = (item) => {
        toast.info(`Proceeding to buy "${item.publication}"!`);
       
    };


    return (
        <div className="view-items-container">
            <h3>All Added Items</h3>
            {actionMode === 'edit' && <p className="action-hint">Click "Edit" on an item to modify it.</p>}
            {actionMode === 'delete' && <p className="action-hint">Click "Delete" on an item to remove it.</p>}

            {items.length === 0 ? (
                <p className="no-items-message">No items added yet. Please add some items using the "Add Item" form.</p>
            ) : (
                <div className="items-grid">
                    {items.map((item) => (
                        <div key={item.id} className="item-card">
                            {item.image && item.image !== 'placeholder-image.jpg' ? (
                                <img src={item.image} alt={item.publication} className="item-image" />
                            ) : (
                                <div className="item-image-placeholder">No Image</div>
                            )}
                            <div className="item-details">
                                <p><strong>Category:</strong> {item.category}</p>
                                <p ><strong>Publication:</strong> {item.publication}</p>
                                <p style={{fontWeight:"bold"}}><strong>Price:</strong> ₹{item.price.toFixed(2)}</p>
                                <p><strong>Seller:</strong> {item.sellerName}</p>
                                <p className={`item-availability ${item.itemAvailable ? 'available' : 'not-available'}`}>
                                    <strong>Availability: </strong> {item.itemAvailable ? 'Active' : 'Not Available'}
                                </p>
                                {item.itemAvailable && (
                                    <div className="purchase-actions">
                                        <button className="add-to-cart-button" onClick={() => handleAddToCart(item)}>
                                            <FaShoppingCart /> Add to Cart
                                        </button>
                                        <button className="buy-now-button" onClick={() => handleBuyNow(item)}>
                                            <FaCreditCard /> Buy
                                        </button>
                                    </div>
                                )}
                            </div>
                            {(actionMode === 'edit' || actionMode === 'delete') && (
                                <div className="item-actions">
                                    {actionMode === 'edit' && (
                                        <button className="edit-button" onClick={() => handleEditClick(item)}>
                                            <FaEdit /> Edit
                                        </button> 
                                    )}
                                    {actionMode === 'delete' && (
                                        <button className="delete-button" onClick={() => handleDeleteClick(item)}>
                                            <FaTrash /> Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {itemToDelete && (
                <div className="custom-confirm-modal-overlay">
                    <div className="custom-confirm-modal-content">
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete the item: <strong>"{itemToDelete.publication}"</strong>?</p>
                        <div className="modal-buttons">
                            <button className="confirm-btn" onClick={confirmDeletion}>Yes</button>
                            <button className="cancel-btn" onClick={cancelDeletion}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewItems;