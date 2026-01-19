import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, BarChart2, Shield, Activity } from 'lucide-react';

export default function Hero() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for the spotlight
    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        x.set(clientX - left);
        y.set(clientY - top);
    }

    return (
        <section
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] shadow-2xl border border-white/10 p-8 md:p-12 mb-8 group"
            onMouseMove={handleMouseMove}
        >
            {/* Background elements for "tech/quant" feel */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            {/* Subtle Interactive Glow that follows mouse across the entire box */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100 z-0"
                style={{
                    background: useTransform(
                        [mouseX, mouseY],
                        ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(16, 185, 129, 0.06), transparent 40%)`
                    ),
                }}
            />

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">

                {/* Left Column: Content */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wider uppercase mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active Management Certificate
                        </div>

                        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4 flex flex-col gap-1">
                            <span>Strategic Stability</span>
                            <span className="text-xl md:text-2xl text-white/40 font-serif italic self-center">in a</span>
                            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 pb-2">Shifting World</span>
                        </h1>

                        <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                            NICHE is a specialized Absolute Return strategy designed to capture systematic risk premia while maintaining sophisticated downside protection. We leverage quantitative models to navigate global market complexities.
                        </p>

                        <div className="space-y-1 text-xs text-muted-foreground border-l-2 border-white/10 pl-4 py-1 mt-8">
                            <p><span className="text-gray-400 font-medium">Issuer:</span> CapStone Securities PCC Limited.</p>
                            <p><span className="text-gray-400 font-medium">Investment Manager:</span> Frame Asset Management SA (FINMA regulated).</p>
                            <p><span className="text-gray-400 font-medium">Advisory Company:</span> Equilibrium Sagl</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                    >
                        <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <Activity className="text-emerald-400 mb-1" size={20} />
                            <span className="text-sm font-medium text-gray-300">Absolute Return</span>
                            <span className="text-xs text-gray-500">Uncorrelated Alpha</span>
                        </div>
                        <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <Shield className="text-cyan-400 mb-1" size={20} />
                            <span className="text-sm font-medium text-gray-300">Risk in Focus</span>
                            <span className="text-xs text-gray-500">Active Hedging</span>
                        </div>
                        <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <BarChart2 className="text-purple-400 mb-1" size={20} />
                            <span className="text-sm font-medium text-gray-300">Systematic</span>
                            <span className="text-xs text-gray-500">Quant Governance</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Visual/Logo - Interactive Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative flex items-center justify-center p-8"
                >
                    <div className="relative w-full flex items-center justify-center">
                        {/* Glowing ring behind logo */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[300px] h-[300px] border border-emerald-500/10 rounded-full shadow-[0_0_100px_-20px_rgba(16,185,129,0.05)] animate-spin-slow opacity-30" style={{ animationDuration: '30s' }} />
                            <div className="absolute w-[220px] h-[220px] border border-cyan-500/10 rounded-full shadow-[0_0_100px_-20px_rgba(6,182,212,0.05)] animate-reverse-spin opacity-40" style={{ animationDuration: '25s' }} />
                        </div>

                        <img
                            src="/logo.svg"
                            alt="Equilibrium Logo"
                            className="w-40 h-40 md:w-56 md:h-56 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
