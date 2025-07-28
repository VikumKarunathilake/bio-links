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
        glowColor: "from-orange-400 via-orange-500 to-orange-600",
        pulse: true,
        size: "md"
    },
    {
        id: 2,
        name: "Active Developer",
        type: "svg",
        svg: "/activedeveloper.svg",
        tooltip: "Own at least 1 active application (app)...",
        glowColor: "from-green-400 via-green-500 to-green-600",
        pulse: true,
        size: "md"
    },
    {
        id: 3,
        name: "Completed a Quest",
        type: "svg",
        svg: "/quest.svg",
        tooltip: "When completing a quest from the gift inventory tab.",
        glowColor: "from-[#b2c1ff] via-[#a6b8ff] to-[#8fa3ff]",
        pulse: true,
        size: "md"
    },
    {
        id: 4,
        name: "Orbs Apprentice",
        type: "svg",
        svg: "/orb.svg",
        tooltip: "Once you complete its specific quests...",
        glowColor: "from-[#ef51e8] via-[#7ae9d6] to-[#7b49ff]",
        pulse: true,
        size: "md"
    },
];

const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
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
                                duration: 10 + Math.random()
                            } : {}
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
                        </Tooltip>
                    </motion.div>
                ))}
            </div>
        </TooltipProvider>
    )
}