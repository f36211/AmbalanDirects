'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Globe, Youtube, Music2, ChevronRight, ArrowDown } from "lucide-react";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const getIconForLink = (name: string) => {
    if (name.toLowerCase().includes('youtube')) {
      return <Youtube size={20} />;
    }
    if (name.toLowerCase().includes('tiktok')) {
      return <Music2 size={20} />;
    }
    return <Globe size={20} />;
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen w-full text-white p-6 overflow-hidden">
      <Image
        src="/background.webp"
        alt="Forest background"
        layout="fill"
        objectFit="cover"
        className="-z-20"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent -z-10" />

      <div className="w-full max-w-md flex flex-col items-center text-center gap-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src="/logo.webp"
            alt="Logo"
            width={150}
            height={150}
            className="drop-shadow-lg"
          />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold drop-shadow-md mt-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Ambalan SMAIT Ummul Quro{' '}
          <Link href="/admin" title="Admin Access" style={{ cursor: 'default', textDecoration: 'none' }}>
            Bogor
          </Link>
        </motion.h1>

        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="my-6"
        >
            <motion.div
              className="flex items-center justify-center gap-3 text-white/80"
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown size={18} />
              <p className="tracking-widest uppercase text-sm">Our Social Media</p>
              <ArrowDown size={18} />
            </motion.div>
        </motion.div>

        <motion.div
          className="w-full flex flex-col gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            links.map((link) => (
              <motion.a
                key={link._id}
                href={link.Links}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-16 bg-white/10 border border-white/25 backdrop-blur-sm text-white text-lg rounded-xl hover:bg-white/20 transition-colors duration-300 flex justify-between items-center px-6"
                >
                  <div className="flex items-center gap-3">
                    {getIconForLink(link.Name)}
                    <span>{link.Name}</span>
                  </div>
                  <ChevronRight size={22} className="text-white/60" />
                </Button>
              </motion.a>
            ))
          )}

          <motion.div
            className="w-full text-center text-white/80 text-base mt-6"
            variants={itemVariants}
          >
            <p className="font-semibold">@passusuq • @focus_smaituq</p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}

