import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Login({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hardcoded simple password check
        if (password === 'equilibrium' || password === 'admin') {
            setShowAnimation(true);

            // Set a timeout to allow the video to play before actually logging in
            // Assuming video length is roughly 3-4 seconds, but we can set a fixed viewing time.
            setTimeout(() => {
                onLogin(password === 'admin');
            }, 3500); // 3.5s delay
        } else {
            setError(true);
        }
    };

    if (showAnimation) {
        return (
            <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                <video
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover md:object-contain max-w-4xl"
                    onEnded={() => onLogin(password === 'admin')} // Fallback if video ends before timeout or user interaction
                >
                    <source src="/logo_animation.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 flex items-center justify-center mb-6">
                        {/* Static Logo on Login Screen */}
                        <img src="/logo.svg" alt="Equilibrium Logo" className="h-full w-full object-contain" />
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
