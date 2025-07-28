"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SvgBadge {
    id: number;
    name: string;
    type: "svg";
    svg: string;
    tooltip: string;
    glowColor: string;
    pulse: boolean;
    size?: "sm" | "md" | "lg";
}

interface ImgBadge {
    id: number;
    name: string;
    type: "img";
    src: string;
    tooltip: string;
    glowColor: string;
    pulse: boolean;
    size?: "sm" | "md" | "lg";
}

type Badge = SvgBadge | ImgBadge;

const badges: Badge[] = [
    {
        id: 1,
        name: "Hypesquad",
        type: "svg",
        svg: "/hypesquadbrilliance.svg",
        tooltip: "Hypesquad Brilliance House",
        glowColor: "from-blue-400 via-purple-500 to-purple-600",
        pulse: true,
        size: "lg"
    },
    {
        id: 2,
        name: "Active Developer",
        type: "svg",
        svg: "/activedeveloper.svg",
        tooltip: "Own at least 1 active application (app)...",
        glowColor: "from-green-400 via-emerald-500 to-emerald-600",
        pulse: true,
        size: "lg"
    },
    {
        id: 3,
        name: "Completed a Quest",
        type: "img",
        src: "/quest.png",
        tooltip: "When completing a quest from the gift inventory tab.",
        glowColor: "from-yellow-400 via-amber-500 to-amber-600",
        pulse: false,
        size: "md"
    },
    {
        id: 4,
        name: "Orbs Apprentice",
        type: "svg",
        svg: "/orb.svg",
        tooltip: "Once you complete its specific quests...",
        glowColor: "from-pink-400 via-rose-500 to-rose-600",
        pulse: true,
        size: "lg"
    },
];

const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-16 h-16"
};

export default function Badges() {
    return (
        <TooltipProvider delayDuration={100}>
            <div className="flex gap-3 z-50 justify-center mt-4">
                {badges.map((badge) => (
                    <motion.div
                        key={badge.id}
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            y: badge.pulse ? [0, -8, 0] : 0
                        }}
                        transition={{
                            delay: 0.2 + badge.id * 0.1,
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                            y: badge.pulse ? {
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 2 + Math.random()
                            } : {}
                        }}
                        whileHover={{
                            scale: 1.4,
                            rotate: [0, -15, 15, 0],
                            transition: { duration: 0.5 }
                        }}
                        className="relative"
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className={`bg-gradient-to-br ${badge.glowColor} p-1 rounded-full shadow-lg hover:shadow-2xl transition-all cursor-pointer group relative`}>
                                    <div className="bg-gray-900/90 rounded-full p-1 backdrop-blur-md">
                                        {badge.type === "svg" ? (
                                            <img
                                                src={badge.svg}
                                                alt={badge.name}
                                                className={`${sizeClasses[badge.size || 'md']} object-contain`}
                                            />
                                        ) : (
                                            <Image
                                                src={badge.src}
                                                alt={badge.name}
                                                width={badge.size === 'lg' ? 64 : badge.size === 'md' ? 56 : 40}
                                                height={badge.size === 'lg' ? 64 : badge.size === 'md' ? 56 : 40}
                                                className="object-contain"
                                                unoptimized
                                            />
                                        )}
                                    </div>
                                    <div className={`absolute inset-0 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${badge.glowColor} blur-lg -z-10`} />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-gray-900/95 backdrop-blur-md text-white border border-white/10 shadow-xl max-w-[240px]">
                                <p className="font-bold text-sm text-center mb-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    {badge.name.toUpperCase()}
                                </p>
                                <p className="text-xs text-gray-200 text-center">{badge.tooltip}</p>
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900/95 border-t border-l border-white/10 rotate-45" />
                            </TooltipContent>
                        </Tooltip>
                    </motion.div>
                ))}
            </div>
        </TooltipProvider>
    )
}