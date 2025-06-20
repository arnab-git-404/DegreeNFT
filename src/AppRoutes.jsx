import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { UniversityDashboard } from './pages/UniversityDashboard';
import { VerificationPortal } from './pages/VerificationPortal';
import { StudentDashboard } from './pages/StudentDashboard';
import { BatchUploadPortal } from './pages/BatchUploadPortal';
import { Faucet } from './pages/Faucet';

const AppRoutes = () => {

    return (
       
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/verify" element={<VerificationPortal />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/university" element={<UniversityDashboard />} />
                <Route path="/batch-upload" element={<BatchUploadPortal />} />
                <Route path="/faucet" element={<Faucet />} />


                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                {/* <Route path="/mint" element={<MintNFT />} /> */}
                {/* <Route path="/profile/:id" element={<Profile />} /> */}
                <Route path="*" element={<NotFound/>} />
            </Routes>
        
    );
};

export default AppRoutes;