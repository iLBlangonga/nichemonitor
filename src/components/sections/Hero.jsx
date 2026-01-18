import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Shield, Activity } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] shadow-2xl border border-white/10 p-8 md:p-12 mb-8">
            {/* Background elements for "tech/quant" feel */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

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

                        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
                            Precision in <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Volatility</span>
                        </h1>

                        <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                            NICHE is a specialized Absolute Return strategy designed to capture systematic risk premia while maintaining sophisticated downside protection. We leverage quantitative models to navigate global market complexities.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                    >
                        <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <Activity className="text-emerald-400 mb-1" size={20} />
                            <span className="text-sm font-medium text-gray-300">Absolute Return</span>
                            <span className="text-xs text-gray-500">Uncorrelated Alpha</span>
                        </div>
                        <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <Shield className="text-cyan-400 mb-1" size={20} />
                            <span className="text-sm font-medium text-gray-300">Long Volatility</span>
                            <span className="text-xs text-gray-500">Tail Risk Hedge</span>
                        </div>
                        <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <BarChart2 className="text-purple-400 mb-1" size={20} />
                            <span className="text-sm font-medium text-gray-300">Systematic</span>
                            <span className="text-xs text-gray-500">Quant Governance</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Visual/Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col justify-center items-center text-center"
                >
                    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                        {/* Glowing ring behind logo */}
                        <div className="absolute inset-0 rounded-full border border-emerald-500/20 shadow-[0_0_100px_-20px_rgba(16,185,129,0.2)] animate-spin-slow" style={{ animationDuration: '20s' }} />
                        <div className="absolute inset-4 rounded-full border border-cyan-500/20 shadow-[0_0_100px_-20px_rgba(6,182,212,0.2)] animate-reverse-spin" style={{ animationDuration: '25s' }} />

                        <img
                            src="/logo.svg"
                            alt="Equilibrium Logo"
                            className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10 drop-shadow-2xl"
                        />
                    </div>

                    <div className="mt-8 space-y-1">
                        <p className="text-sm text-gray-500 tracking-widest uppercase">Developed by</p>
                        <p className="text-base font-semibold text-white tracking-wide">Equilibrium Research Team</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
