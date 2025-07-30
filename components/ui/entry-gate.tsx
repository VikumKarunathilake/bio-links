"use client"

import { motion, AnimatePresence } from "framer-motion"

interface EntryGateProps {
    show: boolean
    onEnter: () => void
    title?: string
    subtitle?: string
}

export function EntryGate({ show, onEnter, title = "Click To Enter...", subtitle }: EntryGateProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
                    onClick={onEnter}
                >
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <h2 className="text-white text-xl opacity-70">
                            <b>{title}</b>
                        </h2>
                        {subtitle && <p className="text-white/60 text-sm mt-2">{subtitle}</p>}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
