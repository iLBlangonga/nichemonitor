import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false); // New state to track actual playback

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

    // Variants for the "slow float" effect
    const floatVariants = {
        initial: { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)" },
        exit: (custom) => ({
            opacity: 0,
            scale: 0.95, // Slight shrink
            x: custom.x,
            y: custom.y,
            rotate: custom.rotate,
            filter: "blur(8px)", // Stronger blur for dreamy effect
            transition: {
                duration: 2.5, // Much slower
                ease: "easeInOut" // Smooth floating feel
            }
        })
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 overflow-hidden relative">
            <div className="w-full max-w-md space-y-8 relative z-10 flex flex-col items-center">

                {/* Logo / Video Section */}
                <div className="relative w-full flex items-center justify-center mb-2 h-32 shrink-0">
                    <AnimatePresence>
                        {showAnimation && (
                            <motion.div
                                key="video-player"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: videoPlaying ? 1 : 0 }} // Only fade in when PLAYING
                                transition={{ duration: 1.0, ease: "easeOut" }} // Crossfade in
                                className="absolute inset-0 flex items-center justify-center z-20"
                            >
                                <div className="relative w-full max-w-[220px] aspect-video">
                                    <video
                                        autoPlay
                                        muted
                                        playsInline
                                        preload="auto"
                                        className="w-full h-full object-contain"
                                        onPlay={() => setVideoPlaying(true)} // Trigger fade-in only when actually playing
                                        onEnded={() => onLogin(password === 'admin')}
                                    >
                                        <source src="/logo_animation.mp4" type="video/mp4" />
                                    </video>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {/* Static logo stays visible until video is CONFIRMED playing */}
                        {(!videoPlaying) && (
                            <motion.div
                                key="static-logo"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, transition: { duration: 1.0 } }} // Fade out matches video fade in
                                className="absolute inset-0 flex items-center justify-center z-10"
                            >
                                <img src="/logo.svg" alt="Equilibrium Logo" className="h-full object-contain" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Text Section - Relative positioning to avoid overlap */}
                <AnimatePresence>
                    {!showAnimation && (
                        <div className="w-full flex flex-col items-center space-y-2 text-center">
                            <motion.h1
                                initial="initial"
                                exit="exit"
                                variants={floatVariants}
                                custom={{ x: -60, y: -100, rotate: -5 }} // Floating up and left
                                className="text-4xl font-extrabold tracking-tight text-foreground"
                            >
                                NICHE
                            </motion.h1>
                            <motion.h2
                                initial="initial"
                                exit="exit"
                                variants={floatVariants}
                                custom={{ x: 60, y: -80, rotate: 5 }} // Floating up and right
                                className="text-lg font-medium text-muted-foreground uppercase tracking-wider"
                            >
                                Investor Portal
                            </motion.h2>
                            <motion.p
                                initial="initial"
                                exit="exit"
                                variants={floatVariants}
                                custom={{ x: 0, y: 100, rotate: 0 }} // Floating down
                                className="mt-4 text-sm text-muted-foreground"
                            >
                                Please enter your access key to view the dashboard.
                            </motion.p>
                        </div>
                    )}
                </AnimatePresence>

                {/* Form Section */}
                <AnimatePresence>
                    {!showAnimation && (
                        <motion.div
                            className="w-full pt-6"
                            initial={{ opacity: 1, y: 0 }}
                            exit={{
                                opacity: 0,
                                y: 50,
                                filter: "blur(10px)",
                                scale: 0.95,
                                transition: { duration: 2.0, ease: "easeInOut" } // Slow fade out
                            }}
                        >
                            <form className="space-y-6" onSubmit={handleSubmit}>
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
