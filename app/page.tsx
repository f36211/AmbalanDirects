'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Globe, Youtube, Music2, ChevronRight, Sparkles } from "lucide-react";
import Link from 'next/link';
import { useState, useEffect } from 'react';

type LinkFromDB = {
  _id: string;
  Name: string;
  Links: string;
};

export default function LinkPage() {
  const [links, setLinks] = useState<LinkFromDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/links');
        if (!response.ok) {
          throw new Error('Failed to fetch links');
        }
        const data = await response.json();
        setLinks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, []);

  // Generate stable positions using index-based calculations
  const generatePosition = (index: number, type: 'x' | 'y') => {
    const seed = index * (type === 'x' ? 17 : 23); // Different multipliers for x and y
    return ((seed * 9301 + 49297) % 233280) / 233280 * 100;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  const logoVariants: Variants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      rotate: -180,
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const titleVariants: Variants = {
    hidden: { 
      y: -40, 
      opacity: 0,
      scale: 0.8,
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.3,
        duration: 0.7,
      },
    },
  };

  const getIconForLink = (name: string) => {
    if (name.toLowerCase().includes('youtube')) {
      return <Youtube size={20} className="text-red-400" />;
    }
    if (name.toLowerCase().includes('tiktok')) {
      return <Music2 size={20} className="text-pink-400" />;
    }
    if (name.toLowerCase().includes('instagram')) {
      return <Globe size={20} className="text-purple-400" />;
    }
    return <Globe size={20} className="text-blue-400" />;
  };

  const getButtonGradient = (name: string) => {
    if (name.toLowerCase().includes('youtube')) {
      return 'from-red-500/20 to-red-600/10 border-red-500/30 hover:from-red-500/30 hover:to-red-600/20';
    }
    if (name.toLowerCase().includes('tiktok')) {
      return 'from-pink-500/20 to-pink-600/10 border-pink-500/30 hover:from-pink-500/30 hover:to-pink-600/20';
    }
    if (name.toLowerCase().includes('instagram')) {
      return 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:from-purple-500/30 hover:to-purple-600/20';
    }
    return 'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:from-blue-500/30 hover:to-blue-600/20';
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen w-full text-white p-6 overflow-hidden">
      {/* Original Background */}
      <Image
        src="/background.webp"
        alt="Forest background"
        fill
        style={{ objectFit: 'cover' }}
        className="-z-20"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent -z-10" />
      
      {/* Enhanced Pramuka/Ambalan-inspired Floating Elements */}
      {isMounted && (
        <div className="absolute inset-0 -z-10">
          {/* Local Ambalan Logos - L1, L2, L3 */}
          {[1, 2, 3].map((logoNum, i) => (
            <motion.div
              key={`local-logo-${logoNum}`}
              className="absolute"
              style={{
                left: `${generatePosition(i * 3, 'x')}%`,
                top: `${generatePosition(i * 3, 'y')}%`,
              }}
              animate={{
                y: [-20, -100],
                rotate: [0, 180],
                opacity: [0, 0.15, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeInOut",
              }}
            >
              <Image
                src={`/images/logo/L${logoNum}.png`}
                alt={`Ambalan Logo ${logoNum}`}
                width={40}
                height={40}
                className="opacity-20 drop-shadow-lg"
              />
            </motion.div>
          ))}

          {/* Trefoil shapes (Scout symbol) */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`trefoil-${i}`}
              className="absolute"
              style={{
                left: `${generatePosition(i + 10, 'x')}%`,
                top: `${generatePosition(i + 10, 'y')}%`,
              }}
              animate={{
                y: [-30, -100],
                rotate: [0, 360],
                opacity: [0, 0.4, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 8 + (i % 4),
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="text-yellow-200/50">
                <path fill="currentColor" d="M12 2C10.34 2 9 3.34 9 5C9 6.66 10.34 8 12 8C13.66 8 15 6.66 15 5C15 3.34 13.66 2 12 2M5 9C3.34 9 2 10.34 2 12C2 13.66 3.34 15 5 15C6.66 15 8 13.66 8 12C8 10.34 6.66 9 5 9M19 9C17.34 9 16 10.34 16 12C16 13.66 17.34 15 19 15C20.66 15 22 13.66 22 12C22 10.34 20.66 9 19 9Z"/>
              </svg>
            </motion.div>
          ))}

          {/* Compass needles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`compass-${i}`}
              className="absolute"
              style={{
                left: `${generatePosition(i + 20, 'x')}%`,
                top: `${generatePosition(i + 20, 'y')}%`,
              }}
              animate={{
                y: [-25, -90],
                rotate: [0, 360],
                opacity: [0, 0.35, 0],
              }}
              transition={{
                duration: 10 + (i % 3),
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" className="text-red-300/40">
                <path fill="currentColor" d="M12,2L14.5,9.5L22,12L14.5,14.5L12,22L9.5,14.5L2,12L9.5,9.5L12,2M12,4.8L10.7,9.3L6.2,10.6L12,12L17.8,10.6L13.3,9.3L12,4.8Z"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
              </svg>
            </motion.div>
          ))}

          {/* Indonesian Scout coconut/tunas kelapa symbols */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`coconut-${i}`}
              className="absolute"
              style={{
                left: `${generatePosition(i + 30, 'x')}%`,
                top: `${generatePosition(i + 30, 'y')}%`,
              }}
              animate={{
                y: [-35, -110],
                rotate: [0, -180],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 14 + (i % 2),
                repeat: Infinity,
                delay: i * 1.2,
                ease: "easeInOut",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" className="text-green-300/30">
                <path fill="currentColor" d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,13L13,11L15,9H21M3,9H9L11,11L9,13L3,7V9M12,8C14.21,8 16,9.79 16,12C16,14.21 14.21,16 12,16C9.79,16 8,14.21 8,12C8,9.79 9.79,8 12,8M12,18L15.5,21.5L12,22L8.5,21.5L12,18Z"/>
                <path fill="currentColor" d="M12,10C11.4,10 10.9,10.4 10.9,11S11.4,12 12,12S13.1,11.6 13.1,11S12.6,10 12,10Z"/>
              </svg>
            </motion.div>
          ))}

          {/* Rope knots and ties */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`knot-${i}`}
              className="absolute"
              style={{
                left: `${generatePosition(i + 40, 'x')}%`,
                top: `${generatePosition(i + 40, 'y')}%`,
              }}
              animate={{
                y: [-40, -120],
                rotate: [0, -90],
                opacity: [0, 0.25, 0],
              }}
              transition={{
                duration: 10 + (i % 2),
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeInOut",
              }}
            >
              <svg width="28" height="16" viewBox="0 0 32 16" className="text-amber-200/25">
                <path d="M4,8 Q8,4 12,8 Q16,12 20,8 Q24,4 28,8" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                <path d="M6,8 Q10,6 14,8 Q18,10 22,8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7"/>
                <circle cx="8" cy="8" r="1.5" fill="currentColor" opacity="0.6"/>
                <circle cx="16" cy="8" r="1.5" fill="currentColor" opacity="0.6"/>
                <circle cx="24" cy="8" r="1.5" fill="currentColor" opacity="0.6"/>
              </svg>
            </motion.div>
          ))}

          {/* Five-pointed star elements (Pancasila inspiration) */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`five-star-${i}`}
              className="absolute"
              style={{
                left: `${generatePosition(i + 50, 'x')}%`,
                top: `${generatePosition(i + 50, 'y')}%`,
              }}
              animate={{
                y: [-20, -85],
                rotate: [0, 360],
                opacity: [0, 0.4, 0],
                scale: [0.6, 1.1, 0.6],
              }}
              transition={{
                duration: 9 + (i % 3),
                repeat: Infinity,
                delay: i * 1.8,
                ease: "easeInOut",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" className="text-yellow-400/40">
                <path fill="currentColor" d="M12,2L15.09,8.26L22,9L17,14L18.18,21L12,17.77L5.82,21L7,14L2,9L8.91,8.26L12,2Z"/>
              </svg>
            </motion.div>
          ))}

          {/* Shield/Badge shapes */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`shield-${i}`}
              className="absolute"
              style={{
                left: `${generatePosition(i + 60, 'x')}%`,
                top: `${generatePosition(i + 60, 'y')}%`,
              }}
              animate={{
                y: [-50, -130],
                rotate: [0, 45],
                opacity: [0, 0.2, 0],
              }}
              transition={{
                duration: 15 + (i % 2),
                repeat: Infinity,
                delay: i * 2.5,
                ease: "easeInOut",
              }}
            >
              <svg width="20" height="24" viewBox="0 0 24 28" className="text-blue-400/25">
                <path fill="currentColor" d="M12,2L20,6V12C20,18 16,23 12,26C8,23 4,18 4,12V6L12,2M12,4.3L6,7.2V12C6,16.5 8.9,20.3 12,23C15.1,20.3 18,16.5 18,12V7.2L12,4.3Z"/>
                <path fill="currentColor" d="M9,12L11,14L15.5,9.5L14,8L11,11L10,10L9,12Z" opacity="0.6"/>
              </svg>
            </motion.div>
          ))}

          {/* Campfire/flame elements */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`flame-${i}`}
              className="absolute"
              style={{
                left: `${generatePosition(i + 70, 'x')}%`,
                top: `${generatePosition(i + 70, 'y')}%`,
              }}
              animate={{
                y: [-30, -100],
                scale: [0.8, 1.2, 0.8],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                delay: i * 3,
                ease: "easeInOut",
              }}
            >
              <svg width="18" height="22" viewBox="0 0 24 28" className="text-orange-300/30">
                <path fill="currentColor" d="M12,2C15,6 16,10 14,12C15,14 13,16 12,18C11,16 9,14 10,12C8,10 9,6 12,2M8,12C9,14 8.5,16 7,17C8,19 6,21 5,22C4,20 3,18 4,17C2,15 3,13 8,12M16,12C21,13 22,15 20,17C21,18 20,20 19,22C18,21 16,19 17,17C15.5,16 15,14 16,12Z"/>
              </svg>
            </motion.div>
          ))}

          {/* Small sparkle dots with variety */}
          {[...Array(20)].map((_, i) => {
            const colors = ['bg-yellow-300/40', 'bg-red-300/40', 'bg-blue-300/40', 'bg-green-300/40'];
            return (
              <motion.div
                key={`dot-${i}`}
                className={`absolute w-1 h-1 ${colors[i % colors.length]} rounded-full`}
                style={{
                  left: `${generatePosition(i + 80, 'x')}%`,
                  top: `${generatePosition(i + 80, 'y')}%`,
                }}
                animate={{
                  y: [-15, -60],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 4 + (i % 2),
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            );
          })}

          {/* Floating Ambalan text elements */}
          {['PRAMUKA', 'AMBALAN'].map((text, i) => (
            <motion.div
              key={`text-${i}`}
              className="absolute opacity-5 font-bold text-white text-xs tracking-widest select-none pointer-events-none"
              style={{
                left: `${generatePosition(i + 90, 'x')}%`,
                top: `${generatePosition(i + 90, 'y')}%`,
                transform: `rotate(${i * 45}deg)`,
              }}
              animate={{
                y: [-60, -140],
                opacity: [0, 0.05, 0],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                delay: i * 10,
                ease: "linear",
              }}
            >
              {text}
            </motion.div>
          ))}
        </div>
      )}

      <div className="w-full max-w-md flex flex-col items-center text-center gap-4">
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ 
            scale: 1.05,
            rotate: 5,
            transition: { type: "spring", stiffness: 300 }
          }}
        >
          <div className="relative">
            <Image
              src="/logo.webp"
              alt="Logo"
              width={150}
              height={150}
              className="drop-shadow-2xl"
            />
            {/* Glowing Ring Effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        <motion.h1
          className="text-3xl font-bold drop-shadow-lg mt-2 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ 
            scale: 1.02,
            transition: { type: "spring", stiffness: 300 }
          }}
        >
          Ambalan SMAIT Ummul Quro{' '}
          <Link href="/admin" title="Admin Access" className="cursor-default no-underline hover:text-yellow-300 transition-colors">
            Bogor
          </Link>
        </motion.h1>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="my-6"
        >
          <motion.div
            className="flex items-center justify-center gap-3 text-white/90"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={18} className="text-yellow-300" />
            </motion.div>
            <p className="tracking-widest uppercase text-sm font-medium bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Our Social Media
            </p>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={18} className="text-yellow-300" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full flex flex-col gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Sparkles size={24} className="text-blue-400" />
              </motion.div>
              <p className="mt-2 text-white/80">Loading links...</p>
            </motion.div>
          ) : (
            links.map((link, index) => (
              <motion.a
                key={link._id}
                href={link.Links}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Button
                  variant="outline"
                  className={`w-full h-18 bg-gradient-to-r ${getButtonGradient(link.Name)} backdrop-blur-lg text-white text-lg rounded-2xl border-2 transition-all duration-500 flex justify-between items-center px-6 py-4 shadow-xl group-hover:shadow-2xl group-hover:border-white/40`}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {getIconForLink(link.Name)}
                    </motion.div>
                    <span className="font-semibold">{link.Name}</span>
                  </div>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2,
                    }}
                  >
                    <ChevronRight size={24} className="text-white/70 group-hover:text-white transition-colors" />
                  </motion.div>
                </Button>
              </motion.a>
            ))
          )}

          <motion.div
            className="w-full text-center text-white/90 text-base mt-8"
            variants={itemVariants}
          >
            <motion.p 
              className="font-semibold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              @passusuq • @focus_smaituq
            </motion.p>
            <motion.div
              className="flex justify-center gap-2 mt-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-1 h-1 bg-blue-400 rounded-full" />
              <div className="w-1 h-1 bg-purple-400 rounded-full" />
              <div className="w-1 h-1 bg-pink-400 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}