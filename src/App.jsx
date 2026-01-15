import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import appData from './data.json';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-white text-black">
                    <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
                    <details className="whitespace-pre-wrap">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default function AppWrapper() {
    return (
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
}

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
