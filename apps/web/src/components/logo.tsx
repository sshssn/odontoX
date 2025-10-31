"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 120, height = 30 }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to light logo during SSR to avoid flash
  if (!mounted) {
    return (
      <Image
        src="/odonto_light.svg"
        alt="OdontoX"
        width={width}
        height={height}
        className={className}
        priority
      />
    );
  }

  const logoSrc = resolvedTheme === "dark" ? "/odonto_dark.svg" : "/odonto_light.svg";

  return (
    <Image
      src={logoSrc}
      alt="OdontoX"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}




