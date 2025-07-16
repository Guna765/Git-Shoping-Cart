import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Signup from './Signup';
import './App.css'; 
import Dashboard from './Dashboard';
import AddItem from './AddItemForm';
import Login from './Login';
import CustomerLogin from './CustomerLogin';
import Customer from './Customer';
import CustomerSignup from './CustomerSignup';
import PaymentPage from './PaymentPage';
import OrderStatus from './OrderStatus';
import DeliveryStatus from './DeliveryStatus';
import FinalBill from './FinalBill';
import Address from './Adress';
import ChangePassword from './ChangePassword';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login/>} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/signup" element={<Signup />} /> 
          <Route path ="/dashboard" element ={<Dashboard/>}/>
          <Route path ="/additem" element ={<AddItem/>}/>
          <Route path ="/customerlogin" element = {<CustomerLogin/>}/>
          <Route path ="/customer" element={<Customer/>}/>
          <Route path = "/customersignup" element={<CustomerSignup/>}/>
          <Route path= "/paymentpage" element ={<PaymentPage/>}/>
          <Route path = "/order-status" element ={<OrderStatus/>}/>
          <Route path = "/delivery-status" element = {<DeliveryStatus/>}/>
          <Route path = "final-bill" element = {<FinalBill/>}/>
          <Route path = "/address" element ={<Address/>}/>
          <Route path = "/change-password" element ={<ChangePassword/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;