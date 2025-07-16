import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaHome, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddItemForm from './AddItemForm';
import ViewItems from './ViewItems';
import EditItemForm from './EditItemForm'; 
import './Dashboard.css';

function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentView, setCurrentView] = useState('home');
    const [actionMode, setActionMode] = useState(null); 
    const [itemToEdit, setItemToEdit] = useState(null); 

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarItemClick = (viewName, mode = null) => {
        console.log("Sidebar item clicked:", viewName, "Mode:", mode);
        setCurrentView(viewName);
        setActionMode(mode);
        setItemToEdit(null); 
        setIsSidebarOpen(false);
    };

    const handleAddItemSuccess = (newItem) => {
        console.log("New item added:", newItem);
        toast.success("New item added successfully!");
        setCurrentView('view-items'); 
        setActionMode(null);
    };

    const handleEditItem = (item) => {
        console.log("Editing item:", item);
        setItemToEdit(item); 
        setCurrentView('edit-item-form'); 
        setActionMode('edit');
        toast.info(`Editing "${item.publication}"`);
    };

    const handleUpdateItem = (updatedItem) => {
        const storedItems = JSON.parse(localStorage.getItem('items')) || [];
        const updatedItems = storedItems.map(item =>
            item.id === updatedItem.id ? updatedItem : item
        );
        localStorage.setItem('items', JSON.stringify(updatedItems));
        toast.success(`"${updatedItem.publication}" updated successfully!`);

        setItemToEdit(null); 
        setCurrentView('view-items'); 
        setActionMode(null); 
        window.dispatchEvent(new Event('storage'));
    };

    const handleDeleteItem = (itemId) => {
       
        const storedItems = JSON.parse(localStorage.getItem('items')) || [];
        const itemDeleted = storedItems.find(item => item.id === itemId);
        const filteredItems = storedItems.filter(item => item.id !== itemId);
        localStorage.setItem('items', JSON.stringify(filteredItems));
        toast.success(`"${itemDeleted ? itemDeleted.publication : 'Item'}" deleted successfully!`);

        setCurrentView('view-items'); 
        setActionMode(null); 
      
        window.dispatchEvent(new Event('storage'));
    };

    const handleCancelEdit = () => {
        setItemToEdit(null); 
        setCurrentView('view-items');
        setActionMode(null); 
        toast.info("Edit cancelled.");
    };

    const renderMainContent = () => {
        switch (currentView) {
            case 'home':
                return (
                    <>
                        <h2 style={{marginLeft:"750px"}}>Welcome to M.R Chandrabhanu Behera!</h2>
                        <p style={{marginLeft:"750px"}}>Use to manage your items.</p>
                    </>
                );
            case 'add-item':
                return <AddItemForm onAddItemSuccess={handleAddItemSuccess} />;
            case 'view-items':
                
                return (
                    <ViewItems
                        actionMode={actionMode}
                        onEditItem={handleEditItem}
                        onDeleteItem={handleDeleteItem}
                    />
                );
            case 'edit-item-form': 
                return (
                    <EditItemForm
                        itemToEdit={itemToEdit}
                        onUpdateItem={handleUpdateItem}
                        onCancelEdit={handleCancelEdit}
                    />
                );
            case 'edit-item': 
                return (
                    <ViewItems
                        actionMode="edit" 
                        onEditItem={handleEditItem}
                        onDeleteItem={handleDeleteItem} 
                    />
                );
            case 'delete-item': 
                return (
                    <ViewItems
                        actionMode="delete" 
                        onEditItem={handleEditItem} 
                        onDeleteItem={handleDeleteItem}
                    />
                );
            default:
                return (
                    <>
                        <h2 style={{marginLeft:"600px"}}>Welcome to your M.R Chandrabhanu!</h2>
                        <p style={{marginLeft:"600px"}}>Use the sidebar to manage your items.</p>
                    </>
                );
        }
    };

    return (
        <div className="dashboard-container">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <header className="dashboard-header">
                <div className="dashboard-header-left">
                    <div className="menu-icon" onClick={toggleSidebar}>
                        <FaBars style={{color:"#11dde3",marginLeft:"10px"}}/>
                    </div>
                    <h1>M.R CHANDRABHANU BEHERA</h1>
                </div>
                <div className="user-info">
                    <span>Welcome, {JSON.parse(localStorage.getItem('currentUser'))?.username || 'Guest'}!</span>
                </div>
            </header>

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <nav>
                    <ul>
                        <li>
                            <Link to="#" onClick={() => handleSidebarItemClick('home')}>
                                <FaHome style={{color:"#27c7b4"}}/> Home
                            </Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleSidebarItemClick('add-item')}>
                                <FaPlus style={{color:"#ff33fc"}}/> Add Item
                            </Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleSidebarItemClick('view-items')} >
                                <FaEye style={{color:"#33f0ff"}}/> View Items
                            </Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleSidebarItemClick('view-items','edit')}> 
                                <FaEdit style={{color:"yellow"}} /> Edit Item
                            </Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleSidebarItemClick('view-items', 'delete')}> 
                                <FaTrash  style={{color:"red"}}/> Delete Item
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            <div className={`main-content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
                <main className="dashboard-content">
                    {renderMainContent()}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;