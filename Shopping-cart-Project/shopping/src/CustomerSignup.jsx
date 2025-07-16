
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CustomerSignup.css'; 

function CustomerSignup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!username || !email || !mobile || !password) {
            toast.error("All fields are required.");
            return;
        }

        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = storedUsers.some(user => user.username === username || user.email === email ||user.mobile === mobile);

        if (userExists) {
            toast.error("Username or email already exists. Please choose a different one.");
        } else {
            const newUser = { id: Date.now(), username, email, mobile, password };
            storedUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(storedUsers));
            toast.success("Signup Successful! Please log in.");
            setTimeout(() => {
                navigate('/customerlogin'); 
            }, 2000);
        }
    };

    return (
        <div className="signup-container">
            <ToastContainer />
            <h2> Customer-Sign-Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                 <div className="form-group">
                    <label htmlFor="mobile">Mobile Number</label>
                    <input
                        type="mobile"
                        id="mobile"
                        name="mobile"
                        placeholder="Enter your Mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
            <div className="login-link">
                Already have an account? <Link to="/customerlogin">Login here</Link>
            </div>
        </div>
    );
}

export default CustomerSignup;