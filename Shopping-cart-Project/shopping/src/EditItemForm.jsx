import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AddItemForm.css'; 

function EditItemForm({ itemToEdit, onUpdateItem, onCancelEdit }) {
    const [id, setId] = useState(''); 
    const [category, setCategory] = useState('');
    const [publication, setPublication] = useState('');
    const [imageFile, setImageFile] = useState(null); 
    const [imagePreviewUrl, setImagePreviewUrl] = useState(''); 
    const [price, setPrice] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [itemAvailable, setItemAvailable] = useState('yes'); 

    const productCategories = [
        "Electronics", "Books", "Clothing", "Home Appliances", "Sports Equipment",
        "Toys & Games", "Groceries", "Automotive", "Health & Beauty", "Furniture"
    ];

    useEffect(() => {
        if (itemToEdit) {
            setId(itemToEdit.id);
            setCategory(itemToEdit.category);
            setPublication(itemToEdit.publication);
            setImagePreviewUrl(itemToEdit.image && itemToEdit.image !== 'placeholder-image.jpg' ? itemToEdit.image : '');
            setImageFile(null); 
            setPrice(itemToEdit.price.toString()); 
            setSellerName(itemToEdit.sellerName);
            setItemAvailable(itemToEdit.itemAvailable ? 'yes' : 'no');
        }
    }, [itemToEdit]); 

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!category || !publication || !price || !sellerName) {
            toast.error("Please fill in all required fields.");
            return;
        }
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            toast.error("Please enter a valid positive price.");
            return;
        }

        const updatedItem = {
            id: id, 
            category,
            publication,
            image: imageFile ? imagePreviewUrl : (itemToEdit.image || 'placeholder-image.jpg'),
            price: parseFloat(price),
            sellerName,
            itemAvailable: itemAvailable === 'yes',
        };

        if (onUpdateItem) {
            onUpdateItem(updatedItem);
            toast.success("Item updated successfully!");
        }
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImageFile(file); 

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result); 
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreviewUrl(itemToEdit.image && itemToEdit.image !== 'placeholder-image.jpg' ? itemToEdit.image : '');
        }
    };

    return (
        <div className="add-item-form-container"> 
            <h3>Edit Item</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">-- Choose Category --</option>
                        {productCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="publication">Publication</label>
                    <input
                        type="text"
                        id="publication"
                        name="publication"
                        value={publication}
                        onChange={(e) => setPublication(e.target.value)}
                        placeholder="e.g., HarperCollins, Samsung, Nike"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imageFile && <p className="file-name">Selected: {imageFile.name}</p>}
                    {imagePreviewUrl && (
                        <div className="image-preview-container">
                            <img src={imagePreviewUrl} alt="Image Preview" className="image-preview" />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g., 99.99"
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="sellerName">Seller Name</label>
                    <input
                        type="text"
                        id="sellerName"
                        name="sellerName"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        placeholder="e.g., ABC Retail"
                        required
                    />
                </div>

                <div className="form-group radio-group">
                    <label>Item Available</label>
                    <div className="radio-option">
                        <input
                            type="radio"
                            id="itemAvailableYes"
                            name="itemAvailable"
                            value="yes"
                            checked={itemAvailable === 'yes'}
                            onChange={(e) => setItemAvailable(e.target.value)}
                        />
                        <label htmlFor="itemAvailableYes">Yes</label>
                    </div>
                    <div className="radio-option">
                        <input
                            type="radio"
                            id="itemAvailableNo"
                            name="itemAvailable"
                            value="no"
                            checked={itemAvailable === 'no'}
                            onChange={(e) => setItemAvailable(e.target.value)}
                        />
                        <label htmlFor="itemAvailableNo">No</label>
                    </div>
                </div>

                <div className="form-actions"> 
                    <button type="submit" className="submit-button">Update Item</button>
                    <button type="button" onClick={onCancelEdit} className="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default EditItemForm;