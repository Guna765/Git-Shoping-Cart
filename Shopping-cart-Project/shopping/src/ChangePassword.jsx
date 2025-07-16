import React, { useState, useEffect } from 'react';
import './ChangePassword.css';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(storedUser);
    }, []);

    const handlePasswordChange = (e) => {
        e.preventDefault();

        if (!currentUser) {
            toast.error("User not logged in!");
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.username === currentUser.username);

        if (userIndex === -1 || users[userIndex].password !== currentPassword) {
            toast.error("Current password is incorrect.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));

        toast.success("Password changed successfully!");
        setTimeout(() => {
            navigate('/customer');
        }, 2000);
    };

    return (
        <div className="change-password-container">
            <ToastContainer />
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                    <label>Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
