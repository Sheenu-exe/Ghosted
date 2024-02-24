// Import necessary libraries and components
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import Cookies from "universal-cookie";
import { auth } from "./firebase.config"; // Ensure you have this Firebase configuration set up
import {SignIn} from "./assets/Components/SignIn";
import {SignUp} from "./assets/Components/SignUp";
import {Home} from "./assets/Components/Homepage";
import Profile from "./assets/Components/Profilecreate";
import "./App.css";
import Error from './assets/Components/404';


// Initialize cookies
const cookies = new Cookies();

const App = () => {
 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  useEffect(() => {
    // Check authentication state on component mount
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // User is signed in
        cookies.set('userAuthenticated', 'true', { path: '/', maxAge: 86400 }); // 86400 seconds = 1 day
        setIsAuthenticated(true);
      } else {
        // User is signed out
        cookies.remove('userAuthenticated', { path: '/' });
        setIsAuthenticated(false);
      }
    });

    return () => {
      unsubscribe(); // Cleanup the subscription
    };
  }, []);

  return (
    <div className='flex'><Error />
    
    <Router>
      <Routes>
        <Route path="/signin" element={!isAuthenticated ? <SignIn /> : <Navigate replace to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate replace to="/" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate replace to="/signin" />} />
      </Routes>
    </Router></div>
  );
};

export default App;
