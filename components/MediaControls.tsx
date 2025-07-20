"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Volume2, VolumeX, Settings, Monitor, Palette, RotateCcw } from "lucide-react"

interface MediaControlsProps {
    videoRef: React.RefObject<HTMLVideoElement>
    audioRef: React.RefObject<HTMLAudioElement>
    hasEntered: boolean
}

interface SettingsState {
    volume: number
    brightness: number
    contrast: number
    saturation: number
    blur: number
    autoplay: boolean
    showParticles: boolean
}

const defaultSettings: SettingsState = {
    volume: 3,
    brightness: 50,
    contrast: 100,
    saturation: 100,
    blur: 0,
    autoplay: true,
    showParticles: true,
}

export default function MediaControls({ videoRef, audioRef, hasEntered }: MediaControlsProps) {
    const [isMuted, setIsMuted] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [settings, setSettings] = useState<SettingsState>(defaultSettings)

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem("profile-settings")
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings)
                setSettings({ ...defaultSettings, ...parsed })
            } catch (error) {
                console.error("Failed to parse saved settings:", error)
            }
        }
    }, [])

    // Save settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("profile-settings", JSON.stringify(settings))
    }, [settings])

    // Apply video effects
    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current
            video.style.filter = `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%) blur(${settings.blur}px)`
        }
    }, [settings.brightness, settings.contrast, settings.saturation, settings.blur, videoRef])

    // Handle volume changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = settings.volume / 100
        }
    }, [settings.volume, audioRef])

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    const resetSettings = () => {
        setSettings(defaultSettings)
    }

    const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
        setSettings((prev) => ({ ...prev, [key]: value }))
    }

    if (!hasEntered) return null

    return (
        <>
            {/* Control Buttons */}
            <div className="fixed top-4 left-4 z-40 flex space-x-2">
                {/* Mute Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    <Button
                        onClick={toggleMute}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md transition-all duration-300"
                    >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                </motion.div>

                {/* Settings Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                >
                    <Button
                        onClick={() => setShowSettings(!showSettings)}
                        variant="outline"
                        size="sm"
                        className={`bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md transition-all duration-300 ${showSettings ? "bg-white/20" : ""
                            }`}
                    >
                        <Settings className="w-4 h-4" />
                    </Button>
                </motion.div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed top-16 left-4 z-40 w-80"
                    >
                        <Card className="bg-[#2e3050]/90 backdrop-blur-md border-white/20 shadow-2xl">
                            <div className="p-6 space-y-6">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-white font-semibold text-lg">Settings</h3>
                                    <Button
                                        onClick={resetSettings}
                                        variant="ghost"
                                        size="sm"
                                        className="text-white/60 hover:text-white hover:bg-white/10"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-1" />
                                        Reset
                                    </Button>
                                </div>

                                {/* Audio Settings */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Volume2 className="w-4 h-4 text-blue-400" />
                                        <span className="text-white text-sm font-medium">Audio</span>
                                    </div>

                                    <div className="space-y-3 pl-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-white/80 text-sm">Volume</label>
                                                <span className="text-white/60 text-sm">{settings.volume}%</span>
                                            </div>
                                            <Slider
                                                value={[settings.volume]}
                                                onValueChange={([value]) => updateSetting("volume", value)}
                                                max={100}
                                                step={1}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label className="text-white/80 text-sm">Autoplay</label>
                                            <Switch
                                                checked={settings.autoplay}
                                                onCheckedChange={(checked) => updateSetting("autoplay", checked)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Video Settings */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Monitor className="w-4 h-4 text-purple-400" />
                                        <span className="text-white text-sm font-medium">Video</span>
                                    </div>

                                    <div className="space-y-3 pl-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-white/80 text-sm">Brightness</label>
                                                <span className="text-white/60 text-sm">{settings.brightness}%</span>
                                            </div>
                                            <Slider
                                                value={[settings.brightness]}
                                                onValueChange={([value]) => updateSetting("brightness", value)}
                                                max={200}
                                                min={10}
                                                step={5}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-white/80 text-sm">Contrast</label>
                                                <span className="text-white/60 text-sm">{settings.contrast}%</span>
                                            </div>
                                            <Slider
                                                value={[settings.contrast]}
                                                onValueChange={([value]) => updateSetting("contrast", value)}
                                                max={200}
                                                min={50}
                                                step={5}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-white/80 text-sm">Saturation</label>
                                                <span className="text-white/60 text-sm">{settings.saturation}%</span>
                                            </div>
                                            <Slider
                                                value={[settings.saturation]}
                                                onValueChange={([value]) => updateSetting("saturation", value)}
                                                max={200}
                                                min={0}
                                                step={5}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-white/80 text-sm">Blur</label>
                                                <span className="text-white/60 text-sm">{settings.blur}px</span>
                                            </div>
                                            <Slider
                                                value={[settings.blur]}
                                                onValueChange={([value]) => updateSetting("blur", value)}
                                                max={10}
                                                min={0}
                                                step={0.5}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Visual Effects */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Palette className="w-4 h-4 text-green-400" />
                                        <span className="text-white text-sm font-medium">Effects</span>
                                    </div>

                                    <div className="space-y-3 pl-6">
                                        <div className="flex items-center justify-between">
                                            <label className="text-white/80 text-sm">Particle Effects</label>
                                            <Switch
                                                checked={settings.showParticles}
                                                onCheckedChange={(checked) => updateSetting("showParticles", checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click outside to close settings */}
            {showSettings && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowSettings(false)}
                    style={{ background: "transparent" }}
                />
            )}
        </>
    )
}
