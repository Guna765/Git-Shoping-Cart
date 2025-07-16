import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import './Signup.css'; // Your custom CSS file

// Import Font Awesome components and icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,    // For Email
  faPhone,        // For Phone
  faUser,         // For Username/User ID
  faLock          // For Password and Confirm Password
} from '@fortawesome/free-solid-svg-icons';

function Signup() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Password matching validation
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!"); // Display an error toast
            return; // Stop the function execution
        }

        // Retrieve existing users from local storage
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        // Check if user with given email or username already exists
        const userExists = existingUsers.some(
            user => user.email === email || user.username === username
        );

        if (userExists) {
            toast.error("User with this email or username already exists. Please try logging in or use different credentials."); // Display error toast
            return; // Stop the function execution
        }

        // Create new user object
        const newUser = {
            email,
            phone,
            username,
            password, // In a real app, hash this password before storing!
        };

        // Add new user to the existing list and save to local storage
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Display success toast
        toast.success("Sign Up Successful! You can now log in.");

        // Navigate to the login page after a short delay to allow the user to see the toast message
        setTimeout(() => {
            navigate('/login');
        }, 2000); // 2-second delay
    };

    return (
        <div className="signup-container">
            {/* ToastContainer is where all toast notifications will be rendered */}
            <ToastContainer
                position="top-right" // Position of the toasts
                autoClose={5000}     // Toasts disappear after 5 seconds
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                {/* Email Input Field with Icon */}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
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
                </div>

                {/* Phone Number Input Field with Icon */}
                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faPhone} className="input-icon" />
                        <input
                            type="tel" // Use type="tel" for phone numbers
                            id="phone"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Username Input Field with Icon */}
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faUser} className="input-icon" />
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Password Input Field with Icon */}
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faLock} className="input-icon" />
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
                </div>

                {/* Confirm Password Input Field with Icon */}
                <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirm_password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Sign Up Button */}
                <button type="submit" className="signup-button">Sign Up</button>
            </form>

            {/* Link to Login Page */}
            <div className="login-link">
                Already have an account? <Link to="/login">Login here</Link>
            </div>
        </div>
    );
}

export default Signup;