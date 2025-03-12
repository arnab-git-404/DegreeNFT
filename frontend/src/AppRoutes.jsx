import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

const AppRoutes = () => {
    
    return (
       
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                {/* <Route path="/mint" element={<MintNFT />} /> */}
                {/* <Route path="/profile/:id" element={<Profile />} /> */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        
    );
};

export default AppRoutes;