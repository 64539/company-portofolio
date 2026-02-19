"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Logo {
  name: string;
  path: string;
}

interface DynamicLogoProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicLogo = ({ name, className, size = 24 }: DynamicLogoProps) => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch("/api/logos");
        const data = await response.json();
        setLogos(data.logos || []);
      } catch (error) {
        console.error("Error fetching logos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  const logo = logos.find(l => l.name.toLowerCase() === name.toLowerCase());

  if (loading) return <div className={`animate-pulse bg-white/10 rounded-sm`} style={{ width: size, height: size }} />;
  if (!logo) return null;

  return (
    <Image
      src={logo.path}
      alt={`${name} logo`}
      width={size}
      height={size}
      className={className}
    />
  );
};
