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
            // We rely on the video onEnded event.
        } else {
            setError(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
            <div className="w-full max-w-md space-y-8 transition-all duration-500">
                <div className="text-center relative">
                    <div className="mx-auto h-32 w-full flex items-center justify-center mb-6 transition-all duration-500 ease-in-out">
                        {showAnimation ? (
                            <div className="relative w-full max-w-[200px] aspect-video">
                                <video
                                    autoPlay
                                    muted
                                    playsInline
                                    preload="auto"
                                    className="w-full h-full object-contain"
                                    onEnded={() => onLogin(password === 'admin')}
                                >
                                    <source src="/logo_animation.mp4" type="video/mp4" />
                                </video>
                            </div>
                        ) : (
                            /* Static Logo */
                            <img src="/logo.svg" alt="Equilibrium Logo" className="h-full object-contain animate-in fade-in duration-500" />
                        )}
                    </div>

                    {/* Hide text when animating to focus on the video */}
                    <div className={cn("transition-opacity duration-500", showAnimation ? "opacity-0 invisible" : "opacity-100 visible")}>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-1">
                            NICHE
                        </h1>
                        <h2 className="text-lg font-medium text-muted-foreground uppercase tracking-wider">
                            Investor Portal
                        </h2>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Please enter your access key to view the dashboard.
                        </p>
                    </div>
                </div>

                <div className={cn("transition-all duration-500 delay-100", showAnimation ? "opacity-0 translate-y-4 invisible" : "opacity-100 translate-y-0 visible")}>
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
        </div>
    );
}
