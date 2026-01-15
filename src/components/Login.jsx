import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Login({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hardcoded simple password for demo purposes (as requested: "private password access (scalable)")
        // Ideally this comes from env or a more secure check, but for a static client-side wall:
        if (password === 'equilibrium' || password === 'admin') {
            onLogin(password === 'admin');
        } else {
            setError(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-accent rounded-full flex items-center justify-center mb-4">
                        <Lock className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Investor Portal
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Please enter your access key to view the dashboard.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="password-input" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password-input"
                                name="password"
                                type="password"
                                required
                                className={cn(
                                    "appearance-none rounded-md relative block w-full px-3 py-2 border border-input bg-background/50 placeholder-muted-foreground text-foreground focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm",
                                    error && "border-destructive focus:ring-destructive"
                                )}
                                placeholder="Access Key"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(false);
                                }}
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-destructive text-center">
                            Invalid access key. Please try again.
                        </p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
                        >
                            Enter Portal
                        </button>
                    </div>
                </form>

                <div className="text-center text-xs text-muted-foreground pt-4">
                    Issued & Managed by Equilibrium
                </div>
            </div>
        </div>
    );
}
