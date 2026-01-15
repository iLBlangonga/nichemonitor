import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import appData from './data.json';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [data, setData] = useState(appData);

    // Check local storage for session persistence
    useEffect(() => {
        const auth = localStorage.getItem('niche_auth');
        const admin = localStorage.getItem('niche_admin');
        if (auth === 'true') {
            setIsAuthenticated(true);
            if (admin === 'true') setIsAdmin(true);
        }
    }, []);

    const handleLogin = (isAdminAccess) => {
        setIsAuthenticated(true);
        setIsAdmin(isAdminAccess);
        localStorage.setItem('niche_auth', 'true');
        if (isAdminAccess) localStorage.setItem('niche_admin', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem('niche_auth');
        localStorage.removeItem('niche_admin');
    };

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    if (isAdmin) {
        return <Admin data={data} setData={setData} onLogout={handleLogout} />;
    }

    return (
        <Dashboard data={data} onLogout={handleLogout} />
    );
}

export default App;
