import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Helper component to split text into characters for granular animation
const SplitText = ({ text, className, variants, customPropBase }) => {
    return (
        <span className={cn("inline-block", className)}>
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    custom={{ ...customPropBase, index }} // Pass index for potentially staggering
                    variants={variants}
                    initial="initial"
                    exit="exit"
                    className="inline-block"
                    style={{ whiteSpace: "pre" }} // Preserve spaces
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
};

export default function Login({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hardcoded simple password check
        if (password === 'equilibrium' || password === 'admin') {
            setShowAnimation(true);
        } else {
            setError(true);
        }
    };

    // Variants for letter scattering
    // Each letter will get a random destination to create the "explosion" effect
    const letterVariants = {
        initial: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" },
        exit: () => {
            // Generate random scatter values
            const randomX = (Math.random() - 0.5) * 800; // Wider spread
            const randomY = (Math.random() - 0.5) * 800; // Taller spread
            const randomRotate = (Math.random() - 0.5) * 360; // Full spin potential
            const randomScale = 0.5 + Math.random(); // Varied scale

            return {
                opacity: 0,
                x: randomX,
                y: randomY,
                rotate: randomRotate,
                scale: randomScale,
                filter: "blur(4px)",
                transition: {
                    duration: 4.0, // MUCH SLOWRR: "Molto più lentamente"
                    ease: [0.2, 0.8, 0.2, 1] // Very smooth, almost distinct "floating" feel
                }
            };
        }
    };

    // Variants for the form container
    const formVariants = {
        initial: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: {
            opacity: 0,
            y: 150, // Move down further
            filter: "blur(12px)",
            transition: { duration: 3.0, ease: "easeInOut" } // Slow fade out to match
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 overflow-hidden relative">
            {/* Main Container - Fixed dimensions or min-height to prevent layout jump */}
            <div className="w-full max-w-md relative z-10 flex flex-col items-center h-[600px] justify-center">

                {/* Logo / Video Section */}
                <div className="relative w-full flex items-center justify-center mb-6 h-32 shrink-0">
                    <AnimatePresence>
                        {showAnimation && (
                            <motion.div
                                key="video-player"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: videoPlaying ? 1 : 0 }}
                                transition={{ duration: 1.0, ease: "easeOut" }}
                                className="absolute inset-0 flex items-center justify-center z-10" // Video is Z-10
                            >
                                <div className="relative w-full max-w-[220px] aspect-video">
                                    <video
                                        autoPlay
                                        muted
                                        playsInline
                                        preload="auto"
                                        className="w-full h-full object-contain"
                                        onLoadedMetadata={(e) => {
                                            // Skip the first second as requested
                                            e.target.currentTime = 1.0;
                                        }}
                                        onPlay={() => setVideoPlaying(true)}
                                        onEnded={() => onLogin(password === 'admin')}
                                    >
                                        <source src="/logo_animation.mp4" type="video/mp4" />
                                    </video>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {(!videoPlaying) && (
                            <motion.div
                                key="static-logo"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, transition: { duration: 0.8 } }}
                                className="absolute inset-0 flex items-center justify-center z-20" // Logo is Z-20
                            >
                                <img src="/logo.svg" alt="Equilibrium Logo" className="h-full object-contain" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Text & Form Container - Absolute position overlay to allow particles to fly freely without pushing layout */}
                <div className="relative w-full flex flex-col items-center z-30"> {/* Text is Z-30 (highest) */}
                    <AnimatePresence mode="popLayout">
                        {!showAnimation && (
                            <motion.div
                                className="flex flex-col items-center text-center w-full"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, transition: { duration: 3.5 } }} // Parent fades slightly slower than children to ensure visibility
                            >
                                <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-1 perspective-1000">
                                    <SplitText
                                        text="NICHE"
                                        variants={letterVariants}
                                    />
                                </h1>
                                <h2 className="text-lg font-medium text-muted-foreground uppercase tracking-wider perspective-1000">
                                    <SplitText
                                        text="Investor Portal"
                                        variants={letterVariants}
                                    />
                                </h2>
                                <motion.p
                                    className="mt-4 text-sm text-muted-foreground"
                                    variants={letterVariants}
                                    initial="initial"
                                    exit="exit"
                                >
                                    Please enter your access key to view the dashboard.
                                </motion.p>

                                <motion.div
                                    className="w-full pt-8 max-w-xs mx-auto"
                                    variants={formVariants}
                                    initial="initial"
                                    exit="exit"
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
