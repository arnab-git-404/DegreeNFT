import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

const AppRoutes = () => {
    
    const Verify = () => {
        return (
            <div>
                <h1>Verify</h1>
            </div>
        );
    };
    const Student = () => {
        return (
            <div>
                <h1>Student</h1>
            </div>
        );
    };

const University = () => {
    return (
        <div>
            <h1>University</h1>
        </div>
    );
};

    return (
       
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/student" element={<Student />} />
                <Route path="/university" element={<University />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                {/* <Route path="/mint" element={<MintNFT />} /> */}
                {/* <Route path="/profile/:id" element={<Profile />} /> */}
                <Route path="*" element={<NotFound/>} />
            </Routes>
        
    );
};

export default AppRoutes;