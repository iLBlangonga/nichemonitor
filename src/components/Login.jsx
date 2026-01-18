import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === 'equilibrium' || password === 'admin') {
            setIsAnimating(true);
            // Wait for animation to finish before actual login
            setTimeout(() => {
                onLogin(password === 'admin');
            }, 2000); // 2 seconds for the full black hole effect
        } else {
            setError(true);
        }
    };

    // Black Hole Animation Variants
    const logoVariants = {
        initial: {
            scale: 1,
            rotate: 0,
            opacity: 1,
            filter: "blur(0px)"
        },
        singularity: {
            scale: 0,
            rotate: 720, // Two full spins
            opacity: 0,
            filter: "blur(4px)",
            transition: {
                duration: 1.5,
                ease: "anticipate", // Pulls back slightly then shoots
            }
        }
    };

    const containerVariants = {
        initial: { opacity: 1 },
        exit: {
            opacity: 0,
            scale: 1.2, // Slight zoom in feeling into the hole
            transition: { duration: 1.0, ease: "easeInOut" }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-foreground p-4 overflow-hidden relative">

            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] opacity-20" />
            </div>

            <div className="w-full max-w-md relative z-10 flex flex-col items-center justify-center min-h-[400px]">

                {/* Logo Section */}
                <div className="relative w-full flex items-center justify-center mb-12 h-32">
                    <motion.div
                        className="relative w-32 h-32 flex items-center justify-center z-20"
                        variants={logoVariants}
                        initial="initial"
                        animate={isAnimating ? "singularity" : "initial"}
                    >
                        {/* The Singularity Glow (Only appears during animation) */}
                        {isAnimating && (
                            <motion.div
                                className="absolute inset-0 bg-white rounded-full blur-xl"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: [0, 0.8, 1, 0], scale: [0.5, 1.5, 0] }}
                                transition={{ duration: 1.5 }}
                            />
                        )}
                        <img src="/logo.svg" alt="Equilibrium Logo" className="h-full w-full object-contain" />
                    </motion.div>
                </div>

                {/* Form Container */}
                <AnimatePresence>
                    {!isAnimating && (
                        <motion.div
                            className="w-full flex flex-col items-center text-center"
                            variants={containerVariants}
                            initial="initial"
                            exit="exit"
                        >
                            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                                NICHE
                            </h1>
                            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-8">
                                Investor Portal
                            </p>

                            <form className="w-full max-w-[280px] space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <input
                                        type="password"
                                        required
                                        className={cn(
                                            "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-center text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-300",
                                            error && "border-rose-500/50 focus:border-rose-500"
                                        )}
                                        placeholder="Access Key"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError(false);
                                        }}
                                    />
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs text-rose-500 font-medium"
                                        >
                                            Invalid key provided
                                        </motion.p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 rounded-lg bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                                >
                                    Enter
                                </button>
                            </form>

                            <div className="mt-12 text-[10px] text-white/20 font-mono">
                                SECURITY CLEARED // LEVEL 4
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
