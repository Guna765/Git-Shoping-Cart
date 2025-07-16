import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './CustomerLogin.css';
function CustomerLogin() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();

        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = storedUsers.find(user =>
            (user.email === identifier ||user.mobile === identifier || user.username === identifier) && user.password === password
        );
        if (foundUser) {
            toast.success("Login Successful! Welcome, " + foundUser.username + "!"); 
          
            localStorage.setItem('currentUser', JSON.stringify({ username: foundUser.username, mobile: foundUser.mobile, email: foundUser.email }));
            setTimeout(() => {
                navigate('/customer');
            }, 2000); 
        } else {
            toast.error("Invalid credentials. Please check your user ID/email/mobilenumber and password."); 
        }
    };

    return (
        <div className="login-container">
            <ToastContainer /> 
            <h2> Customer Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="identifier">User ID , Email or Mobile Number</label>
                    <input
                        type="text"
                        id="identifier"
                        name="identifier"
                        placeholder="Enter your user ID , email or mobile"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
            <div className="signup-link">
                Don't have an account? <Link to="/customerSignup">Sign Up here</Link>
            </div>
        </div>
    );
}

export default CustomerLogin;
